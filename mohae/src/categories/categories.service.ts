import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Category } from './entity/category.entity';
import { CategoryRepository } from './repository/category.repository';

@Injectable()
export class CategoriesService {
  constructor(
    @InjectRepository(CategoryRepository)
    private categoryRepository: CategoryRepository,
  ) {}

  findAllCategories(): Promise<Category[]> {
    return this.categoryRepository.find();
  }
}
