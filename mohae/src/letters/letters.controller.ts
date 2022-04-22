import { Body, Controller, Get, Param, Post } from '@nestjs/common';
import { SendLetterDto } from './dto/letter.dto';
import { LettersService } from './letters.service';

@Controller('letters')
export class LettersController {
  constructor(private lettersService: LettersService) {}

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
