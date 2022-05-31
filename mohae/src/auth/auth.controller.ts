import {
  Body,
  Controller,
  Delete,
  HttpCode,
  Param,
  Patch,
  Post,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { ApiOkResponse, ApiOperation, ApiTags } from '@nestjs/swagger';
import { SuccesseInterceptor } from 'src/common/interceptors/success.interceptor';
import { AuthService } from './auth.service';
import { ChangePasswordDto } from './dto/change-password.dto';
import { SignUpDto } from './dto/sign-up.dto';
import { ForgetPasswordDto } from './dto/forget-password.dto';
import { SignInDto } from './dto/sign-in.dto';

import { User } from './entity/user.entity';

@Controller('auth')
@UseInterceptors(SuccesseInterceptor)
@ApiTags('Auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('/signup')
  @HttpCode(201)
  @ApiOperation({
    summary: '회원가입 API',
    description: '회원가입을 할때 사용되는 api',
  })
  @ApiOkResponse({
    description: '회원가입이 성공적으로 이루어진 경우.',
  })
  async signUp(@Body() signUpDto: SignUpDto): Promise<Object> {
    const response = await this.authService.signUp(signUpDto);

    return {
      msg: `성공적으로 회원가입이 되었습니다.`,
      response,
    };
  }

  @Post('/signin')
  @HttpCode(200)
  @ApiOperation({
    summary: '로그인 API',
    description: '로그인 기능을 하는 api입니다.',
  })
  @ApiOkResponse({
    description: '로그인이 성공적으로 이루어진 경우.',
  })
  async signIn(@Body() signInDto: SignInDto): Promise<Object> {
    // id 맞는지 확인 + 패널티 시간 지나지 않았을 때 로그인 시도했을 때 알림
    const userInfo: User = await this.authService.confirmUser(signInDto);
    // 성공했을 때 + 비밀번호 틀렸을 때
    const accessToken: string = await this.authService.passwordConfirm(
      userInfo,
      signInDto.password,
    );

    return {
      msg: `성공적으로 로그인이 되었습니다.`,
      response: accessToken,
    };
  }

  @Delete('/:no')
  @UseGuards(AuthGuard())
  @HttpCode(200)
  @ApiOperation({
    summary: '회원 탈퇴 API',
    description: '회원 탈퇴 기능을 하는 api입니다.',
  })
  @ApiOkResponse({
    description: '회원 탈퇴가 성공적으로 이루어진 경우.',
  })
  async signDown(@Param('no') no: number): Promise<Object> {
    await this.authService.signDown(no);

    return {
      msg: `성공적으로 회원탈퇴가 진행되었습니다.`,
    };
  }

  @Patch('/change/password')
  @UseGuards(AuthGuard())
  @HttpCode(200)
  @ApiOperation({
    summary: '비밀번호 변경 API',
    description: '비밀번호 변경 기능을 하는 api입니다.',
  })
  @ApiOkResponse({
    description: '비밀번호 변경이 성공적으로 이루어진 경우.',
  })
  async changePassword(
    @Body() changePasswordDto: ChangePasswordDto,
  ): Promise<Object> {
    await this.authService.changePassword(changePasswordDto);

    return {
      msg: '성공적으로 비밀번호가 변경되었습니다.',
    };
  }

  @Patch('/forget/password')
  @HttpCode(200)
  @ApiOperation({
    summary: '비밀번호를 잊어버린뒤 변경할 때 사용되는 API',
    description:
      '비밀번호를 잊어버린 유저가 비밀번호를 변경할 때 사용하는 api입니다.',
  })
  @ApiOkResponse({
    description: '비밀번호 변경이 성공적으로 이루어진 경우.',
  })
  async forgetPassword(
    @Body() forgetPasswordDto: ForgetPasswordDto,
  ): Promise<Object> {
    await this.authService.forgetPassword(forgetPasswordDto);

    return {
      msg: '성공적으로 비밀번호가 변경되었습니다.',
    };
  }
}
