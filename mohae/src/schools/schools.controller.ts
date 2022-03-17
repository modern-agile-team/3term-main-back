import { Controller, Get, Param } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { throws } from 'assert';
import { AuthService } from 'src/auth/auth.service';
import { User } from 'src/auth/entity/user.entity';
import { FindRelationsNotFoundError } from 'typeorm';
import { School } from './entity/school.entity';
import { SchoolsService } from './schools.service';

@Controller('schools')
@ApiTags('Schools')
export class SchoolsController {
  constructor(private schoolService: SchoolsService) {}
}
