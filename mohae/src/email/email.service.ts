import { UserRepository } from 'src/auth/repository/user.repository';
import { ErrorConfirm } from 'src/utils/error';
import Mail = require('nodemailer/lib/mailer');
// import Mail = require('nodemailer/lib/mailer');
import * as nodemailer from 'nodemailer';
// import * as nodemailer from 'nodemailer'
import { Injectable, UnauthorizedException } from '@nestjs/common';
import * as config from 'config';

const emailConfig = config.get('email');

interface EmailOptions {
  to: string;
  from: string;
  subject: string;
  html: string;
}
@Injectable()
export class EmailService {
  private transpoter: Mail;
  constructor(
    private errorConfirm: ErrorConfirm,
    private userRepository: UserRepository,
  ) {
    this.transpoter = nodemailer.createTransport({
      host: emailConfig.EMAIL_HOST,
      port: emailConfig.EMAIL_PORT,
      secure: false,
      auth: {
        user: emailConfig.EMAIL_AUTH_EMAIL,
        pass: emailConfig.EMAIL_AUTH_PASSWORD,
      },
    });
  }
  async sendEmail(sendEmailDto) {
    try {
      const { name, email } = sendEmailDto;
      const user = await this.userRepository.signIn(email);
      const url = '비밀번호 변경 url 적어주면 됨 ㅋ';
      this.errorConfirm.notFoundError(
        user,
        '해당 email을 가진 유저는 없습니다.',
      );

      if (user.name === name) {
        const mailOptions: EmailOptions = {
          to: email,
          from: emailConfig.EMAIL_FROM_USER_NAME,
          subject: `모해로부터 온 ${name}님의 비밀번호 변경 관련 메일입니다.`,
          html: `
          아래 버튼을 누르시면 비밀번호 변경 화면으로 넘어갑니다.<br/>
          <form action="${url}" method="GET">
            <button>버튼</button>
          </form>`,
        };
        return await this.transpoter.sendMail(mailOptions);
      }
      throw new UnauthorizedException(
        '등록하셨던 이름과 현재 이름이 맞지 않습니다.',
      );
    } catch (err) {
      throw err;
    }
  }
}
