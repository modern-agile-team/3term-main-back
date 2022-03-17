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
} from '@nestjs/common';
import { ApiCreatedResponse, ApiOperation, ApiTags } from '@nestjs/swagger';
import { BoardsService } from './boards.service';
import { CreateBoardDto, UpdateBoardDto } from './dto/board.dto';
import { Board } from './entity/board.entity';

@Controller('boards')
@ApiTags('Boards')
export class BoardsController {
  constructor(private boardService: BoardsService) {}

  @Get()
  async getAllBoard(): Promise<Board[]> {
    return await this.boardService.getAllBoards();
  }

  @Get('/:no')
  async getByOneBoard(@Param('no') no: number): Promise<Board> {
    return await this.boardService.findOne(no);
  }

  @Post()
  @UsePipes(ValidationPipe)
  @ApiOperation({
    summary: '게시글 생성 경로',
    description: '게시글 생성 API',
  })
  @ApiCreatedResponse({
    description: '성공여부',
    schema: {
      example: {
        statusCode: 201,
        msg: '게시글 생성이 완료되었습니다.',
        response: {
          success: true,
          createBoardNo: 26,
        },
      },
    },
  })
  async createBoard(@Body() createBoardDto: CreateBoardDto): Promise<Board> {
    const response = await this.boardService.createBoard(createBoardDto);

    return Object.assign({
      statusCode: 201,
      msg: '게시글 생성이 완료되었습니다.',
      response,
    });
  }

  @Delete('/:no')
  deleteBoard(@Param('no') no: number): Promise<void> {
    return this.boardService.delete(no);
  }

  @Patch('/:no')
  async updateBoard(
    @Param('no') no: number,
    @Body() updateBoardDto: UpdateBoardDto,
  ): Promise<object> {
    const response = await this.boardService.updateBoard(no, updateBoardDto);

    return Object.assign({
      statusCode: 201,
      msg: '게시글 수정이 완료되었습니다.',
      response,
    });
  }
}
