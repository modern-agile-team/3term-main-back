import { Area } from 'src/areas/entity/areas.entity';
import { Category } from 'src/categories/entity/category.entity';
import { Major } from 'src/majors/entity/major.entity';
import { School } from 'src/schools/entity/school.entity';
import { Connection } from 'typeorm';
import { Factory, Seeder } from 'typeorm-seeding';
import { areaDefaultData } from './area-default-data';
import { categoryDefaultData } from './category-default-data';
import { majorDefaultData } from './major-default-data';
import { schoolDefaultData } from './school-default-data';

export class CreateInitialData implements Seeder {
  public async run(factory: Factory, connection: Connection): Promise<any> {
    await connection
      .createQueryBuilder()
      .insert()
      .into(Category)
      .values(categoryDefaultData)
      .execute();

    await connection
      .createQueryBuilder()
      .insert()
      .into(Major)
      .values(majorDefaultData)
      .execute();

    await connection
      .createQueryBuilder()
      .insert()
      .into(School)
      .values(schoolDefaultData)
      .execute();

    await connection
      .createQueryBuilder()
      .insert()
      .into(Area)
      .values(areaDefaultData)
      .execute();
  }
}
