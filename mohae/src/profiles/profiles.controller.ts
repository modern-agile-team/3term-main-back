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
import { ApiOkResponse, ApiOperation, ApiTags } from '@nestjs/swagger';
import { User } from '@sentry/node';
import { AwsService } from 'src/aws/aws.service';
import { UserPhotoSizes } from 'src/common/configs/photo-size.config';
import { CurrentUser } from 'src/common/decorators/current-user.decorator';
import { SuccesseInterceptor } from 'src/common/interceptors/success.interceptor';
import { JudgeDuplicateNicknameDto } from './dto/judge-duplicate-nickname.dto';
import { UpdateProfileDto } from './dto/update-profile.dto';
import { ProfilesService } from './profiles.service';

@UseGuards(AuthGuard('jwt'))
@Controller('profile')
@UseInterceptors(SuccesseInterceptor)
@ApiTags('Profile')
export class ProfilesController {
  constructor(
    private readonly profileService: ProfilesService,
    private readonly awsService: AwsService,
  ) {}

  @Get('/:profileUserNo')
  @HttpCode(200)
  @ApiOperation({
    summary: '한 명의 유저 프로필 전체 조회 API',
    description: '한명의 유저 프로필을 한번에 불러온다',
  })
  @ApiOkResponse({
    description: '성공적으로 유저의 프로필이 불러와진 경우.',
  })
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

  @Post('/check-nickname')
  @HttpCode(200)
  @ApiOperation({
    summary: '프로필 수정에서 닉네임 변경확인 API',
    description: '변경할 수 있는 닉네임인지 확인한다.',
  })
  @ApiOkResponse({
    description: '사용가능한 닉네임인 경우.',
  })
  async judgeDuplicateNickname(
    @Body() judgeDuplicateNicknameDto: JudgeDuplicateNicknameDto,
  ) {
    await this.profileService.judgeDuplicateNickname(judgeDuplicateNicknameDto);

    return {
      msg: '사용가능한 닉네임입니다.',
    };
  }

  @UseInterceptors(FileInterceptor('image'))
  @Patch()
  @HttpCode(201)
  @ApiOperation({
    summary: '유저 프로필 정보 수정 API',
    description: '유저 프로필 정보를 수정한다.',
  })
  @ApiOkResponse({
    description: '성공적으로 유저의 프로필이 수정된 경우.',
  })
  @UseGuards(AuthGuard())
  async updateProfile(
    @UploadedFile() file: Express.Multer.File,
    @Body() updateProfileDto: UpdateProfileDto,
    @CurrentUser() user: User,
  ): Promise<object> {
    console.log(updateProfileDto);

    // 이건 school = null 이런식으로 들어오면 ㅈ됨 school 변경 사항 없으면 걍 school이라는 key,value를 받으면 안됨!
    for (const key in updateProfileDto) {
      if (key === 'school' || key === 'major') {
        updateProfileDto[`${key}`] = Number(updateProfileDto[`${key}`]);
      }
      if (key === 'categories') {
        updateProfileDto[`${key}`] = updateProfileDto[`${key}`]
          .split(',')
          .map(Number);
      }
    }

    // const profilePhoto = file
    //   ? false
    //   : await this.awsService.uploadFileToS3(
    //       'profile',
    //       UserPhotoSizes.small,
    //       file,
    //     );
    const profilePhoto = 1;
    const response: number = await this.profileService.updateProfile(
      user.no,
      updateProfileDto,
      profilePhoto,
    );
    return {
      msg: '프로필 정보 수정이 완료되었습니다.',
      response,
    };
  }
}
