import { Controller } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';

@Controller('majors')
@ApiTags('Majors')
export class MajorsController {}
