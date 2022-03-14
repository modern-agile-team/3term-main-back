import { IsNumber, IsString } from 'class-validator';

export abstract class PublicReportDto {
  @IsNumber()
  reportUserNo: number;

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
  reportedBoardNo: number;
}

export class CreateReportUserDto extends PublicReportDto {
  @IsNumber()
  reportedUserNo: number;
}
