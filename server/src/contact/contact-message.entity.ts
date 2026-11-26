import { Column, CreateDateColumn, Entity, PrimaryGeneratedColumn } from "typeorm";

@Entity({ name: "contact_messages" })
export class ContactMessageEntity {
  @PrimaryGeneratedColumn("uuid")
  id!: string;

  @Column({ length: 80 })
  name!: string;

  @Column({ length: 255 })
  email!: string;

  @Column({ type: "text" })
  message!: string;

  @CreateDateColumn({ type: "timestamptz" })
  createdAt!: Date;
}
