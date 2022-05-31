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
  UseGuards,
} from '@nestjs/common';
import { User } from '@sentry/node';
import { AuthGuard } from '@nestjs/passport';
import { Cron } from '@nestjs/schedule';
import {
  ApiCreatedResponse,
  ApiOperation,
  ApiQuery,
  ApiTags,
} from '@nestjs/swagger';
import { BoardsService } from './boards.service';
import {
  CreateBoardDto,
  SearchBoardDto,
  UpdateBoardDto,
} from './dto/board.dto';
import { Board } from './entity/board.entity';
import { CurrentUser } from 'src/common/decorators/current-user.decorator';

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

  @Get('profile')
  async readUserBoard(
    @Query('user') user: number,
    @Query('take') take: number,
    @Query('page') page: number,
    @Query('target') target: boolean,
  ) {
    try {
      const response: Array<Board> = await this.boardService.readUserBoard(
        user,
        take,
        page,
        target,
      );
      return Object.assign({
        statusCode: 200,
        msg: '프로필 게시물 조회에 성공했습니다.',
        response,
      });
    } catch (err) {
      throw err;
    }
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
        response: true,
      },
    },
  })
  @UseGuards(AuthGuard())
  async createBoard(
    @Body() createBoardDto: CreateBoardDto,
    @CurrentUser() user: User,
  ): Promise<object> {
    const response: boolean = await this.boardService.createBoard(
      createBoardDto,
      user,
    );

    return Object.assign({
      statusCode: 201,
      msg: '게시글 생성이 완료 되었습니다.',
      response,
    });
  }

  @ApiOperation({
    summary: '게시글 삭제 경로',
    description: '게시글 삭제 API',
  })
  @ApiCreatedResponse({
    description: '성공여부',
    schema: {
      example: {
        statusCode: 204,
        msg: '게시글 삭제가 완료되었습니다.',
        response: true,
      },
    },
  })
  @UseGuards(AuthGuard())
  @Delete('/:no')
  async deleteBoard(
    @Param('no') boardNo: number,
    @CurrentUser() user: User,
  ): Promise<object> {
    const response: boolean = await this.boardService.deleteBoard(
      boardNo,
      user.no,
    );

    return Object.assign({
      statusCode: 204,
      msg: '게시글 삭제가 완료되었습니다',
      response,
    });
  }

  @UseGuards(AuthGuard())
  @Patch('/:no')
  async updateBoard(
    @Param('no') boardNo: number,
    @Body() updateBoardDto: UpdateBoardDto,
    @CurrentUser() user: User,
  ): Promise<object> {
    const response: boolean = await this.boardService.updateBoard(
      boardNo,
      updateBoardDto,
      user.no,
    );

    return Object.assign({
      statusCode: 201,
      msg: '게시글 수정이 완료되었습니다.',
      response,
    });
  }
}
