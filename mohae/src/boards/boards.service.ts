import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { CategoryRepository } from 'src/categories/repository/category.repository';
import { AreasRepository } from 'src/areas/repository/area.repository';
import { createQueryBuilder, DeleteResult, getConnection } from 'typeorm';
import { CreateBoardDto, UpdateBoardDto } from './dto/board.dto';
import { Board } from './entity/board.entity';
import { BoardRepository } from './repository/board.repository';

@Injectable()
export class BoardsService {
  constructor(
    @InjectRepository(BoardRepository)
    private boardRepository: BoardRepository,

    @InjectRepository(AreasRepository)
    private areaRepository: AreasRepository,

    private categoryRepository: CategoryRepository,
  ) {}

  async getAllBoards(): Promise<Board[]> {
    return this.boardRepository.getAllBoards();
  }

  async searchBoard(sort): Promise<Board[]> {
    return await this.boardRepository.searchBoard(sort);
  }

  async getByOneBoard(no: number): Promise<Board> {
    const board = await this.boardRepository.getByOneBoard(no);
    if (!board) {
      throw new NotFoundException(`No: ${no} 게시글을 찾을 수 없습니다.`);
    }
    return board;
  }

  async createBoard(createBoardDto: CreateBoardDto): Promise<Board> {
    const { categoryNo, areaNo } = createBoardDto;
    const category = await this.categoryRepository.findOne(categoryNo, {
      relations: ['boards'],
    });

    const area = await this.areaRepository.findOne(areaNo, {
      relations: ['boards'],
    });

    if (!category) {
      throw new NotFoundException(
        `No: ${createBoardDto.categoryNo} 카테고리가 존재하지 않습니다.`,
      );
    }
    const board = await this.boardRepository.createBoard(
      category,
      area,
      createBoardDto,
    );

    category.boards.push(board);
    return board;
  }

  async deleteBoard(no: number): Promise<DeleteResult> {
    const deleteBoard = await this.boardRepository.deleteBoard(no);
    if (deleteBoard.affected === 0) {
      throw new NotFoundException(`${no}번의 게시글이 삭제되지 않았습니다.`);
    }
    return deleteBoard;
  }
  async updateBoard(
    no: number,
    updateBoardDto: UpdateBoardDto,
  ): Promise<Object> {
    const { categoryNo, areaNo } = updateBoardDto;
    const category = await this.categoryRepository.findOne(categoryNo, {
      relations: ['boards'],
    });

    const area = await this.areaRepository.findOne(areaNo, {
      relations: ['boards'],
    });
    const updateBoard = await this.boardRepository.updateBoard(
      no,
      category,
      area,
      updateBoardDto,
    );

    if (updateBoard) {
      return { success: true, msg: '게시글 수정이 완료되었습니다.' };
    }

    return { success: false, msg: '게시글 수정 실패' };
  }
}
