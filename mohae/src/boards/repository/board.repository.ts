import {
  InternalServerErrorException,
  NotFoundException,
} from '@nestjs/common';
import { Area } from 'src/areas/entity/areas.entity';
import { Category } from 'src/categories/entity/category.entity';
import {
  DeleteResult,
  EntityRepository,
  getConnection,
  Repository,
} from 'typeorm';
import { CreateBoardDto, UpdateBoardDto } from '../dto/board.dto';
import { Board } from '../entity/board.entity';

@EntityRepository(Board)
export class BoardRepository extends Repository<Board> {
  async findOneBoard(no: number): Promise<Board> {
    const board = await this.createQueryBuilder('boards')
      .leftJoinAndSelect('boards.area', 'areas')
      .leftJoinAndSelect('boards.category', 'categories')
      .where('boards.area = areas.no')
      .where('boards.category = categories.no')
      .getOne();
    return board;
  }
  async findAllBoard(): Promise<Board[]> {
    try {
      const boards = await this.createQueryBuilder('boards')
        .leftJoinAndSelect('boards.area', 'areas')
        .leftJoinAndSelect('boards.category', 'categories')
        .where('boards.area = areas.no')
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
    category: Category,
    area: Area,
    updateBoardDto: UpdateBoardDto,
  ): Promise<object> {
    const board = await this.findOne(no);
    if (!board) {
      throw new NotFoundException(`No: ${no} 게시글을 찾을 수 없습니다.`);
    }
    const { title, description, price, summary, target, note1, note2, note3 } =
      updateBoardDto;

    const result = await this.createQueryBuilder()
      .update(Board)
      .set({
        title: title,
        description: description,
        price: price,
        summary: summary,
        target: target,
        category: category,
        area: area,
        note1: note1,
        note2: note2,
        note3: note3,
      })
      .where('no = :no', { no: `${no}` })
      .execute();
    const { affected } = result;
    if (!affected) {
      return { success: false };
    }

    return { success: true };
  }

  async deleteBoard(no: number): Promise<DeleteResult> {
    const board = await this.findOne(no);
    if (!board) {
      throw new NotFoundException(`No: ${no} 게시글을 찾을 수 없습니다.`);
    }
    const boardQuery = await this.createQueryBuilder()
      .softDelete()
      .from(Board)
      .where('no = :no', { no })
      .execute();
    return boardQuery;
  }
}
