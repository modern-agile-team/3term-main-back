import {
  Body,
  Controller,
  Delete,
  Param,
  Patch,
  Post,
  Req,
  UseGuards,
} from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { ApiTags } from '@nestjs/swagger';
import { DeleteResult } from 'typeorm';
import { AuthService } from './auth.service';
import {
  ChangePasswordDto,
  CreateUserDto,
  ForgetPasswordDto,
  SignInDto,
} from './dto/auth-credential.dto';
import { User } from './entity/user.entity';

@Controller('auth')
@ApiTags('Auth')
export class AuthController {
  constructor(private authService: AuthService) {}

  @Post('/signup')
  async signUp(@Body() createUserDto: CreateUserDto): Promise<User> {
    try {
      const { nickname, email } = await this.authService.signUp(createUserDto);

      return Object.assign({
        statusCode: 201,
        msg: `성공적으로 회원가입이 되었습니다.`,
        nickname,
        email,
      });
    } catch (err) {
      throw err;
    }
  }

  @Post('/signin')
  async signIn(@Body() signInDto: SignInDto): Promise<{ accessToken: string }> {
    try {
      const response = await this.authService.signIn(signInDto);

      return Object.assign({
        statusCode: 200,
        msg: `성공적으로 로그인이 되었습니다.`,
        token: response.accessToken,
      });
    } catch (err) {
      throw err;
    }
  }

  @Delete('/:no')
  async signDown(@Param('no') no: number): Promise<DeleteResult> {
    await this.authService.signDown(no);

    return Object.assign({
      statusCode: 204,
      msg: `성공적으로 회원탈퇴가 진행되었습니다.`,
    });
  }

  @Patch('/change/password')
  @UseGuards(AuthGuard())
  async changePassword(
    @Body() changePasswordDto: ChangePasswordDto,
  ): Promise<void> {
    await this.authService.changePassword(changePasswordDto);

    return Object.assign({
      statusCode: 204,
      msg: '성공적으로 비밀번호가 변경되었습니다.',
    });
  }

  @Patch('/forget/password')
  async forgetPassword(
    @Body() forgetPasswordDto: ForgetPasswordDto,
  ): Promise<void> {
    await this.authService.forgetPassword(forgetPasswordDto);

    return Object.assign({
      statusCode: 204,
      msg: '성공적으로 비밀번호가 변경되었습니다.',
    });
  }

  @Post('/authtest')
  @UseGuards(AuthGuard())
  authTest(@Req() req) {
    console.log(req);
  }
}
