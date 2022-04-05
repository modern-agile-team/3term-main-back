import { Body, Controller, Get, Param, Patch, Post } from '@nestjs/common';
import { CreateSpecDto, UpdateSpecDto } from './dto/spec.dto';
import { SpecsService } from './specs.service';

@Controller('specs')
export class SpecsController {
  constructor(private specsService: SpecsService) {}

  @Get('/user/:no')
  async getAllSpec(@Param('no') no: number) {
    try {
      const specs = await this.specsService.getAllSpec(no);

      return Object.assign({
        statusCode: 200,
        msg: '성공적으로 스펙을 불러왔습니다.',
        specs,
      });
    } catch (err) {
      throw err;
    }
  }

  @Post('/regist')
  async registSpec(@Body() createSpecDto: CreateSpecDto) {
    try {
      await this.specsService.registSpec(createSpecDto);

      return Object.assign({
        statusCode: 201,
        msg: '성공적으로 스팩등록이 되었습니다.',
      });
    } catch (err) {
      throw err;
    }
  }

  @Patch('/:no')
  async updateSpec(@Param('no') specNo: number, @Body() updateSpec) {
    try {
      await this.specsService.updateSpec(specNo, updateSpec);

      return Object.assign({
        statusCode: 204,
        msg: '성공적으로 스팩이 수정되었습니다.',
      });
    } catch (err) {
      throw err;
    }
  }
}
