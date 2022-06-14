import { Injectable } from '@nestjs/common';
import { CreateCommentDto } from './dto/create-comment.dto';
import { CommentRepository } from './repository/comment.repository';

@Injectable()
export class CommentsService {
  constructor(private readonly commentRepository: CommentRepository) {}

  readAllComments(boardNo: number) {
    return this.commentRepository.readAllComments(boardNo);
  }

  createComment(boardNo: number, createCommentDto: CreateCommentDto) {
    return this.commentRepository.createComment(boardNo, createCommentDto);
  }
}
