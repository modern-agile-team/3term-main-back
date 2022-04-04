import { Body, Controller, Get, Param, Post } from '@nestjs/common';
import { CreateSpecDto } from './dto/spec.dto';
import { SpecsService } from './specs.service';

@Controller('specs')
export class SpecsController {
  constructor(private specsService: SpecsService) {}

  @Post('/regist')
  async registSpec(@Body() createSpecDto: CreateSpecDto) {
    try {
      await this.specsService.registSpec(createSpecDto);

      return Object.assign({
        statusCode: 200,
        msg: '성공적으로 스팩등록이 되었습니다.',
      });
    } catch (err) {
      throw err;
    }
  }
  @Get('/user/:no')
  async getAllSpec(@Param() no: number) {
    try {
      const specs = await this.specsService.getAllSpec(no);

      return Object.assign({
        statusCode: 200,
        msg: '성공적으로 스펙이 불러와졌습니다.',
        specs,
      });
    } catch (err) {
      throw err;
    }
  }
}
