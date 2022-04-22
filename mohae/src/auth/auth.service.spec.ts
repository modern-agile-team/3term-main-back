import {
  ConflictException,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { PassportModule } from '@nestjs/passport';
import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { create } from 'domain';
import { Category } from 'src/categories/entity/category.entity';
import { CategoryRepository } from 'src/categories/repository/category.repository';
import { MajorRepository } from 'src/majors/repository/major.repository';
import { SchoolRepository } from 'src/schools/repository/school.repository';
import { ErrorConfirm } from 'src/utils/error';
import { getRepository, Repository } from 'typeorm';
import { AuthService } from './auth.service';
import { CreateUserDto, SignInDto } from './dto/auth-credential.dto';
import { User } from './entity/user.entity';
import { UserRepository } from './repository/user.repository';
import * as bcrypt from 'bcryptjs';

const MockUserRepository = () => ({
  //signUp
  findOne: jest.fn(),
  duplicateCheck: jest.fn(),
  createUser: jest.fn(),
  //signIn
  signIn: jest.fn(),
  changeIsLock: jest.fn(),
  clearLoginCount: jest.fn(),
  plusLoginFailCount: jest.fn(),
  //signDown
  signDown: jest.fn(),
  //changePassword, forgetPassword
  changePassword: jest.fn(),
});
const MockSchoolRepository = () => ({
  //signUp
  findOne: jest.fn(),
});
const MockMajorRepository = () => ({
  //signUp
  findOne: jest.fn(),
});
const MockCategoryRepository = () => ({
  //signUp
  selectCategory: jest.fn(),
  saveUsers: jest.fn(),
});
const mockJwtService = {
  sign: jest.fn(),
  verify: jest.fn(),
};

type MockRepository<T = any> = Partial<Record<keyof Repository<T>, jest.Mock>>;

describe('AuthService', () => {
  let authService: AuthService;
  let userRepository: MockRepository<UserRepository>;
  let schoolRepository: MockRepository<SchoolRepository>;
  let majorRepository: MockRepository<MajorRepository>;
  let categoryRepository: MockRepository<CategoryRepository>;
  let errorConfirm: ErrorConfirm;

  beforeAll(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [PassportModule.register({ defaultStrategy: 'jwt' })],
      providers: [
        AuthService,
        ErrorConfirm,
        { provide: JwtService, useValue: mockJwtService },
        {
          provide: getRepositoryToken(UserRepository),
          useValue: MockUserRepository(),
        },
        {
          provide: getRepositoryToken(SchoolRepository),
          useValue: MockSchoolRepository(),
        },
        {
          provide: getRepositoryToken(MajorRepository),
          useValue: MockMajorRepository(),
        },
        {
          provide: getRepositoryToken(CategoryRepository),
          useValue: MockCategoryRepository(),
        },
      ],
    }).compile();

    authService = module.get<AuthService>(AuthService);
    userRepository = module.get<MockRepository<UserRepository>>(
      getRepositoryToken(UserRepository),
    );
    categoryRepository = module.get<MockRepository<CategoryRepository>>(
      getRepositoryToken(CategoryRepository),
    );
    schoolRepository = module.get<MockRepository<SchoolRepository>>(
      getRepositoryToken(SchoolRepository),
    );
    majorRepository = module.get<MockRepository<MajorRepository>>(
      getRepositoryToken(MajorRepository),
    );
    categoryRepository = module.get<MockRepository<CategoryRepository>>(
      getRepositoryToken(CategoryRepository),
    );
    errorConfirm = module.get<ErrorConfirm>(ErrorConfirm);
  });

  it('should be defined', () => {
    expect(authService).toBeDefined();
  });

  describe('signUp', () => {
    it('회원가입이 성공적으로 이루어졌을 경우', async () => {
      schoolRepository.findOne.mockResolvedValue({
        no: 1,
        name: '인덕대',
        users: [],
      });

      majorRepository.findOne.mockResolvedValue({
        no: 1,
        name: '개발',
        users: [],
      });
      categoryRepository['selectCategory'].mockResolvedValue([
        { no: 1, name: '개발' },
        { no: 2, name: '디자인' },
        { no: 3, name: '일상' },
      ]);
      userRepository['duplicateCheck'].mockResolvedValue(undefined);
      userRepository['createUser'].mockResolvedValue({
        no: 1,
        email: 'subro',
        nickname: '용훈',
      });
      userRepository.findOne.mockResolvedValue({
        no: 1,
        categories: [],
      });
      categoryRepository['saveUsers'].mockResolvedValue();

      const createUserDto: CreateUserDto = {
        email: 'cd111@eegnadddddsver.com',
        password: 'hello',
        name: '백팀장',
        school: 1,
        major: 1,
        categories: [],
        phone: '01012345678',
        nickname: '1ddd11gddddd111',
        manager: false,
        photo_url: 'asdfasdf',
      };
      const returnValue = await authService.signUp(createUserDto);

      expect(returnValue).toStrictEqual({
        no: 1,
        email: 'subro',
        nickname: '용훈',
      });
    });

    it('이메일,닉네임이 중복되는 경우', async () => {
      schoolRepository.findOne.mockResolvedValue({
        no: 1,
        name: '인덕대',
        users: [],
      });

      majorRepository.findOne.mockResolvedValue({
        no: 1,
        name: '개발',
        users: [],
      });
      categoryRepository['selectCategory'].mockResolvedValue([
        { no: 1, name: '개발' },
        { no: 2, name: '디자인' },
        { no: 3, name: '일상' },
      ]);
      userRepository['duplicateCheck'].mockResolvedValue(1);
      userRepository['createUser'].mockResolvedValue({
        no: 1,
        email: 'subro',
        nickname: '용훈',
      });
      userRepository.findOne.mockResolvedValue({
        no: 1,
        categories: [],
      });
      categoryRepository['saveUsers'].mockResolvedValue();

      const createUserDto: CreateUserDto = {
        email: 'cd111@eegnadddddsver.com',
        password: 'hello',
        name: '백팀장',
        school: 1,
        major: 1,
        categories: [],
        phone: '01012345678',
        nickname: '1ddd11gddddd111',
        manager: false,
        photo_url: 'asdfasdf',
      };
      try {
        await authService.signUp(createUserDto);
      } catch (e) {
        expect(e).toBeInstanceOf(ConflictException);
        expect(e.response.message).toBe(
          '해당 이메일,닉네임이 이미 존재합니다.',
        );
        expect(e.response).toStrictEqual({
          statusCode: 409,
          message: '해당 이메일,닉네임이 이미 존재합니다.',
          error: 'Conflict',
        });
      }
    });

    it('DB에 없는 학교 정보,전공 번호로 회원가입을 하려할 때', async () => {
      schoolRepository.findOne.mockResolvedValue(undefined);

      majorRepository.findOne.mockResolvedValue(undefined);
      categoryRepository['selectCategory'].mockResolvedValue([
        { no: 1, name: '개발' },
        { no: 2, name: '디자인' },
        { no: 3, name: '일상' },
      ]);
      userRepository['duplicateCheck'].mockResolvedValue(undefined);
      userRepository['createUser'].mockResolvedValue({
        no: 1,
        email: 'subro',
        nickname: '용훈',
      });
      userRepository.findOne.mockResolvedValue({
        no: 1,
        categories: [],
      });
      categoryRepository['saveUsers'].mockResolvedValue();

      const createUserDto: CreateUserDto = {
        email: 'cd111@eegnadddddsver.com',
        password: 'hello',
        name: '백팀장',
        school: 5,
        major: 5,
        categories: [],
        phone: '01012345678',
        nickname: '1ddd11gddddd111',
        manager: false,
        photo_url: 'asdfasdf',
      };
      try {
        await authService.signUp(createUserDto);
      } catch (e) {
        expect(e).toBeInstanceOf(NotFoundException);
        expect(e.response.message).toBe(
          `해당 번호에 해당하는 학교,전공이(가) 존재하지 않습니다.`,
        );
        expect(e.response).toStrictEqual({
          statusCode: 404,
          message: '해당 번호에 해당하는 학교,전공이(가) 존재하지 않습니다.',
          error: 'Not Found',
        });
      }
    });

    it('유저 생성이 정상적으로 이루어지지 않았을 때', async () => {
      schoolRepository.findOne.mockResolvedValue({
        no: 1,
        name: '인덕대',
        users: [],
      });

      majorRepository.findOne.mockResolvedValue({
        no: 1,
        name: '개발',
        users: [],
      });
      categoryRepository['selectCategory'].mockResolvedValue([
        { no: 1, name: '개발' },
        { no: 2, name: '디자인' },
        { no: 3, name: '일상' },
      ]);
      userRepository['duplicateCheck'].mockResolvedValue(undefined);
      userRepository['createUser'].mockResolvedValue(undefined);
      userRepository.findOne.mockResolvedValue({
        no: 1,
        categories: [],
      });
      categoryRepository['saveUsers'].mockResolvedValue();

      const createUserDto: CreateUserDto = {
        email: 'cd111@eegnadddddsver.com',
        password: 'hello',
        name: '백팀장',
        school: 1,
        major: 1,
        categories: [],
        phone: '01012345678',
        nickname: '1ddd11gddddd111',
        manager: false,
        photo_url: 'asdfasdf',
      };
      try {
        await authService.signUp(createUserDto);
      } catch (e) {
        expect(e).toBeInstanceOf(NotFoundException);
        expect(e.response.message).toBe(
          '유저 생성이 정상적으로 이루어지지 않았습니다.',
        );
        expect(e.response).toStrictEqual({
          statusCode: 404,
          message: '유저 생성이 정상적으로 이루어지지 않았습니다.',
          error: 'Not Found',
        });
      }
    });
  });

  describe('signIn', () => {
    it('로그인에 성공하였을 때', async () => {
      userRepository['signIn'].mockResolvedValue({
        no: 1,
        isLock: 0,
        latestLogin: new Date(),
        salt: '1234',
        logInFailCount: 0,
      });
      userRepository['changeIsLock'].mockResolvedValue({
        affected: 0,
      });
      userRepository['clearLoginCount'].mockResolvedValue({
        affected: 0,
      });
      userRepository['plusLoginFailCount'].mockResolvedValue({
        affected: 0,
      });
      bcrypt.compare = jest.fn().mockResolvedValue(true);
      mockJwtService.sign = jest.fn().mockResolvedValue('accessToken 입니다.');

      const signInDto: SignInDto = {
        email: 'subro',
        password: '1234',
      };
      const resultValue = await authService.signIn(signInDto);

      expect(resultValue).toStrictEqual({
        accessToken: 'accessToken 입니다.',
      });
    });

    it('없는 이메일로 로그인을 시도했을 때', async () => {
      userRepository['signIn'].mockResolvedValue(undefined);
      userRepository['changeIsLock'].mockResolvedValue({
        affected: 0,
      });
      userRepository['clearLoginCount'].mockResolvedValue({
        affected: 0,
      });
      userRepository['plusLoginFailCount'].mockResolvedValue({
        affected: 0,
      });
      bcrypt.compare = jest.fn().mockResolvedValue(true);
      mockJwtService.sign = jest.fn().mockResolvedValue('accessToken 입니다.');

      const signInDto: SignInDto = {
        email: 'subro',
        password: '1234',
      };
      try {
        await authService.signIn(signInDto);
      } catch (e) {
        expect(e).toBeInstanceOf(NotFoundException);
        expect(e.response.message).toBe(
          '아이디 또는 비밀번호가 일치하지 않습니다.',
        );
        expect(e.response).toStrictEqual({
          error: 'Not Found',
          message: '아이디 또는 비밀번호가 일치하지 않습니다.',
          statusCode: 404,
        });
      }
    });

    it('비밀번호가 틀렸을때', async () => {
      userRepository['signIn'].mockResolvedValue({
        no: 1,
        isLock: 0,
        latestLogin: new Date(),
        salt: '1234',
        logInFailCount: 0,
      });
      userRepository['changeIsLock'].mockResolvedValue({
        affected: 0,
      });
      userRepository['clearLoginCount'].mockResolvedValue({
        affected: 0,
      });
      userRepository['plusLoginFailCount'].mockResolvedValue({
        affected: 0,
      });
      bcrypt.compare = jest.fn().mockResolvedValue(false);
      mockJwtService.sign = jest.fn().mockResolvedValue('accessToken 입니다.');

      const signInDto: SignInDto = {
        email: 'subro',
        password: '1234',
      };
      try {
        await authService.signIn(signInDto);
      } catch (e) {
        expect(e).toBeInstanceOf(UnauthorizedException);
        expect(e.response.message).toBe(
          `아이디 또는 비밀번호가 일치하지 않습니다. 로그인 실패 횟수: undefined `,
        );
        expect(e.response).toStrictEqual({
          statusCode: 401,
          message:
            '아이디 또는 비밀번호가 일치하지 않습니다. 로그인 실패 횟수: undefined ',
          error: 'Unauthorized',
        });
      }
    });

    it('로그인 시도 횟수를 모두 초과하였을 때', async () => {
      userRepository['signIn'].mockResolvedValue({
        no: 1,
        isLock: 1,
        latestLogin: new Date(),
        salt: '1234',
        logInFailCount: 0,
      });
      userRepository['changeIsLock'].mockResolvedValue({
        affected: 0,
      });
      userRepository['clearLoginCount'].mockResolvedValue({
        affected: 0,
      });
      userRepository['plusLoginFailCount'].mockResolvedValue({
        affected: 0,
      });
      bcrypt.compare = jest.fn().mockResolvedValue(false);
      mockJwtService.sign = jest.fn().mockResolvedValue('accessToken 입니다.');

      const signInDto: SignInDto = {
        email: 'subro',
        password: '1234',
      };
      try {
        await authService.signIn(signInDto);
      } catch (e) {
        expect(e).toBeInstanceOf(UnauthorizedException);
        expect(e.response.message).toBe(
          '로그인 실패 횟수를 모두 초과 하였습니다 -32389초 뒤에 다시 로그인 해주세요',
        );
        expect(e.response).toStrictEqual({
          statusCode: 401,
          message:
            '로그인 실패 횟수를 모두 초과 하였습니다 -32389초 뒤에 다시 로그인 해주세요',
          error: 'Unauthorized',
        });
      }
    });
  });
});
