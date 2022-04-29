import {
  BadRequestException,
  Injectable,
  InternalServerErrorException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { CategoryRepository } from 'src/categories/repository/category.repository';
import { AreasRepository } from 'src/areas/repository/area.repository';
import { Any, DeleteResult, RelationId } from 'typeorm';
import {
  CreateBoardDto,
  SearchBoardDto,
  UpdateBoardDto,
} from './dto/board.dto';
import { Board } from './entity/board.entity';
import { BoardRepository } from './repository/board.repository';
import { ErrorConfirm } from 'src/utils/error';
import { UserRepository } from 'src/auth/repository/user.repository';
import { profile } from 'console';

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

    private errorConfirm: ErrorConfirm,
  ) {}

  async getAllBoards(): Promise<object> {
    const boards = await this.boardRepository.getAllBoards();
    this.errorConfirm.notFoundError(boards, '게시글을 찾을 수 없습니다.');

    const currentTime = new Date();
    currentTime.setHours(currentTime.getHours() + 9);

    return { allBoardNum: boards.length, boards };
  }

  async closingBoard() {
    const currentTime = new Date();
    currentTime.setHours(currentTime.getHours() + 9);

    const result = await this.boardRepository.closingBoard(currentTime);
    if (!result) {
      return { success: false };
    }

    return { success: true };
  }

  async likeBoard({ boardNo, userNo, judge }) {
    const board = await this.boardRepository.findOne(boardNo, {
      relations: ['likedUser'],
    });
    this.errorConfirm.notFoundError(board, '게시글을 찾을 수 없습니다.');

    const user = await this.userRepository.findOne(userNo);
    this.errorConfirm.notFoundError(user, '회원을 찾을 수 없습니다.');

    const findUser = board.likedUser.find(
      (thumbUser) => thumbUser.no === user.no,
    );

    if ((findUser && judge) || (!findUser && !judge)) {
      return {
        success: false,
        msg: '좋아요가 중복되었거나 좋아요 취소가 실패하였습니다.',
      };
    }

    if (!findUser) {
      board.likedUser.push(user);

      await this.boardRepository.save(board);

      return {
        success: true,
        msg: '좋아요 등록',
      };
    }

    for (let i = 0; i < board.likedUser.length; i++) {
      if (board.likedUser[i].no === userNo) {
        board.likedUser.splice(i, 1);
      }
    }

    await this.boardRepository.save(board);

    return {
      success: true,
      msg: '좋아요 취소',
    };
  }

  async filteredBoards(
    no: number,
    sort: any,
    title: string,
    popular: string,
    areaNo: number,
    max: number,
    min: number,
    target: boolean,
    date: string,
    free: string,
  ): Promise<object> {
    const currentTime = new Date();
    currentTime.setHours(currentTime.getHours() + 9);

    const endTime = new Date();
    endTime.setHours(endTime.getHours() + 9);

    switch (date) {
      case '0':
        endTime.setDate(endTime.getDate() + 7);
        break;
      case '1':
        endTime.setMonth(endTime.getMonth() + 1);
        break;
      case '2':
        endTime.setMonth(endTime.getMonth() + 3);
        break;
      case '3':
        endTime.setFullYear(endTime.getFullYear() + 1);
        break;
    }

    const boards = await this.boardRepository.filteredBoards(
      no,
      sort,
      title,
      popular,
      areaNo,
      max,
      min,
      target,
      date,
      endTime,
      currentTime,
      free,
    );

    return { filteredBoardNum: boards.length, boards };
  }

  async readHotBoards(): Promise<Object> {
    const boards = await this.boardRepository.readHotBoards();
    this.errorConfirm.notFoundError(boards, '게시글을 찾을 수 없습니다.');

    return boards;
  }

  async getByOneBoard(no: number) {
    const { board, likeCount, D_day } = await this.boardRepository.getByOneBoard(no);
    this.errorConfirm.notFoundError(board, `해당 게시글을 찾을 수 없습니다.`);

    const boardHit = await this.boardRepository.addBoardHit(no, board);
    const time = board.deadline.getTime();
    if (!boardHit) {
      throw new InternalServerErrorException(
        '게시글 조회 수 증가가 되지 않았습니다',
      );
    }

    return { D_day, likeCount, board };
  }

  async boardClosed(no: number): Promise<object> {
    const board = await this.boardRepository.findOne(no);
    this.errorConfirm.notFoundError(board, '게시글을 찾을 수 없습니다.');
    if (board.isDeadline) {
      throw new InternalServerErrorException('마감된 게시글 입니다.');
    }

    const result = await this.boardRepository.boardClosed(no);

    if (!result) {
      throw new InternalServerErrorException('게시글 마감이 되지 않았습니다');
    }

    return { success: true };
  }

  async cancelClosedBoard(no: number): Promise<object> {
    const board = await this.boardRepository.findOne(no);
    this.errorConfirm.notFoundError(board, `해당 게시글을 찾을 수 없습니다.`);
    if (!board.isDeadline) {
      throw new InternalServerErrorException('활성화된 게시글 입니다.');
    }

    const result = await this.boardRepository.cancelClosedBoard(no);

    if (!result) {
      throw new InternalServerErrorException(
        '게시글 마감 취소가 되지 않았습니다.',
      );
    }

    return { success: true };
  }

  async searchAllBoards(searchBoardDto: SearchBoardDto): Promise<object> {
    const boards = await this.boardRepository.searchAllBoards(searchBoardDto);
    this.errorConfirm.notFoundError(boards, '게시글을 찾을 수 없습니다.');

    return { foundedBoardNum: boards.length, boards };
  }

  async createBoard(createBoardDto: CreateBoardDto): Promise<Board> {
    const { categoryNo, areaNo, deadline, userNo } = createBoardDto;
    const category = await this.categoryRepository.findOne(categoryNo, {
      relations: ['boards'],
    });

    const area = await this.areaRepository.findOne(areaNo, {
      relations: ['boards'],
    });

    const user = await this.userRepository.findOne(userNo, {
      relations: ['boards'],
    });

    this.errorConfirm.notFoundError(
      category,
      `해당 카테고리를 찾을 수 없습니다.`,
    );

    this.errorConfirm.notFoundError(area, `해당 지역을 찾을 수 없습니다.`);

    this.errorConfirm.notFoundError(user, `해당 회원을 찾을 수 없습니다.`);

    const endTime = new Date();
    endTime.setHours(endTime.getHours() + 9);

    switch (deadline) {
      case 0:
        endTime.setDate(endTime.getDate() + 7);
        break;
      case 1:
        endTime.setMonth(endTime.getMonth() + 1);
        break;
      case 2:
        endTime.setMonth(endTime.getMonth() + 3);
        break;
      case 3:
        endTime.setFullYear(endTime.getFullYear() + 100);
        break;
    }

    const board = await this.boardRepository.createBoard(
      category,
      area,
      user,
      createBoardDto,
      endTime,
    );

    category.boards.push(board);

    return board;
  }

  async deleteBoard(no: number): Promise<DeleteResult> {
    const board = await this.boardRepository.findOne(no);
    this.errorConfirm.notFoundError(board, `해당 게시글을 찾을 수 없습니다.`);

    const result = await this.boardRepository.deleteBoard(no);

    if (!result.affected) {
      throw new InternalServerErrorException(
        '해당 게시글이 삭제되지 않았습니다.',
      );
    }

    return result;
  }

  async updateBoard(
    no: number,
    updateBoardDto: UpdateBoardDto,
  ): Promise<Object> {
    const { category, area, deadline } = updateBoardDto;

    const board = await this.boardRepository.findOne(no);
    this.errorConfirm.notFoundError(board, `해당 게시글을 찾을 수 없습니다.`);

    const endTime = new Date(board.createdAt);

    switch (deadline) {
      case null:
        endTime.setTime(board.deadline.getTime());
      case 0:
        endTime.setDate(endTime.getDate() + 7);
        break;
      case 1:
        endTime.setMonth(endTime.getMonth() + 1);
        break;
      case 2:
        endTime.setMonth(endTime.getMonth() + 3);
        break;
      case 3:
        endTime.setFullYear(endTime.getFullYear() + 100);
        break;
    }

    const currentTime = new Date();
    currentTime.setHours(currentTime.getHours() + 9);

    if (deadline && endTime <= currentTime) {
      throw new BadRequestException('다른 기간을 선택해 주십시오');
    }

    updateBoardDto.deadline = endTime;

    const boardKey = Object.keys(updateBoardDto);

    const deletedNullBoardKey = {};

    boardKey.forEach((item) => {
      updateBoardDto[item] !== null
        ? (deletedNullBoardKey[item] = updateBoardDto[item])
        : 0;
    });

    if (category) {
      const categoryNo = await this.categoryRepository.findOne(category, {
        relations: ['boards'],
      });
      this.errorConfirm.notFoundError(
        categoryNo,
        `해당 카테고리를 찾을 수 없습니다.`,
      );
    }
    if (area) {
      const getArea = await this.areaRepository.findOne(area, {
        relations: ['boards'],
      });

      this.errorConfirm.notFoundError(getArea, `해당 지역을 찾을 수 없습니다.`);
    }

    const updatedBoard = await this.boardRepository.updateBoard(
      no,
      deletedNullBoardKey,
    );

    if (updatedBoard) {
      return { success: true };
    }

    return { success: false };
  }
}
