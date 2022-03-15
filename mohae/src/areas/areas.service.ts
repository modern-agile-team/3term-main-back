import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Area } from './entity/areas.entity';
import { AreasRepository } from './repository/area.repository';

@Injectable()
export class AreasService {
  constructor(
    @InjectRepository(AreasRepository)
    private areasRepository: AreasRepository,
  ) {}

  async getAllAreas(): Promise<Area[]> {
    return this.areasRepository.find();
  }
}
