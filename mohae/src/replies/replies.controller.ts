import {
  Body,
  Controller,
  Delete,
  HttpCode,
  Param,
  Post,
  Put,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { ApiOkResponse, ApiOperation, ApiTags } from '@nestjs/swagger';
import { User } from 'src/auth/entity/user.entity';
import { HTTP_STATUS_CODE } from 'src/common/configs/http-status.config';
import { CurrentUser } from 'src/common/decorators/current-user.decorator';
import { CreateReplyDto } from './dto/create-reply.dto';
import { UpdateReplyDto } from './dto/update-reply.dto';
import { RepliesService } from './replies.service';

@UseGuards(AuthGuard('jwt'))
@ApiTags('Replies')
@Controller('comments/:commentNo/replies')
export class RepliesController {
  constructor(private readonly repliesService: RepliesService) {}

  @ApiOperation({
    summary: '대댓글 생성',
    description: '대댓글 생성 API',
  })
  @ApiOkResponse({
    description: '대댓글 생성 성공 결과',
    schema: {
      example: {
        success: true,
        statusCode: HTTP_STATUS_CODE.success.created,
        msg: '대댓글 생성 완료',
      },
    },
  })
  @HttpCode(HTTP_STATUS_CODE.success.created)
  @Post()
  async createReply(
    @Param('commentNo') commentNo: number,
    @Body() { content }: CreateReplyDto,
    @CurrentUser() loginUser: User,
  ): Promise<object> {
    await this.repliesService.createReply(commentNo, content, loginUser.no);

    return {
      msg: '대댓글 생성 완료',
    };
  }

  @ApiOperation({
    summary: '대댓글 수정',
    description: '대댓글 수정 API',
  })
  @ApiOkResponse({
    description: '대댓글 수정 성공 결과',
    schema: {
      example: {
        success: true,
        statusCode: HTTP_STATUS_CODE.success.ok,
        msg: '대댓글 수정 완료',
      },
    },
  })
  @HttpCode(HTTP_STATUS_CODE.success.ok)
  @Put(':replyNo')
  async updateReply(
    @Param('replyNo') replyNo: number,
    @Body() { content }: UpdateReplyDto,
    @CurrentUser() loginUser: User,
  ): Promise<object> {
    await this.repliesService.updateReply(replyNo, content, loginUser.no);

    return {
      msg: '대댓글 수정 완료',
    };
  }

  @ApiOperation({
    summary: '대댓글 삭제',
    description: '대댓글 삭제 API',
  })
  @ApiOkResponse({
    description: '대댓글 삭제 성공 결과',
    schema: {
      example: {
        success: true,
        statusCode: HTTP_STATUS_CODE.success.ok,
        msg: '대댓글 삭제 완료',
      },
    },
  })
  @HttpCode(HTTP_STATUS_CODE.success.ok)
  @Delete(':replyNo')
  async deleteReply(
    @Param('replyNo') replyNo: number,
    @CurrentUser() loginUser: User,
  ): Promise<object> {
    await this.repliesService.deleteReply(replyNo, loginUser.no);

    return {
      msg: '대댓글 삭제 완료',
    };
  }
}
