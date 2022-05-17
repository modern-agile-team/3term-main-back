import { Body, Controller, Get, Param, Post } from '@nestjs/common';
import { ApiOperation, ApiTags } from '@nestjs/swagger';
import { SendLetterDto } from './dto/letter.dto';
import { LettersService } from './letters.service';

@Controller('letters')
@ApiTags('Letters')
export class LettersController {
  constructor(private lettersService: LettersService) {}

  @ApiOperation({
    summary: '쪽지 보내기 기능',
    description:
      '유저 간 쪽지 보내기 기능, 쪽지함이 없을 경우 생성하고 있으면 저장 API',
  })
  @Post()
  async sendLetter(@Body() sendLetterDto: SendLetterDto) {
    const response = await this.lettersService.sendLetter(sendLetterDto);

    return Object.assign({
      statusCode: 201,
      msg: '쪽지를 정상적으로 전송했습니다.',
      response,
    });
  }
}
