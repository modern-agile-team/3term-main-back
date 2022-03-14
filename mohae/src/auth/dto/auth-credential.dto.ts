export class CreateUserDto {
  email: string;

  password: string;

  name: string;

  school_no: number;

  major_no: number;

  phone: string;

  nickname: string;

  manager: number;

  photo_url: string;
}

export class SignInDto {
  email: string;
  password: string;
}
