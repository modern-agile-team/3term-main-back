import {
  Body,
  Controller,
  Param,
  ParseIntPipe,
  ParseUUIDPipe,
  Post,
  ValidationPipe,
} from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { School } from 'src/schools/entity/school.entity';
import { AuthService } from './auth.service';
import { CreateUserDto, SignInDto } from './dto/auth-credential.dto';
import { User } from './entity/user.entity';

@Controller('auth')
@ApiTags('Auth')
export class AuthController {
  constructor(private authService: AuthService) {}
  @Post('/signup')
  signUp(@Body() createUserDto: CreateUserDto): Promise<User> {
    return this.authService.signUp(createUserDto);
  }
  @Post('/signin')
  async signIn(@Body() signInDto: SignInDto): Promise<{ accessToken: string }> {
    const result = await this.authService.signIn(signInDto);

    return result;
  }
}
