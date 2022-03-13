import { Controller, Get } from '@nestjs/common';
import { AreasService } from './areas.service';
import { Areas } from './entity/areas.entity';

@Controller('areas')
export class AreasController {
  constructor(private areasService: AreasService) {}

  @Get()
  getAllAreas(): Promise<Areas[]> {
    return this.areasService.getAllAreas();
  }
}
