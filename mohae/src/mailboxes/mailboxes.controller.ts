import { Controller, Get, Param } from '@nestjs/common';
import { MailboxesService } from './mailboxes.service';

@Controller('mailboxes')
export class MailboxesController {
  constructor(private mailboxesService: MailboxesService) {}

  @Get('/:no')
  async searchMailboxList(@Param('no') no: number) {
    const response = await this.mailboxesService.searchMailboxList(no);

    return response;
  }
}
