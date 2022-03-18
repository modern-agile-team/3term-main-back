import {
  Body,
  Controller,
  Delete,
  Param,
  ParseIntPipe,
  ParseUUIDPipe,
  Post,
  Req,
  UseGuards,
  ValidationPipe,
} from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { ApiTags } from '@nestjs/swagger';
import { School } from 'src/schools/entity/school.entity';
import { DeleteResult } from 'typeorm';
import { AuthService } from './auth.service';
import {
  CreateUserDto,
  SignDownDto,
  SignInDto,
} from './dto/auth-credential.dto';
import { User } from './entity/user.entity';

@Controller('auth')
@ApiTags('Auth')
export class AuthController {
  constructor(private authService: AuthService) {}
  @Post('/signup')
  async signUp(@Body() createUserDto: CreateUserDto): Promise<User> {
    const { nickname, email } = await this.authService.signUp(createUserDto);
    return Object.assign({
      statusCode: 201,
      msg: `성공적으로 회원가입이 되었습니다.`,
      nickname,
      email,
    });
  }

  @Post('/signin')
  async signIn(@Body() signInDto: SignInDto): Promise<{ accessToken: string }> {
    const response = await this.authService.signIn(signInDto);

    return Object.assign({
      statusCode: 200,
      msg: `성공적으로 로그인이 되었습니다.`,
      token: response.accessToken,
    });
  }

  @Delete('/:no')
  async signDown(@Param('no') no: number): Promise<DeleteResult> {
    const response = await this.authService.signDown(no);
    return Object.assign({
      statusCode: 204,
      mas: `성공적으로 회원탈퇴가 진행되었습니다.`,
      response,
    });
  }

  @Post('/authtest')
  @UseGuards(AuthGuard())
  authTest(@Req() req) {
    console.log(req);
  }
}
