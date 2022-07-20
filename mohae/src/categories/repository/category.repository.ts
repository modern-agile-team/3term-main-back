import { InternalServerErrorException } from '@nestjs/common';
import { EntityRepository, Repository } from 'typeorm';
import { Category } from '../entity/category.entity';
import { User } from 'src/auth/entity/user.entity';

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

  async selectCategory(categories: Category[]): Promise<Category[]> {
    try {
      return [
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
    } catch (err) {
      throw new InternalServerErrorException(
        `${err} selectCategory 메소드 관련 서버에러`,
      );
    }
  }

  async addUser(categoryNo: number, user: User): Promise<void> {
    try {
      await this.createQueryBuilder()
        .relation(Category, 'users')
        .of(categoryNo)
        .add(user);
    } catch (err) {
      throw new InternalServerErrorException(`
        ${err} ### 유저 회원 가입도중 카테고리정보 저장 관련 알 수없는 서버에러입니다. `);
    }
  }
  async deleteUser(categoryNo: Category, user: User): Promise<void> {
    try {
      await this.createQueryBuilder()
        .relation(Category, 'users')
        .of(categoryNo)
        .remove(user);
    } catch (err) {
      throw new InternalServerErrorException(
        `${err} 카테고리에 포함된 유저 삭제중 발생한 서버에러`,
      );
    }
  }

  async readHotCategories(): Promise<Category[]> {
    try {
      return await this.createQueryBuilder('categories')
        .leftJoin('categories.boards', 'board')
        .select(['categories.no AS no', 'categories.name AS name'])
        .where('categories.no = board.category')
        .groupBy('categories.no')
        .orderBy('COUNT(board.no)', 'DESC')
        .limit(5)
        .getRawMany();
    } catch (e) {
      throw new InternalServerErrorException(
        `${e} ### 인기 카테고리 조회 : 알 수 없는 서버 에러입니다.`,
      );
    }
  }
}
