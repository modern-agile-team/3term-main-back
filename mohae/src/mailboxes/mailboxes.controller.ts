import { Controller, Get, Param } from '@nestjs/common';
import { MailboxesService } from './mailboxes.service';

@Controller('mailboxes')
export class MailboxesController {
  constructor(private mailboxesService: MailboxesService) {}

  // 유저가 알림버튼을 클릭했을 때 API
  @Get('/find/:no')
  async findAllMailboxes(@Param('no') no: number) {
    const response = await this.mailboxesService.findAllMailboxes(no);

    return response;
  }

  // 유저가 채팅방 없이 쪽지 버튼을 눌렀을 때 API
  @Get('/:myNo/:yourNo')
  async searchMailbox(
    @Param('myNo') myNo: number,
    @Param('yourNo') yourNo: number,
  ) {
    const response = await this.mailboxesService.searchMailbox(myNo, yourNo);

    return response;
  }

  @Get('/all/:no')
  async searchMailboxList(@Param('no') no: number) {
    const response = await this.mailboxesService.searchMailboxList(no);

    return response;
  }
}
