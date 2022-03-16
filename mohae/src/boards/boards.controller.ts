import {
  Body,
  Controller,
  Get,
  Param,
  Post,
  Delete,
  UsePipes,
  ValidationPipe,
  Patch,
  ParseIntPipe,
} from '@nestjs/common';
import { CreateReviewDto } from 'src/reviews/dto/create-review.dto';
import { BoardUpdate } from './board.model';
import { BoardsService } from './boards.service';
import { CreateBoardDto, UpdateBoardDto } from './dto/board.dto';
import { Board } from './entity/board.entity';

@Controller('boards')
export class BoardsController {
  constructor(private boardService: BoardsService) {}

  @Patch('review/:no')
  createBoardReview(
    @Param('no', ParseIntPipe) no: number,
    @Body() createReviewDto: CreateReviewDto,
  ): Promise<Board> {
    return this.boardService.createBoardReview(no, createReviewDto);
  }

  @Get()
  getAllBoard(): Promise<Board[]> {
    return this.boardService.getAllBoards();
  }

  @Get('/:no')
  getByOneBoard(@Param('no') no: number): Promise<Board> {
    return this.boardService.findOne(no);
  }

  @Post()
  @UsePipes(ValidationPipe)
  createBoard(@Body() createBoardDto: CreateBoardDto): Promise<Board> {
    return this.boardService.create(createBoardDto);
  }

  @Delete('/:no')
  deleteBoard(@Param('no') no: number): Promise<void> {
    return this.boardService.delete(no);
  }

  @Patch('/:no')
  updateBoard(
    @Param('no') no: number,
    @Body() updateBoardDto: UpdateBoardDto,
  ): Promise<Board> {
    this.boardService.update(no, updateBoardDto);
    return Object.assign({
      statusCode: 201,
      msg: '게시글 수정이 완료되었습니다.',
    });
  }
}
