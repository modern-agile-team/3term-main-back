import { CategoryRepository } from 'src/categories/repository/category.repository';
import { MajorRepository } from 'src/majors/repository/major.repository';
import { SchoolRepository } from 'src/schools/repository/school.repository';
import { ErrorConfirm } from 'src/utils/error';
import { Repository } from 'typeorm';
import { AuthService } from './auth.service';
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

type MockRepository<T = any> = Partial<Record<keyof Repository<T>, jest.Mock>>;

describe('AuthService', () => {
  let authService: AuthService;
  let userRepository: MockRepository<UserRepository>;
  let schoolRepository: MockRepository<SchoolRepository>;
  let majorRepository: MockRepository<MajorRepository>;
  let categoryRepository: MockRepository<CategoryRepository>;
  let errorConfirm: ErrorConfirm;

  beforeEach(async () => {});
});
