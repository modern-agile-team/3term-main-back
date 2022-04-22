import { Board } from 'src/boards/entity/board.entity';
import { EntityRepository, Repository } from 'typeorm';
import { Area } from '../entity/areas.entity';

@EntityRepository(Area)
export class AreasRepository extends Repository<Area> {
  async findOneArea(no: number) {
    const area = await this.createQueryBuilder('areas')
      .relation(Board, 'area')
      .of(no)
      .loadMany();

    return area;
  }
}
