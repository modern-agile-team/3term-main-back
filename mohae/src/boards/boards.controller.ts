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
  UploadedFiles,
  Inject,
} from '@nestjs/common';
import { User } from '@sentry/node';
import { AuthGuard } from '@nestjs/passport';
import { Cron } from '@nestjs/schedule';
import {
  ApiBadRequestResponse,
  ApiBearerAuth,
  ApiInternalServerErrorResponse,
  ApiNotFoundResponse,
  ApiOkResponse,
  ApiOperation,
  ApiTags,
  ApiUnauthorizedResponse,
} from '@nestjs/swagger';
import { BoardsService } from './boards.service';

import { AwsService } from 'src/aws/aws.service';
import { Board } from './entity/board.entity';
import { CurrentUser } from 'src/common/decorators/current-user.decorator';
import { CategoriesService } from 'src/categories/categories.service';
import { HTTP_STATUS_CODE } from 'src/common/configs/http-status.config';
import { FilesInterceptor } from '@nestjs/platform-express';
import { operationConfig } from 'src/common/swagger-apis/api-operation.swagger';
import { apiResponse } from 'src/common/swagger-apis/api-response.swagger';
import { FilterBoardDto } from './dto/filterBoard.dto';
import { HotBoardDto } from './dto/hotBoard.dto';
import { SearchBoardDto } from './dto/searchBoard.dto';
import { UpdateBoardDto } from './dto/updateBoard.dto';
import { WinstonLogger, WINSTON_MODULE_PROVIDER } from 'nest-winston';
import { PaginationDto } from './dto/pagination.dto';

@ApiTags('Boards')
@Controller('boards')
export class BoardsController {
  constructor(
    @Inject(WINSTON_MODULE_PROVIDER)
    private readonly logger: WinstonLogger,

    private readonly boardService: BoardsService,
    private readonly categoriesService: CategoriesService,
    private readonly awsService: AwsService,
  ) {}

  @Cron('0 1 * * * *')
  async handleBoardSchedule() {
    const closedBoardNum: number = await this.boardService.closingBoard();

    this.logger.verbose(
      `게시글 ${closedBoardNum}개 마감처리`,
      '마감된 게시글 개수',
    );
  }

  @ApiOperation(operationConfig('게시글 필터링 경로', '게시글 필터링 API'))
  @ApiOkResponse(
    apiResponse.success(
      '성공여부',
      HTTP_STATUS_CODE.success.ok,
      '게시글 필터링이 완료되었습니다.',
      {
        boardNum: 1,
        boards: [
          {
            no: 75,
            photoUrl: 'board/1655864764068_dsn.jpg',
            decimalDay: -10,
            title: 'board test',
            isDeadline: 0,
            price: 0,
            target: 0,
            area: '서울 특별시',
            nickName: 'hheeddjsjde',
          },
        ],
      },
    ),
  )
  @HttpCode(HTTP_STATUS_CODE.success.ok)
  @Get('filter')
  async filteredBoards(
    @Query() filterBoardDto: FilterBoardDto,
  ): Promise<object> {
    const response: object = await this.boardService.filteredBoards(
      filterBoardDto,
    );

    return {
      msg: '게시글 필터링이 완료되었습니다.',
      response,
    };
  }

  @ApiOperation(operationConfig('인기게시글 경로', '인기게시글 API'))
  @ApiOkResponse(
    apiResponse.success(
      '성공여부',
      HTTP_STATUS_CODE.success.ok,
      '인기 게시글 조회 완료',
      [
        {
          no: 8,
          decimalDay: 5,
          photoUrl: null,
          title: '123-5',
          isDeadline: 1,
          price: 1000,
          target: 1,
          area: '서울특별시',
          userNo: 2,
          nickname: 'hneeddjsjde',
        },
      ],
    ),
  )
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

  @ApiOperation(operationConfig('게시글 검색 경로', '게시글 검색 API'))
  @ApiOkResponse(
    apiResponse.success(
      '성공여부',
      HTTP_STATUS_CODE.success.ok,
      '게시글 검색 완료',
      {
        foundedBoardNum: 1,
        search: '게시글',
        boards: [
          {
            no: 19,
            photo: '백승범.jpg',
            decimalDay: null,
            title: '게시글 생성 test 3',
            isDeadline: 0,
            price: 1000,
            target: 1,
            area: '서울특별시',
            nickname: 'hneeddjsjde',
          },
        ],
      },
    ),
  )
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

  @ApiOperation(
    operationConfig('게시글 마감 취소 경로', '게시글 마감 취소 API'),
  )
  @ApiOkResponse(
    apiResponse.success(
      '성공여부',
      HTTP_STATUS_CODE.success.ok,
      '게시글 마감 취소 완료',
    ),
  )
  @ApiBadRequestResponse(
    apiResponse.error(
      '마감이 안된 게시글을 마감취소를 하려고 하였을 때',
      HTTP_STATUS_CODE.clientError.badRequest,
      '활성화된 게시글 입니다.',
      'Bad Request',
    ),
  )
  @ApiUnauthorizedResponse(
    apiResponse.error(
      '게시글을 작성한 회원이 아닐 경우',
      HTTP_STATUS_CODE.clientError.unauthorized,
      '게시글을 작성한 유저가 아닙니다.',
      'Unauthorized',
    ),
  )
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
  @ApiOperation(operationConfig('게시글 마감 경로', '게시글 마감 API'))
  @ApiOkResponse(
    apiResponse.success(
      '성공여부',
      HTTP_STATUS_CODE.success.ok,
      '게시글 마감이 완료되었습니다.',
    ),
  )
  @ApiInternalServerErrorResponse(
    apiResponse.error(
      '이미 마감된 게시글을 마감하려고 했을 때',
      HTTP_STATUS_CODE.clientError.badRequest,
      '이미 마감된 게시글 입니다.',
      'Bad Request',
    ),
  )
  @ApiUnauthorizedResponse(
    apiResponse.error(
      '게시글을 작성한 회원이 아닐 경우',
      HTTP_STATUS_CODE.clientError.unauthorized,
      '게시글을 작성한 유저가 아닙니다.',
      'Unauthorized',
    ),
  )
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

  @ApiOperation(operationConfig('게시글 상세조회 경로', '게시글 상세조회 API'))
  @ApiOkResponse(
    apiResponse.success(
      '성공여부',
      HTTP_STATUS_CODE.success.ok,
      '게시글 상세조회가 완료되었습니다.',
      {
        no: 15,
        boardPhotoUrls: 'seungBum.jpg, 11222.jpg, 1.png, 2.jpeg',
        decimalDay: -6,
        title: '게시글 검색',
        description: '생성',
        isDeadline: 0,
        hit: 17,
        price: 1000,
        summary: '',
        target: 1,
        areaNo: 1,
        area: '서울특별시',
        categoryNo: 2,
        category: '디자인',
        userPhotoUrl: 'profile/1655184234165_test.jpg',
        userNo: 2,
        nickname: 'hneeddjsjde',
        school: '인덕대학교',
        major: '컴퓨터',
      },
    ),
  )
  @ApiNotFoundResponse(
    apiResponse.error(
      '없는 게시글을 조회 하려고 했을 때',
      HTTP_STATUS_CODE.clientError.notFound,
      '해당 게시글을 찾을 수 없습니다.',
      'Not Found',
    ),
  )
  @HttpCode(HTTP_STATUS_CODE.success.ok)
  @Get(':boardNo')
  async readByOneBoard(@Param('boardNo') boardNo: number): Promise<object> {
    const response = await this.boardService.readByOneBoard(boardNo);

    return {
      msg: '게시글 상세 조회가 완료되었습니다.',
      response,
    };
  }

  @ApiOperation(
    operationConfig('카테고리 선택 조회 경로', '카테고리 선택 조회 API'),
  )
  @ApiOkResponse(
    apiResponse.success(
      '성공여부',
      HTTP_STATUS_CODE.success.ok,
      '카테고리 선택 조회가 완료되었습니다.',
      {
        boardNum: 1,
        categoryName: '전체 게시판',
        boards: [
          {
            decimalDay: -1,
            photoUrl: '백승범.jpg',
            no: 15,
            title: '게시글 검색',
            isDeadline: 0,
            price: 1000,
            target: 1,
            area: '서울특별시',
            nickname: 'hneeddjsjde',
          },
        ],
      },
    ),
  )
  @HttpCode(HTTP_STATUS_CODE.success.ok)
  @Get('category/:categoryNo')
  async getByCategory(
    @Param('categoryNo') categoryNo: number,
    @Query() paginationDto: PaginationDto,
  ): Promise<object> {
    this.logger.verbose(
      `카테고리 선택 조회 시도. 카테고리 번호 : ${categoryNo}`,
    );
    const response: object = await this.categoriesService.findOneCategory(
      categoryNo,
      paginationDto,
    );

    return {
      msg: '카테고리 선택 조회가 완료되었습니다.',
      response,
    };
  }

  @Post()
  @ApiOperation(operationConfig('게시글 생성 경로', '게시글 생성 API'))
  @ApiOkResponse(
    apiResponse.success(
      '성공여부',
      HTTP_STATUS_CODE.success.created,
      '게시글 생성이 완료되었습니다.',
    ),
  )
  @HttpCode(HTTP_STATUS_CODE.success.created)
  @ApiBearerAuth('access-token')
  @UseGuards(AuthGuard('jwt'))
  @UseInterceptors(FilesInterceptor('image', 5))
  async createBoard(
    @UploadedFiles() files: Express.Multer.File[],
    @Body()
    createBoardDto,
    @CurrentUser() user: User,
  ): Promise<object> {
    for (const key of Object.keys(createBoardDto)) {
      createBoardDto[`${key}`] = JSON.parse(createBoardDto[`${key}`]);
    }

    const boardPhotoUrls = await this.awsService.uploadBoardFileToS3(
      'board',
      files,
    );

    await this.boardService.createBoard(createBoardDto, user, boardPhotoUrls);

    return {
      msg: '게시글 생성이 완료 되었습니다.',
    };
  }
  @ApiOperation(operationConfig('게시글 삭제 경로', '게시글 삭제 API'))
  @ApiOkResponse(
    apiResponse.success(
      '성공여부',
      HTTP_STATUS_CODE.success.ok,
      '게시글 삭제가 완료되었습니다.',
    ),
  )
  @ApiNotFoundResponse(
    apiResponse.error(
      '없는 게시글을 삭제 하려고 했을 때',
      HTTP_STATUS_CODE.clientError.notFound,
      '해당 게시글을 찾을 수 없습니다.',
      'Not Found',
    ),
  )
  @ApiUnauthorizedResponse(
    apiResponse.error(
      '게시글을 작성한 회원이 아닐 경우',
      HTTP_STATUS_CODE.clientError.unauthorized,
      '게시글을 작성한 유저가 아닙니다.',
      'Unauthorized',
    ),
  )
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

  @ApiOperation(operationConfig('게시글 수정 경로', '게시글 수정 API'))
  @ApiOkResponse(
    apiResponse.success(
      '성공여부',
      HTTP_STATUS_CODE.success.created,
      '게시글 수정이 완료되었습니다.',
    ),
  )
  @ApiNotFoundResponse(
    apiResponse.error(
      '없는 게시글을 수정 하려고 했을 때',
      HTTP_STATUS_CODE.clientError.notFound,
      '해당 게시글을 찾을 수 없습니다.',
      'Not Found',
    ),
  )
  @ApiUnauthorizedResponse(
    apiResponse.error(
      '게시글을 작성한 회원이 아닐 경우',
      HTTP_STATUS_CODE.clientError.unauthorized,
      '게시글을 작성한 유저가 아닙니다.',
      'Unauthorized',
    ),
  )
  @HttpCode(HTTP_STATUS_CODE.success.created)
  @ApiBearerAuth('access-token')
  @UseGuards(AuthGuard('jwt'))
  @UseInterceptors(FilesInterceptor('image', 5))
  @Patch(':boardNo')
  async updateBoard(
    @Param('boardNo') boardNo: number,
    @UploadedFiles() files: Express.Multer.File[],
    @Body() updateBoardDto: UpdateBoardDto,
    @CurrentUser() user: User,
  ): Promise<object> {
    for (const key of Object.keys(updateBoardDto)) {
      updateBoardDto[`${key}`] = JSON.parse(updateBoardDto[`${key}`]);
    }
    const boardPhotoUrls =
      files.length === 0
        ? false
        : await this.awsService.uploadBoardFileToS3('board', files);

    const originBoardPhotoUrls = await this.boardService.updateBoard(
      boardNo,
      updateBoardDto,
      user.no,
      boardPhotoUrls,
    );

    if (originBoardPhotoUrls) {
      await this.awsService.deleteBoardS3Object(originBoardPhotoUrls);
    }

    return {
      msg: '게시글 수정이 완료되었습니다.',
    };
  }
}
