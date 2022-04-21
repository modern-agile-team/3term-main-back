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
    it('회원 가입 절차 도중 학교 가져오기', async () => {
      schoolRepository.findOne.mockResolvedValue([
        {
          no: 1,
          name: '수형',
          users: [User],
        },
      ]);
      const schoolNo = 1;

      const returnSchoolRepo = await schoolRepository.findOne(schoolNo);
      console.log(returnSchoolRepo);
      expect(returnSchoolRepo).toStrictEqual([
        {
          no: 1,
          name: '수형',
          users: [User],
        },
      ]);
    });

    it('회원 가입 절차 도중 전공 가져오기', async () => {
      majorRepository.findOne.mockResolvedValue([
        {
          no: 1,
          name: '수형',
          users: [User],
        },
      ]);
      const majorNo = 1;

      const returnMajorRepo = await schoolRepository.findOne(majorNo);
      expect(returnMajorRepo).toStrictEqual([
        {
          no: 1,
          name: '수형',
          users: [User],
        },
      ]);
    });

    it('회원 가입 절차 도충 카테고리별 레포 가져오기', async () => {
      categoryRepository['selectCategory'].mockResolvedValue([
        {
          categories: [
            { no: 1, name: '개발' },
            { no: 2, name: '디자인' },
            { no: 3, name: '일상' },
          ],
        },
      ]);
      const categoriesNo = [1, 2, 3];
      const returnCatoegoriesRepo = await categoryRepository['selectCategory'](
        categoriesNo,
      );
      console.log(returnCatoegoriesRepo);
      expect(returnCatoegoriesRepo).toStrictEqual([
        {
          categories: [
            { no: 1, name: '개발' },
            { no: 2, name: '디자인' },
            { no: 3, name: '일상' },
          ],
        },
      ]);
    });

    it('회원 가입 절차 도중 이메일,닉네임 중복 체크', async () => {
      userRepository['duplicateCheck'].mockResolvedValue([{}]);
    });
  });
});
