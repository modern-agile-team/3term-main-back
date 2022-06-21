import {
  Body,
  Controller,
  Get,
  Param,
  Post,
  Delete,
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
  ApiBearerAuth,
  ApiCreatedResponse,
  ApiInternalServerErrorResponse,
  ApiOkResponse,
  ApiOperation,
  ApiTags,
  ApiUnauthorizedResponse,
} from '@nestjs/swagger';
import { BoardsService } from './boards.service';
import {
  CreateBoardDto,
  HotBoardDto,
  SearchBoardDto,
  UpdateBoardDto,
} from './dto/board.dto';
import { Board } from './entity/board.entity';
import { CurrentUser } from 'src/common/decorators/current-user.decorator';
import { CategoriesService } from 'src/categories/categories.service';
import { HTTP_STATUS_CODE } from 'src/common/configs/http-status.config';

@ApiTags('Boards')
@Controller('boards')
export class BoardsController {
  private logger = new Logger('BoardsController');
  constructor(
    private boardService: BoardsService,
    private categoriesService: CategoriesService,
  ) {}

  @Cron('0 1 * * * *')
  async handleCron() {
    const isClosed: number = await this.boardService.closingBoard();

    this.logger.verbose(`게시글 ${isClosed}개 마감처리`);
  }

  @HttpCode(HTTP_STATUS_CODE.success.ok)
  @Get('filter')
  async filteredBoards(@Query() paginationQuery): Promise<object> {
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

    const response: object = await this.boardService.filteredBoards(
      categoryNo,
      sort,
      title,
      popular,
      areaNo,
      max,
      min,
      target,
      +date,
      free,
    );

    return {
      msg: '게시글 필터링이 완료되었습니다.',
      response,
    };
  }

  @ApiOperation({
    summary: '인기게시글 경로',
    description: '인기게시글 API',
  })
  @ApiOkResponse({
    description: '성공여부',
    schema: {
      example: {
        success: true,
        statusCode: 200,
        msg: '인기 게시글 조회가 완료되었습니다.',
        response: [
          {
            no: 8,
            decimalDay: 5,
            boardPhotoUrl: null,
            title: '123-5',
            isDeadline: 1,
            price: 1000,
            target: 1,
            areaName: '서울특별시',
            userNo: 2,
            userNickname: 'hneeddjsjde',
          },
        ],
      },
    },
  })
  @HttpCode(HTTP_STATUS_CODE.success.ok)
  @Get('hot')
  async readHotBoards(@Query() hotBoardDto: HotBoardDto): Promise<object> {
    const response: Board[] = await this.boardService.readHotBoards(
      hotBoardDto,
    );

    return {
      msg: '인기 게시글 조회가 완료되었습니다.',
      response,
    };
  }

  @ApiOperation({
    summary: '게시글 검색 경로',
    description: '게시글 검색 API',
  })
  @ApiOkResponse({
    description: '성공여부',
    schema: {
      example: {
        success: true,
        statusCode: 200,
        msg: '검색결과에 대한 게시글 조회가 완료되었습니다.',
        response: {
          foundedBoardNum: 1,
          search: '게시글',
          boards: [
            {
              no: 19,
              boardPhoto: '백승범.jpg',
              decimalDay: null,
              title: '게시글 생성 test 3',
              isDeadline: 0,
              price: 1000,
              target: 1,
              areaName: '서울특별시',
              userNickname: 'hneeddjsjde',
            },
          ],
        },
      },
    },
  })
  @HttpCode(HTTP_STATUS_CODE.success.ok)
  @Get('search')
  async searchAllBoards(
    @Query() searchBoardDto: SearchBoardDto,
  ): Promise<object> {
    const response: object = await this.boardService.searchAllBoards(
      searchBoardDto,
    );

    return {
      msg: '검색결과에 대한 게시글 조회가 완료되었습니다.',
      response,
    };
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
  @UseGuards(AuthGuard('jwt'))
  @ApiBearerAuth('access-token')
  @Patch('cancel/:boardNo')
  @HttpCode(HTTP_STATUS_CODE.success.ok)
  async cancelClosedBoard(
    @Param('boardNo') boardNo: number,
    @CurrentUser() user: User,
  ): Promise<object> {
    await this.boardService.cancelClosedBoard(boardNo, user.no);

    return {
      msg: '게시글 마감 취소가 완료되었습니다.',
    };
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
  @ApiBearerAuth('access-token')
  @UseGuards(AuthGuard('jwt'))
  @Patch('close/:boardNo')
  @HttpCode(HTTP_STATUS_CODE.success.ok)
  async boardClosed(
    @Param('boardNo') boardNo: number,
    @CurrentUser() user: User,
  ): Promise<object> {
    await this.boardService.boardClosed(boardNo, user.no);

    return {
      msg: '게시글 마감이 완료되었습니다.',
    };
  }

  @Get('profile')
  @HttpCode(HTTP_STATUS_CODE.success.ok)
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

  @ApiOperation({
    summary: '게시글 상세조회 경로',
    description: '게시글 상세조회 API',
  })
  @ApiOkResponse({
    description: '성공여부',
    schema: {
      example: {
        success: true,
        statusCode: 200,
        msg: '게시글 상세조회가 완료되었습니다.',
        response: {
          foundedBoardNum: 1,
          search: '게시글',
          response: {
            no: 15,
            boardPhoto: '백승범.jpg,11222,1,2',
            decimalDay: -6,
            title: '게시글 검색',
            description: '생성',
            isDeadline: 0,
            hit: 17,
            likeCount: 0,
            price: 1000,
            summary: '',
            target: 1,
            areaNo: 1,
            areaName: '서울특별시',
            categoryNo: 2,
            categoryName: '디자인',
            userProfilePhoto: 'profile/1655184234165_�8�P�.jpg',
            userNo: 2,
            userName: '수브로',
            userNickname: 'hneeddjsjde',
            userSchool: '인덕대학교',
            userMajor: '컴퓨터',
          },
        },
      },
    },
  })
  @HttpCode(HTTP_STATUS_CODE.success.ok)
  @Get(':boardNo')
  async readByOneBoard(@Param('boardNo') boardNo: number): Promise<object> {
    const response = await this.boardService.readByOneBoard(boardNo);

    return {
      msg: '게시글 상세 조회가 완료되었습니다.',
      response,
    };
  }

  @HttpCode(HTTP_STATUS_CODE.success.ok)
  @Get('category/:categoryNo')
  async getByCategory(
    @Param('categoryNo') categoryNo: number,
  ): Promise<object> {
    this.logger.verbose(
      `카테고리 선택 조회 시도. 카테고리 번호 : ${categoryNo}`,
    );
    const response: object = await this.categoriesService.findOneCategory(
      categoryNo,
    );

    return {
      msg: '카테고리 선택 조회가 완료되었습니다.',
      response,
    };
  }

  @Post()
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
  @HttpCode(HTTP_STATUS_CODE.success.created)
  @ApiBearerAuth('access-token')
  @UseGuards(AuthGuard('jwt'))
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
        statusCode: 200,
        msg: '게시글 삭제가 완료되었습니다.',
        response: true,
      },
    },
  })
  @UseGuards(AuthGuard('jwt'))
  @ApiBearerAuth('access-token')
  @Delete(':boardNo')
  @HttpCode(HTTP_STATUS_CODE.success.ok)
  async deleteBoard(
    @Param('boardNo') boardNo: number,
    @CurrentUser() user: User,
  ): Promise<object> {
    const response: boolean = await this.boardService.deleteBoard(
      boardNo,
      user.no,
    );

    return {
      msg: '게시글 삭제가 완료되었습니다',
      response,
    };
  }

  @ApiOperation({
    summary: '게시글 수정 경로',
    description: '게시글 수정 API',
  })
  @ApiCreatedResponse({
    description: '성공여부',
    schema: {
      example: {
        success: true,
        statusCode: 201,
        msg: '게시글 수정이 완료되었습니다.',
      },
    },
  })
  @HttpCode(HTTP_STATUS_CODE.success.created)
  @ApiBearerAuth('access-token')
  @UseGuards(AuthGuard('jwt'))
  @Patch(':boardNo')
  async updateBoard(
    @Param('boardNo') boardNo: number,
    @Body() updateBoardDto: UpdateBoardDto,
    @CurrentUser() user: User,
  ): Promise<object> {
    await this.boardService.updateBoard(boardNo, updateBoardDto, user.no);

    return {
      msg: '게시글 수정이 완료되었습니다.',
    };
  }
}
