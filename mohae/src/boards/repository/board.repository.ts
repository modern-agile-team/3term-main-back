import {
  InternalServerErrorException,
  NotFoundException,
} from '@nestjs/common';
import { User } from 'src/auth/entity/user.entity';
import { Category } from 'src/categories/entity/category.entity';
import { DeleteResult, EntityRepository, Repository } from 'typeorm';
import { CreateBoardDto, UpdateBoardDto } from '../dto/board.dto';
import { Board } from '../entity/board.entity';

@EntityRepository(Board)
export class BoardRepository extends Repository<Board> {
  async getByOneBoard(no: number) {
    try {
      const qb = this.createQueryBuilder('boards')
        .leftJoin('boards.area', 'areas')
        .leftJoin('boards.category', 'categories')
        .leftJoin('boards.user', 'users')
        .leftJoin('users.school', 'school')
        .leftJoin('users.major', 'major')
        .select([
          'users.no',
          'users.name',
          'users.nickname',
          'users.photo_url',
          'school.name',
          'major.name',
          'boards.no',
          'boards.title',
          'boards.description',
          'boards.createdAt',
          'boards.deadline',
          'boards.isDeadline',
          'boards.likeCount',
          'boards.hit',
          'boards.price',
          'boards.summary',
          'boards.target',
          'boards.note1',
          'boards.note2',
          'boards.note3',
          'areas.no',
          'areas.name',
          'categories.no',
          'categories.name',
        ])
        .where('boards.no = :no', { no })
        .andWhere('boards.area = areas.no')
        .andWhere('boards.category = categories.no');

      const board = await qb.getOne();

      const { D_day } = await qb
        .addSelect('DATEDIFF(boards.deadline, now())', 'D_day')
        .getRawOne();
      return { D_day, board };
    } catch (e) {
      `${e} ### 게시판 상세 조회 : 알 수 없는 서버 에러입니다.`;
    }
  }

  async readHotBoards(year: number, month: number): Promise<Object> {
    try {
      const boards = await this.createQueryBuilder('boards')
        .leftJoin('boards.area', 'areas')
        .leftJoin('boards.user', 'users')
        .select([
          'boards.no AS no',
          'DATEDIFF(boards.deadline, now()) AS D_day',
          'boards.title AS title',
          'boards.isDeadline AS isDeadline',
          'boards.price AS price',
          'boards.target AS target',
          'areas.no AS area_no',
          'areas.name AS area_name',
          'users.nickname AS user_nickname',
        ])
        .where('Year(boards.createdAt) = :year', { year })
        .andWhere('Month(boards.createdAt) = :month', { month })
        .orderBy(
          '(boards.hit + boards.likeCount) / DATEDIFF(now(), boards.createdAt)',
          'DESC',
        )
        .limit(3)
        .getRawMany();

      return { year, month, boards };
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

  async likeCountUp(no: number, { likeCount }) {
    try {
      const boardHit = await this.createQueryBuilder()
        .update(Board)
        .set({ likeCount: likeCount + 1 })
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

  async likeCountDown(no: number, { likeCount }) {
    try {
      const boardHit = await this.createQueryBuilder()
        .update(Board)
        .set({ likeCount: likeCount - 1 })
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

  async cancelClosedBoard(no: number) {
    try {
      const { affected } = await this.createQueryBuilder()
        .update(Board)
        .set({ isDeadline: false })
        .where('no = :no', { no })
        .execute();

      return affected;
    } catch (e) {
      throw new InternalServerErrorException(
        `${e} ### 게시판 활성화 : 알 수 없는 서버 에러입니다.`,
      );
    }
  }

  async boardClosed(no: number): Promise<Object> {
    try {
      const { affected } = await this.createQueryBuilder()
        .update(Board)
        .set({ isDeadline: true })
        .where('no = :no', { no })
        .execute();

      if (!affected) {
        return { success: false };
      }

      return { success: true };
    } catch (e) {
      throw new InternalServerErrorException(
        `${e} ### 게시판 비활성화 : 알 수 없는 서버 에러입니다.`,
      );
    }
  }

  async closingBoard(currentTime: Date) {
    try {
      const { affected } = await this.createQueryBuilder()
        .update(Board)
        .set({ isDeadline: true })
        .where(`deadline is not null`)
        .andWhere('deadline <= :currentTime', { currentTime })
        .andWhere('isDeadline = false')
        .execute();

      if (!affected) {
        return { success: false };
      }
      return { success: true };
    } catch (e) {
      throw new InternalServerErrorException(
        `${e} ### 게시판 마감 처리 : 알 수 없는 서버 에러입니다.`,
      );
    }
  }

  async searchAllBoards(title: string): Promise<Board[]> {
    try {
      const boards = await this.createQueryBuilder('boards')
        .leftJoin('boards.area', 'areas')
        .leftJoin('boards.user', 'users')
        .select([
          'boards.no AS no',
          'DATEDIFF(boards.deadline, now()) AS D_day',
          'boards.title AS title',
          'boards.isDeadline AS isDeadline',
          'boards.price AS price',
          'boards.target AS target',
          'areas.no AS area_no',
          'areas.name AS area_name',
          'users.nickname AS user_nickname',
        ])
        .where('boards.title like :title', { title: `%${title}%` })
        .orderBy('boards.no', 'DESC')
        .getRawMany();

      return boards;
    } catch (e) {
      throw new InternalServerErrorException(
        `${e} ### 게시글 검색 : 알 수 없는 서버 에러입니다.`,
      );
    }
  }

  async filteredBoards(
    categoryNo: number,
    sort: any,
    title: string,
    popular: string,
    areaNo: number,
    max: number,
    min: number,
    target: boolean,
    date: any,
    endTime: Date,
    currentTime: Date,
    free: string,
  ): Promise<Board[]> {
    try {
      const boardFiltering = this.createQueryBuilder('boards')
        .leftJoin('boards.area', 'areas')
        .leftJoin('boards.category', 'categories')
        .leftJoin('boards.user', 'users')
        .select([
          'boards.no AS no',
          'DATEDIFF(boards.deadline, now()) AS D_day',
          'boards.title AS title',
          'boards.createdAt AS createdAt',
          'boards.isDeadline AS isDeadline',
          'boards.price AS price',
          'boards.target AS target',
          'areas.no AS area_no',
          'areas.name AS area_name',
          'users.nickname AS user_nickname',
        ])
        .orderBy('boards.no', sort);
      if (categoryNo) {
        boardFiltering.andWhere('boards.category = :categoryNo', {
          categoryNo,
        });
      }
      if (title)
        boardFiltering.andWhere('boards.title like :title', {
          title: `%${title}%`,
        });
      if (areaNo) boardFiltering.andWhere('boards.area = :areaNo', { areaNo });
      if (max) boardFiltering.andWhere('boards.price < :max', { max });
      if (min) boardFiltering.andWhere('boards.price >= :min', { min });
      if (target)
        boardFiltering.andWhere('boards.target = :target', { target });
      if (date === NaN) {
        boardFiltering.andWhere('boards.deadline is null');
      }
      if (date) {
        boardFiltering.andWhere('boards.deadline < :endTime', { endTime });
        boardFiltering.andWhere('boards.deadline > :currentTime', {
          currentTime,
        });
      }
      if (free) boardFiltering.andWhere('boards.price = 0');
      if (popular) boardFiltering.orderBy('boards.hit', 'DESC');

      return await boardFiltering.getRawMany();
    } catch (e) {
      throw new InternalServerErrorException(
        `${e} ### 게시판 필터링 조회 : 알 수 없는 서버 에러입니다.`,
      );
    }
  }

  async getAllBoards(): Promise<Board[]> {
    try {
      const boards = await this.createQueryBuilder('boards')
        .leftJoin('boards.area', 'areas')
        .leftJoin('boards.category', 'categories')
        .leftJoin('boards.user', 'users')
        .select([
          'DATEDIFF(boards.deadline, now()) AS D_day',
          'boards.no AS no',
          'boards.title AS title',
          'boards.createdAt AS createdAt',
          'boards.isDeadline AS isDeadline',
          'boards.price AS price',
          'boards.target AS target',
          'areas.no AS area_no',
          'areas.name AS area_name',
          'users.nickname AS user_nickname',
        ])
        .where('boards.area = areas.no')
        .andWhere('boards.category = categories.no')
        .orderBy('boards.no', 'DESC')
        .getRawMany();

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
    user: User,
    createBoardDto: CreateBoardDto,
    endTime: Date,
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
            user,
            note1,
            note2,
            note3,
            deadline: endTime,
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

  async updateBoard(no: number, deletedNullBoardKey: any): Promise<Object> {
    try {
      const updatedBoard = await this.createQueryBuilder()
        .update(Board)
        .set(deletedNullBoardKey)
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

  async saveCategory(categoryNo: number, board: Board) {
    try {
      await this.createQueryBuilder()
        .relation(Category, 'boards')
        .of(categoryNo)
        .add(board);
    } catch (e) {
      throw new InternalServerErrorException();
    }
  }
}
