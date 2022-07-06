import {
  Injectable,
  InternalServerErrorException,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { PaginationDto } from 'src/boards/dto/pagination.dto';
import { Board } from 'src/boards/entity/board.entity';
import { BoardRepository } from 'src/boards/repository/board.repository';
import { Category } from './entity/category.entity';
import { CategoryRepository } from './repository/category.repository';

@Injectable()
export class CategoriesService {
  constructor(
    @InjectRepository(CategoryRepository)
    private readonly categoryRepository: CategoryRepository,

    private readonly boardRepository: BoardRepository,
  ) {}

  async findAllCategories(): Promise<Category[]> {
    const categories = await this.categoryRepository.findAllCategory();

    return categories;
  }

  async readHotCategories(): Promise<Category[]> {
    try {
      const categories: Category[] =
        await this.categoryRepository.readHotCategories();

      return categories;
    } catch (err) {
      throw err;
    }
  }
}
