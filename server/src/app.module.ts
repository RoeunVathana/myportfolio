import { Module } from "@nestjs/common";
import { ConfigModule } from "@nestjs/config";
import { TypeOrmModule } from "@nestjs/typeorm";
import { ContactController } from "./contact/contact.controller";
import { ContactMessageEntity } from "./contact/contact-message.entity";
import { ContactService } from "./contact/contact.service";

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: [".env.local", ".env"],
    }),
    TypeOrmModule.forRoot({
      type: "postgres",
      host: process.env.POSTGRES_HOST ?? "localhost",
      port: Number(process.env.POSTGRES_PORT ?? 5432),
      username: process.env.POSTGRES_USER ?? "postgres",
      password: process.env.POSTGRES_PASSWORD,
      database: process.env.POSTGRES_DB ?? "myportfolio",
      autoLoadEntities: true,
      synchronize: process.env.NODE_ENV !== "production",
    }),
    TypeOrmModule.forFeature([ContactMessageEntity]),
  ],
  controllers: [ContactController],
  providers: [ContactService],
})
export class AppModule {}
