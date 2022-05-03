import { Body, Controller, Post } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { SendEmailDto } from './dto/email.dto';
import { EmailService } from './email.service';

@Controller('email')
@ApiTags('Email')
export class EmailController {
  constructor(private emailService: EmailService) {}

  @Post('/forget/password')
  async sendEmail(@Body() sendEmailDto: SendEmailDto) {
    await this.emailService.sendEmail(sendEmailDto);

    return Object.assign({
      statusCode: 200,
      mag: '가입하신 email로 링크가 전송 되었습니다.',
    });
  }
}
