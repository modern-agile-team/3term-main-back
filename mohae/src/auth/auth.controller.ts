import {
  Body,
  Controller,
  Delete,
  HttpCode,
  Param,
  Patch,
  Post,
  UnauthorizedException,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import {
  ApiBadGatewayResponse,
  ApiBadRequestResponse,
  ApiBearerAuth,
  ApiConflictResponse,
  ApiInternalServerErrorResponse,
  ApiNotFoundResponse,
  ApiOkResponse,
  ApiOperation,
  ApiTags,
  ApiUnauthorizedResponse,
} from '@nestjs/swagger';
import { SuccesseInterceptor } from 'src/common/interceptors/success.interceptor';
import { AuthService } from './auth.service';
import { ChangePasswordDto } from './dto/change-password.dto';
import { SignUpDto } from './dto/sign-up.dto';
import { ForgetPasswordDto } from './dto/forget-password.dto';
import { SignInDto } from './dto/sign-in.dto';
import { User } from './entity/user.entity';
import { SignDownDto } from './dto/sign-down.dto';
import { CurrentUser } from 'src/common/decorators/current-user.decorator';
import { HTTP_STATUS_CODE } from 'src/common/configs/http-status.config';

@Controller('auth')
@UseInterceptors(SuccesseInterceptor)
@ApiTags('Auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @ApiOperation({
    summary: '회원가입 API',
    description: '회원가입을 할때 사용되는 api',
  })
  @ApiOkResponse({
    description: '회원가입이 성공적으로 이루어진 경우.',
    schema: {
      example: {
        statusCode: 201,
        msg: '성공적으로 회원가입이 되었습니다.',
      },
    },
  })
  @ApiNotFoundResponse({
    description: '변경하려는 학교(전공)이 DB에 존재하지 않는 학교(전공)인 경우',
    schema: {
      example: {
        statusCode: 404,
        msg: '~에 해당하는 학교(전공)을 찾을 수 없습니다.',
        err: 'Not Found',
      },
    },
  })
  @ApiConflictResponse({
    description: '변경하려는 이메일(닉네임)이 이미 사용되고 있는 경우.',
    schema: {
      example: {
        statusCode: 409,
        msg: '해당 (입력한 이메일,입력한 닉네임)이 이미 존재합니다.',
        err: 'Conflict',
      },
    },
  })
  @ApiInternalServerErrorResponse({
    description: '요청에 대한 응답 처리중 서버에러가 발생한 경우',
    schema: {
      example: {
        statusCode: 500,
        msg: 'DB관련한 에러 메시지 + ~에서 일어난 에러입니다.',
        err: 'InternalServerErrorException',
      },
    },
  })
  @ApiBadGatewayResponse({
    description: 'DB에 유저가 만들어 지는 도중 발생한 서버에러',
    schema: {
      example: {
        statusCode: 502,
        msg: 'Bad Gateway',
        err: 'Bad Gateway',
      },
    },
  })
  @HttpCode(HTTP_STATUS_CODE.success.created)
  @Post('signup')
  async signUp(@Body() signUpDto: SignUpDto): Promise<Object> {
    try {
      const response = await this.authService.signUp(signUpDto);

      return {
        msg: `성공적으로 회원가입이 되었습니다.`,
        response,
      };
    } catch (err) {
      throw err;
    }
  }

  @ApiOperation({
    summary: '로그인 API',
    description: '로그인 기능을 하는 api입니다.',
  })
  @ApiOkResponse({
    description: '로그인이 성공적으로 이루어진 경우.',
    schema: {
      example: {
        statusCode: 200,
        msg: '성공적으로 로그인이 되었습니다.',
      },
    },
  })
  @ApiUnauthorizedResponse({
    description:
      '1.패널티 시간이 지나지 않았는데 로그인을 다시 시도한 경우 2. 아이디가 맞았는데 비밀번호는 틀린경우',
    schema: {
      example: {
        statusCode: 401,
        msg: `1. 아이디 또는 비밀번호가 일치하지 않습니다. 로그인 실패 횟수 (실패 횟수) ,
              2. 로그인 실패 횟수를 모두 초과 하였습니다 (남은시간)초 뒤에 다시 로그인 해주세요. 실패횟수 :(로그인 시도 횟수)`,
        err: 'Unauthorized',
      },
    },
  })
  @ApiNotFoundResponse({
    description:
      '아이디가 틀린 경우 (msg는 보안상 아이디가 틀렸는지 비밀번호가 틀렸는지 안알려주기 위함임)',
    schema: {
      example: {
        statusCode: 404,
        msg: '아이디 또는 비밀번호가 일치하지 않습니다.',
        err: 'Not Found',
      },
    },
  })
  @ApiInternalServerErrorResponse({
    description: '요청에 대한 응답 처리중 서버에러가 발생한 경우',
    schema: {
      example: {
        statusCode: 500,
        msg: 'DB관련한 에러 메시지 + ~에서 일어난 에러입니다.',
        err: 'InternalServerErrorException',
      },
    },
  })
  @HttpCode(HTTP_STATUS_CODE.success.ok)
  @Post('signin')
  async signIn(@Body() signInDto: SignInDto): Promise<Object> {
    try {
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
    } catch (err) {
      throw err;
    }
  }

  @ApiOperation({
    summary: '회원 탈퇴 API',
    description: '회원 탈퇴 기능을 하는 api입니다.',
  })
  @ApiOkResponse({
    description: '회원 탈퇴가 성공적으로 이루어진 경우.',
    schema: {
      example: {
        statusCode: 200,
        msg: '성공적으로 회원탈퇴가 진행되었습니다.',
      },
    },
  })
  @ApiUnauthorizedResponse({
    description: '본인이 다른 사람계정 탈퇴 시키려고 할때 발생하는 오류',
    schema: {
      example: {
        statusCode: 401,
        msg: '1.로그인 한 유저와 탈퇴 하려는 유저 번호 불일치! 2.회원님의 이메일이 일치 하지 않습니다.',
        err: 'Unauthorized',
      },
    },
  })
  @ApiInternalServerErrorResponse({
    description: '요청에 대한 응답 처리중 서버에러가 발생한 경우',
    schema: {
      example: {
        statusCode: 500,
        msg: 'DB관련한 에러 메시지 + ~에서 일어난 에러입니다.',
        err: 'InternalServerErrorException',
      },
    },
  })
  @HttpCode(HTTP_STATUS_CODE.success.ok)
  @ApiBearerAuth('access-token')
  @UseGuards(AuthGuard('jwt'))
  @Delete(':userNo')
  async signDown(
    @Param('userNo') userNo: number,
    @Body() signDownDto: SignDownDto,
    @CurrentUser() user: User,
  ): Promise<Object> {
    try {
      if (userNo === user.no) {
        await this.authService.signDown(userNo, user.email, signDownDto);

        return {
          msg: `성공적으로 회원탈퇴가 진행되었습니다.`,
        };
      }

      throw new UnauthorizedException(
        '로그인 한 유저와 탈퇴 하려는 유저 번호 불일치!',
      );
    } catch (err) {
      throw err;
    }
  }

  @ApiOperation({
    summary: '비밀번호 변경 API',
    description: '비밀번호 변경 기능을 하는 api입니다.',
  })
  @ApiOkResponse({
    description: '비밀번호 변경이 성공적으로 이루어진 경우.',
    schema: {
      example: {
        statusCode: 200,
        msg: '성공적으로 비밀번호가 변경되었습니다.',
      },
    },
  })
  @ApiBadRequestResponse({
    description: '새비밀번호와 새비밀번호 확인이 일치하지 않는 경우',
    schema: {
      example: {
        statusCode: 400,
        msg: '새비밀번호와 새비밀번호 확인이 일치하지 않습니다',
        err: 'Bad Request',
      },
    },
  })
  @ApiUnauthorizedResponse({
    description: '이메일에 해당하는 비밀번호가 맞지 않을 때 ',
    schema: {
      example: {
        statusCode: 401,
        msg: '아이디 또는 비밀번호가 일치하지 않습니다.',
        err: 'Unauthorized',
      },
    },
  })
  @ApiConflictResponse({
    description: '이전 비밀번호로 변경하려고 한 경우',
    schema: {
      example: {
        statusCode: 409,
        msg: '이전의 비밀번호로는 변경하실 수 없습니다.',
        err: 'Conflict',
      },
    },
  })
  @ApiInternalServerErrorResponse({
    description: '요청에 대한 응답 처리중 서버에러가 발생한 경우',
    schema: {
      example: {
        statusCode: 500,
        msg: 'DB관련한 에러 메시지 + ~에서 일어난 에러입니다.',
        err: 'InternalServerErrorException',
      },
    },
  })
  @HttpCode(HTTP_STATUS_CODE.success.ok)
  @ApiBearerAuth('access-token')
  @UseGuards(AuthGuard('jwt'))
  @Patch('change/password')
  async changePassword(
    @Body() changePasswordDto: ChangePasswordDto,
  ): Promise<Object> {
    try {
      await this.authService.changePassword(changePasswordDto);

      return {
        msg: '성공적으로 비밀번호가 변경되었습니다.',
      };
    } catch (err) {
      throw err;
    }
  }

  @ApiOperation({
    summary: '비밀번호를 잊어버린뒤 변경할 때 사용되는 API',
    description:
      '비밀번호를 잊어버린 유저가 비밀번호를 변경할 때 사용하는 api입니다.',
  })
  @ApiOkResponse({
    description: '비밀번호 변경이 성공적으로 이루어진 경우.',
    schema: {
      example: {
        statusCode: 200,
        msg: '성공적으로 비밀번호가 변경되었습니다.',
      },
    },
  })
  @ApiBadRequestResponse({
    description: '새비밀번호와 새비밀번호 확인이 일치하지 않는 경우',
    schema: {
      example: {
        statusCode: 400,
        msg: '새비밀번호와 새비밀번호 확인이 일치하지 않습니다',
        err: 'Bad Request',
      },
    },
  })
  @ApiUnauthorizedResponse({
    description: '존재하지 않는 이메일을 입력한 경우',
    schema: {
      example: {
        statusCode: 401,
        msg: '존재하지 않는 이메일 입니다.',
        err: 'Unauthorized',
      },
    },
  })
  @ApiConflictResponse({
    description: '이전 비밀번호로 변경하려고 한 경우',
    schema: {
      example: {
        statusCode: 409,
        msg: '이전의 비밀번호로는 변경하실 수 없습니다.',
        err: 'Conflict',
      },
    },
  })
  @ApiInternalServerErrorResponse({
    description: '요청에 대한 응답 처리중 서버에러가 발생한 경우',
    schema: {
      example: {
        statusCode: 500,
        msg: 'DB관련한 에러 메시지 + ~에서 일어난 에러입니다.',
        err: 'InternalServerErrorException',
      },
    },
  })
  @HttpCode(HTTP_STATUS_CODE.success.ok)
  @Patch('forget/password')
  async forgetPassword(
    @Body() forgetPasswordDto: ForgetPasswordDto,
  ): Promise<Object> {
    try {
      await this.authService.forgetPassword(forgetPasswordDto);

      return {
        msg: '성공적으로 비밀번호가 변경되었습니다.',
      };
    } catch (err) {
      throw err;
    }
  }
}
