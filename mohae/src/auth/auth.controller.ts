import {
  Body,
  Controller,
  ForbiddenException,
  Headers,
  HttpCode,
  Inject,
  Patch,
  Post,
  UseGuards,
} from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { Cron } from '@nestjs/schedule';
import { User } from './entity/user.entity';
import { AuthService } from './auth.service';
import { SignUpDto } from './dto/sign-up.dto';
import { SignDownDto } from './dto/sign-down.dto';
import { SignInDto } from './dto/sign-in.dto';
import { ForgetPasswordDto } from './dto/forget-password.dto';
import { ChangePasswordDto } from './dto/change-password.dto';
import { CurrentUser } from 'src/common/decorators/current-user.decorator';
import { HTTP_STATUS_CODE } from 'src/common/configs/http-status.config';
import { WinstonLogger, WINSTON_MODULE_PROVIDER } from 'nest-winston';
import {
  ApiBadGatewayResponse,
  ApiBadRequestResponse,
  ApiBearerAuth,
  ApiConflictResponse,
  ApiCreatedResponse,
  ApiForbiddenResponse,
  ApiInternalServerErrorResponse,
  ApiNotFoundResponse,
  ApiOkResponse,
  ApiOperation,
  ApiTags,
  ApiUnauthorizedResponse,
} from '@nestjs/swagger';
import { operationConfig } from 'src/common/swagger-apis/api-operation.swagger';
import { authSwagger } from './auth.swagger';
import { JwtRefreshStrategy } from './jwt/jwt-refresh.strategy';

@Controller('auth')
@ApiTags('Auth')
export class AuthController {
  constructor(
    @Inject(WINSTON_MODULE_PROVIDER)
    private readonly logger: WinstonLogger,
    private readonly authService: AuthService,
  ) {}

  @Cron('0 0 0 * * *')
  async handleHardDeleteUserSchedule(): Promise<void> {
    const hardDeletedUserNum: number = await this.authService.hardDeleteUser();

    this.logger.verbose(`hard delete 된 회원 수 :${hardDeletedUserNum}`);
  }

  @ApiOperation(operationConfig('회원가입 API', '회원가입을 할때 사용되는 api'))
  @ApiCreatedResponse(authSwagger.signUp.success)
  @ApiNotFoundResponse(authSwagger.signUp.notFoundResponse)
  @ApiConflictResponse(authSwagger.signUp.confilctResponse)
  @ApiInternalServerErrorResponse(authSwagger.internalServerErrorResponse)
  @ApiBadGatewayResponse(authSwagger.signUp.badGatewayResponse)
  @HttpCode(HTTP_STATUS_CODE.success.created)
  @Post('signup')
  async signUp(@Body() signUpDto: SignUpDto): Promise<object> {
    try {
      const response: Record<string, string> = await this.authService.signUp(
        signUpDto,
      );

      return {
        msg: `성공적으로 회원가입이 되었습니다.`,
        response,
      };
    } catch (err) {
      throw err;
    }
  }

  @ApiOperation(operationConfig('로그인 API', '로그인 기능을 하는 api입니다.'))
  @ApiOkResponse(authSwagger.signIn.success)
  @ApiUnauthorizedResponse(authSwagger.signIn.unauthorizedResponse)
  @ApiNotFoundResponse(authSwagger.signIn.notFoundResponse)
  @ApiInternalServerErrorResponse(authSwagger.internalServerErrorResponse)
  @HttpCode(HTTP_STATUS_CODE.success.ok)
  @Post('signin')
  async signIn(@Body() signInDto: SignInDto): Promise<object> {
    try {
      // id 맞는지 확인 + 패널티 시간 지나지 않았을 때 로그인 시도했을 때 알림
      const userInfo: User = await this.authService.confirmUser(signInDto);
      // 성공했을 때 + 비밀번호 틀렸을 때
      await this.authService.passwordConfirm(userInfo, signInDto.password);
      const token = await this.authService.createJwtToken(userInfo);

      return {
        msg: `성공적으로 로그인이 되었습니다.`,
        response: token,
      };
    } catch (err) {
      throw err;
    }
  }

  @ApiOperation(
    operationConfig('회원 탈퇴 API', '회원 탈퇴 기능을 하는 api입니다.'),
  )
  @ApiOkResponse(authSwagger.signDown.success)
  @ApiUnauthorizedResponse(authSwagger.signDown.unauthorizedResponse)
  @ApiInternalServerErrorResponse(authSwagger.internalServerErrorResponse)
  @HttpCode(HTTP_STATUS_CODE.success.ok)
  @ApiBearerAuth('access-token')
  @UseGuards(AuthGuard('jwt'))
  @Patch()
  async signDown(
    @Body() { password }: SignDownDto,
    @CurrentUser() user: User,
  ): Promise<object> {
    try {
      await this.authService.signDown(user, password);

      return {
        msg: `성공적으로 회원탈퇴가 진행되었습니다.`,
      };
    } catch (err) {
      throw err;
    }
  }

  @ApiOperation(
    operationConfig(
      '비밀번호 변경 API',
      '비밀번호 변경 기능을 하는 api입니다.',
    ),
  )
  @ApiOkResponse(authSwagger.changePassword.success)
  @ApiBadRequestResponse(authSwagger.changePassword.badRequestResponse)
  @ApiUnauthorizedResponse(authSwagger.changePassword.unauthorizedResponse)
  @ApiConflictResponse(authSwagger.changePassword.confilctResponse)
  @ApiInternalServerErrorResponse(authSwagger.internalServerErrorResponse)
  @HttpCode(HTTP_STATUS_CODE.success.ok)
  @ApiBearerAuth('access-token')
  @UseGuards(AuthGuard('jwt'))
  @Patch('change/password')
  async changePassword(
    @Body() changePasswordDto: ChangePasswordDto,
  ): Promise<object> {
    try {
      await this.authService.changePassword(changePasswordDto);

      return {
        msg: '성공적으로 비밀번호가 변경되었습니다.',
      };
    } catch (err) {
      throw err;
    }
  }

  @ApiOperation(
    operationConfig(
      '비밀번호를 잊어버린뒤 변경할 때 사용되는 API',
      '비밀번호를 잊어버린 유저가 비밀번호를 변경할 때 사용하는 api입니다.',
    ),
  )
  @ApiOkResponse(authSwagger.forgetPassword.success)
  @ApiBadRequestResponse(authSwagger.forgetPassword.badRequestResponse)
  @ApiUnauthorizedResponse(authSwagger.forgetPassword.unauthorizedResponse)
  @ApiForbiddenResponse(authSwagger.forgetPassword.forbiddenResponse)
  @ApiNotFoundResponse(authSwagger.forgetPassword.notFoundResponse)
  @ApiConflictResponse(authSwagger.forgetPassword.confilctResponse)
  @ApiInternalServerErrorResponse(authSwagger.internalServerErrorResponse)
  @HttpCode(HTTP_STATUS_CODE.success.ok)
  @Patch('forget/password')
  async forgetPassword(
    @Headers('key') key: string,
    @Body() forgetPasswordDto: ForgetPasswordDto,
  ): Promise<object> {
    try {
      if (key !== forgetPasswordDto.email)
        throw new ForbiddenException(
          '가입하신 이메일로만 비밀번호 변경이 가능합니다.',
        );
      await this.authService.getTokenCacheData(key);
      await this.authService.forgetPassword(forgetPasswordDto);

      return {
        msg: '성공적으로 비밀번호가 변경되었습니다.',
      };
    } catch (err) {
      throw err;
    }
  }

  @ApiOperation(
    operationConfig(
      '로그아웃 버튼 눌렀을 때 사용되는 API',
      '유저 로그아웃시 사용되는 api입니다.',
    ),
  )
  @ApiOkResponse(authSwagger.signOut.success)
  @HttpCode(HTTP_STATUS_CODE.success.ok)
  @ApiBearerAuth('access-token')
  @UseGuards(AuthGuard('jwt'))
  @UseGuards(AuthGuard('jwt-refresh-token'))
  @Post('signout')
  async signOut(@CurrentUser() user: User) {
    try {
      console.log('첫번째 ', user);
      await this.authService.deleteRefreshToken(user);
      return {
        msg: '성공적으로 로그아웃이 되었습니다.',
      };
    } catch (err) {
      throw err;
    }
  }
}
