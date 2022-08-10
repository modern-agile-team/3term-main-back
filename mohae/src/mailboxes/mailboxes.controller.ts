import {
  Controller,
  Get,
  HttpCode,
  Param,
  Query,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { ApiOperation, ApiTags } from '@nestjs/swagger';
import { User } from 'src/auth/entity/user.entity';
import { HTTP_STATUS_CODE } from 'src/common/configs/http-status.config';
import { CurrentUser } from 'src/common/decorators/current-user.decorator';
import { Mailbox } from './entity/mailbox.entity';
import { MailboxesService } from './mailboxes.service';

@ApiTags('Mailboxes')
@UseGuards(AuthGuard('jwt-refresh-token'))
@Controller('mailboxes')
export class MailboxesController {
  constructor(private mailboxesService: MailboxesService) {}

  @ApiOperation({
    summary: '로그인한 유저의 쪽지함 전체 조회',
    description: '로그인한 유저의 쪽지함 전체를 조회하는 API',
  })
  @HttpCode(HTTP_STATUS_CODE.success.ok)
  @Get()
  async readAllMailboxes(@CurrentUser() user: User): Promise<object> {
    const response: any = await this.mailboxesService.readAllMailboxes(user);

    return {
      msg: '쪽지함 목록 조회 완료',
      response,
    };
  }

  @ApiOperation({
    summary: '쪽지함 목록에 있는 한 개의 쪽지함을 클릭',
    description: '클릭한 쪽지함 내용을 조회하는 API',
  })
  @HttpCode(HTTP_STATUS_CODE.success.ok)
  @Get(':mailboxNo')
  async searchMailbox(
    @Param('mailboxNo') mailboxNo: number,
    @Query('limit') limit: number,
  ): Promise<object> {
    const response: Mailbox = await this.mailboxesService.searchMailbox(
      mailboxNo,
      limit,
    );

    return {
      msg: '쪽지 전송 화면 조회 완료',
      response,
    };
  }

  @ApiOperation({
    summary: '로그인한 유저와 상대방의 유저의 채팅 내역이 있는지 확인',
    description:
      '채팅 내역이 존재하면 채팅 내역 리턴, 없으면 아무 내용도 리턴하지 않는 API',
  })
  @Get('confirm/:opponentNo')
  async checkMailbox(
    @CurrentUser() oneself: User,
    @Param('opponentNo') opponentNo: number,
  ): Promise<object> {
    const { success, mailboxNo }: { success: boolean; mailboxNo: number } =
      await this.mailboxesService.checkMailbox(oneself, opponentNo);

    if (!success) {
      return {
        statusCode: HTTP_STATUS_CODE.success.accepted,
        msg: '해당 유저와의 쪽지함이 존재하지 않습니다.',
      };
    }

    const response: Mailbox = await this.mailboxesService.searchMailbox(
      mailboxNo,
      0,
    );

    return {
      statusCode: HTTP_STATUS_CODE.success.ok,
      msg: '쪽지함 존재 여부 확인 완료',
      response,
    };
  }
}
