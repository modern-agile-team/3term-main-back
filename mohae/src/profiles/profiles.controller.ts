import {
  Body,
  Controller,
  Get,
  HttpCode,
  Param,
  Patch,
  Post,
  UploadedFile,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { FileInterceptor } from '@nestjs/platform-express';
import {
  ApiConflictResponse,
  ApiInternalServerErrorResponse,
  ApiNotFoundResponse,
  ApiOkResponse,
  ApiOperation,
  ApiTags,
  ApiUnauthorizedResponse,
} from '@nestjs/swagger';
import { User } from '@sentry/node';
import { AwsService } from 'src/aws/aws.service';
import { CurrentUser } from 'src/common/decorators/current-user.decorator';
import { SuccesseInterceptor } from 'src/common/interceptors/success.interceptor';
import { JudgeDuplicateNicknameDto } from './dto/judge-duplicate-nickname.dto';
import { UpdateProfileDto } from './dto/update-profile.dto';
import { ProfilesService } from './profiles.service';

@Controller('profile')
@UseInterceptors(SuccesseInterceptor)
@ApiTags('Profile')
export class ProfilesController {
  constructor(
    private readonly profileService: ProfilesService,
    private readonly awsService: AwsService,
  ) {}

  @ApiOperation({
    summary: '한 명의 유저 프로필 전체 조회 API',
    description: '한명의 유저 프로필을 한번에 불러온다',
  })
  @ApiOkResponse({
    description: '성공적으로 유저의 프로필이 불러와진 경우.',
    schema: {
      example: {
        statusCode: 200,
        msg: '프로필 조회에 성공했습니다.',
      },
    },
  })
  @ApiUnauthorizedResponse({
    description: '회원가입하지 않은 사람이 프로필 조회를 시도한 경우',
    schema: {
      example: {
        statusCode: 401,
        msg: 'Unauthorized',
        err: 'Unauthorized',
      },
    },
  })
  @ApiNotFoundResponse({
    description: '조회 하려는 회원이 존재하지 않는 경우',
    schema: {
      example: {
        statusCode: 404,
        msg: '~에 해당하는 회원을 찾을 수 없습니다.',
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
  @UseGuards(AuthGuard('jwt'))
  @HttpCode(200)
  @Get('/:profileUserNo')
  async readUserProfile(
    @Param('profileUserNo') profileUserNo: number,
    @CurrentUser() user: User,
  ): Promise<object> {
    const response: object = await this.profileService.readUserProfile(
      profileUserNo,
      user.no,
    );

    return {
      msg: '프로필 조회에 성공했습니다.',
      response,
    };
  }

  @ApiOperation({
    summary: '프로필 수정에서 닉네임 변경확인 API',
    description: '변경할 수 있는 닉네임인지 확인한다.',
  })
  @ApiOkResponse({
    description: '사용가능한 닉네임인 경우.',
    schema: {
      example: {
        success: true,
        statusCode: 200,
        msg: '사용가능한 닉네임입니다.',
      },
    },
  })
  @ApiConflictResponse({
    description:
      '변경하려는 닉네임이 현재 닉네임이거나 다른사람이 사용하는 경우.',
    schema: {
      example: {
        statusCode: 409,
        msg: '현재 닉네임입니다. or 이미 사용 중인 닉네임 입니다.',
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
  @HttpCode(200)
  @Post('/check-nickname')
  async judgeDuplicateNickname(
    @Body() judgeDuplicateNicknameDto: JudgeDuplicateNicknameDto,
  ) {
    await this.profileService.judgeDuplicateNickname(judgeDuplicateNicknameDto);

    return {
      msg: '사용가능한 닉네임입니다.',
    };
  }

  @ApiOperation({
    summary: '유저 프로필 정보 수정 API',
    description: '유저 프로필 정보를 수정한다.',
  })
  @ApiOkResponse({
    description: '성공적으로 유저의 프로필이 수정된 경우.',
    schema: {
      example: {
        success: true,
        statusCode: 201,
        msg: '프로필 정보 수정이 완료되었습니다.',
      },
    },
  })
  @ApiUnauthorizedResponse({
    description: '회원가입하지 않은 사람이 프로필 조회를 시도한 경우',
    schema: {
      example: {
        statusCode: 401,
        msg: 'Unauthorized',
        err: 'Unauthorized',
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
  @HttpCode(201)
  @UseGuards(AuthGuard('jwt'))
  @UseInterceptors(FileInterceptor('image'))
  @Patch()
  async updateProfile(
    @UploadedFile() file: Express.Multer.File,
    @Body() updateProfileDto: UpdateProfileDto,
    @CurrentUser() user: User,
  ): Promise<object> {
    for (const key in updateProfileDto) {
      updateProfileDto[`${key}`] = JSON.parse(updateProfileDto[`${key}`]);
    }

    const profilePhotoUrl: boolean | string = !file
      ? false
      : await this.awsService.uploadProfileFileToS3('profile', file);
    const beforeProfileUrl: string | undefined =
      await this.profileService.updateProfile(
        user.no,
        updateProfileDto,
        profilePhotoUrl,
      );

    if (beforeProfileUrl) {
      await this.awsService.deleteProfileS3Object(beforeProfileUrl);
    }

    return {
      msg: '프로필 정보 수정이 완료되었습니다.',
    };
  }
}
