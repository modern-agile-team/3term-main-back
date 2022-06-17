import {
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
  Param,
  Patch,
  Post,
  UseFilters,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { User } from 'src/auth/entity/user.entity';
import { HTTP_STATUS_CODE } from 'src/common/configs/http-status.config';
import { CurrentUser } from 'src/common/decorators/current-user.decorator';
import { HttpExceptionFilter } from 'src/common/exceptions/http-exception.filter';
import { SuccesseInterceptor } from 'src/common/interceptors/success.interceptor';
import { CommentsService } from './comments.service';
import { CreateCommentDto } from './dto/create-comment.dto';
import { ParamCommentDto } from './dto/param-comment.dto';
import { UpdateCommentDto } from './dto/update-comment.dto';
import { Comment } from './entity/comment.entity';

@UseGuards(AuthGuard('jwt'))
@UseFilters(HttpExceptionFilter)
@UseInterceptors(SuccesseInterceptor)
@Controller('board/:boardNo/comments')
export class CommentsController {
  constructor(private readonly commentsService: CommentsService) {}

  @HttpCode(HTTP_STATUS_CODE.success.ok)
  @Get()
  async readAllComments(
    @Param('boardNo') boardNo: number,
    @CurrentUser() loginUser: User,
  ): Promise<object> {
    const response: object = await this.commentsService.readAllComments(
      boardNo,
      loginUser,
    );

    return {
      msg: `No${boardNo} 게시글의 댓글 전체 조회 완료`,
      response,
    };
  }

  @HttpCode(HTTP_STATUS_CODE.success.created)
  @Post()
  async createComment(
    @Param('boardNo') boardNo: number,
    @Body() { content }: CreateCommentDto,
    @CurrentUser() loginUser: User,
  ): Promise<object> {
    await this.commentsService.createComment(boardNo, content, loginUser);

    return {
      msg: '댓글 작성 성공',
    };
  }

  @HttpCode(HTTP_STATUS_CODE.success.created)
  @Patch(':commentNo')
  async updateComment(
    @Param() { commentNo }: { commentNo: number },
    @Body() { content }: UpdateCommentDto,
    @CurrentUser() loginUser: User,
  ): Promise<object> {
    await this.commentsService.updateComment(commentNo, content, loginUser);

    return {
      msg: '댓글 수정 성공',
    };
  }

  @HttpCode(HTTP_STATUS_CODE.success.created)
  @Delete(':commentNo')
  async deleteComment(
    @Param() { commentNo }: { commentNo: number },
    @CurrentUser() loginUser: User,
  ): Promise<object> {
    await this.commentsService.deleteComment(commentNo, loginUser);

    return {
      msg: '댓글 삭제 성공',
    };
  }
}
