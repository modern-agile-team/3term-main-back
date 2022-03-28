import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { CategoryRepository } from 'src/categories/repository/category.repository';
import { AreasRepository } from 'src/areas/repository/area.repository';
import { createQueryBuilder, getConnection } from 'typeorm';
import { CreateBoardDto, UpdateBoardDto } from './dto/board.dto';
import { Board } from './entity/board.entity';
import { BoardRepository } from './repository/board.repository';
import { NoteRepository } from 'src/notes/repository/note.repository';

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
    return this.boardRepository.findAllBoard();
  }

  async findOne(no: number): Promise<Board> {
    const board = await this.boardRepository.findOneBoard(no);

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

  async delete(no: number): Promise<void> {
    const result = await this.boardRepository.delete(no);
    if (!result.affected) {
      throw new NotFoundException(`Can't not found id ${no}`);
    }
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
