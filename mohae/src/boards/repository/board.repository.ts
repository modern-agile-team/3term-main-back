import { NotFoundException } from '@nestjs/common';
import { CreateReviewDto } from 'src/reviews/dto/create-review.dto';
import { ReviewRepository } from 'src/reviews/repository/review.repository';
import { EntityRepository, Repository } from 'typeorm';
import { CreateBoardDto, UpdateBoardDto } from '../dto/board.dto';
import { Board } from '../entity/board.entity';

@EntityRepository(Board)
export class BoardRepository extends Repository<Board> {
  async createBoard(createBoardDto: CreateBoardDto): Promise<object> {
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
    return { success: true, createBoardNo: createdboard.no };
  }

  async updateBoard(
    no: number,
    updateBoardDto: UpdateBoardDto,
  ): Promise<object> {
    const board = await this.findOne(no);
    if (!board) {
      throw new NotFoundException(`No: ${no} 게시글을 찾을 수 없습니다.`);
    }
    const { title, description, price, summary, target } = updateBoardDto;

    board.title = title;
    board.description = description;
    board.price = price;
    board.summary = summary;
    board.target = target;

    await this.save(board);
    return {
      success: true,
      updateBoardNo: no,
    };
  }
}
