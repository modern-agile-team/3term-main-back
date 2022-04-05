import {
  Injectable,
  InternalServerErrorException,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { CategoryRepository } from 'src/categories/repository/category.repository';
import { AreasRepository } from 'src/areas/repository/area.repository';
import { createQueryBuilder, DeleteResult, getConnection } from 'typeorm';
import { CreateBoardDto, SearchBoardDto, UpdateBoardDto } from './dto/board.dto';
import { Board } from './entity/board.entity';
import { BoardRepository } from './repository/board.repository';
import { ErrorConfirm } from 'src/utils/error';

@Injectable()
export class BoardsService {
  constructor(
    @InjectRepository(BoardRepository)
    private boardRepository: BoardRepository,

    @InjectRepository(AreasRepository)
    private areaRepository: AreasRepository,

    @InjectRepository(CategoryRepository)
    private categoryRepository: CategoryRepository,

    private errorConfirm: ErrorConfirm,
  ) {}

  async getAllBoards(): Promise<Board[]> {
    const boards = await this.boardRepository.getAllBoards();
    this.errorConfirm.notFoundError(boards, '게시글을 찾을 수 없습니다.');

    const currentTime = new Date()
    currentTime.setHours(currentTime.getHours() +9);
    
    const {affected} = await this.boardRepository.closeBoard(currentTime)
    if (!affected) {
      throw new InternalServerErrorException(
        '게시글 마감이 되지 않았습니다',
      );
    }

    return boards;
  }

  async sortAllBoards(sort: any): Promise<Board[]> {
    const boards = await this.boardRepository.sortAllBoards(sort);
    this.errorConfirm.notFoundError(
      boards,
      '정렬된 게시글을 찾을 수 없습니다.',
    );

    return boards;
  }

  async readHotBoards(): Promise<Board[]> {
    const boards = await this.boardRepository.readHotBoards();
    this.errorConfirm.notFoundError(boards, '게시글을 찾을 수 없습니다.');

    return boards;
  }

  async getByOneBoard(no: number): Promise<Board> {
    const board = await this.boardRepository.getByOneBoard(no);
    this.errorConfirm.notFoundError(board, `해당 게시글을 찾을 수 없습니다.`);
    const boardHit = await this.boardRepository.addBoardHit(no, board);

    if (!boardHit) {
      throw new InternalServerErrorException(
        '게시글 조회 수 증가가 되지 않았습니다',
      );
    }

    const currentTime = new Date()
    currentTime.setHours(currentTime.getHours() +9);

   
    const {affected} = await this.boardRepository.closeBoard(currentTime)
    if (!affected) {
      throw new InternalServerErrorException(
        '게시글 마감이 되지 않았습니다',
      );
    }

    return board;
  }

  async searchAllBoards(searchBoardDto:SearchBoardDto):Promise<Board[]> {
    const boards = await this.boardRepository.searchAllBoards(searchBoardDto);
    this.errorConfirm.notFoundError(boards, '게시글을 찾을 수 없습니다.');

    return boards;
  }

  async createBoard(createBoardDto: CreateBoardDto): Promise<Board> {
    const { categoryNo, areaNo, deadline } = createBoardDto;
    const category = await this.categoryRepository.findOne(categoryNo, {
      relations: ['boards'],
    });

    const area = await this.areaRepository.findOne(areaNo, {
      relations: ['boards'],
    });

    this.errorConfirm.notFoundError(
      category,
      `해당 카테고리를 찾을 수 없습니다.`,
    );

    this.errorConfirm.notFoundError(area, `해당 지역을 찾을 수 없습니다.`);
    const endTime = new Date();
    endTime.setHours(endTime.getHours()+9);
    
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

    if (result.affected === 0) {
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
    const { categoryNo, areaNo, deadline } = updateBoardDto;
    const category = await this.categoryRepository.findOne(categoryNo, {
      relations: ['boards'],
    });

    const area = await this.areaRepository.findOne(areaNo, {
      relations: ['boards'],
    });

    this.errorConfirm.notFoundError(
      category,
      `해당 카테고리를 찾을 수 없습니다.`,
    );

    this.errorConfirm.notFoundError(area, `해당 지역을 찾을 수 없습니다.`);
    
    const endTime = new Date();
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

    const updatedBoard = await this.boardRepository.updateBoard(
      no,
      category,
      area,
      updateBoardDto,
      endTime
    );

    if (updatedBoard) {
      return { success: true };
    }

    return { success: false };
  }
}
