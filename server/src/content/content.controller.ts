import { Body, Controller, Delete, Get, Headers, Param, Post, Put } from "@nestjs/common";
import { ContentService } from "./content.service";
import { ProjectUpdateDto, ProfileUpdateDto, SiteInfoUpdateDto } from "./content.dto";

@Controller()
export class ContentController {
  constructor(private readonly contentService: ContentService) {}

  @Get("content")
  getContent() {
    return this.contentService.getContent();
  }

  @Get("admin/content")
  getAdminContent(@Headers("x-dashboard-key") key?: string) {
    return this.contentService.getAdminContent(key);
  }

  @Put("admin/profile")
  saveProfile(@Headers("x-dashboard-key") key: string | undefined, @Body() dto: ProfileUpdateDto) {
    return this.contentService.saveProfile(key, dto);
  }

  @Put("admin/site-info")
  saveSiteInfo(@Headers("x-dashboard-key") key: string | undefined, @Body() dto: SiteInfoUpdateDto) {
    return this.contentService.saveSiteInfo(key, dto);
  }

  @Post("admin/projects")
  createProject(@Headers("x-dashboard-key") key: string | undefined, @Body() dto: ProjectUpdateDto) {
    return this.contentService.createProject(key, dto);
  }

  @Put("admin/projects/:id")
  updateProject(@Headers("x-dashboard-key") key: string | undefined, @Param("id") id: string, @Body() dto: ProjectUpdateDto) {
    return this.contentService.updateProject(key, id, dto);
  }

  @Delete("admin/projects/:id")
  deleteProject(@Headers("x-dashboard-key") key: string | undefined, @Param("id") id: string) {
    return this.contentService.deleteProject(key, id);
  }
}
