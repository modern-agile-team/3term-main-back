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
  UseInterceptors,
  HttpCode,
} from '@nestjs/common';
import { User } from '@sentry/node';
import { AuthGuard } from '@nestjs/passport';
import { Cron } from '@nestjs/schedule';
import {
  ApiBadRequestResponse,
  ApiCreatedResponse,
  ApiInternalServerErrorResponse,
  ApiNoContentResponse,
  ApiOkResponse,
  ApiOperation,
  ApiTags,
  ApiUnauthorizedResponse,
} from '@nestjs/swagger';
import { SuccesseInterceptor } from 'src/common/interceptors/success.interceptor';
import { BoardsService } from './boards.service';
import {
  CreateBoardDto,
  SearchBoardDto,
  UpdateBoardDto,
} from './dto/board.dto';
import { Board } from './entity/board.entity';
import { CurrentUser } from 'src/common/decorators/current-user.decorator';

@Controller('boards')
@UseInterceptors(SuccesseInterceptor)
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

  @ApiOperation({
    summary: '게시글 검색 경로',
    description: '게시글 검색 API',
  })
  @ApiOkResponse({
    description: '성공여부',
    schema: {
      example: {
        statusCode: 200,
        msg: '검색결과에 대한 게시글 조회가 완료되었습니다.',
        response: {
          foundedBoardNum: 1,
          search: 'Test',
          boards: [
            {
              no: 1,
              decimalDay: null,
              title: '게시글 검색 Test',
              isDeadline: 0,
              price: 1000,
              target: 1,
              areaNo: 1,
              areaName: '서울특별시',
              userNickname: 'hneeddjjde',
            },
          ],
        },
      },
    },
  })
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

  @ApiOperation({
    summary: '게시글 마감 취소 경로',
    description: '게시글 마감 취소 API',
  })
  @ApiOkResponse({
    description: '성공여부',
    schema: {
      example: {
        success: true,
        statusCode: 200,
        msg: '게시글 마감 취소가 완료되었습니다.',
      },
    },
  })
  @ApiBadRequestResponse({
    description: '마감이 안된 게시글을 마감취소를 하려고 하였을 때',
    schema: {
      example: {
        statusCode: 400,
        msg: '활성화된 게시글 입니다.',
        err: 'Bad Request',
      },
    },
  })
  @ApiUnauthorizedResponse({
    description: '게시글을 작성한 회원이 아닐 경우',
    schema: {
      example: {
        statusCode: 401,
        message: '게시글을 작성한 유저가 아닙니다.',
        error: 'Unauthorized',
      },
    },
  })
  @UseGuards(AuthGuard())
  @Patch('/cancel/:no')
  @HttpCode(200)
  async cancelClosedBoard(
    @Param('no') no: number,
    @CurrentUser() user: User,
  ): Promise<object> {
    await this.boardService.cancelClosedBoard(no, user.no);

    return Object.assign({
      msg: '게시글 마감 취소가 완료되었습니다.',
    });
  }

  @ApiOperation({
    summary: '게시글 마감 경로',
    description: '게시글 마감 API',
  })
  @ApiOkResponse({
    description: '성공여부',
    schema: {
      example: {
        success: true,
        statusCode: 200,
        msg: '게시글 마감이 완료되었습니다.',
      },
    },
  })
  @ApiInternalServerErrorResponse({
    description: '이미 마감된 게시글을 마감하려고 하였을 때',
    schema: {
      example: {
        statusCode: 400,
        msg: '이미 마감된 게시글 입니다.',
        err: 'Bad Request',
      },
    },
  })
  @ApiUnauthorizedResponse({
    description: '게시글을 작성한 회원이 아닐 경우',
    schema: {
      example: {
        statusCode: 401,
        message: '게시글을 작성한 유저가 아닙니다.',
        error: 'Unauthorized',
      },
    },
  })
  @UseGuards(AuthGuard())
  @Patch('/close/:no')
  @HttpCode(200)
  async boardClosed(
    @Param('no') no: number,
    @CurrentUser() user: User,
  ): Promise<object> {
    await this.boardService.boardClosed(no, user.no);

    return {
      msg: '게시글 마감이 완료되었습니다.',
    };
  }

  @Get('profile')
  @HttpCode(200)
  @ApiOperation({
    summary: '프로필 페이지에서 유저가 작성한 게시글 불러오는 API',
    description: '프로필 주인이 작성한 게시글을 불러온다.',
  })
  @ApiOkResponse({
    description: '프로필 게시물 조회에 성공한 경우.',
  })
  async readUserBoard(
    @Query('user') user: number,
    @Query('take') take: number,
    @Query('page') page: number,
    @Query('target') target: boolean,
  ): Promise<object> {
    const response: Board[] = await this.boardService.readUserBoard(
      user,
      take,
      page,
      target,
    );
    return {
      msg: '프로필 게시물 조회에 성공했습니다.',
      response,
    };
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
  @HttpCode(201)
  @UseGuards(AuthGuard())
  async createBoard(
    @Body() createBoardDto: CreateBoardDto,
    @CurrentUser() user: User,
  ): Promise<object> {
    await this.boardService.createBoard(createBoardDto, user);

    return {
      msg: '게시글 생성이 완료 되었습니다.',
    };
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
