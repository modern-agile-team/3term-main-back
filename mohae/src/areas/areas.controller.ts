import { Controller, Get } from '@nestjs/common';
import { AreasService } from './areas.service';
import { Area } from './entity/areas.entity';

@Controller('areas')
export class AreasController {
  constructor(private areasService: AreasService) {}

  @Get()
  getAllAreas(): Promise<Area[]> {
    return this.areasService.getAllAreas();
  }
}
