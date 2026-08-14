import { IsString, IsOptional, IsEnum, IsDateString, MaxLength } from 'class-validator';
import { TaskPriority } from '@prisma/client';

export class CreateProjectDto {
  @IsString()
  @MaxLength(200)
  name: string;

  @IsOptional()
  @IsEnum(TaskPriority)
  priority?: TaskPriority;

  @IsOptional()
  @IsString()
  leadId?: string;

  @IsOptional()
  @IsDateString()
  dueDate?: string;
}