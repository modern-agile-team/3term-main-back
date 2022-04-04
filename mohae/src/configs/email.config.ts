// // import 'dotenv/config';
// import * as config from 'config';
// /*
//   EMAIL_AUTH_EMAIL: 메일서버의 이메일
//   EMAIL_AUTH_PASSWORD: 메일서버 패스워드
//   EMAIL_HOST: 메일서버
//   EMAIL_FROM_USER_NAME: 보내는 사람 이름
// */
// const emailConfig = config.get('email');
// export default () => ({
//   email: {
//     transport: `smtps://${emailConfig.EMAIL_AUTH_EMAIL}:${emailConfig.EMAIL_AUTH_PASSWORD}@${emailConfig.EMAIL_HOST}`,
//     defaults: {
//       from: `"${emailConfig.EMAIL_FROM_USER_NAME}" <${emailConfig.EMAIL_AUTH_EMAIL}>`,
//     },
//   },
// });
