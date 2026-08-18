import { IsString, IsOptional, MaxLength, Matches } from 'class-validator';

export class CreateLabelDto {
  @IsString()
  @MaxLength(50)
  name: string;

  @IsOptional()
  @IsString()
  @Matches(/^#[0-9a-fA-F]{6}$/, { message: 'color must be a hex value like #6b7280' })
  color?: string;
}