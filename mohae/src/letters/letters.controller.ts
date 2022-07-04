import {
  Body,
  Controller,
  Get,
  HttpCode,
  Param,
  Post,
  UploadedFile,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { FileInterceptor } from '@nestjs/platform-express';
import { ApiOperation, ApiTags } from '@nestjs/swagger';
import { User } from 'src/auth/entity/user.entity';
import { AwsService } from 'src/aws/aws.service';
import { HTTP_STATUS_CODE } from 'src/common/configs/http-status.config';
import { CurrentUser } from 'src/common/decorators/current-user.decorator';
import { SendLetterDto } from './dto/letter.dto';
import { LettersService } from './letters.service';

@UseGuards(AuthGuard('jwt'))
@ApiTags('Letters')
@Controller('letters')
export class LettersController {
  constructor(
    private lettersService: LettersService,
    private awsService: AwsService,
  ) {}

  @ApiOperation({
    summary: '쪽지 보내기 기능',
    description:
      '유저 간 쪽지 보내기 기능, 쪽지함이 없을 경우 생성하고 있으면 저장 API',
  })
  @HttpCode(HTTP_STATUS_CODE.success.created)
  @UseInterceptors(FileInterceptor('image'))
  @Post()
  async sendLetter(
    @CurrentUser() sender: User,
    @UploadedFile() sendImage: Express.Multer.File,
    @Body() sendLetterDto: SendLetterDto,
  ): Promise<object> {
    if (sendImage) {
      const { imageUrl, imageKey }: { imageUrl: string; imageKey: string } =
        this.awsService.makeImageKey('letters', sendImage);

      await this.lettersService.sendLetter(sender, sendLetterDto, imageUrl);
      await this.awsService.uploadLetterPhotoToS3(imageKey, sendImage);
    } else {
      await this.lettersService.sendLetter(sender, sendLetterDto);
    }

    return {
      msg: '쪽지를 정상적으로 전송했습니다.',
    };
  }
}
