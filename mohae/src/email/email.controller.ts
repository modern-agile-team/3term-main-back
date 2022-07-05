import { Body, Controller, HttpCode, Post } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { HTTP_STATUS_CODE } from 'src/common/configs/http-status.config';
import { SendEmailDto } from './dto/email.dto';
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
}
