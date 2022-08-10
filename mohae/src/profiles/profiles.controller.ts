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
  ApiBearerAuth,
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
import { HTTP_STATUS_CODE } from 'src/common/configs/http-status.config';
import { CurrentUser } from 'src/common/decorators/current-user.decorator';
import { JudgeDuplicateNicknameDto } from './dto/judge-duplicate-nickname.dto';
import { UpdateProfileDto } from './dto/update-profile.dto';
import { ProfilesService } from './profiles.service';
import { profileSwagger } from './profiles.swagger';
import { operationConfig } from 'src/common/swagger-apis/api-operation.swagger';

@Controller('profile')
@ApiTags('Profiles')
export class ProfilesController {
  constructor(
    private readonly profileService: ProfilesService,
    private readonly awsService: AwsService,
  ) {}

  @ApiOperation(
    operationConfig(
      '한 명의 유저 프로필 전체 조회 API',
      '한명의 유저 프로필을 한번에 불러온다',
    ),
  )
  @ApiOkResponse(profileSwagger.readUserProfile.success)
  @ApiUnauthorizedResponse(profileSwagger.readUserProfile.unauthorizedResponse)
  @ApiNotFoundResponse(profileSwagger.readUserProfile.notFoundResponse)
  @ApiInternalServerErrorResponse(profileSwagger.internalServerErrorResponse)
  @ApiBearerAuth('access-token')
  @HttpCode(HTTP_STATUS_CODE.success.ok)
  @UseGuards(AuthGuard('jwt-refresh-token'))
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

  @ApiOperation(
    operationConfig(
      '프로필 수정에서 닉네임 변경확인 API',
      '변경할 수 있는 닉네임인지 확인한다.',
    ),
  )
  @ApiOkResponse(profileSwagger.judgeDuplicateNickname.success)
  @ApiConflictResponse(profileSwagger.judgeDuplicateNickname.confilctResponse)
  @ApiInternalServerErrorResponse(profileSwagger.internalServerErrorResponse)
  @HttpCode(HTTP_STATUS_CODE.success.ok)
  @ApiBearerAuth('access-token')
  @Post('/check-nickname')
  async judgeDuplicateNickname(
    @Body() judgeDuplicateNicknameDto: JudgeDuplicateNicknameDto,
  ) {
    await this.profileService.judgeDuplicateNickname(judgeDuplicateNicknameDto);

    return {
      msg: '사용가능한 닉네임입니다.',
    };
  }

  @ApiOperation(
    operationConfig(
      '유저 프로필 정보 수정 API',
      '유저 프로필 정보를 수정한다.',
    ),
  )
  @ApiOkResponse(profileSwagger.updateProfile.success)
  @ApiUnauthorizedResponse(profileSwagger.updateProfile.unauthorizedResponse)
  @ApiInternalServerErrorResponse(profileSwagger.internalServerErrorResponse)
  @HttpCode(HTTP_STATUS_CODE.success.ok)
  @ApiBearerAuth('access-token')
  @UseGuards(AuthGuard('jwt-refresh-token'))
  @UseInterceptors(FileInterceptor('image'))
  @Patch()
  async updateProfile(
    @UploadedFile() file: Express.Multer.File,
    @Body() updateProfileDto: UpdateProfileDto,
    @CurrentUser() user: User,
  ): Promise<object> {
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
