import { IsString, IsOptional, IsNotEmpty, IsInt, IsObject, IsBoolean } from 'class-validator';

export class CreateIssueTemplateDto {
  @IsString()
  @IsNotEmpty()
  name: string;

  @IsString()
  @IsOptional()
  description?: string;

  @IsObject()
  @IsNotEmpty()
  fields: any; // Template field definitions

  @IsInt()
  @IsOptional()
  projectId?: number;
}

export class UpdateIssueTemplateDto {
  @IsString()
  @IsOptional()
  name?: string;

  @IsString()
  @IsOptional()
  description?: string;

  @IsObject()
  @IsOptional()
  fields?: any;
}

export class CreateIssueFromTemplateDto {
  @IsInt()
  @IsNotEmpty()
  templateId: number;

  @IsInt()
  @IsNotEmpty()
  projectId: number;

  @IsObject()
  @IsNotEmpty()
  templateData: any; // Data to fill the template fields
}
