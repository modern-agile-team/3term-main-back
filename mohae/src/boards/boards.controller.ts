import {
  Body,
  Controller,
  Get,
  Param,
  Post,
  Delete,
  UsePipes,
  ValidationPipe,
} from '@nestjs/common';
import { BoardsService } from './boards.service';
import { CreateBoardDto } from './dto/board.dto';
import { Board } from './entity/board.entity';

@Controller('boards')
export class BoardsController {
  constructor(private boardService: BoardsService) {}

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
}
