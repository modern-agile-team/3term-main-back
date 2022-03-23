import {
  InternalServerErrorException,
  NotFoundException,
} from '@nestjs/common';
import { Area } from 'src/areas/entity/areas.entity';
import { Category } from 'src/categories/entity/category.entity';
import { EntityRepository, getConnection, Repository } from 'typeorm';
import { CreateBoardDto, UpdateBoardDto } from '../dto/board.dto';
import { Board } from '../entity/board.entity';

@EntityRepository(Board)
export class BoardRepository extends Repository<Board> {
  async findAllBoard(): Promise<Board[]> {
    try {
      const boards = await this.createQueryBuilder('boards')
        .leftJoinAndSelect('boards.area', 'areas')
        .leftJoinAndSelect('boards.note', 'notes')
        .leftJoinAndSelect('boards.category', 'categories')
        .where('boards.area = areas.no')
        .where('boards.note = notes.no')
        .where('boards.category = categories.no')
        .getMany();

      return boards;
    } catch (e) {
      throw new InternalServerErrorException(
        `${e} ### 게시판 전체 조회 : 알 수 없는 서버 에러입니다.`,
      );
    }
  }

  async createBoard(
    category: Category,
    area: object,
    createBoardDto: CreateBoardDto,
  ): Promise<Board> {
    const { price, title, description, summary, target, note1, note2, note3 } =
      createBoardDto;
    const board = await this.createQueryBuilder('boards')
      .insert()
      .into(Board)
      .values([
        {
          price,
          title,
          description,
          summary,
          target,
          category,
          area,
          note1,
          note2,
          note3,
        },
      ])
      .execute();

    const { affectedRows, insertId } = board.raw;
    if (affectedRows) {
      return await this.createQueryBuilder('boards')
        .leftJoinAndSelect('boards.category', 'category')
        .leftJoinAndSelect('boards.area', 'area')
        .where('boards.no = :no', { no: insertId })
        .getOne();
    }
    // return board;
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
