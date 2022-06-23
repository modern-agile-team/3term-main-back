import { IsString } from 'class-validator';

export class PaginationDto {
  @IsString()
  take: string;

  @IsString()
  page: string;
}
