import { UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { PassportModule } from '@nestjs/passport';
import { Test, TestingModule } from '@nestjs/testing';
import { CategoryRepository } from 'src/categories/repository/category.repository';
import { MajorRepository } from 'src/majors/repository/major.repository';
import { SchoolRepository } from 'src/schools/repository/school.repository';
import { ErrorConfirm } from 'src/common/utils/error';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import {
  ChangePasswordDto,
  CreateUserDto,
  ForgetPasswordDto,
  SignDownDto,
  SignInDto,
} from './dto/auth-credential.dto';
import { UserRepository } from './repository/user.repository';

const mockJwtService = {
  sign: jest.fn(),
  verify: jest.fn(),
};
const errorConfirm = new ErrorConfirm();
const unauthorizedException = new UnauthorizedException();

describe('AuthController', () => {
  let authController: AuthController;
  let authService: AuthService;

  beforeAll(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [PassportModule.register({ defaultStrategy: 'jwt' })],
      controllers: [AuthController],
      providers: [
        { provide: JwtService, useValue: mockJwtService },
        AuthService,
        UserRepository,
        SchoolRepository,
        MajorRepository,
        CategoryRepository,
        ErrorConfirm,
      ],
    })
      .overrideProvider(AuthService)
      .useValue(authService)
      .compile();

    authController = module.get<AuthController>(AuthController);
    authService = module.get<AuthService>(AuthService);
  });

  describe('/POST auth, signUp()', () => {
    it('Auth 회원가입', async () => {
      authService.signUp = jest.fn().mockResolvedValue({
        email: 'c1@naddsver.com',
        password: 'hello',
        name: '백팀장',
        school: 1,
        major: 1,
        categories: [],
        phone: '01012345678',
        nickname: '1ddd111',
        manager: false,
        photo_url: 'asdfasdf',
      });

      const createUserDto: CreateUserDto = {
        email: 'c1@naddsver.com',
        password: 'hello',
        name: '백팀장',
        school: 1,
        major: 1,
        categories: [],
        phone: '01012345678',
        nickname: '1ddd111',
        manager: false,
        photo_url: 'asdfasdf',
      };

      const MockCreateUser = await authService.signUp(createUserDto);
      const response = await authController.signUp(createUserDto);

      expect(response).toStrictEqual({
        statusCode: 201,
        msg: `성공적으로 회원가입이 되었습니다.`,
        nickname: MockCreateUser.nickname,
        email: MockCreateUser.email,
      });
    });
  });

  describe('/POST auth, signIn()', () => {
    it('Auth 로그인', async () => {
      authService.signIn = jest.fn().mockResolvedValue({
        // signIn 내부의 return 값을 임의로 만들어 주어야함
        accessToken: 'test',
      });

      const signInDto: SignInDto = {
        email: 'subro@naver.com',
        password: '1234',
      };

      const MockSignIn = await authService.signIn(signInDto);
      const response = await authController.signIn(signInDto);

      expect(response).toStrictEqual({
        statusCode: 200,
        msg: `성공적으로 로그인이 되었습니다.`,
        token: MockSignIn.accessToken,
      });
    });
  });
  describe('/POST auth, signIn()', () => {
    it('Auth 로그인 실패시 ', async () => {
      authService.signIn = jest.fn().mockResolvedValue({
        // signIn 내부의 return 값을 임의로 만들어 주어야함
        statusCode: 401,
        message:
          '아이디 또는 비밀번호가 일치하지 않습니다. 로그인 실패 횟수: 1 ',
        error: 'Unauthorized',
      });
      unauthorizedException.message =
        '아이디 또는 비밀번호가 일치하지 않습니다. 로그인 실패 횟수: 1 ';

      const signInDto: SignInDto = {
        email: 'subro@naver.com',
        password: '1234',
      };

      const response = await authService.signIn(signInDto);

      expect(response).toStrictEqual({
        statusCode: 401,
        message:
          '아이디 또는 비밀번호가 일치하지 않습니다. 로그인 실패 횟수: 1 ',
        error: 'Unauthorized',
      });
    });
  });
  describe('Delete auth signDown()', () => {
    it('Auth 회원탈퇴', async () => {
      authService.signDown = jest.fn().mockResolvedValue({
        statusCode: 204,
        msg: `성공적으로 회원탈퇴가 진행되었습니다.`,
      });
      const userNo = 1;
      const MockSignDown = await authService.signDown(userNo);
      const response = await authController.signDown(userNo);

      expect(response).toStrictEqual({
        statusCode: 204,
        msg: `성공적으로 회원탈퇴가 진행되었습니다.`,
      });
    });
  });
  describe('/Patch auth, changePassword()', () => {
    it('Auth 비밀번호 변경', async () => {
      authService.changePassword = jest.fn().mockResolvedValue({
        statusCode: 204,
        msg: '성공적으로 비밀번호가 변경되었습니다.',
      });
      const changePasswordDto: ChangePasswordDto = {
        email: 'string',
        nowPassword: 'string',
        changePassword: 'string',
        confirmChangePassword: 'string',
      };
      const MockChangePassword = await authService.changePassword(
        changePasswordDto,
      );
      const response = await authController.changePassword(changePasswordDto);

      expect(response).toStrictEqual({
        statusCode: 204,
        msg: '성공적으로 비밀번호가 변경되었습니다.',
      });
    });
  });
  describe('/Patch auth, forgetPassword()', () => {
    it('Auth 비밀번호 잃어버려서 변경', async () => {
      authService.forgetPassword = jest.fn().mockResolvedValue({
        statusCode: 204,
        msg: '성공적으로 비밀번호가 변경되었습니다.',
      });
      const forgetPasswordDto: ForgetPasswordDto = {
        email: 'a@a.com',
        changePassword: 'string',
        confirmChangePassword: 'string',
      };
      const MockChangePassword = await authService.forgetPassword(
        forgetPasswordDto,
      );
      const response = await authController.forgetPassword(forgetPasswordDto);
      expect(response).toStrictEqual({
        statusCode: 204,
        msg: '성공적으로 비밀번호가 변경되었습니다.',
      });
    });
  });
});
