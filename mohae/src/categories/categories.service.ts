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

  async findOneCategory(
    no: number,
    paginationDto: PaginationDto,
  ): Promise<object> {
    try {
      const category: Category = await this.categoryRepository.findOne(no);

      if (!category) {
        throw new NotFoundException(
          `${no}번에 해당하는 카테고리를 찾을 수 없습니다.`,
        );
      }
      if (no === 1) {
        const boards: Board[] = await this.boardRepository.getAllBoards(
          paginationDto,
        );

        return {
          categoryName: `${category.name} 게시판`,
          boards: boards,
        };
      }
      const boards: any = await this.categoryRepository.findOneCategory(
        no,
        paginationDto,
      );

      return {
        categoryName: `${category.name} 게시판`,
        boards: boards,
      };
    } catch (err) {
      throw err;
    }
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
