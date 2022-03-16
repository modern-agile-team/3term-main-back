import { Controller, Get } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { AreasService } from './areas.service';
import { Area } from './entity/areas.entity';

@Controller('areas')
@ApiTags('Areas')
export class AreasController {
  constructor(private areasService: AreasService) {}

  @Get()
  getAllAreas(): Promise<Area[]> {
    return this.areasService.getAllAreas();
  }
}
