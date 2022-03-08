import { IsNumber, IsString } from 'class-validator';

export abstract class PublicReportDto {
  @IsNumber()
  firstNo: number;

  @IsNumber()
  secondNo: number;

  @IsNumber()
  thirdNo: number;

  @IsString()
  description: string;
}

export class CreateReportBoardDto extends PublicReportDto {
  @IsNumber()
  boardNo: number;

  @IsNumber()
  reportUserNo: number;
}

export class CreateReportUserDto extends PublicReportDto {
  @IsNumber()
  userNo: number;

  @IsNumber()
  reportUserNo: number;
}
