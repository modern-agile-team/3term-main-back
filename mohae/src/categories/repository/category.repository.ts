import { InternalServerErrorException } from '@nestjs/common';
import { EntityRepository, Repository } from 'typeorm';
import { Category } from '../entity/category.entity';

@EntityRepository(Category)
export class CategoryRepository extends Repository<Category> {
  async findAllCategory(): Promise<Category[]> {
    try {
      const categories = await this.createQueryBuilder('categories')
        .leftJoinAndSelect('categories.boards', 'boards')
        .where('categories.no = boards.category')
        .getMany();
      return categories;
    } catch (e) {
      throw new InternalServerErrorException(e);
    }
  }

  async findOneCategory(no: number): Promise<Category> {
    try {
      const category = await this.createQueryBuilder('categories')
        .leftJoinAndSelect('categories.boards', 'boards')
        .leftJoinAndSelect('categories.users', 'users')
        .select([
          'categories.no',
          'categories.hit',
          'categories.name',
          'boards.no',
          'boards.title',
          'boards.description',
          'users.no',
          'users.email',
          'users.nickname',
        ])
        .where('categories.no = :no', { no })
        .getOne();

      return category;
    } catch (e) {
      throw new InternalServerErrorException(e);
    }
  }
  async selectCategory(categories: Array<number>) {
    const categoryInfo = [
      await this.createQueryBuilder('categories')
        .select()
        .where('categories.no = :no', { no: categories[0] })
        .getOne(),
      await this.createQueryBuilder('categories')
        .select()
        .where('categories.no = :no', { no: categories[1] })
        .getOne(),
      await this.createQueryBuilder('categories')
        .select()
        .where('categories.no = :no', { no: categories[2] })
        .getOne(),
    ];
    return categoryInfo;
  }
  async saveUsers(categories, user) {
    try {
      const filterdCategory = categories.filter(
        (category) => category !== undefined,
      );

      for (const category of filterdCategory) {
        const saveUser = await this.findOne(category.no, {
          relations: ['users'],
        });
        saveUser.users.push(user);
        this.save(saveUser);
      }
    } catch (e) {
      throw e;
    }
  }

  async addCategoryHit(no: number, { hit }) {
    try {
      const qb = await this.createQueryBuilder()
        .update(Category)
        .set({ hit: hit + 1 })
        .where('no = :no', { no })
        .execute();

      if (!qb.affected) {
        return { success: false };
      }

      return { success: true };
    } catch (e) {
      throw new InternalServerErrorException(
        `${e} ### 카테고리 조회수 증가 : 알 수 없는 서버 에러입니다.`,
      );
    }
  }

  async readHotCategories(): Promise<Category[]> {
    try {
      return await this.createQueryBuilder('categories')
        .select(['categories.no', 'categories.name'])
        .orderBy('categories.hit', 'DESC')
        .where('categories.hit > 0')
        .limit(3)
        .getMany();
    } catch (e) {
      throw new InternalServerErrorException(
        `${e} ### 인기 카테고리 조회 : 알 수 없는 서버 에러입니다.`,
      );
    }
  }

  async resetCategoryHit() {
    try {
      const { affected } = await this.createQueryBuilder()
        .update(Category)
        .set({ hit: 0 })
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
}
