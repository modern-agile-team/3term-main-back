import { PassportModule, PassportStrategy } from '@nestjs/passport';
import { Test, TestingModule } from '@nestjs/testing';
import { profile } from 'console';
import { UserRepository } from 'src/auth/repository/user.repository';
import { CategoryRepository } from 'src/categories/repository/category.repository';
import { LikeRepository } from 'src/like/repository/like.repository';
import { MajorRepository } from 'src/majors/repository/major.repository';
import { SchoolRepository } from 'src/schools/repository/school.repository';
import { ErrorConfirm } from 'src/common/utils/error';
import {
  JudgeDuplicateNicknameDto,
  UpdateProfileDto,
} from './dto/update-profile.dto';
import { ProfilesController } from './profiles.controller';
import { ProfilesService } from './profiles.service';

describe('ProfilesController', () => {
  let profilesController: ProfilesController;
  let profilesService: ProfilesService;

  beforeAll(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [PassportModule.register({ defaultStrategy: 'jwt' })],
      controllers: [ProfilesController],
      providers: [
        ProfilesService,
        UserRepository,
        SchoolRepository,
        MajorRepository,
        CategoryRepository,
        LikeRepository,
        ErrorConfirm,
      ],
    })
      .overrideProvider(ProfilesService)
      .useValue(profilesService)
      .compile();

    profilesController = module.get<ProfilesController>(ProfilesController);
    profilesService = module.get<ProfilesService>(ProfilesService);
  });

  describe('/Get profile/:profileUserNo/:userNo, findOneProfile()', () => {
    it('Profile 유저가 다른 유저 프로필에 들어갔을 때', async () => {
      profilesService.findOneProfile = jest.fn().mockResolvedValue({
        profileUserNo: 1,
        name: '수브로',
        email: 'subro@kakao.com',
        nickname: '수브로에요',
        photo_url: 'subro.png',
        createdAt: '2022-04-28',
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
      const profileUserNo = 1;
      const userNo = 2;

      const MockGetProfile = await profilesService.findOneProfile(
        profileUserNo,
        userNo,
      );
      const response = await profilesController.findOneProfile(
        profileUserNo,
        userNo,
      );

      expect(response).toStrictEqual({
        statusCode: 200,
        msg: '프로필 조회에 성공했습니다.',
        response: MockGetProfile,
      });
    });
  });
  describe('/Patch profile/:no, updateProfile()', () => {
    it('프로필 수정 성공', async () => {
      profilesService.updateProfile = jest.fn().mockResolvedValue(1);
      const no = 1;
      const updateProfileDto: UpdateProfileDto = {
        phone: '010',
        nickname: 'susu',
        school: 1,
        major: 1,
        categories: [],
        photo_url: 'adsf.png',
      };

      const mockUpdateProfile = await profilesService.updateProfile(
        no,
        updateProfileDto,
      );
      const response = await profilesController.updateProfile(
        no,
        updateProfileDto,
      );

      expect(response).toStrictEqual({
        statusCode: 201,
        msg: '프로필 정보 수정이 완료되었습니다.',
        userNo: mockUpdateProfile,
      });
    });
  });

  describe('/Post profile/check-nickname, judgeDuplicateNickname()', () => {
    it('닉네임 중복 확인', async () => {
      profilesService.judgeDuplicateNickname = jest.fn().mockResolvedValue({});
      const judgeDuplicateNickname: JudgeDuplicateNicknameDto = {
        no: 1,
        nickname: '브로브로',
      };
      const mockCheckNickname = await profilesService.judgeDuplicateNickname(
        judgeDuplicateNickname,
      );
      const response = await profilesController.judgeDuplicateNickname(
        judgeDuplicateNickname,
      );
      expect(response).toStrictEqual({
        statusCode: 200,
        msg: '사용가능한 닉네임입니다.',
      });
    });
  });
});
