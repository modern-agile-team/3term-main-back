import {
  Injectable,
  InternalServerErrorException,
  UnauthorizedException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { UserRepository } from 'src/auth/repository/user.repository';
import { SpecRepository } from './repository/spec.repository';

@Injectable()
export class SpecsService {
  constructor(
    @InjectRepository(SpecRepository)
    private specRepository: SpecRepository,
    private userRepository: UserRepository,
  ) {}
  async getAllSpec(no) {
    try {
      const specs = await this.specRepository.getAllSpec(no);

      return specs;
    } catch (err) {
      throw err;
    }
  }

  async registSpec(createSpecDto) {
    try {
      const { title, description, photo_url, userNo } = createSpecDto;
      const user = await this.userRepository.findOne(userNo, {
        relations: ['specs'],
      });
      if (user) {
        const specNo = await this.specRepository.registSpec(
          title,
          description,
          photo_url,
          user,
        );
        const spec = await this.specRepository.findOne(specNo[0].no);
        if (spec) {
          user.specs.push(spec);
        }
        return new InternalServerErrorException(
          '스펙등록 중 발생한 서버에러입니다.',
        );
      }
      return new UnauthorizedException(
        `${userNo}에 해당하는 유저가 존재하지 않습니다.`,
      );
    } catch (err) {
      throw err;
    }
  }
}
