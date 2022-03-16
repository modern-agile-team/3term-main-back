import { EntityRepository, Repository } from 'typeorm';
import { CreateUserDto } from '../dto/auth-credential.dto';
import { User } from '../entity/user.entity';
import * as bcrypt from 'bcryptjs';
import { Duplex } from 'stream';
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
      school,
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
