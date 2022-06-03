import {
  Injectable,
  InternalServerErrorException,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Board } from 'src/boards/entity/board.entity';
import { BoardRepository } from 'src/boards/repository/board.repository';
import { Category } from './entity/category.entity';
import { CategoryRepository } from './repository/category.repository';

@Injectable()
export class CategoriesService {
  constructor(
    @InjectRepository(CategoryRepository)
    private categoryRepository: CategoryRepository,

    private boardRepository: BoardRepository,
  ) {}

  async findAllCategories(): Promise<Category[]> {
    const categories = await this.categoryRepository.findAllCategory();

    return categories;
  }

  async findOneCategory(no: number): Promise<object> {
    try {
      if (no === 1) {
        const boards: Board[] = await this.boardRepository.getAllBoards();

        return { boardNum: boards.length, categoryName: '전체 게시판', boards };
      }
      const category: object = await this.categoryRepository.findOneCategory(
        no,
      );

      if (!category) {
        throw new NotFoundException(
          `${no}에 해당하는 카테고리를 찾을 수 없습니다.`,
        );
      }

      return {
        boardNum: category['boards'].length,
        categoryName: `${category['categoryName']} 게시판`,
        category,
      };
    } catch (err) {
      throw err;
    }
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
}
