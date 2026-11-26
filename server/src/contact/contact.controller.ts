import { Body, Controller, Get, Post } from "@nestjs/common";
import { ContactDto } from "./contact.dto";
import { ContactService } from "./contact.service";

@Controller("contact")
export class ContactController {
  constructor(private readonly contactService: ContactService) {}

  @Get("health")
  health() {
    return { ok: true, service: "noah-portfolio-api" };
  }

  @Post()
  create(@Body() contactDto: ContactDto) {
    return this.contactService.create(contactDto);
  }
}
