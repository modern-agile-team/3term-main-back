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
    private categoryRepository: CategoryRepository,

    private boardRepository: BoardRepository,
  ) {}

  async findAllCategories(): Promise<Category[]> {
    const categories = await this.categoryRepository.findAllCategory();

    return categories;
  }

  async findOneCategory(
    no: number,
    paginationDto: PaginationDto,
  ): Promise<object> {
    try {
      if (no === 17) {
        const boards: Board[] = await this.boardRepository.getAllBoards(
          paginationDto,
        );

        return {
          categoryName: '전체 게시판',
          category: { boards },
        };
      }
      const category: object = await this.categoryRepository.findOneCategory(
        no,
        paginationDto,
      );

      if (!category) {
        throw new NotFoundException(
          `${no}에 해당하는 카테고리를 찾을 수 없습니다.`,
        );
      }

      return {
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
