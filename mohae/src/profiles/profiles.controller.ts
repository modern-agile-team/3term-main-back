import {
  Body,
  Controller,
  Get,
  Param,
  ParseIntPipe,
  Patch,
  Post,
  Query,
} from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import {
  JudgeDuplicateNicknameDto,
  ProfilePagenationDto,
  UpdateProfileDto,
} from './dto/update-profile.dto';
import { ProfilesService } from './profiles.service';

@Controller('profile')
@ApiTags('Profile')
export class ProfilesController {
  constructor(private profileService: ProfilesService) {}

  @Get('/:profileUserNo/:userNo')
  async findUserProfile(
    @Param('profileUserNo', ParseIntPipe) profileUserNo: number,
    @Param('userNo', ParseIntPipe) userNo: number,
  ): Promise<object> {
    try {
      const response: object = await this.profileService.findUserProfile(
        profileUserNo,
        userNo,
      );
      return Object.assign({
        statusCode: 200,
        msg: '프로필 조회에 성공했습니다.',
        response,
      });
    } catch (err) {
      throw err;
    }
  }

  @Get('/spec')
  async findUserSpec(
    @Query('user') user: number,
    @Query('take') take: number,
    @Query('page') page: number,
  ) {
    try {
      const response = await this.profileService.findUserSpec(user, take, page);
      return Object.assign({
        statusCode: 200,
        msg: '프로필 스펙 조회에 성공했습니다.',
        response,
      });
    } catch (err) {
      throw err;
    }
  }

  @Get('/board')
  async findUserBoard(
    @Query('user') user: number,
    @Query('take') take: number,
    @Query('page') page: number,
    @Query('target') target: boolean,
  ) {
    try {
      const response = await this.profileService.findUserBoard(
        user,
        take,
        page,
        target,
      );
      return Object.assign({
        statusCode: 200,
        msg: '프로필 스펙 조회에 성공했습니다.',
        response,
      });
    } catch (err) {
      throw err;
    }
  }

  @Post('/check-nickname')
  async judgeDuplicateNickname(
    @Body() judgeDuplicateNicknameDto: JudgeDuplicateNicknameDto,
  ) {
    try {
      await this.profileService.judgeDuplicateNickname(
        judgeDuplicateNicknameDto,
      );

      return Object.assign({
        statusCode: 200,
        msg: '사용가능한 닉네임입니다.',
      });
    } catch (err) {
      throw err;
    }
  }

  @Patch('/:no')
  async updateProfile(
    @Param('no', ParseIntPipe) no: number,
    @Body() updateProfileDto: UpdateProfileDto,
  ): Promise<number> {
    try {
      const response: number = await this.profileService.updateProfile(
        no,
        updateProfileDto,
      );
      return Object.assign({
        statusCode: 201,
        msg: '프로필 정보 수정이 완료되었습니다.',
        userNo: response,
      });
    } catch (err) {
      throw err;
    }
  }
}
