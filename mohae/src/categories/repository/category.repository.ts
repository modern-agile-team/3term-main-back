import { InternalServerErrorException } from '@nestjs/common';
import { ConstraintMetadata } from 'class-validator/types/metadata/ConstraintMetadata';
import { filter } from 'rxjs';
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

      filterdCategory.forEach(async (item) => {
        const oneCategory = await this.findOne(item.no, {
          relations: ['users'],
        });
        oneCategory.users.push(user);
        this.save(oneCategory);
      });
    } catch (e) {
      throw e;
    }
  }
}
