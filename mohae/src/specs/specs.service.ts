import {
  Injectable,
  InternalServerErrorException,
  UnauthorizedException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { UserRepository } from 'src/auth/repository/user.repository';
import { UpdateSpecDto } from './dto/spec.dto';
import { SpecRepository } from './repository/spec.repository';

@Injectable()
export class SpecsService {
  constructor(
    @InjectRepository(SpecRepository)
    private specRepository: SpecRepository,
    private userRepository: UserRepository,
  ) {}
  async getAllSpec(no: number) {
    try {
      const specs = await this.specRepository.getAllSpec(no);

      return specs;
    } catch (err) {
      throw err;
    }
  }

  async registSpec(createSpecDto) {
    try {
      const { userNo } = createSpecDto;
      const user = await this.userRepository.findOne(userNo, {
        relations: ['specs'],
      });
      if (user) {
        const specNo = await this.specRepository.registSpec(
          createSpecDto,
          user,
        );
        // registSpec 해서 가져온 specNO 값은 [{no : 새로 생성된 스팩 고유번호}] 이런식으로 넘어옴.
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

  async updateSpec(specNo, updateSpec) {
    try {
      const isupdate = await this.specRepository.updateSpec(specNo, updateSpec);

      return isupdate;
    } catch (err) {
      throw err;
    }
  }
}
