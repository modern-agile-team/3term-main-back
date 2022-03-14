import { EntityRepository, Repository } from 'typeorm';
import { CreateUserDto } from '../dto/auth-credential.dto';
import { Users } from '../entity/user.entity';
import * as bcrypt from 'bcryptjs';

@EntityRepository(Users)
export class UserRepository extends Repository<Users> {
  async createUser(createUserDto: CreateUserDto): Promise<void> {
    const {
      email,
      password,
      school_no,
      major_no,
      phone,
      nickname,
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
      school_no,
      major_no,
      phone,
      nickname,
      manager,
      photo_url,
    });
    try {
      await this.save(user);
    } catch (error) {
      console.log(error);
    }
  }
}
