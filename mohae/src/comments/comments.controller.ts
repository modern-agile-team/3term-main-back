import {
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
  Param,
  Post,
  Put,
  UseFilters,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { ApiOkResponse, ApiOperation, ApiTags } from '@nestjs/swagger';
import { User } from 'src/auth/entity/user.entity';
import { HTTP_STATUS_CODE } from 'src/common/configs/http-status.config';
import { CurrentUser } from 'src/common/decorators/current-user.decorator';
import { HttpExceptionFilter } from 'src/common/exceptions/http-exception.filter';
import { SuccesseInterceptor } from 'src/common/interceptors/success.interceptor';
import { CommentsService } from './comments.service';
import { CreateCommentDto } from './dto/create-comment.dto';
import { UpdateCommentDto } from './dto/update-comment.dto';

@UseGuards(AuthGuard('jwt'))
@UseFilters(HttpExceptionFilter)
@UseInterceptors(SuccesseInterceptor)
@ApiTags('Comments')
@Controller('board/:boardNo/comments')
export class CommentsController {
  constructor(private readonly commentsService: CommentsService) {}

  @ApiOperation({
    summary: '게시글 댓글 전체 조회 경로',
    description: '댓글 전체 조회 API',
  })
  @ApiOkResponse({
    description: '성공여부',
    schema: {
      example: {
        success: true,
        statusCode: HTTP_STATUS_CODE.success.ok,
        msg: '댓글 전체 조회 완료',
        response: [
          {
            commentNo: 8,
            commentContent: '댓글을 수정했습니다.',
            commentCreatedAt: '2022년 06월 17일',
            commenterNo: 2,
            commenterNickname: 'hneeddjsjde',
            commenterPhotoUrl: 'profile/165518423416.jpg',
            isCommenter: 0,
            replies: [
              {
                replyNo: 1,
                replyContent: '가ㄷㅏㅁㅏㅏㅏㅏ',
                replyWriterNo: 1,
                replyWriterPhotoUrl: 'example.com',
                replyCreatedAt: '2022년 06월 17일',
              },
            ],
          },
        ],
      },
    },
  })
  @HttpCode(HTTP_STATUS_CODE.success.ok)
  @Get()
  async readAllComments(
    @Param('boardNo') boardNo: number,
    @CurrentUser() loginUser: User,
  ): Promise<object> {
    const response: object = await this.commentsService.readAllComments(
      boardNo,
      loginUser.no,
    );

    return {
      msg: `댓글 전체 조회 완료`,
      response,
    };
  }

  @ApiOperation({
    summary: '댓글 생성',
    description: '댓글 생성 API',
  })
  @ApiOkResponse({
    description: '댓글 생성 성공 결과',
    schema: {
      example: {
        success: true,
        statusCode: HTTP_STATUS_CODE.success.created,
        msg: '댓글 생성 완료',
      },
    },
  })
  @HttpCode(HTTP_STATUS_CODE.success.created)
  @Post()
  async createComment(
    @Param('boardNo') boardNo: number,
    @Body() { content }: CreateCommentDto,
    @CurrentUser() loginUser: User,
  ): Promise<object> {
    await this.commentsService.createComment(boardNo, content, loginUser.no);

    return {
      msg: '댓글 작성 성공',
    };
  }

  @ApiOperation({
    summary: '댓글 수정',
    description: '댓글 수정 API',
  })
  @ApiOkResponse({
    description: '댓글 수정 성공 결과',
    schema: {
      example: {
        success: true,
        statusCode: HTTP_STATUS_CODE.success.ok,
        msg: '댓글 수정 완료',
      },
    },
  })
  @HttpCode(HTTP_STATUS_CODE.success.created)
  @Put(':commentNo')
  async updateComment(
    @Param('commentNo') commentNo: number,
    @Body() { content }: UpdateCommentDto,
    @CurrentUser() loginUser: User,
  ): Promise<object> {
    await this.commentsService.updateComment(commentNo, content, loginUser.no);

    return {
      msg: '댓글 수정 성공',
    };
  }

  @ApiOperation({
    summary: '댓글 삭제',
    description: '댓글 삭제 API',
  })
  @ApiOkResponse({
    description: '댓글 삭제 성공 결과',
    schema: {
      example: {
        success: true,
        statusCode: HTTP_STATUS_CODE.success.ok,
        msg: '댓글 삭제 완료',
      },
    },
  })
  @HttpCode(HTTP_STATUS_CODE.success.created)
  @Delete(':commentNo')
  async deleteComment(
    @Param('commentNo') commentNo: number,
    @CurrentUser() loginUser: User,
  ): Promise<object> {
    await this.commentsService.deleteComment(commentNo, loginUser.no);

    return {
      msg: '댓글 삭제 성공',
    };
  }
}
