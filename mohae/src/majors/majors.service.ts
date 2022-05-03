import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Major } from './entity/major.entity';
import { MajorRepository } from './repository/major.repository';

@Injectable()
export class MajorsService {
  constructor(
    @InjectRepository(MajorRepository)
    private majorRepository: MajorRepository,
  ) {}

  async findOne(no: number) {
    const major = await this.majorRepository.findOneMajor(no);
    return major;
  }
}
