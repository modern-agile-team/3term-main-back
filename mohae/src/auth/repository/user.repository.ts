import { EntityRepository, Repository } from 'typeorm';
import { CreateUserDto } from '../dto/auth-credential.dto';
import { User } from '../entity/user.entity';
import * as bcrypt from 'bcryptjs';
import { ConflictException } from '@nestjs/common';

@EntityRepository(User)
export class UserRepository extends Repository<User> {
  async createUser(createUserDto: CreateUserDto): Promise<User> {
    const {
      email,
      password,
      phone,
      nickname,
      school,
      major,
      manager,
      name,
      photo_url,
    } = createUserDto;
    const salt = await bcrypt.genSalt();
    const hashedPassword = await bcrypt.hash(password, salt);
    const user = this.create({
      email,
      salt: hashedPassword,
      name,
      phone,
      nickname,
      manager,
      photo_url,
      major,
    });

    try {
      await user.save();
      return user;
    } catch (e) {
      if (e.errno === 1062) {
        throw new ConflictException(
          '해당 닉네임 또는 이메일이 이미 존재합니다.',
        );
      }
    }
  }
}
//   async createSchool(
//     no: number,
//     createUserDto: CreateUserDto,
//   ): Promise<School> {
//     const school = await this.schoolRepository.findOne(no, {
//       // school 테이블의 no에 해당하는 녀석에 users 테이블을 붙일 것임
//       relations: ['users'],
//     });

//     if (!school) {
//       throw new NotFoundException(`No: ${no} 해당 학교는 존재하지 않습니다.`);
//     } else {
//       const user = await this.userRepository.findOne()

//       school.users.push(user);

//       await this.schoolRepository.save(school);
//       return user;
//     }
//   }
// }
