import { IsString, IsOptional, IsNotEmpty, IsEnum, IsInt, IsArray, Min, Max } from 'class-validator';

export enum IssueStatus {
  TODO = 'TODO',
  IN_PROGRESS = 'IN_PROGRESS',
  IN_REVIEW = 'IN_REVIEW',
  DONE = 'DONE',
}

export enum Priority {
  LOW = 'LOW',
  MEDIUM = 'MEDIUM',
  HIGH = 'HIGH',
  URGENT = 'URGENT',
}

export class CreateIssueDto {
  @IsString()
  @IsNotEmpty()
  title: string;

  @IsString()
  @IsOptional()
  description?: string;

  @IsEnum(IssueStatus)
  @IsOptional()
  status?: IssueStatus;

  @IsEnum(Priority)
  @IsOptional()
  priority?: Priority;

  @IsInt()
  @IsOptional()
  @Min(1)
  @Max(100)
  storyPoints?: number;

  @IsArray()
  @IsString({ each: true })
  @IsOptional()
  labels?: string[];

  @IsInt()
  @IsOptional()
  assigneeId?: number;

  @IsInt()
  @IsOptional()
  milestoneId?: number;

  @IsInt()
  @IsOptional()
  parentId?: number;

  @IsInt()
  @IsNotEmpty()
  projectId: number;
}

export class UpdateIssueDto {
  @IsString()
  @IsOptional()
  title?: string;

  @IsString()
  @IsOptional()
  description?: string;

  @IsEnum(IssueStatus)
  @IsOptional()
  status?: IssueStatus;

  @IsEnum(Priority)
  @IsOptional()
  priority?: Priority;

  @IsInt()
  @IsOptional()
  @Min(1)
  @Max(100)
  storyPoints?: number;

  @IsArray()
  @IsString({ each: true })
  @IsOptional()
  labels?: string[];

  @IsInt()
  @IsOptional()
  assigneeId?: number;

  @IsInt()
  @IsOptional()
  milestoneId?: number;

  @IsInt()
  @IsOptional()
  parentId?: number;
}

export class CreateCommentDto {
  @IsString()
  @IsNotEmpty()
  content: string;

  @IsInt()
  @IsNotEmpty()
  issueId: number;
}
