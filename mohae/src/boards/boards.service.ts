import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { CategoryRepository } from 'src/categories/repository/category.repository';
import { createQueryBuilder, getConnection } from 'typeorm';
import { CreateBoardDto, UpdateBoardDto } from './dto/board.dto';
import { Board } from './entity/board.entity';
import { BoardRepository } from './repository/board.repository';

@Injectable()
export class BoardsService {
  constructor(
    @InjectRepository(BoardRepository)
    private boardRepository: BoardRepository,

    private categoryRepository: CategoryRepository,
  ) {}

  async getAllBoards(): Promise<Board[]> {
    return this.boardRepository.find();
  }

  async findOne(no: number): Promise<Board> {
    return await this.boardRepository.findOne(no);
  }

  async createBoard(createBoardDto: CreateBoardDto): Promise<Board> {
    const category = await this.categoryRepository.findOne(
      createBoardDto.category,
      {
        relations: ['boards'],
      },
    );

    if (!category) {
      throw new NotFoundException(
        `No: ${createBoardDto.category} 카테고리가 존재하지 않습니다.`,
      );
    } else {
      const board = await this.boardRepository.createBoard(
        category,
        createBoardDto,
      );

      return board;
    }
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
  ): Promise<object> {
    return await this.boardRepository.updateBoard(no, updateBoardDto);
  }
}
