import { Controller, Get, Param } from '@nestjs/common';
import { MailboxesService } from './mailboxes.service';

@Controller('mailboxes')
export class MailboxesController {
  constructor(private mailboxesService: MailboxesService) {}

  // 유저가 알림버튼을 클릭했을 때 API
  @Get('/list/:loginUserNo')
  async findAllMailboxes(@Param('loginUserNo') loginUserNo: number) {
    const response = await this.mailboxesService.findAllMailboxes(loginUserNo);

    return Object.assign({
      statusCode: 200,
      msg: '쪽지함 조회 완료',
      response,
    });
  }

  // 유저가 채팅방 없이 쪽지 버튼을 눌렀을 때 API
  @Get('/:loginUserNo/:clickedUserNo')
  async searchMailbox(
    @Param('loginUserNo') loginUserNo: number,
    @Param('clickedUserNo') clickedUserNo: number,
  ) {
    const response = await this.mailboxesService.searchMailbox(
      loginUserNo,
      clickedUserNo,
    );

    return Object.assign({
      statusCode: 200,
      msg: '쪽지 전송 화면 조회 완료',
      response,
    });
  }
}
