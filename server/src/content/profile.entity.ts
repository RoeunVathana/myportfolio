import { Column, Entity, PrimaryColumn } from "typeorm";

@Entity({ name: "site_profile" })
export class ProfileEntity {
  @PrimaryColumn({ type: "integer" })
  id = 1;

  @Column({ length: 80 })
  displayName!: string;

  @Column({ length: 120 })
  role!: string;

  @Column({ type: "text" })
  intro!: string;

  @Column({ type: "text" })
  about!: string;

  @Column({ length: 120 })
  location!: string;

  @Column({ length: 120 })
  availability!: string;

  @Column({ length: 255 })
  email!: string;
}
