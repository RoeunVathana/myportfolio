import { Injectable, Logger } from "@nestjs/common";
import { ContactDto } from "./contact.dto";

@Injectable()
export class ContactService {
  private readonly logger = new Logger(ContactService.name);

  create(contactDto: ContactDto) {
    this.logger.log(`New portfolio message from ${contactDto.name} <${contactDto.email}>`);
    return {
      ok: true,
      message: "Thanks — your message is on its way.",
      receivedAt: new Date().toISOString(),
    };
  }
}
