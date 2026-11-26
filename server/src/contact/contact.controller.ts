import { Body, Controller, Get, Headers, Post } from "@nestjs/common";
import { ContactDto } from "./contact.dto";
import { ContactService } from "./contact.service";

@Controller("contact")
export class ContactController {
  constructor(private readonly contactService: ContactService) {}

  @Get("health")
  health() {
    return { ok: true, service: "noah-portfolio-api" };
  }

  @Get()
  list(@Headers("x-dashboard-key") dashboardKey?: string) {
    return this.contactService.findAll(dashboardKey);
  }

  @Post()
  create(@Body() contactDto: ContactDto) {
    return this.contactService.create(contactDto);
  }
}
