import { Body, Controller, Get, Param, Patch, Post } from '@nestjs/common';
import { CommentsService } from './comments.service';
import { CreateCommentDto } from './dto/create-comment.dto';
import { UpdateCommentDto } from './dto/update-comment.dto';

@Controller(':boardNo/comments')
export class CommentsController {
  constructor(private readonly commentsService: CommentsService) {}

  @Get()
  readAllComments(@Param('boardNo') boardNo: number) {
    return this.commentsService.readAllComments(boardNo);
  }

  @Post()
  createComment(
    @Param('boardNo') boardNo: number,
    @Body() createCommentDto: CreateCommentDto,
  ) {
    return this.commentsService.createComment(boardNo, createCommentDto);
  }

  @Patch(':commentNo')
  updateComment(
    @Param() boardAndCommentNo: { boardNo: number; commentNo: number },
    @Body() updateCommentDto: UpdateCommentDto,
  ) {
    return this.commentsService.updateComment(
      boardAndCommentNo,
      updateCommentDto,
    );
  }
}
