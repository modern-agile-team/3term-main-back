import { Controller, Get, Param, Query } from '@nestjs/common';
import { Mailbox } from './entity/mailbox.entity';
import { MailboxesService } from './mailboxes.service';

@Controller('mailboxes')
export class MailboxesController {
  constructor(private mailboxesService: MailboxesService) {}

  // 유저가 우측 하단 알림 버튼을 클릭했을 때
  @Get('/:loginUserNo')
  async readAllMailboxes(
    @Param('loginUserNo') loginUserNo: number,
  ): Promise<object> {
    const response: Mailbox[] = await this.mailboxesService.readAllMailboxes(
      loginUserNo,
    );

    return Object.assign({
      statusCode: 200,
      msg: '쪽지함 조회 완료',
      response,
    });
  }

  // 유저가 알림창에 있는 쪽지함 리스트 중에 하나를 클릭했을 때
  @Get('/letter/:mailboxNo')
  async searchMailbox(
    @Param('mailboxNo') mailboxNo: number,
    @Query('limit') limit: number,
  ): Promise<object> {
    const response: Mailbox = await this.mailboxesService.searchMailbox(
      mailboxNo,
      limit,
    );

    return Object.assign({
      statusCode: 200,
      msg: '쪽지 전송 화면 조회 완료',
      response,
    });
  }

  @Get('/confirm/:oneselfNo/:opponentNo')
  async checkMailbox(
    @Param('oneselfNo') oneselfNo: number,
    @Param('opponentNo') opponentNo: number,
  ): Promise<object> {
    const { success, mailboxNo }: any =
      await this.mailboxesService.checkMailbox(oneselfNo, opponentNo);

    if (!success) {
      return Object.assign({
        statusCode: 200,
        msg: '해당 유저와의 쪽지함이 존재하지 않습니다.',
      });
    }

    const response: Mailbox = await this.mailboxesService.searchMailbox(
      mailboxNo,
      0,
    );

    return Object.assign({
      statusCode: 200,
      msg: '쪽지함 존재 여부 확인 완료',
      response,
    });
  }
}
