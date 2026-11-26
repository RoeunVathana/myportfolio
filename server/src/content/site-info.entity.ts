import { Column, Entity, PrimaryColumn } from "typeorm";

@Entity({ name: "site_info" })
export class SiteInfoEntity {
  @PrimaryColumn({ type: "integer" })
  id = 1;

  @Column({ length: 120 })
  stack!: string;

  @Column({ length: 120 })
  currently!: string;

  @Column({ length: 120 })
  location!: string;

  @Column({ length: 255 })
  contactEmail!: string;

  @Column({ length: 255 })
  github!: string;

  @Column({ length: 255 })
  linkedin!: string;
}
