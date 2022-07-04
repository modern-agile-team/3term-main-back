import { ConflictException, NotFoundException } from '@nestjs/common';
import { PassportModule } from '@nestjs/passport';
import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { UserRepository } from 'src/auth/repository/user.repository';
import { CategoryRepository } from 'src/categories/repository/category.repository';
import { LikeRepository } from 'src/like/repository/like.repository';
import { MajorRepository } from 'src/majors/repository/major.repository';
import { SchoolRepository } from 'src/schools/repository/school.repository';
import { ErrorConfirm } from 'src/common/utils/error';
import { Repository } from 'typeorm';
import {
  JudgeDuplicateNicknameDto,
  UpdateProfileDto,
} from './dto/update-profile.dto';
import { ProfilesService } from './profiles.service';

const MockLikeRepository = () => ({
  isLike: jest.fn(),
});
const MockUserRepository = () => ({
  findOne: jest.fn(),
  duplicateCheck: jest.fn(),
  findOneUser: jest.fn(),
  save: jest.fn(),
});
const MockSchoolRepository = () => ({
  findOne: jest.fn(),
});
const MockMajorRepository = () => ({
  findOne: jest.fn(),
});
const MockCategoryRepository = () => ({
  selectCategory: jest.fn(),
});

type MockRepository<T = any> = Partial<Record<keyof Repository<T>, jest.Mock>>;

describe('ProfilesService', () => {
  let profilesService: ProfilesService;
  let userRepository: MockRepository<UserRepository>;
  let schoolRepository: MockRepository<SchoolRepository>;
  let majorRepository: MockRepository<MajorRepository>;
  let categoryRepository: MockRepository<CategoryRepository>;
  let likeRepository: MockRepository<LikeRepository>;
  let errorConfirm: ErrorConfirm;

  beforeAll(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [PassportModule.register({ defaultStrategy: 'jwt' })],
      providers: [
        ProfilesService,
        ErrorConfirm,
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
          provide: getRepositoryToken(LikeRepository),
          useValue: MockLikeRepository(),
        },
        {
          provide: getRepositoryToken(CategoryRepository),
          useValue: MockCategoryRepository(),
        },
      ],
    }).compile();

    profilesService = module.get<ProfilesService>(ProfilesService);
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
    likeRepository = module.get<MockRepository<LikeRepository>>(
      getRepositoryToken(LikeRepository),
    );
    errorConfirm = module.get<ErrorConfirm>(ErrorConfirm);
  });
  it('should be defined', () => {
    expect(profilesService).toBeDefined();
  });

  describe('findOneProfile', () => {
    beforeEach(async () => {
      userRepository['findOneUser'].mockResolvedValue({
        no: 7,
        name: '백팀장',
        photo_url: 'asdfasdf',
        email: '4@4e32.com',
        nickname: '저는 4e32시민입니다',
        createdAt: new Date(),
        boards: [],
        school: { no: 1, name: '인덕대학교' },
        major: { no: 4, name: '선택안함' },
        specs: [],
        categories: [
          { no: 1, name: '개발' },
          { no: 2, name: '디자인' },
        ],
        likedUser: [],
      });
      likeRepository['isLike'].mockResolvedValue();
    });

    it('프로필이 성공적으로 불러와진 경우', async () => {
      const profileUserNo = 1;
      const userNo = 2;
      const returnValue = await profilesService.findOneProfile(
        profileUserNo,
        userNo,
      );
      expect(returnValue).toStrictEqual({
        profileUserNo: 1,
        name: '백팀장',
        email: '4@4e32.com',
        nickname: '저는 4e32시민입니다',
        photo_url: 'asdfasdf',
        userCreatedAt: '2022.5.8',
        likedNum: 0,
        islike: false,
        boards: [],
        school: { no: 1, name: '인덕대학교' },
        major: { no: 4, name: '선택안함' },
        specs: [],
        categories: [
          { no: 1, name: '개발' },
          { no: 2, name: '디자인' },
        ],
      });
    });
    it('삭제되거나 없는 유저의 프로필에 들어간 경우', async () => {
      userRepository['findOneUser'].mockResolvedValue(undefined);
      try {
        const profileUserNo = 1;
        const userNo = 2;
        await profilesService.findOneProfile(profileUserNo, userNo);
      } catch (e) {
        expect(e).toBeInstanceOf(NotFoundException);
        expect(e.response.message).toBe(`No: 1 일치하는 유저가 없습니다.`);
        expect(e.response).toStrictEqual({
          statusCode: 404,
          message: 'No: 1 일치하는 유저가 없습니다.',
          error: 'Not Found',
        });
      }
    });
  });

  describe('judgeDuplicateNickname', () => {
    beforeEach(async () => {
      userRepository.findOne.mockResolvedValue({
        no: 1,
        name: '백팀장',
        photo_url: 'asdfasdf',
        email: '2@2.com',
        phone: '01012345678',
        nickname: 'subro',
        manager: false,
        loginFailCount: 0,
        isLock: false,
        latestLogin: '2022-04-29',
        deletedAt: null,
        userCreatedAt: '2022-04-28',
      });
      userRepository['duplicateCheck'].mockResolvedValue(undefined);
    });

    it('현재 사용중인 닉네임으로 변경을 시도했을 때', async () => {
      try {
        const judgeDuplicateNickname: JudgeDuplicateNicknameDto = {
          no: 1,
          nickname: 'subro',
        };
        await profilesService.judgeDuplicateNickname(judgeDuplicateNickname);
      } catch (e) {
        expect(e).toBeInstanceOf(ConflictException);
        expect(e.response.message).toBe('현재 닉네임입니다.');
        expect(e.response).toStrictEqual({
          statusCode: 409,
          message: '현재 닉네임입니다.',
          error: 'Conflict',
        });
      }
    });
    it('변경하려는 닉네임이 다른 유저가 이미 사용중인 닉네임일때', async () => {
      userRepository['duplicateCheck'].mockResolvedValue(true);
      try {
        const judgeDuplicateNickname: JudgeDuplicateNicknameDto = {
          no: 1,
          nickname: '수브로',
        };
        await profilesService.judgeDuplicateNickname(judgeDuplicateNickname);
      } catch (e) {
        expect(e).toBeInstanceOf(ConflictException);
        expect(e.response.message).toBe('이미 사용 중인 닉네임 입니다.');
        expect(e.response).toStrictEqual({
          statusCode: 409,
          message: '이미 사용 중인 닉네임 입니다.',
          error: 'Conflict',
        });
      }
    });
  });

  describe('updateProfile', () => {
    beforeEach(async () => {
      userRepository.findOne.mockResolvedValue({
        no: 1,
        name: '이수형',
        photo_url: '변경된 사진',
        email: 'subro@naver.com',
        phone: '00000000',
        nickname: '닉네임',
        manager: false,
        loginFailCount: 0,
        isLock: false,
        latestLogin: '2022-05-02',
        deletedAt: null,
        createdAt: '2022-04-28',
        categories: [
          { no: 1, name: '개발' },
          { no: 2, name: '디자인' },
        ],
      });
      userRepository['duplicateCheck'].mockResolvedValue(undefined);
      schoolRepository.findOne.mockResolvedValue({ no: 1, name: '인덕대학교' });
      majorRepository.findOne.mockResolvedValue({ no: 1, name: '컴퓨터' });
      categoryRepository['selectCategory'].mockResolvedValue([
        { no: 1, name: '개발' },
        { no: 2, name: '디자인' },
      ]);
      userRepository.save.mockResolvedValue({
        no: 1,
        name: '수브로',
        photo_url: '변경된 사진',
        email: 'subro@naver.com',
        phone: '0000000',
        nickname: '닉네임',
        manager: false,
        loginFailCount: 0,
        isLock: false,
        latestLogin: '2022-05-02',
        deletedAt: null,
        createdAt: '2022-04-28',
        categories: [
          { no: 1, name: '개발' },
          { no: 2, name: '디자인' },
        ],
        school: { no: 1, name: '인덕대학교' },
        major: { no: 1, name: '컴퓨터' },
      });
    });

    it('성공적으로 프로필 수정이 이루어졌을 때', async () => {
      const no = 1;
      const updateProfileDto: UpdateProfileDto = {
        phone: '00000',
        nickname: '브로',
        school: 1,
        major: 1,
        categories: [],
        photo_url: 'hello',
      };

      const returnValue = await profilesService.updateProfile(
        no,
        updateProfileDto,
      );
      expect(returnValue).toStrictEqual(1);
    });

    it('프론트에서 프로필 주인의 번호를 잘못 넘겨준 경우(일어나선 안되는 일이긴 함)', async () => {
      userRepository.findOne.mockResolvedValue(undefined);
      try {
        const no = 1;
        const updateProfileDto: UpdateProfileDto = {
          phone: '00000',
          nickname: '브로',
          school: 1,
          major: 1,
          categories: [],
          photo_url: 'hello',
        };
        await profilesService.updateProfile(no, updateProfileDto);
      } catch (e) {
        expect(e).toBeInstanceOf(NotFoundException);
        expect(e.response.message).toBe('유저 정보를 찾지 못했습니다.');
        expect(e.response).toStrictEqual({
          statusCode: 404,
          message: '유저 정보를 찾지 못했습니다.',
          error: 'Not Found',
        });
      }
    });
  });
});
