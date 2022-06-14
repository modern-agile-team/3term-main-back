import {
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
  Param,
  Patch,
  Post,
  UseInterceptors,
} from '@nestjs/common';
import { HTTP_STATUS_CODE } from 'src/common/configs/http-status.config';
import { SuccesseInterceptor } from 'src/common/interceptors/success.interceptor';
import { CommentsService } from './comments.service';
import { CreateCommentDto } from './dto/create-comment.dto';
import { ParamCommentDto } from './dto/param-comment.dto';
import { UpdateCommentDto } from './dto/update-comment.dto';
import { Comment } from './entity/comment.entity';

@UseInterceptors(SuccesseInterceptor)
@Controller('board/:boardNo/comments')
export class CommentsController {
  constructor(private readonly commentsService: CommentsService) {}

  @HttpCode(HTTP_STATUS_CODE.success.ok)
  @Get()
  async readAllComments(@Param('boardNo') boardNo: number): Promise<object> {
    const response: Comment[] = await this.commentsService.readAllComments(
      boardNo,
    );

    return {
      msg: `No${boardNo} 게시글의 댓글 전체 조회 완료`,
      response,
    };
  }

  @HttpCode(HTTP_STATUS_CODE.success.created)
  @Post()
  createComment(
    @Param('boardNo') boardNo: number,
    @Body() createCommentDto: CreateCommentDto,
  ): object {
    this.commentsService.createComment(boardNo, createCommentDto);

    return {
      msg: '댓글 작성 성공',
    };
  }

  @HttpCode(HTTP_STATUS_CODE.success.created)
  @Patch(':commentNo')
  updateComment(
    @Param() boardAndCommentNo: ParamCommentDto,
    @Body() updateCommentDto: UpdateCommentDto,
  ): object {
    this.commentsService.updateComment(boardAndCommentNo, updateCommentDto);

    return {
      msg: '댓글 수정 성공',
    };
  }

  @HttpCode(HTTP_STATUS_CODE.success.created)
  @Delete(':commentNo')
  deleteComment(@Param() boardAndCommentNo: ParamCommentDto): object {
    this.commentsService.deleteComment(boardAndCommentNo);

    return {
      msg: '댓글 삭제 성공',
    };
  }
}
