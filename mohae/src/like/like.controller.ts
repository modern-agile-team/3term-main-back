import { Body, Controller, Post } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { LikeUserDto } from './dto/user-like.dto';
import { LikeService } from './like.service';

@Controller('like')
@ApiTags('like')
export class LikeController {
  constructor(private likeService: LikeService) {}

  @Post('/user')
  async likeUser(@Body() likeUserDto: LikeUserDto) {
    const response = await this.likeService.likeUser(likeUserDto);
    return Object.assign({
      success: true,
      msg: '성공적으로 요청이 처리되었습니다.',
    });
  }
}
