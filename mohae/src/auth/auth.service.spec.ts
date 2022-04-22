import { ConflictException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { PassportModule } from '@nestjs/passport';
import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Category } from 'src/categories/entity/category.entity';
import { CategoryRepository } from 'src/categories/repository/category.repository';
import { MajorRepository } from 'src/majors/repository/major.repository';
import { SchoolRepository } from 'src/schools/repository/school.repository';
import { ErrorConfirm } from 'src/utils/error';
import { getRepository, Repository } from 'typeorm';
import { AuthService } from './auth.service';
import { CreateUserDto } from './dto/auth-credential.dto';
import { User } from './entity/user.entity';
import { UserRepository } from './repository/user.repository';

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
    test.todo('학교 정보,전공 정보 넣어주지 않았을 때');
    test.todo('카테고리 정보가 없을 때');
  });
});
