import {
  Body,
  Controller,
  Get,
  Param,
  ParseIntPipe,
  Patch,
  Post,
} from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import {
  JudgeDuplicateNicknameDto,
  UpdateProfileDto,
} from './dto/update-profile.dto';
import { ProfilesService } from './profiles.service';

@Controller('profile')
@ApiTags('Profile')
export class ProfilesController {
  constructor(private profileService: ProfilesService) {}

  @Get(':no')
  async findOneProfile(@Param('no', ParseIntPipe) no: number): Promise<object> {
    const response = await this.profileService.findOneProfile(no);

    return Object.assign({
      success: true,
      statusCode: 200,
      msg: '프로필 조회에 성공했습니다.',
      response,
    });
  }

  @Post()
  async judgeDuplicateNickname(
    @Body() judgeDuplicateNicknameDto: JudgeDuplicateNicknameDto,
  ) {
    await this.profileService.judgeDuplicateNickname(judgeDuplicateNicknameDto);

    return Object.assign({
      success: true,
      statusCode: 204,
      msg: '사용가능한 닉네임입니다.',
    });
  }

  @Patch(':no')
  async updateProfile(
    @Param('no', ParseIntPipe) no: number,
    @Body() updateProfileDto,
  ): Promise<number> {
    const response = await this.profileService.updateProfile(
      no,
      updateProfileDto,
    );

    return Object.assign({
      success: true,
      statusCode: 201,
      msg: '프로필 정보 수정이 완료되었습니다.',
      userNo: response,
    });
  }
}
