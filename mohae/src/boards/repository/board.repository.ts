import { InternalServerErrorException } from '@nestjs/common';
// import { User } from 'src/auth/entity/user.entity';
import { Category } from 'src/categories/entity/category.entity';
import { DeleteResult, EntityRepository, Repository } from 'typeorm';
import { CreateBoardDto } from '../dto/board.dto';
import { Board } from '../entity/board.entity';
import { User } from '@sentry/node';

@EntityRepository(Board)
export class BoardRepository extends Repository<Board> {
  async getByOneBoard(no: number) {
    try {
      return await this.createQueryBuilder('boards')
        .leftJoin('boards.area', 'areas', 'areas.no = boards.area')
        .leftJoin(
          'boards.category',
          'categories',
          'categories.no = boards.category',
        )
        .leftJoin('boards.user', 'users')
        .leftJoin('users.school', 'school')
        .leftJoin('users.major', 'major')
        .leftJoin(
          'boards.likedUser',
          'likedUser',
          'likedUser.likedBoardNo = :no',
          { no },
        )
        .select([
          'boards.no AS no',
          'DATEDIFF(boards.deadline, now()) AS decimalDay',
          'boards.title AS title',
          'boards.description AS description',
          'boards.isDeadline AS isDeadline',
          'boards.hit AS hit',
          'COUNT(likedUser.likedBoardNo) AS likeCount',
          'boards.price AS price',
          'boards.summary AS summary',
          'boards.target AS target',
          'boards.note1 AS note1',
          'boards.note2 AS note2',
          'boards.note3 AS note3',
          'areas.no AS areaNo',
          'areas.name AS areaName',
          'categories.no AS categoryNo',
          'categories.name AS categoryName',
          'users.no AS userNo',
          'users.name AS userName',
          'users.nickname AS userNickname',
          'users.photo_url AS userPhotoUrl',
          'school.name AS userSchool',
          'major.name AS userMajor',
        ])
        .where('boards.no = :no', { no })
        .getRawOne();
    } catch (e) {
      `${e} ### 게시판 상세 조회 : 알 수 없는 서버 에러입니다.`;
    }
  }

  async addBoardHit({ no, hit }): Promise<number> {
    try {
      const { affected } = await this.createQueryBuilder()
        .update(Board)
        .set({ hit: hit + 1 })
        .where('no = :no', { no })
        .execute();

      return affected;
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

  async boardClosed(no: number): Promise<number> {
    try {
      const { affected } = await this.createQueryBuilder()
        .update(Board)
        .set({ isDeadline: true })
        .where('no = :no', { no })
        .execute();

      return affected;
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

      return affected;
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
          'DATEDIFF(boards.deadline, now()) AS decimalDay',
          'boards.title AS title',
          'boards.isDeadline AS isDeadline',
          'boards.price AS price',
          'boards.target AS target',
          'areas.no AS areaNo',
          'areas.name AS areaName',
          'users.nickname AS userNickname',
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
          'DATEDIFF(boards.deadline, now()) AS decimalDay',
          'boards.title AS title',
          'boards.isDeadline AS isDeadline',
          'boards.price AS price',
          'boards.target AS target',
          'areas.no AS areaNo',
          'areas.name AS areaName',
          'users.nickname AS userNickname',
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
    } catch (err) {
      throw new InternalServerErrorException(
        `${err} ### 게시판 필터링 조회 : 알 수 없는 서버 에러입니다.`,
      );
    }
  }

  async getAllBoards(): Promise<Board[]> {
    try {
      return await this.createQueryBuilder('boards')
        .leftJoin('boards.area', 'areas')
        .leftJoin('boards.category', 'categories')
        .leftJoin('boards.user', 'users')
        .select([
          'DATEDIFF(boards.deadline, now()) AS decimalDay',
          'boards.no AS no',
          'boards.title AS title',
          'boards.isDeadline AS isDeadline',
          'boards.price AS price',
          'boards.target AS target',
          'areas.no AS areaNo',
          'areas.name AS areaName',
          'users.nickname AS userNickname',
        ])
        .where('boards.area = areas.no')
        .andWhere('boards.category = categories.no')
        .orderBy('boards.no', 'DESC')
        .getRawMany();
    } catch (err) {
      throw new InternalServerErrorException(
        `${err} ### 게시판 전체 조회 : 알 수 없는 서버 에러입니다.`,
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

  async updateBoard(no: number, deletedNullBoardKey: any): Promise<number> {
    try {
      const { affected } = await this.createQueryBuilder()
        .update(Board)
        .set(deletedNullBoardKey)
        .where('no = :no', { no })
        .execute();

      return affected;
    } catch (err) {
      throw new InternalServerErrorException(
        `${err} ### 게시판 수정: 알 수 없는 서버 에러입니다.`,
      );
    }
  }

  async deleteBoard(boardNo: number): Promise<number> {
    try {
      const { affected }: DeleteResult = await this.createQueryBuilder()
        .softDelete()
        .from(Board)
        .where('no = :boardNo', { boardNo })
        .execute();

      return affected;
    } catch (err) {
      throw new InternalServerErrorException(
        `${err} ### 게시판 삭제: 알 수 없는 서버 에러입니다.`,
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

  async readHotBoards(
    select: number,
    year: number,
    month: number,
  ): Promise<object> {
    try {
      const hotBoards = this.createQueryBuilder('boards')
        .leftJoin('boards.area', 'areas')
        .leftJoin('boards.user', 'users')
        .leftJoin(
          'boards.likedUser',
          'likedUsers',
          'likedUsers.likedBoardNo != boards.no OR likedUsers.likedBoardNo = boards.no',
        )
        .select([
          'boards.no AS no',
          'DATEDIFF(boards.deadline, now()) AS decimalDay',
          'boards.title AS title',
          'boards.isDeadline AS isDeadline',
          'boards.price AS price',
          'boards.target AS target',
          'areas.no AS areaNo',
          'areas.name AS areaName',
          'users.nickname AS userNickname',
        ])
        .where('Year(boards.createdAt) <= :year', { year })
        .andWhere('Month(boards.createdAt) <= :month', { month })
        .groupBy('likedUsers.likedBoardNo')
        .orderBy(
          '(boards.hit + COUNT(likedUsers.likedBoardNo)) / DATEDIFF(now(), boards.createdAt)',
          'DESC',
        )
        .limit(3);

      if (select === 1) {
        hotBoards.andWhere('boards.isDeadline = false');
      }

      if (select === 2) {
        hotBoards.andWhere('boards.isDeadline = true');
      }
      const filteredHotBoards = await hotBoards.getRawMany();

      return filteredHotBoards;
    } catch (err) {
      `${err} ### 인기 게시판 조회 : 알 수 없는 서버 에러입니다.`;
    }
  }

  async readUserBoard(
    userNo: number,
    take: number,
    page: number,
    target: boolean,
  ): Promise<Board[]> {
    try {
      const boards: Board[] = await this.createQueryBuilder('boards')
        .leftJoin('boards.user', 'user')
        .leftJoin('boards.photos', 'boardPhotos')
        .select([
          'boards.no',
          'boards.title',
          'boards.description',
          'boardPhotos.photo_url',
          'boards.target',
          'user.no',
        ])
        .where('user.no = :userNo', { userNo })
        .andWhere('boards.no = boardPhotos.board')
        .andWhere('boards.target = :target', { target })
        .take(take)
        .skip(take * (page - 1))
        .getMany();

      return boards;
    } catch (err) {
      throw new InternalServerErrorException(
        `${err}####스펙 전체 조회 관련 서버 에러입니다`,
      );
    }
  }
}
