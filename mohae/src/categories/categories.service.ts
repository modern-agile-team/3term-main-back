import {
  Injectable,
  InternalServerErrorException,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Category } from './entity/category.entity';
import { CategoryRepository } from './repository/category.repository';

@Injectable()
export class CategoriesService {
  constructor(
    @InjectRepository(CategoryRepository)
    private categoryRepository: CategoryRepository,
  ) {}

  async findAllCategories(): Promise<Category[]> {
    const categories = await this.categoryRepository.findAllCategory();

    return categories;
  }

  async findOneCategory(no: number): Promise<Category> {
    const category = await this.categoryRepository.findOneCategory(no);

    if (!category) {
      throw new NotFoundException(
        `${no}에 해당하는 카테고리를 찾을 수 없습니다.`,
      );
    }

    const affected = await this.categoryRepository.addCategoryHit(no, category);

    if (!affected) {
      throw new InternalServerErrorException(
        '카테고리 조회 수 증가가 되지 않았습니다',
      );
    }

    return category;
  }

  async readHotCategories(): Promise<Object> {
    const categories = await this.categoryRepository.readHotCategories();

    if (!categories.length) {
      return {
        msg: '이번달 인기 카테고리가 없습니다.',
      };
    }

    return categories;
  }

  async resetCategoryHit() {
    const result = await this.categoryRepository.resetCategoryHit();

    if (!result.success) {
      throw new InternalServerErrorException(
        '카테고리 조회 수 초기화가 되지 않았습니다',
      );
    }

    return result;
  }
}
