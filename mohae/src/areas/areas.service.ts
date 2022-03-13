import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Areas } from './entity/areas.entity';
import { AreasRepository } from './repository/area.repository';

@Injectable()
export class AreasService {
  constructor(
    @InjectRepository(AreasRepository)
    private areasRepository: AreasRepository,
  ) {}

  async getAllAreas(): Promise<Areas[]> {
    return this.areasRepository.find();
  }
}
