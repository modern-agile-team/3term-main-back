import { EntityRepository, Repository } from 'typeorm';
import { CreateBoardDto } from '../dto/board.dto';
import { Board } from '../entity/board.entity';

@EntityRepository(Board)
export class BoardRepository extends Repository<Board> {
  async createBoard(createBoardDto: CreateBoardDto): Promise<Board> {
    const {
      thumb,
      hit,
      price,
      title,
      description,
      summary,
      target,
      category,
      area,
    } = createBoardDto;

    const createdboard = this.create({
      thumb,
      hit,
      price,
      title,
      description,
      summary,
      target,
      category,
      area,
    });

    await createdboard.save();
    return createdboard;
  }
}
