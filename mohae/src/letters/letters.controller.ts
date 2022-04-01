import { Body, Controller, Get, Param, Post } from '@nestjs/common';
import { MailboxesService } from 'src/mailboxes/mailboxes.service';
import { SendLetterDto } from './dto/letter.dto';
import { LettersService } from './letters.service';

@Controller('letters')
export class LettersController {
  constructor(
    private lettersService: LettersService,
    private mailboxesService: MailboxesService,
  ) {}

  @Get(':myNo/:youNo')
  async readingLetter(
    @Param('myNo') myNo: number,
    @Param('youNo') youNo: number,
  ) {
    const response = await this.lettersService.readingLetter(myNo, youNo);

    return response;
  }

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
