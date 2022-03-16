import { EntityRepository, Repository } from 'typeorm';
import { CreateBoardDto } from '../dto/board.dto';
import { Board } from '../entity/board.entity';

@EntityRepository(Board)
export class BoardRepository extends Repository<Board> {
  async createBoard(createBoardDto: CreateBoardDto): Promise<Board> {
    const { price, title, description, summary, target, category } =
      createBoardDto;

    const createdboard = this.create({
      price,
      title,
      description,
      summary,
      target,
      category,
    });

    await createdboard.save();
    return createdboard;
  }
}
