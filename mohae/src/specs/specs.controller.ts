import { Body, Controller, Post } from '@nestjs/common';
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
}
