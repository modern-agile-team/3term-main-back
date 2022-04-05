import {
  InternalServerErrorException,
  NotFoundException,
} from '@nestjs/common';
import { Area } from 'src/areas/entity/areas.entity';
import { Category } from 'src/categories/entity/category.entity';
import { DeleteResult, EntityRepository, Repository } from 'typeorm';
import { CreateBoardDto, UpdateBoardDto } from '../dto/board.dto';
import { Board } from '../entity/board.entity';

@EntityRepository(Board)
export class BoardRepository extends Repository<Board> {
  async getByOneBoard(no: number): Promise<Board> {
    try {
      const board = await this.createQueryBuilder('boards')
        .leftJoinAndSelect('boards.area', 'areas')
        .leftJoinAndSelect('boards.category', 'categories')
        .select(['boards.no','boards.title','boards.description','boards.createdAt','boards.deadLine','boards.isDeadLine','boards.thumb','boards.hit','boards.price','boards.summary','boards.target','boards.note1','boards.note2','boards.note3','areas.name','categories.name'])
        .where('boards.no = :no', { no })
        .andWhere('boards.area = areas.no')
        .andWhere('boards.category = categories.no')
        .getOne();

      return board;
    } catch (e) {
      `${e} ### 게시판 상세 조회 : 알 수 없는 서버 에러입니다.`;
    }
  }

  async readHotBoards(): Promise<Board[]> {
    try {
      const boards = await this.createQueryBuilder('boards')
      .leftJoinAndSelect('boards.area','areas')
      .leftJoinAndSelect('boards.category','categories')
      .select(['boards.no','boards.title','boards.description','boards.createdAt','boards.deadLine','boards.isDeadLine','boards.thumb','boards.hit','boards.price','boards.summary','boards.target','boards.note1','boards.note2','boards.note3','areas.name','categories.name'])
      .orderBy('boards.thumb', 'DESC')
      .limit(3)
      .getMany();
      
      return boards;
    } catch (e) {
      `${e} ### 인기 게시판 순위 조회 : 알 수 없는 서버 에러입니다.`;
    }
  }

  async addBoardHit(no: number, { hit }) {
    try {
      const boardHit = await this.createQueryBuilder()
        .update(Board)
        .set({ hit: hit + 1 })
        .where('no = :no', { no })
        .execute();

      if (!boardHit.affected) {
        return { success: false };
      }

      return { success: true };
    } catch (e) {
      throw new InternalServerErrorException(
        `${e} ### 게시판 조회수 증가 : 알 수 없는 서버 에러입니다.`,
        );
      }
    }

  async closeBoard(currentTime: Date){
    try {
      const closedBoard = await this.createQueryBuilder()
        .update(Board)
        .set({ isDeadLine: true })
        .where('deadline <= :currentTime', {currentTime})
        .execute();
      return closedBoard;
    } catch(e) {
      throw new InternalServerErrorException(
        `${e} ### 게시판 마감 처리 : 알 수 없는 서버 에러입니다.`,
        );
    }
  }
    
  async searchAllBoards(sort: any): Promise<Board[]> {
    try {
      const filteredBoard = await this.createQueryBuilder('boards')
        .leftJoinAndSelect('boards.area', 'areas')
        .leftJoinAndSelect('boards.category', 'categories')
        .select(['boards.no','boards.title','boards.description','boards.createdAt','boards.deadLine','boards.isDeadLine','boards.thumb','boards.hit','boards.price','boards.summary','boards.target','boards.note1','boards.note2','boards.note3','areas.name','categories.name'])
        .where('boards.area = areas.no')
        .andWhere('boards.category = categories.no')
        .orderBy('boards.no', sort)
        .getMany();

      return filteredBoard;
    } catch (e) {
      throw new InternalServerErrorException(
        `${e} ### 게시판 정렬 조회 : 알 수 없는 서버 에러입니다.`,
      );
    }
  }

  async getAllBoards(): Promise<Board[]> {
    try {
      const boards = await this.createQueryBuilder('boards')
        .leftJoinAndSelect('boards.area', 'areas')
        .leftJoinAndSelect('boards.category', 'categories')
        .where('boards.area = areas.no')
        .andWhere('boards.category = categories.no')
        .orderBy('boards.no', 'ASC')
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
    endTime: Date
  ): Promise<Board> {
    try {
      const {
        price,
        title,
        description,
        summary,
        target,
        note1,
        note2,
        note3,
      } = createBoardDto;
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
            deadline: endTime
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
    } catch (e) {
      throw new InternalServerErrorException(
        `${e} ### 게시판 생성: 알 수 없는 서버 에러입니다.`,
      );
    }
  }

  async updateBoard(
    no: number,
    category: Category,
    area: Area,
    updateBoardDto: UpdateBoardDto,
    endTime: Date
  ): Promise<object> {
    const board = await this.findOne(no);
    if (!board) {
      throw new NotFoundException(`No: ${no} 게시글을 찾을 수 없습니다.`);
    }
    try {
      const {
        title,
        description,
        price,
        summary,
        target,
        note1,
        note2,
        note3,
      } = updateBoardDto;

      const updatedBoard = await this.createQueryBuilder()
        .update(Board)
        .set({
          title,
          description,
          price,
          summary,
          target,
          category,
          area,
          note1,
          note2,
          note3,
          deadline: endTime
        })
        .where('no = :no', { no })
        .execute();
      const { affected } = updatedBoard;

      if (!affected) {
        return { success: false };
      }

      return { success: true };
    } catch (e) {
      throw new InternalServerErrorException(
        `${e} ### 게시판 수정: 알 수 없는 서버 에러입니다.`,
      );
    }
  }

  async deleteBoard(no: number): Promise<DeleteResult> {
    try {
      const result = await this.createQueryBuilder()
        .softDelete()
        .from(Board)
        .where('no = :no', { no })
        .execute();

      return result;
    } catch (e) {
      throw new InternalServerErrorException(
        `${e} ### 게시판 삭제: 알 수 없는 서버 에러입니다.`,
      );
    }
  }
}
