import {
  BadGatewayException,
  BadRequestException,
  Injectable,
  InternalServerErrorException,
  UnauthorizedException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { CategoryRepository } from 'src/categories/repository/category.repository';
import { AreasRepository } from 'src/areas/repository/area.repository';
import { Any, Connection, DeleteResult, RelationId } from 'typeorm';
import {
  CreateBoardDto,
  SearchBoardDto,
  UpdateBoardDto,
} from './dto/board.dto';
import { BoardRepository } from './repository/board.repository';
import { ErrorConfirm } from 'src/common/utils/error';
import { UserRepository } from 'src/auth/repository/user.repository';
import { Board } from './entity/board.entity';
import { Category } from 'src/categories/entity/category.entity';
import { Area } from 'src/areas/entity/areas.entity';
import { BoardPhotoRepository } from 'src/photo/repository/photo.repository';
import { User } from '@sentry/node';

@Injectable()
export class BoardsService {
  constructor(
    @InjectRepository(BoardRepository)
    private boardRepository: BoardRepository,

    @InjectRepository(AreasRepository)
    private areaRepository: AreasRepository,

    @InjectRepository(CategoryRepository)
    private categoryRepository: CategoryRepository,

    @InjectRepository(UserRepository)
    private userRepository: UserRepository,

    private connection: Connection,

    private errorConfirm: ErrorConfirm,
  ) {}

  async closingBoard(): Promise<number> {
    const currentTime: Date = new Date();
    currentTime.setHours(currentTime.getHours() + 9);

    const result: number = await this.boardRepository.closingBoard(currentTime);

    return result;
  }

  async filteredBoards(
    categoryNo: number,
    sort: any,
    title: string,
    popular: string,
    areaNo: number,
    max: number,
    min: number,
    target: boolean,
    date: any,
    free: string,
  ): Promise<object> {
    const currentTime: Date = new Date();
    currentTime.setHours(currentTime.getHours() + 9);

    let endTime: Date = new Date();
    endTime.setHours(endTime.getHours() + 9);

    if (!date) {
      endTime = null;
    }

    if (date) {
      endTime.setDate(endTime.getDate() + date);
    }

    const boards: Board[] = await this.boardRepository.filteredBoards(
      categoryNo,
      sort,
      title,
      popular,
      areaNo,
      max,
      min,
      target,
      Number(date),
      endTime,
      currentTime,
      free,
    );

    return { filteredBoardNum: boards.length, boards };
  }

  async readHotBoards(select: number): Promise<object> {
    const currentTime: Date = new Date();
    currentTime.setHours(currentTime.getHours() + 9);
    const year: number = currentTime.getFullYear();
    const month: number = currentTime.getMonth();

    if (month === 12) {
      year - 1;
    }

    const filteredHotBoards: object = await this.boardRepository.readHotBoards(
      select,
      year,
      month,
    );

    this.errorConfirm.notFoundError(
      filteredHotBoards,
      '인기게시글이 존재하지 얺습니다.',
    );

    return filteredHotBoards;
  }

  async getByOneBoard(no: number) {
    const board = await this.boardRepository.getByOneBoard(no);
    this.errorConfirm.notFoundError(
      board.no,
      `해당 게시글을 찾을 수 없습니다.`,
    );

    const boardHit: number = await this.boardRepository.addBoardHit(board);

    if (!boardHit) {
      throw new InternalServerErrorException(
        '게시글 조회 수 증가가 되지 않았습니다',
      );
    }
    board.likeCount = Number(board.likeCount);

    return board;
  }

  async boardClosed(no: number, userNo: number): Promise<boolean> {
    try {
      const board: Board = await this.boardRepository.getByOneBoard(no);
      this.errorConfirm.notFoundError(board.no, '게시글을 찾을 수 없습니다.');

      if (board['userNo'] !== userNo) {
        throw new UnauthorizedException('게시글을 작성한 유저가 아닙니다.');
      }

      if (board.isDeadline) {
        throw new BadRequestException('이미 마감된 게시글 입니다.');
      }

      const result: number = await this.boardRepository.boardClosed(no);

      if (!result) {
        throw new InternalServerErrorException('게시글 마감이 되지 않았습니다');
      }

      return true;
    } catch (err) {
      throw err;
    }
  }

  async cancelClosedBoard(no: number, userNo: number): Promise<boolean> {
    try {
      const board: Board = await this.boardRepository.getByOneBoard(no);
      this.errorConfirm.notFoundError(
        board.no,
        `해당 게시글을 찾을 수 없습니다.`,
      );

      if (board['userNo'] !== userNo) {
        throw new UnauthorizedException('게시글을 작성한 유저가 아닙니다.');
      }

      const currentTime: Date = new Date();
      currentTime.setHours(currentTime.getHours() + 9);

      if (board.deadline !== null) {
        if (board.deadline <= currentTime) {
          throw new InternalServerErrorException(
            '시간이 지나 마감된 게시글 입니다.',
          );
        }
      }

      if (!board.isDeadline) {
        throw new BadRequestException('활성화된 게시글 입니다.');
      }

      const result: number = await this.boardRepository.cancelClosedBoard(no);

      if (!result) {
        throw new InternalServerErrorException(
          '게시글 마감 취소가 되지 않았습니다.',
        );
      }

      return true;
    } catch (err) {
      throw err;
    }
  }

  async searchAllBoards(searchBoardDto: SearchBoardDto): Promise<object> {
    try {
      const { title }: SearchBoardDto = searchBoardDto;
      const boards: Board[] = await this.boardRepository.searchAllBoards(title);
      this.errorConfirm.notFoundError(boards, '게시글을 찾을 수 없습니다.');

      return { foundedBoardNum: boards.length, search: title, boards };
    } catch (err) {
      throw err;
    }
  }

  async createBoard(
    createBoardDto: CreateBoardDto,
    user: User,
  ): Promise<boolean> {
    const queryRunner = this.connection.createQueryRunner();

    await queryRunner.connect();
    await queryRunner.startTransaction();
    try {
      const { categoryNo, areaNo, deadline, photoUrl }: CreateBoardDto =
        createBoardDto;

      const category: Category = await this.categoryRepository.findOne(
        categoryNo,
        {
          relations: ['boards'],
        },
      );

      this.errorConfirm.notFoundError(
        category,
        `해당 카테고리를 찾을 수 없습니다.`,
      );

      const area: Area = await this.areaRepository.findOne(areaNo, {
        relations: ['boards'],
      });

      this.errorConfirm.notFoundError(area, `해당 지역을 찾을 수 없습니다.`);

      let endTime: Date = new Date();

      endTime.setHours(endTime.getHours() + 9);

      if (!deadline) {
        endTime = null;
      } else {
        endTime.setDate(endTime.getDate() + deadline);
      }

      const board: Board = await this.boardRepository.createBoard(
        category,
        area,
        user,
        createBoardDto,
        endTime,
      );
      await this.userRepository.userRelation(user, board.no, 'boards');

      if (!board) {
        throw new BadGatewayException('게시글 생성 관련 오류입니다.');
      }

      const photos: Array<object> = photoUrl.map((photo, index) => {
        return {
          photo_url: photo,
          board: board.no,
          order: index + 1,
        };
      });

      const boardPhotoNo: Array<object> = await queryRunner.manager
        .getCustomRepository(BoardPhotoRepository)
        .createBoardPhoto(photos);

      if (photos.length !== boardPhotoNo.length) {
        throw new BadGatewayException('게시글 사진 등록 도중 DB관련 오류');
      }
      await queryRunner.manager
        .getCustomRepository(BoardRepository)
        .saveCategory(categoryNo, board);
      await queryRunner.commitTransaction();

      return true;
    } catch (err) {
      await queryRunner.rollbackTransaction();
      throw err;
    } finally {
      await queryRunner.release();
    }
  }

  async deleteBoard(boardNo: number, userNo: number): Promise<boolean> {
    try {
      const board: Board = await this.boardRepository.getByOneBoard(boardNo);
      this.errorConfirm.notFoundError(
        board.no,
        `해당 게시글을 찾을 수 없습니다.`,
      );

      if (board['userNo'] !== userNo) {
        throw new UnauthorizedException('게시글을 작성한 유저가 아닙니다.');
      }

      const result: number = await this.boardRepository.deleteBoard(boardNo);

      if (!result) {
        throw new BadGatewayException('해당 게시글이 삭제되지 않았습니다.');
      }

      return true;
    } catch (err) {
      throw err;
    }
  }

  async updateBoard(
    boardNo: number,
    updateBoardDto: UpdateBoardDto,
    userNo: number,
  ): Promise<boolean> {
    const queryRunner = this.connection.createQueryRunner();

    await queryRunner.connect();
    await queryRunner.startTransaction();
    try {
      const { category, area, deadline, photoUrl }: UpdateBoardDto =
        updateBoardDto;

      const board: Board = await this.boardRepository.getByOneBoard(boardNo);

      this.errorConfirm.notFoundError(board, `해당 게시글을 찾을 수 없습니다.`);

      if (board['userNo'] !== userNo) {
        throw new UnauthorizedException('게시글을 작성한 유저가 아닙니다.');
      }

      let endTime: Date = new Date(board.createdAt);

      if (deadline) {
        endTime.setDate(endTime.getDate() + deadline);
        updateBoardDto.deadline = endTime;
      }

      const currentTime: Date = new Date();
      currentTime.setHours(currentTime.getHours() + 9);

      if (deadline && endTime <= currentTime) {
        throw new BadRequestException('다른 기간을 선택해 주십시오');
      }

      const boardKey: any = Object.keys(updateBoardDto);

      const duplicateCheck = {};

      boardKey.forEach((item: any) => {
        updateBoardDto[item] !== null
          ? (duplicateCheck[item] = updateBoardDto[item])
          : 0;
      });

      if (!deadline) {
        endTime = null;
        duplicateCheck['deadline'] = endTime;
      }

      const categoryNo: Category = await this.categoryRepository.findOne(
        category,
        {
          relations: ['boards'],
        },
      );
      this.errorConfirm.notFoundError(
        categoryNo,
        `해당 카테고리를 찾을 수 없습니다.`,
      );

      const areaNo: Area = await this.areaRepository.findOne(area, {
        relations: ['boards'],
      });

      this.errorConfirm.notFoundError(areaNo, `해당 지역을 찾을 수 없습니다.`);

      if (Object.keys(duplicateCheck).includes('photoUrl')) {
        const deleteBoardPhoto: number = await queryRunner.manager
          .getCustomRepository(BoardPhotoRepository)
          .deleteBoardPhoto(boardNo);

        if (!deleteBoardPhoto) {
          throw new BadGatewayException('게시글 사진 삭제 도중 DB관련 오류');
        }

        const photos: Array<object> = photoUrl.map((photo, index) => {
          return {
            photo_url: photo,
            board: board.no,
            order: index + 1,
          };
        });

        const boardPhotoNo: Array<object> = await queryRunner.manager
          .getCustomRepository(BoardPhotoRepository)
          .createBoardPhoto(photos);

        if (photos.length !== boardPhotoNo.length) {
          throw new BadGatewayException('게시글 사진 등록 도중 DB관련 오류');
        }
        delete duplicateCheck['photoUrl'];
      }

      const updatedBoard = await queryRunner.manager
        .getCustomRepository(BoardRepository)
        .updateBoard(boardNo, duplicateCheck);

      await queryRunner.commitTransaction();

      if (!updatedBoard) {
        throw new BadGatewayException('게시글 업데이트 관련 오류');
      }

      return true;
    } catch (err) {
      await queryRunner.rollbackTransaction();
      throw err;
    } finally {
      await queryRunner.release();
    }
  }
  async readUserBoard(
    userNo: number,
    take: number,
    page: number,
    target: boolean,
  ): Promise<Board[]> {
    try {
      const profileBoards: Board[] = await this.boardRepository.readUserBoard(
        userNo,
        take,
        page,
        target,
      );
      return profileBoards;
    } catch (err) {
      throw err;
    }
  }
}
