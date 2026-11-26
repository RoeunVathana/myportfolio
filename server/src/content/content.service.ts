import { Injectable, NotFoundException, UnauthorizedException } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository } from "typeorm";
import { ProjectEntity } from "./project.entity";
import { ProfileEntity } from "./profile.entity";
import { SiteInfoEntity } from "./site-info.entity";
import { ProjectUpdateDto, ProfileUpdateDto, SiteInfoUpdateDto } from "./content.dto";

const defaultProfile = {
  id: 1,
  displayName: "Noah",
  role: "FULL-STACK DEVELOPER / 2025",
  intro: "I'm Noah — I design and engineer expressive digital products for people with something worth saying.",
  about: "I like the part where a fuzzy idea becomes something you can touch. My work lives at the intersection of thoughtful product design, playful technology, and the tiny details that make a screen feel human.",
  location: "Bangkok / GMT+7",
  availability: "Available for select projects",
  email: "hello@noah.dev",
  avatarUrl: "",
};

const defaultSiteInfo = {
  id: 1,
  stack: "Next.js + NestJS",
  currently: "Building for the web",
  location: "Bangkok / GMT+7",
  contactEmail: "hello@noah.dev",
  github: "https://github.com/RoeunVathana",
  linkedin: "https://linkedin.com",
};

const defaultProjects = [
  { id: "orbit-finance", title: "Orbit Finance", tag: "Product system", description: "A calm, high-signal finance workspace for teams that want clarity without the spreadsheet sprawl.", year: "2025", accent: "project-orbit", link: "#", featured: true },
  { id: "mori-objects", title: "Mori Objects", tag: "E-commerce experience", description: "A tactile storefront with a tiny carbon footprint, built around thoughtful objects and quiet motion.", year: "2024", accent: "project-mori", link: "#", featured: true },
  { id: "studio-42", title: "Studio / 42", tag: "Creative tooling", description: "A shared visual playground where a distributed creative team can think, remix, and ship together.", year: "2024", accent: "project-studio", link: "#", featured: true },
];

@Injectable()
export class ContentService {
  constructor(
    @InjectRepository(ProfileEntity) private readonly profiles: Repository<ProfileEntity>,
    @InjectRepository(SiteInfoEntity) private readonly siteInfos: Repository<SiteInfoEntity>,
    @InjectRepository(ProjectEntity) private readonly projects: Repository<ProjectEntity>,
  ) {}

  private requireAdmin(key?: string) {
    if (!process.env.DASHBOARD_KEY || key !== process.env.DASHBOARD_KEY) {
      throw new UnauthorizedException("Dashboard access denied");
    }
  }

  private async ensureDefaults() {
    const [profile, siteInfo, projectCount] = await Promise.all([
      this.profiles.findOneBy({ id: 1 }),
      this.siteInfos.findOneBy({ id: 1 }),
      this.projects.count(),
    ]);

    if (!profile) await this.profiles.save(this.profiles.create(defaultProfile));
    if (!siteInfo) await this.siteInfos.save(this.siteInfos.create(defaultSiteInfo));
    if (!projectCount) await this.projects.save(defaultProjects.map((project) => this.projects.create(project)));
  }

  async getContent() {
    await this.ensureDefaults();
    const [profile, siteInfo, projects] = await Promise.all([
      this.profiles.findOneBy({ id: 1 }),
      this.siteInfos.findOneBy({ id: 1 }),
      this.projects.find({ order: { createdAt: "DESC" } }),
    ]);
    return { profile: profile ?? defaultProfile, siteInfo: siteInfo ?? defaultSiteInfo, projects };
  }

  async getAdminContent(key?: string) {
    this.requireAdmin(key);
    return this.getContent();
  }

  async saveProfile(key: string | undefined, dto: ProfileUpdateDto) {
    this.requireAdmin(key);
    const existing = await this.profiles.findOneBy({ id: 1 });
    const profile = this.profiles.create({ ...(existing ?? defaultProfile), ...dto, id: 1 });
    return this.profiles.save(profile);
  }

  async saveSiteInfo(key: string | undefined, dto: SiteInfoUpdateDto) {
    this.requireAdmin(key);
    const existing = await this.siteInfos.findOneBy({ id: 1 });
    const siteInfo = this.siteInfos.create({ ...(existing ?? defaultSiteInfo), ...dto, id: 1 });
    return this.siteInfos.save(siteInfo);
  }

  async createProject(key: string | undefined, dto: ProjectUpdateDto) {
    this.requireAdmin(key);
    return this.projects.save(this.projects.create({ ...dto, id: crypto.randomUUID() }));
  }

  async updateProject(key: string | undefined, id: string, dto: ProjectUpdateDto) {
    this.requireAdmin(key);
    const project = await this.projects.findOneBy({ id });
    if (!project) throw new NotFoundException("Project not found");
    Object.assign(project, dto);
    return this.projects.save(project);
  }

  async deleteProject(key: string | undefined, id: string) {
    this.requireAdmin(key);
    const result = await this.projects.delete({ id });
    if (!result.affected) throw new NotFoundException("Project not found");
    return { ok: true, id };
  }
}
