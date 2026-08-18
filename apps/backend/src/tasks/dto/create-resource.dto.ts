import { IsString, IsUrl, MaxLength } from 'class-validator';

export class CreateResourceDto {
  @IsString()
  @MaxLength(100)
  label: string;

  @IsUrl({ require_protocol: true })
  url: string;
}