import { Injectable, Logger, UnauthorizedException } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository } from "typeorm";
import { ContactDto } from "./contact.dto";
import { ContactMessageEntity } from "./contact-message.entity";

@Injectable()
export class ContactService {
  private readonly logger = new Logger(ContactService.name);

  constructor(
    @InjectRepository(ContactMessageEntity)
    private readonly contactMessages: Repository<ContactMessageEntity>,
  ) {}

  async create(contactDto: ContactDto) {
    const contactMessage = await this.contactMessages.save(
      this.contactMessages.create(contactDto),
    );

    this.logger.log(`Saved portfolio message ${contactMessage.id} from ${contactDto.email}`);
    return {
      ok: true,
      message: "Thanks — your message is on its way.",
      id: contactMessage.id,
      receivedAt: contactMessage.createdAt.toISOString(),
    };
  }

  async findAll(dashboardKey?: string) {
    const configuredKey = process.env.DASHBOARD_KEY;
    if (!configuredKey || dashboardKey !== configuredKey) {
      throw new UnauthorizedException("Dashboard access denied");
    }

    const messages = await this.contactMessages.find({
      order: { createdAt: "DESC" },
      take: 100,
    });

    return { messages };
  }
}
