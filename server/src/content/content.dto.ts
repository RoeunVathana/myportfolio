import { IsBoolean, IsEmail, IsNotEmpty, IsOptional, IsString, MaxLength } from "class-validator";

export class ProfileUpdateDto {
  @IsString() @IsNotEmpty() @MaxLength(80) displayName!: string;
  @IsString() @IsNotEmpty() @MaxLength(120) role!: string;
  @IsString() @IsNotEmpty() @MaxLength(1000) intro!: string;
  @IsString() @IsNotEmpty() @MaxLength(3000) about!: string;
  @IsString() @IsNotEmpty() @MaxLength(120) location!: string;
  @IsString() @IsNotEmpty() @MaxLength(120) availability!: string;
  @IsEmail() email!: string;
}

export class SiteInfoUpdateDto {
  @IsString() @IsNotEmpty() @MaxLength(120) stack!: string;
  @IsString() @IsNotEmpty() @MaxLength(120) currently!: string;
  @IsString() @IsNotEmpty() @MaxLength(120) location!: string;
  @IsEmail() contactEmail!: string;
  @IsString() @IsNotEmpty() @MaxLength(255) github!: string;
  @IsString() @IsNotEmpty() @MaxLength(255) linkedin!: string;
}

export class ProjectUpdateDto {
  @IsString() @IsNotEmpty() @MaxLength(120) title!: string;
  @IsString() @IsNotEmpty() @MaxLength(120) tag!: string;
  @IsString() @IsNotEmpty() @MaxLength(1000) description!: string;
  @IsString() @IsNotEmpty() @MaxLength(20) year!: string;
  @IsString() @IsNotEmpty() @MaxLength(40) accent!: string;
  @IsString() @IsOptional() @MaxLength(255) link = "#";
  @IsBoolean() @IsOptional() featured = true;
}
