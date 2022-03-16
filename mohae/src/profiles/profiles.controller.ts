import {
  Body,
  Controller,
  Get,
  Param,
  ParseIntPipe,
  Patch,
} from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { UpdateProfileDto } from './dto/update-profile.dto';
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

  @Patch(':no')
  async updateProfile(
    @Param('no', ParseIntPipe) no: number,
    @Body() updateProfileDto: UpdateProfileDto,
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
