import { UserRepository } from 'src/auth/repository/user.repository';
import { ErrorConfirm } from 'src/common/utils/error';
import Mail = require('nodemailer/lib/mailer');
import * as nodemailer from 'nodemailer';
import { Injectable, UnauthorizedException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { QuestionEmailDto } from './dto/question.email.dto';
interface EmailOptions {
  to: string;
  from: string;
  subject: string;
  html: string;
  attachments?: any;
}
@Injectable()
export class EmailService {
  private transpoter: Mail;
  constructor(
    private errorConfirm: ErrorConfirm,
    private userRepository: UserRepository,
    private configService: ConfigService,
  ) {
    const emailHost = this.configService.get<string>('EMAIL_HOST');
    const emailPort = this.configService.get<string>('EMAIL_PORT');
    const emailAuthEmail = this.configService.get<string>('EMAIL_AUTH_EMAIL');
    const emailAuthPassword = this.configService.get<string>(
      'EMAIL_AUTH_PASSWORD',
    );

    this.transpoter = nodemailer.createTransport({
      host: emailHost,
      secure: false,
      auth: {
        user: emailAuthEmail,
        pass: emailAuthPassword,
      },
    });
  }
  async sendEmail(sendEmailDto) {
    try {
      const emailFromUserName =
        this.configService.get<string>('EMAIL_AUTH_EMAIL');
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
          from: emailFromUserName,
          subject: `모해로부터 온 ${name}님의 비밀번호 변경 관련 메일입니다.`,
          html: `<body style="box-sizing: border-box; width: 100%; color: #4f4e5c; background: #f5f5f5">
          <table border="0" cellpadding="0" cellspacing="0" width="100%">
            <tbody width="732px">
              <tr>
                <td
                  style="
                    width: 100%;
                    min-width: 700px;
                    background: #f5f5f5;
                    padding: 16px calc((100% - 668px) / 2);
                  "
                >
                  <table cellpadding="0" cellspacing="0" width="700px">
                    <tbody>
                      <tr>
                        <td align="center">
                          <h1 style="margin: 0; padding-top: 16px;">
                            <img
                              src="https://d2ffbnf2hpheay.cloudfront.net/email/mohae.png?w=100"
                              alt="로고"
                              width="66px"
                              height="50px"
                              border="0"
                              style="display: block; margin: 0 auto"
                            />
                          </h1>
                        </td>
                      </tr>
                    </tbody>
                  </table>
                </td>
              </tr>
              <tr>
                <td
                  style="
                    width: 100%;
                    background: #f5f5f5;
                    padding: 16px calc((100% - 668px) / 2);
                  "
                >
                  <table style="width: 700px">
                    <tbody>
                      <tr>
                        <td
                          style="
                            background: #fff;
                            border-radius: 24px;
                            display: flex;
                            flex-direction: column;
                            align-items: center;
                          "
                        >
                          <h2 style="margin: 24px 0; font-size: 20px">
                            비밀번호 변경이 요청 되었습니다.
                          </h2>
                          <p style="margin: 0 0 8px 0; font-size: 14px">
                            본 메일은 비밀번호 변경을 위해 발송되는 메일입니다.
                          </p>
                          <p style="margin: 0 0 8px 0; font-size: 14px">
                            아래 버튼을 누르시면 비밀번호 변경 화면으로 넘어갑니다.
                          </p>
                          <a
                            href=""
                            style="
                              background: #ff445e;
                              border-radius: 6px;
                              padding: 12px 24px;
                              margin: 24px 0;
                              color: #fff;
                              text-decoration: none;
                              cursor: pointer;
                              font-size: 14px;
                              display: flex;
                              justify-content: space-between;
                            "
                          >
                            비밀번호 변경<img
                              src="https://d2ffbnf2hpheay.cloudfront.net/email/move.png?w=100"
                              alt="화살표"
                              style="width: 20px; height: 20px; padding-left: 8px"
                            />
                          </a>
                        </td>
                      </tr>
                    </tbody>
                  </table>
                </td>
              </tr>
              <tr>
              <td align="center"
                style="
                width: 100%;
                min-width: 700px;
                background: #f5f5f5;
                padding: 16px calc((100% - 668px) / 2);
              ">
                <img
                  src="https://mohaeproj.s3.amazonaws.com/question/1657612862109_modern-logo.png"
                  alt="Creating Email Magic"
                  width="25"
                  height="25"
                  align="center"
                />
                  Modern Agile Team
              </td>
            </tr>
            </tbody>
          </table>
        </body>`,
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

  async questionEmail(
    { nickname, email }: any,
    questionEmailDto: QuestionEmailDto,
    questionPhotoUrls: Array<string>,
  ) {
    try {
      const { title, description }: QuestionEmailDto = questionEmailDto;
      const emailFromUserName =
        this.configService.get<string>('EMAIL_AUTH_EMAIL');

      const urlLists = questionPhotoUrls.map((el) => {
        const obj = {};
        obj['path'] = encodeURI(el);
        return obj;
      });

      const mailOptions: EmailOptions = {
        to: emailFromUserName,
        from: emailFromUserName,
        subject: `#모해 문의 접수 : ${nickname}님`,
        html: ` <body style="background: #f5f5f5">
        <table align="center" cellpadding="0" cellspacing="0" width="700">
          <tr>
            <td align="center" style="padding: 40px 0 30px 0">
              <img
                src="https://d2ffbnf2hpheay.cloudfront.net/email/mohae.png?w=100"
                alt="Creating Email Magic"
                width="100"
                height="75"
                style="display: block"
              />
            </td>
          </tr>
          <tr>
            <td
              align="center"
              bgcolor="#ffffff"
              style="border-radius: 24px; padding: 20px"
            >
              <p style="font-size: 20px">작성자 : ${email}</p>
              <p style="font-size: 18px">제목 : ${title}</p>
              <p style="font-size: 14px">${description}</p>
            </td>
          </tr>
          <tr>
            <td align="center" style="padding: 20px">
              <img
                src="https://mohaeproj.s3.amazonaws.com/question/1657612862109_modern-logo.png"
                alt="Creating Email Magic"
                width="25"
                height="25"
                align="center"
              />
                Modern Agile Team
            </td>
          </tr>
        </table>
      </body>
      `,
        attachments: urlLists,
      };

      return await this.transpoter.sendMail(mailOptions);
    } catch (err) {
      throw err;
    }
  }
}
