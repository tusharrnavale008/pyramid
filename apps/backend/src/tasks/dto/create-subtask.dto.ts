import { IsString, IsOptional, IsEnum, IsDateString, MaxLength } from 'class-validator';
import { TaskPriority } from '@prisma/client';

export class CreateSubtaskDto {
  @IsString()
  @MaxLength(300)
  title: string;

  @IsOptional()
  @IsEnum(TaskPriority)
  priority?: TaskPriority;

  @IsOptional()
  @IsString()
  memberId?: string;

  @IsOptional()
  @IsDateString()
  dueDate?: string;
}