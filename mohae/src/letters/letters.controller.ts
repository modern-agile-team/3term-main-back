import { Body, Controller, Get, Post } from '@nestjs/common';
import { SendLetterDto } from './dto/letter.dto';
import { LettersService } from './letters.service';

@Controller('letters')
export class LettersController {
  constructor(private lettersService: LettersService) {}

  @Get()
  async findAllLetters() {
    return await this.lettersService.findAllLetters();
  }

  @Post()
  async sendLetter(@Body() sendLetterDto: SendLetterDto) {
    const response = await this.lettersService.sendLetter(sendLetterDto);

    return response;
  }
}
