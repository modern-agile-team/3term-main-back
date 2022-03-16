import { Controller } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';

@Controller('schools')
@ApiTags('Schools')
export class SchoolsController {}
