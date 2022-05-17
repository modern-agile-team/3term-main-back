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
import { BoardRepository } from './repository/board.repository';
import { ErrorConfirm } from 'src/utils/error';
import { UserRepository } from 'src/auth/repository/user.repository';
import { Board } from './entity/board.entity';
import { Category } from 'src/categories/entity/category.entity';
import { Area } from 'src/areas/entity/areas.entity';
import { User } from 'src/auth/entity/user.entity';

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

  async getAllBoards(): Promise<Object> {
    const boards: Board[] = await this.boardRepository.getAllBoards();
    this.errorConfirm.notFoundError(boards, '게시글을 찾을 수 없습니다.');

    return { allBoardNum: boards.length, boards };
  }

  async closingBoard(): Promise<Number> {
    const currentTime: Date = new Date();
    currentTime.setHours(currentTime.getHours() + 9);

    const result: Number = await this.boardRepository.closingBoard(currentTime);

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
  ): Promise<Object> {
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

  async readHotBoards(select: number): Promise<Object> {
    const currentTime: Date = new Date();
    currentTime.setHours(currentTime.getHours() + 9);
    const year: number = currentTime.getFullYear();
    const month: number = currentTime.getMonth();

    if (month === 12) {
      year - 1;
    }

    const filteredHotBoards: Object = await this.boardRepository.readHotBoards(
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
    this.errorConfirm.notFoundError(board, `해당 게시글을 찾을 수 없습니다.`);

    const boardHit: Number = await this.boardRepository.addBoardHit(board);

    if (!boardHit) {
      throw new InternalServerErrorException(
        '게시글 조회 수 증가가 되지 않았습니다',
      );
    }
    board.likeCount = Number(board.likeCount);

    return board;
  }

  async boardClosed(no: number): Promise<Object> {
    const board: Board = await this.boardRepository.findOne(no);
    this.errorConfirm.notFoundError(board, '게시글을 찾을 수 없습니다.');
    if (board.isDeadline) {
      throw new InternalServerErrorException('이미 마감된 게시글 입니다.');
    }

    const result: Object = await this.boardRepository.boardClosed(no);

    if (!result) {
      throw new InternalServerErrorException('게시글 마감이 되지 않았습니다');
    }

    return { isSuccess: true };
  }

  async cancelClosedBoard(no: number): Promise<Object> {
    const board: Board = await this.boardRepository.findOne(no);
    this.errorConfirm.notFoundError(board, `해당 게시글을 찾을 수 없습니다.`);

    const currentTime: Date = new Date();
    currentTime.setHours(currentTime.getHours() + 9);

    if (board.deadline <= currentTime) {
      throw new InternalServerErrorException(
        '시간이 지나 마감된 게시글 입니다.',
      );
    }

    if (!board.isDeadline) {
      throw new InternalServerErrorException('활성화된 게시글 입니다.');
    }

    const result: number = await this.boardRepository.cancelClosedBoard(no);

    if (!result) {
      throw new InternalServerErrorException(
        '게시글 마감 취소가 되지 않았습니다.',
      );
    }

    return { isSuccess: true };
  }

  async searchAllBoards(searchBoardDto: SearchBoardDto): Promise<Object> {
    const { title }: any = searchBoardDto;
    const boards: Board[] = await this.boardRepository.searchAllBoards(title);
    this.errorConfirm.notFoundError(boards, '게시글을 찾을 수 없습니다.');

    return { foundedBoardNum: boards.length, search: title, boards };
  }

  async createBoard(createBoardDto: CreateBoardDto): Promise<Object> {
    const { categoryNo, areaNo, deadline, userNo }: any = createBoardDto;
    const category: Category = await this.categoryRepository.findOne(
      categoryNo,
      {
        relations: ['boards'],
      },
    );

    const area: Area = await this.areaRepository.findOne(areaNo, {
      relations: ['boards'],
    });

    const user: User = await this.userRepository.findOne(userNo, {
      relations: ['boards'],
    });

    this.errorConfirm.notFoundError(
      category,
      `해당 카테고리를 찾을 수 없습니다.`,
    );

    this.errorConfirm.notFoundError(area, `해당 지역을 찾을 수 없습니다.`);

    this.errorConfirm.notFoundError(user, `해당 회원을 찾을 수 없습니다.`);

    let endTime = new Date();
    endTime.setHours(endTime.getHours() + 9);

    if (!deadline) {
      endTime = null;
    }

    if (deadline) {
      endTime.setSeconds(endTime.getSeconds() + deadline);
    }

    const { affectedRows }: any = await this.boardRepository.createBoard(
      category,
      area,
      user,
      createBoardDto,
      endTime,
    );
    // await this.boardRepository.saveCategory(categoryNo, board);

    if (!affectedRows) {
      return { isSuccess: false, msg: '게시글 생성이 되지 않았습니다.' };
    }

    return { isSuccess: true, msg: '게시글 생성이 완료 되었습니다.' };
  }

  async deleteBoard(no: number): Promise<DeleteResult> {
    const board: Board = await this.boardRepository.findOne(no);
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

    const board: Board = await this.boardRepository.findOne(no);
    this.errorConfirm.notFoundError(board, `해당 게시글을 찾을 수 없습니다.`);

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
    console.log(typeof Object.keys(updateBoardDto));
    const boardKey: any = Object.keys(updateBoardDto);

    const deletedNullBoardKey = {};

    boardKey.forEach((item) => {
      updateBoardDto[item] !== null
        ? (deletedNullBoardKey[item] = updateBoardDto[item])
        : 0;
    });

    if (deadline !== null) {
      if (!deadline) {
        endTime = null;
        deletedNullBoardKey['deadline'] = endTime;
      }
    }

    if (category) {
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
    }

    if (area) {
      const getArea: Area = await this.areaRepository.findOne(area, {
        relations: ['boards'],
      });

      this.errorConfirm.notFoundError(getArea, `해당 지역을 찾을 수 없습니다.`);
    }

    const updatedBoard: object = await this.boardRepository.updateBoard(
      no,
      deletedNullBoardKey,
    );

    if (!updatedBoard) {
      return { isSuccess: false };
    }

    return { isSuccess: true };
  }
}
