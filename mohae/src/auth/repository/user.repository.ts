import { EntityRepository, Repository } from 'typeorm';
import { CreateUserDto } from '../dto/auth-credential.dto';
import { User } from '../entity/user.entity';
import * as bcrypt from 'bcryptjs';

@EntityRepository(User)
export class UserRepository extends Repository<User> {
  async createUser(createUserDto: CreateUserDto): Promise<void> {
    const {
      email,
      password,
      phone,
      nickname,
      // school,
      // major,
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
      // school,
      // major,
    });
    try {
      await this.save(user);
    } catch (error) {
      console.log(error);
    }
  }
}
