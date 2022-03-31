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
  UseGuards,
  Req,
  Query,
} from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { ApiCreatedResponse, ApiOperation, ApiTags } from '@nestjs/swagger';
import { DeleteResult } from 'typeorm';
import { BoardsService } from './boards.service';
import {
  CreateBoardDto,
  SearchBoardDto,
  UpdateBoardDto,
} from './dto/board.dto';
import { Board } from './entity/board.entity';

@Controller('boards')
@ApiTags('Boards')
export class BoardsController {
  constructor(private boardService: BoardsService) {}

  @Get()
  async getAllBoards(): Promise<Board[]> {
    return await this.boardService.getAllBoards();
  }

  @Get('/search')
  async searchBoard(@Query('sort') sort): Promise<Board[]> {
    const response = await this.boardService.searchAllBoards(sort);

    return response;
  }

  @Get('/:no')
  async getByOneBoard(@Param('no') no: number): Promise<Board> {
    return await this.boardService.getByOneBoard(no);
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
  async deleteBoard(@Param('no') no: number): Promise<DeleteResult> {
    const result = await this.boardService.deleteBoard(no);
    return Object.assign({
      statusCode: 204,
      msg: '게시글 삭제가 완료되었습니다',
    });
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
