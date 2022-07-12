import {
  Body,
  Controller,
  HttpCode,
  Post,
  UploadedFiles,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { FilesInterceptor } from '@nestjs/platform-express';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { User } from 'src/auth/entity/user.entity';
import { HTTP_STATUS_CODE } from 'src/common/configs/http-status.config';
import { CurrentUser } from 'src/common/decorators/current-user.decorator';
import { SendEmailDto } from './dto/email.dto';
import { QuestionEmailDto } from './dto/question.email.dto';
import { EmailService } from './email.service';

@Controller('email')
@ApiTags('Email')
export class EmailController {
  constructor(private emailService: EmailService) {}

  @HttpCode(HTTP_STATUS_CODE.success.ok)
  @Post('/forget/password')
  async sendEmail(@Body() sendEmailDto: SendEmailDto) {
    await this.emailService.sendEmail(sendEmailDto);

    return {
      msg: '가입하신 email로 링크가 전송 되었습니다.',
    };
  }

  @Post('/question')
  @UseGuards(AuthGuard('jwt'))
  @ApiBearerAuth('access-token')
  @UseInterceptors(FilesInterceptor('image', 10))
  async questionEmail(
    @Body() questionEmailDto: QuestionEmailDto,
    @CurrentUser() user: User,
    @UploadedFiles() files: Express.Multer.File[],
  ) {
    await this.emailService.questionEmail(
      user.nickname,
      questionEmailDto,
      files,
    );

    return {
      msg: '문의사항이 성공적으로 전송 되었습니다.',
    };
  }
}
