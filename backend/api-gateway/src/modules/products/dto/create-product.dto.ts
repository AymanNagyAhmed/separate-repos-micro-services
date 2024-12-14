import { IsString, IsArray, IsOptional } from 'class-validator';

export class CreateProductDto {
  @IsString()
  title: string;

  @IsString()
  @IsOptional()
  status?: string;

  @IsArray()
  @IsOptional()
  images?: string[];
}
