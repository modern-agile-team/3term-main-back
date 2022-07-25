import {
  Body,
  Controller,
  Get,
  Param,
  Post,
  Delete,
  Patch,
  Query,
  UseGuards,
  UseInterceptors,
  HttpCode,
  UploadedFiles,
  Inject,
  Req,
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
import { FilesInterceptor } from '@nestjs/platform-express';
import { ConfigService } from '@nestjs/config';
import { JwtService } from '@nestjs/jwt';
import { BoardsService } from './boards.service';
import { AwsService } from 'src/aws/aws.service';
import { CurrentUser } from 'src/common/decorators/current-user.decorator';
import { HTTP_STATUS_CODE } from 'src/common/configs/http-status.config';
import { Board } from './entity/board.entity';
import { FilterBoardDto } from './dto/filterBoard.dto';
import { HotBoardDto } from './dto/hotBoard.dto';
import { SearchBoardDto } from './dto/searchBoard.dto';
import { UpdateBoardDto } from './dto/updateBoard.dto';
import { PaginationDto } from './dto/pagination.dto';
import { CreateBoardDto } from './dto/createBoard.dto';
import { WinstonLogger, WINSTON_MODULE_PROVIDER } from 'nest-winston';
import { boardSwagger } from './boards.swagger';
import { operationConfig } from 'src/common/swagger-apis/api-operation.swagger';

@ApiTags('Boards')
@Controller('boards')
export class BoardsController {
  validateToken: any;
  constructor(
    @Inject(WINSTON_MODULE_PROVIDER)
    private readonly logger: WinstonLogger,

    private readonly boardService: BoardsService,
    private readonly awsService: AwsService,
    private readonly configService: ConfigService,
    private readonly jwtService: JwtService,
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
  @ApiOkResponse(boardSwagger.filter.success)
  @HttpCode(HTTP_STATUS_CODE.success.ok)
  @Get('filter')
  async filteredBoards(
    @Query() filterBoardDto: FilterBoardDto,
  ): Promise<object> {
    const response: Board[] = await this.boardService.filteredBoards(
      filterBoardDto,
    );

    return {
      msg: '게시글 필터링이 완료되었습니다.',
      response,
    };
  }

  @ApiOperation(operationConfig('인기게시글 경로', '인기게시글 API'))
  @ApiOkResponse(boardSwagger.popular.success)
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
  @ApiOkResponse(boardSwagger.search.success)
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
  @ApiOkResponse(boardSwagger.closedCancel.success)
  @ApiBadRequestResponse(boardSwagger.closedCancel.badRequest)
  @ApiUnauthorizedResponse(boardSwagger.closedCancel.unauthorized)
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
  @ApiOkResponse(boardSwagger.closed.success)
  @ApiInternalServerErrorResponse(boardSwagger.closed.badRequest)
  @ApiUnauthorizedResponse(boardSwagger.closed.unauthorized)
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
  @ApiOkResponse(boardSwagger.getOne.success)
  @ApiNotFoundResponse(boardSwagger.getOne.notFound)
  @HttpCode(HTTP_STATUS_CODE.success.ok)
  @ApiBearerAuth('access-token')
  @Get(':boardNo')
  async readOneBoardByAuth(
    @Param('boardNo') boardNo: number,
    @Req() token,
  ): Promise<object> {
    const sliceToken = token.headers.authorization.substr(7);

    if (sliceToken === 'null') {
      const response: object = await this.boardService.readOneBoardByUnAuth(
        boardNo,
      );

      return {
        msg: '게시글 상세 조회가 완료되었습니다(비회원).',
        response,
      };
    }

    const tokenDecode: object = this.jwtService.verify(sliceToken, {
      secret: this.configService.get('JWT_SECRET'),
    });
    const response: object = await this.boardService.readOneBoardByAuth(
      boardNo,
      tokenDecode['userNo'],
    );

    return {
      msg: '게시글 상세 조회가 완료되었습니다(회원).',
      response,
    };
  }

  @ApiOperation(
    operationConfig('카테고리 선택 조회 경로', '카테고리 선택 조회 API'),
  )
  @ApiOkResponse(boardSwagger.getByCategory.success)
  @HttpCode(HTTP_STATUS_CODE.success.ok)
  @Get('category/:categoryNo')
  async getByCategory(
    @Param('categoryNo') categoryNo: number,
    @Query() paginationDto: PaginationDto,
  ): Promise<object> {
    this.logger.verbose(
      `카테고리 선택 조회 시도. 카테고리 번호 : ${categoryNo}`,
    );
    const response: Board[] = await this.boardService.findOneCategory(
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
  @ApiOkResponse(boardSwagger.create.success)
  @HttpCode(HTTP_STATUS_CODE.success.created)
  @ApiBearerAuth('access-token')
  @UseGuards(AuthGuard('jwt'))
  @UseInterceptors(FilesInterceptor('image', 5))
  async createBoard(
    @UploadedFiles() files: Express.Multer.File[],
    @Body() createBoardDto: CreateBoardDto,
    @CurrentUser() user: User,
  ): Promise<object> {
    for (const key of Object.keys(createBoardDto)) {
      createBoardDto[`${key}`] = JSON.parse(createBoardDto[`${key}`]);
    }
    const boardPhotoUrls: string[] = await this.awsService.uploadBoardFileToS3(
      'board',
      files,
    );

    await this.boardService.createBoard(createBoardDto, user, boardPhotoUrls);

    return {
      msg: '게시글 생성이 완료 되었습니다.',
    };
  }
  @ApiOperation(operationConfig('게시글 삭제 경로', '게시글 삭제 API'))
  @ApiOkResponse(boardSwagger.delete.success)
  @ApiNotFoundResponse(boardSwagger.delete.notFound)
  @ApiUnauthorizedResponse(boardSwagger.delete.unauthorized)
  @UseGuards(AuthGuard('jwt'))
  @ApiBearerAuth('access-token')
  @Delete(':boardNo')
  @HttpCode(HTTP_STATUS_CODE.success.ok)
  async deleteBoard(
    @Param('boardNo') boardNo: number,
    @CurrentUser() user: User,
  ): Promise<object> {
    await this.boardService.deleteBoard(boardNo, user.no);

    return {
      msg: '게시글 삭제가 완료되었습니다',
    };
  }

  @ApiOperation(operationConfig('게시글 수정 경로', '게시글 수정 API'))
  @ApiOkResponse(boardSwagger.update.success)
  @ApiNotFoundResponse(boardSwagger.update.notFound)
  @ApiUnauthorizedResponse(boardSwagger.update.unauthorized)
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
    const boardPhotoUrls: false | string[] =
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
