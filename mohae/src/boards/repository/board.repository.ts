import { InternalServerErrorException } from '@nestjs/common';
import {
  DeleteResult,
  EntityRepository,
  InsertResult,
  Repository,
  SelectQueryBuilder,
  UpdateResult,
} from 'typeorm';
import { User } from '@sentry/node';
import { Board } from '../entity/board.entity';
import { Category } from 'src/categories/entity/category.entity';
import { PaginationDto } from '../dto/pagination.dto';
import { SearchBoardDto } from '../dto/searchBoard.dto';
import { boardInfo } from '../boards.service';

@EntityRepository(Board)
export class BoardRepository extends Repository<Board> {
  async readOneBoardByAuth(boardNo: number, userNo: number): Promise<Board> {
    try {
      return await this.createQueryBuilder('boards')
        .leftJoin('boards.area', 'areas', 'areas.no = boards.area')
        .leftJoin(
          'boards.category',
          'categories',
          'categories.no = boards.category',
        )
        .leftJoin('boards.user', 'users')
        .leftJoin('boards.photos', 'photo')
        .leftJoin('users.school', 'school')
        .leftJoin('users.major', 'major')
        .leftJoin(
          'boards.likedUser',
          'likedUser',
          'likedUser.likedBoardNo = :boardNo',
          { boardNo },
        )
        .leftJoin('users.profilePhoto', 'profilePhoto')
        .select([
          'boards.no AS no',
          'REPLACE(GROUP_CONCAT(photo.photo_url), ",", ", ") AS boardPhotoUrls',
          'DATEDIFF(boards.deadline, now()) * -1 AS decimalDay',
          'ifnull(DATEDIFF(boards.deadline, boards.createdAt), 0) AS deadline',
          'boards.deadline AS endDate',
          'boards.title AS title',
          'boards.description AS description',
          'boards.isDeadline AS isDeadline',
          'boards.createdAt AS createdAt',
          'boards.hit AS hit',
          'boards.price AS price',
          'boards.summary AS summary',
          'boards.target AS target',
          'COUNT(DISTINCT likedUser.no) AS likeCount',
          `EXISTS(SELECT no FROM board_likes WHERE board_likes.likedUserNo = ${userNo} AND board_likes.likedBoardNo = ${boardNo}) AS isLike`,
          'areas.no AS areaNo',
          'areas.name AS areaName',
          'categories.no AS categoryNo',
          'categories.name AS categoryName',
          'profilePhoto.photo_url AS userPhotoUrl',
          'users.no AS userNo',
          'users.nickname AS nickname',
          'major.name AS majorName',
        ])
        .where('boards.no = :no', { no: boardNo })
        .getRawOne();
    } catch (err) {
      throw new InternalServerErrorException(
        `${err} ### 게시판 상세 조회(회원) : 알 수 없는 서버 에러입니다.`,
      );
    }
  }

  async readOneBoardByUnAuth(boardNo: number): Promise<any> {
    try {
      return await this.createQueryBuilder('boards')
        .leftJoin('boards.area', 'areas', 'areas.no = boards.area')
        .leftJoin(
          'boards.category',
          'categories',
          'categories.no = boards.category',
        )
        .leftJoin('boards.user', 'users')
        .leftJoin('boards.photos', 'photo')
        .leftJoin('users.major', 'major')
        .leftJoin(
          'boards.likedUser',
          'likedUser',
          'likedUser.likedBoardNo = :boardNo',
          { boardNo },
        )
        .leftJoin('users.profilePhoto', 'profilePhoto')
        .select([
          'boards.no AS no',
          'REPLACE(GROUP_CONCAT(photo.photo_url), ",", ", ") AS boardPhotoUrls',
          'DATEDIFF(boards.deadline, now()) * -1 AS decimalDay',
          'boards.title AS title',
          'boards.isDeadline AS isDeadline',
          'boards.hit AS hit',
          'boards.price AS price',
          'boards.summary AS summary',
          'boards.target AS target',
          'COUNT(likedUser.no) AS likeCount',
          'areas.no AS areaNo',
          'areas.name AS areaName',
          'categories.no AS categoryNo',
          'categories.name AS categoryName',
          'profilePhoto.photo_url AS userPhotoUrl',
          'users.no AS userNo',
          'users.nickname AS nickname',
          'major.name AS majorName',
        ])
        .where('boards.no = :no', { no: boardNo })
        .getRawOne();
    } catch (err) {
      throw new InternalServerErrorException(
        `${err} ### 게시판 상세 조회(비회원) : 알 수 없는 서버 에러입니다.`,
      );
    }
  }

  async cancelClosedBoard(boardNo: number): Promise<number> {
    try {
      const { affected }: UpdateResult = await this.createQueryBuilder()
        .update(Board)
        .set({ isDeadline: false })
        .where('no = :no', { no: boardNo })
        .execute();

      return affected;
    } catch (e) {
      throw new InternalServerErrorException(
        `${e} ### 게시판 활성화 : 알 수 없는 서버 에러입니다.`,
      );
    }
  }

  async boardClosed(boardNo: number): Promise<number> {
    try {
      const { affected }: UpdateResult = await this.createQueryBuilder()
        .update(Board)
        .set({ isDeadline: true })
        .where('no = :no', { no: boardNo })
        .execute();

      return affected;
    } catch (e) {
      throw new InternalServerErrorException(
        `${e} ### 게시판 비활성화 : 알 수 없는 서버 에러입니다.`,
      );
    }
  }

  async closingBoard(): Promise<number> {
    try {
      const { affected }: UpdateResult = await this.createQueryBuilder()
        .update(Board)
        .set({ isDeadline: true })
        .where(`deadline is not null`)
        .andWhere('deadline <= now()')
        .andWhere('isDeadline = false')
        .execute();

      return affected;
    } catch (e) {
      throw new InternalServerErrorException(
        `${e} ### 게시판 마감 처리 : 알 수 없는 서버 에러입니다.`,
      );
    }
  }

  async searchAllBoards({
    title,
    take,
    page,
  }: SearchBoardDto): Promise<Board[]> {
    try {
      const boards: Board[] = await this.createQueryBuilder('boards')
        .leftJoin('boards.area', 'areas')
        .leftJoin('boards.user', 'users')
        .leftJoin('boards.photos', 'photo')
        .select([
          'boards.no AS no',
          'photo.photo_url AS photoUrl',
          'DATEDIFF(boards.deadline, now()) * -1 AS decimalDay',
          'boards.title AS title',
          'boards.isDeadline AS isDeadline',
          'boards.price AS price',
          'boards.target AS target',
          'areas.no AS areaNo',
          'areas.name AS areaName',
          'users.nickname AS nickname',
        ])
        .where('boards.title like :title', { title: `%${title}%` })
        .orderBy('boards.no', 'DESC')
        .groupBy('boards.no')
        .addGroupBy('boards.no = photo.no')
        .limit(+take)
        .offset((+page - 1) * +take)
        .getRawMany();

      return boards;
    } catch (e) {
      throw new InternalServerErrorException(
        `${e} ### 게시글 검색 : 알 수 없는 서버 에러입니다.`,
      );
    }
  }

  async filteredBoards(
    duplicateCheck: any,
    date: number,
    endTime: Date,
    currentTime: Date,
  ): Promise<Board[]> {
    try {
      const {
        sort,
        categoryNo,
        title,
        areaNo,
        max,
        min,
        target,
        free,
        popular,
        page,
        take,
      } = duplicateCheck;
      const boardFiltering: SelectQueryBuilder<Board> = this.createQueryBuilder(
        'boards',
      )
        .leftJoin('boards.area', 'areas')
        .leftJoin('boards.category', 'categories')
        .leftJoin('boards.user', 'users')
        .leftJoin('boards.photos', 'photo')
        .select([
          'boards.no AS no',
          'photo.photo_url AS photoUrl',
          'DATEDIFF(boards.deadline, now()) * -1 AS decimalDay',
          'boards.title AS title',
          'boards.isDeadline AS isDeadline',
          'boards.price AS price',
          'boards.target AS target',
          'areas.no AS areaNo',
          'areas.name AS areaName',
          'users.nickname AS nickname',
        ])
        .orderBy('boards.no', sort)
        .groupBy('boards.no')
        .limit(+take)
        .offset((+page - 1) * +take);

      if (+categoryNo > 1) {
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
      if (date === 0) {
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

  async getAllBoards({ take, page }: PaginationDto): Promise<Board[]> {
    try {
      return await this.createQueryBuilder('boards')
        .leftJoin('boards.area', 'area')
        .leftJoin('boards.category', 'category')
        .leftJoin('boards.user', 'user')
        .leftJoin('boards.photos', 'photo')
        .select([
          'DATEDIFF(boards.deadline, now()) * -1 AS decimalDay',
          'photo.photo_url AS photoUrl',
          'boards.no AS no',
          'boards.title AS title',
          'boards.isDeadline AS isDeadline',
          'boards.price AS price',
          'boards.target AS target',
          'area.no AS areaNo',
          'area.name AS areaName',
          'user.nickname AS nickname',
        ])
        .where('boards.area = area.no')
        .andWhere('boards.category = category.no')
        .groupBy('boards.no')
        .orderBy('boards.no', 'DESC')
        .limit(+take)
        .offset((+page - 1) * +take)
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
    createBoardDto: any,
    endTime: Date,
  ): Promise<boardInfo> {
    try {
      const { price, title, description, summary, target } = createBoardDto;

      const board: InsertResult = await this.createQueryBuilder('boards')
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
            deadline: endTime,
          },
        ])
        .execute();

      return board.raw;
    } catch (err) {
      throw new InternalServerErrorException(
        `${err} ### 게시판 생성: 알 수 없는 서버 에러입니다.`,
      );
    }
  }

  async updateBoard(
    boardNo: number,
    deletedNullBoardKey: object,
  ): Promise<number> {
    try {
      const { affected }: UpdateResult = await this.createQueryBuilder()
        .update(Board)
        .set(deletedNullBoardKey)
        .where('no = :no', { no: boardNo })
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

  async saveCategory(categoryNo: number, boardNo: number) {
    try {
      await this.createQueryBuilder()
        .relation(Category, 'boards')
        .of(categoryNo)
        .add(boardNo);
    } catch (err) {
      throw new InternalServerErrorException(
        `${err} ### 카테고리 릴레이션: 릴레이션 관계 지정 서버 에러입니다.`,
      );
    }
  }

  async readHotBoards(
    select: number,
    year: number,
    month: number,
  ): Promise<Board[]> {
    try {
      const hotBoards: SelectQueryBuilder<Board> = this.createQueryBuilder(
        'boards',
      )
        .leftJoin('boards.area', 'areas')
        .leftJoin('boards.user', 'users')
        .leftJoin('boards.photos', 'photo')
        .leftJoin('boards.likedUser', 'likedUsers')
        .select([
          'boards.no AS no',
          'DATEDIFF(boards.deadline, now()) * -1 AS decimalDay',
          'photo.photo_url AS photoUrl',
          'boards.title AS title',
          'boards.isDeadline AS isDeadline',
          'boards.price AS price',
          'boards.target AS target',
          'areas.name AS areaName',
          'users.nickname AS nickname',
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
      const filteredHotBoards: Board[] = await hotBoards.getRawMany();

      return filteredHotBoards;
    } catch (err) {
      `${err} ### 인기 게시판 조회 : 알 수 없는 서버 에러입니다.`;
    }
  }

  async replaceReadHotBoards(select: number): Promise<Board[]> {
    try {
      const hotBoards: SelectQueryBuilder<Board> = this.createQueryBuilder(
        'boards',
      )
        .leftJoin('boards.area', 'areas')
        .leftJoin('boards.user', 'users')
        .leftJoin('boards.photos', 'photo')
        .leftJoin('boards.likedUser', 'likedUsers')
        .select([
          'boards.no AS no',
          'DATEDIFF(boards.deadline, now()) * -1 AS decimalDay',
          'photo.photo_url AS photoUrl',
          'boards.title AS title',
          'boards.isDeadline AS isDeadline',
          'boards.price AS price',
          'boards.target AS target',
          'areas.name AS areaName',
          'users.nickname AS nickname',
        ])
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
      const filteredHotBoards: Board[] = await hotBoards.getRawMany();

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
          'boards.no AS no',
          'boards.title AS title',
          'boards.description AS description',
          'boardPhotos.photo_url AS photoUrl',
          'boards.target AS target',
          'user.no AS userNo',
        ])
        .where('user.no = :userNo', { userNo })
        .andWhere('boards.target = :target', { target })
        .limit(take)
        .offset((page - 1) * take)
        .groupBy('boards.no')
        .getRawMany();

      return boards;
    } catch (err) {
      throw new InternalServerErrorException(
        `${err}####게시글 전체 조회 관련 서버 에러입니다`,
      );
    }
  }

  async boardRelation(no: any, value: any, relation: string): Promise<void> {
    try {
      await this.createQueryBuilder()
        .relation(Board, relation)
        .of(no)
        .add(value);
    } catch (err) {
      throw new InternalServerErrorException(
        `${err} 게시글 관계형성 도중 생긴 오류`,
      );
    }
  }

  async findOneCategory(
    no: number,
    { page, take }: PaginationDto,
  ): Promise<Board[] | Board> {
    try {
      const findedinCategoryBoard: Board[] | Board =
        await this.createQueryBuilder('boards')
          .leftJoin('boards.category', 'category')
          .leftJoin('boards.area', 'area')
          .leftJoin('boards.user', 'user')
          .leftJoin('boards.photos', 'photo')
          .select([
            'DATEDIFF(boards.deadline, now()) * -1 AS decimalDay',
            'photo.photo_Url AS photoUrl',
            'boards.no AS no',
            'boards.title AS title',
            'boards.isDeadline AS isDeadline',
            'boards.price AS price',
            'boards.target AS target',
            'area.no AS areaNo',
            'area.name AS areaName',
            'user.nickname AS nickname',
          ])
          .groupBy('boards.no')
          .orderBy('boards.no', 'DESC')
          .limit(+take)
          .offset((+page - 1) * +take)
          .where('boards.category = :no', { no })
          .getRawMany();

      return findedinCategoryBoard;
    } catch (err) {
      throw new InternalServerErrorException(
        `${err}, ### 카테고리 선택조회 관련 서버에러`,
      );
    }
  }
}
