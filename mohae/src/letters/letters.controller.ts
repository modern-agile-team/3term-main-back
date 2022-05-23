import { Body, Controller, Get, Param, Post, UseGuards } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { ApiOperation, ApiTags } from '@nestjs/swagger';
import { User } from 'src/auth/entity/user.entity';
import { CurrentUser } from 'src/common/decorators/current-user.decorator';
import { SendLetterDto } from './dto/letter.dto';
import { LettersService } from './letters.service';

@Controller('letters')
@ApiTags('Letters')
export class LettersController {
  constructor(private lettersService: LettersService) {}

  @ApiOperation({
    summary: '쪽지 보내기 기능',
    description:
      '유저 간 쪽지 보내기 기능, 쪽지함이 없을 경우 생성하고 있으면 저장 API',
  })
  @UseGuards(AuthGuard('jwt'))
  @Post()
  async sendLetter(
    @CurrentUser() sender: User,
    @Body() sendLetterDto: SendLetterDto,
  ): Promise<object> {
    try {
      const response: boolean = await this.lettersService.sendLetter(
        sender,
        sendLetterDto,
      );

      return Object.assign({
        statusCode: 201,
        msg: '쪽지를 정상적으로 전송했습니다.',
        success: response,
      });
    } catch (err) {
      throw new Error(err.message);
    }
  }
}
