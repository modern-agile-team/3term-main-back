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
  Query,
  Logger,
} from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { Cron } from '@nestjs/schedule';
import { ApiCreatedResponse, ApiOperation, ApiTags } from '@nestjs/swagger';
import { DeleteResult } from 'typeorm';
import { BoardsService } from './boards.service';
import {
  CreateBoardDto,
  SearchBoardDto,
  LikeBoardDto,
  UpdateBoardDto,
} from './dto/board.dto';
import { Board } from './entity/board.entity';

@Controller('boards')
@ApiTags('Boards')
export class BoardsController {
  private logger = new Logger('BoardsController');
  constructor(private boardService: BoardsService) {}

  @Cron('0 1 * * * *')
  async handleCron() {
    const isClosed: Number = await this.boardService.closingBoard();

    this.logger.verbose(`게시글 ${isClosed}개 마감처리`);
  }

  @Get()
  async getAllBoards(): Promise<Object> {
    const response: Object = await this.boardService.getAllBoards();

    return Object.assign({
      statusCode: 200,
      msg: '게시글 전체 조회가 완료되었습니다.',
      response,
    });
  }

  @Get('/filter')
  async filteredBoards(@Query() paginationQuery): Promise<Object> {
    const {
      categoryNo,
      sort,
      title,
      popular,
      areaNo,
      max,
      min,
      target,
      date,
      free,
    } = paginationQuery;

    const response = await this.boardService.filteredBoards(
      categoryNo,
      sort,
      title,
      popular,
      areaNo,
      max,
      min,
      target,
      Number(date),
      free,
    );

    return Object.assign({
      statusCode: 200,
      msg: '게시글 필터링이 완료되었습니다.',
      response,
    });
  }

  @Get('/hot')
  async readHotBoards(@Query('select') select: number): Promise<Object> {
    const response = await this.boardService.readHotBoards(select);

    return Object.assign({
      statusCode: 200,
      msg: '인기 게시글 조회가 완료되었습니다.',
      response,
    });
  }

  @Get('search')
  async searchAllBoards(
    @Query() searchBoardDto: SearchBoardDto,
  ): Promise<Object> {
    const response = await this.boardService.searchAllBoards(searchBoardDto);

    return Object.assign({
      statusCode: 200,
      msg: '검색결과에 대한 게시글 조회가 완료되었습니다.',
      response,
    });
  }

  @Patch('/cancel/:no')
  async cancelClosedBoard(@Param('no') no: number): Promise<Object> {
    const response = await this.boardService.cancelClosedBoard(no);

    return Object.assign({
      statusCode: 200,
      msg: '게시글 마감 취소가 완료되었습니다.',
      response,
    });
  }

  @Patch('/close/:no')
  async boardClosed(@Param('no') no: number): Promise<Object> {
    const response = await this.boardService.boardClosed(no);

    return Object.assign({
      statusCode: 200,
      msg: '게시글 마감이 완료되었습니다.',
      response,
    });
  }

  @Get('/:no')
  async getByOneBoard(@Param('no') no: number): Promise<Object> {
    const response = await this.boardService.getByOneBoard(no);

    return Object.assign({
      statusCode: 200,
      msg: '게시글 상세 조회가 완료되었습니다.',
      response,
    });
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
  async createBoard(@Body() createBoardDto: CreateBoardDto): Promise<object> {
    const response: boolean = await this.boardService.createBoard(
      createBoardDto,
    );

    return Object.assign({
      statusCode: 201,
      msg: '게시글 생성이 완료 되었습니다.',
      response,
    });
  }

  @Delete('/:no')
  async deleteBoard(@Param('no') no: number): Promise<object> {
    const response: boolean = await this.boardService.deleteBoard(no);

    return Object.assign({
      statusCode: 204,
      msg: '게시글 삭제가 완료되었습니다',
      response,
    });
  }

  @Patch('/:no')
  async updateBoard(
    @Param('no') no: number,
    @Body() updateBoardDto: UpdateBoardDto,
  ): Promise<object> {
    const response: boolean = await this.boardService.updateBoard(
      no,
      updateBoardDto,
    );

    return Object.assign({
      statusCode: 201,
      msg: '게시글 수정이 완료되었습니다.',
      response,
    });
  }
}
