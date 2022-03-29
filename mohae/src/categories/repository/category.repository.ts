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
        .leftJoinAndSelect('categoreis.users', 'users')
        // .leftJoinAndSelect('users.categories', 'userCategories')
        // .select([
        //   'categories.no',
        //   'categories.name',
        //   'boards.no',
        //   'boards.title',
        //   'boards.description',
        // ])
        .where('categories.no = :no', { no })
        // .andWhere('categories.no = boards.category')
        .getOne();

      return category;
    } catch (e) {
      throw new InternalServerErrorException(e);
    }
  }
}
