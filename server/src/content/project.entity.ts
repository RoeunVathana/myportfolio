import { Column, CreateDateColumn, Entity, PrimaryColumn, UpdateDateColumn } from "typeorm";

@Entity({ name: "portfolio_projects" })
export class ProjectEntity {
  @PrimaryColumn({ length: 64 })
  id!: string;

  @Column({ length: 120 })
  title!: string;

  @Column({ length: 120 })
  tag!: string;

  @Column({ type: "text" })
  description!: string;

  @Column({ length: 20 })
  year!: string;

  @Column({ length: 40, default: "project-orbit" })
  accent!: string;

  @Column({ length: 255, default: "#" })
  link!: string;

  @Column({ default: true })
  featured!: boolean;

  @CreateDateColumn({ type: "timestamptz" })
  createdAt!: Date;

  @UpdateDateColumn({ type: "timestamptz" })
  updatedAt!: Date;
}
