import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { BoardUpdate } from './board.model';
import { CreateBoardDto, UpdateBoardDto } from './dto/board.dto';
import { Board } from './entity/board.entity';
import { BoardRepository } from './repository/board.repository';

@Injectable()
export class BoardsService {
  constructor(
    @InjectRepository(BoardRepository)
    private boardRepository: BoardRepository,
  ) {}

  async getAllBoards(): Promise<Board[]> {
    return this.boardRepository.find();
  }

  async findOne(no: number): Promise<Board> {
    return this.boardRepository.findOne(no);
  }

  async create(createBoardDto: CreateBoardDto): Promise<Board> {
    return this.boardRepository.createBoard(createBoardDto);
  }

  async delete(no: number): Promise<void> {
    const result = await this.boardRepository.delete(no);
    if (!result.affected) {
      throw new NotFoundException(`Can't not found id ${no}`);
    }
  }

  async update(no: number, updateBoardDto: UpdateBoardDto): Promise<Board> {
    const findBoard = await this.findOne(no);
    const { title, description, price, summary, target } = updateBoardDto;
    findBoard.title = title;
    findBoard.description = description;
    findBoard.price = price;
    findBoard.summary = summary;
    findBoard.target = target;
    await this.boardRepository.save(findBoard);

    return findBoard;
  }
}
