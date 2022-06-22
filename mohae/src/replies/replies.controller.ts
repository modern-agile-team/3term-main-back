import {
  Body,
  Controller,
  Delete,
  HttpCode,
  Param,
  Post,
  Put,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import {
  ApiBearerAuth,
  ApiCreatedResponse,
  ApiOkResponse,
  ApiOperation,
  ApiTags,
} from '@nestjs/swagger';
import { User } from 'src/auth/entity/user.entity';
import { HTTP_STATUS_CODE } from 'src/common/configs/http-status.config';
import { CurrentUser } from 'src/common/decorators/current-user.decorator';
import { SuccesseInterceptor } from 'src/common/interceptors/success.interceptor';
import { operationConfig } from 'src/common/swagger-apis/api-operation.swagger';
import { apiResponse } from 'src/common/swagger-apis/api-response.swagger';
import { CreateReplyDto } from './dto/create-reply.dto';
import { UpdateReplyDto } from './dto/update-reply.dto';
import { RepliesService } from './replies.service';

@UseGuards(AuthGuard('jwt'))
@UseInterceptors(SuccesseInterceptor)
@ApiTags('Replies')
@Controller('comments/:commentNo/replies')
export class RepliesController {
  constructor(private readonly repliesService: RepliesService) {}

  @ApiOperation(operationConfig('대댓글 생성', '대댓글 생성 API'))
  @ApiCreatedResponse(
    apiResponse.success(
      '대댓글 생성 성공 결과',
      HTTP_STATUS_CODE.success.created,
      '대댓글 생성 완료',
    ),
  )
  @ApiBearerAuth('access-token')
  @HttpCode(HTTP_STATUS_CODE.success.created)
  @Post()
  async createReply(
    @Param('commentNo') commentNo: number,
    @Body() { content }: CreateReplyDto,
    @CurrentUser() loginUser: User,
  ): Promise<object> {
    await this.repliesService.createReply(commentNo, content, loginUser.no);

    return {
      msg: '대댓글 생성 완료',
    };
  }

  @ApiOperation(operationConfig('대댓글 수정', '대댓글 수정 API'))
  @ApiOkResponse(
    apiResponse.success(
      '대댓글 수정 성공 결과',
      HTTP_STATUS_CODE.success.ok,
      '대댓글 수정 완료',
    ),
  )
  @ApiBearerAuth('access-token')
  @HttpCode(HTTP_STATUS_CODE.success.ok)
  @Put(':replyNo')
  async updateReply(
    @Param('replyNo') replyNo: number,
    @Body() { content }: UpdateReplyDto,
    @CurrentUser() loginUser: User,
  ): Promise<object> {
    await this.repliesService.updateReply(replyNo, content, loginUser.no);

    return {
      msg: '대댓글 수정 완료',
    };
  }

  @ApiOperation(operationConfig('대댓글 삭제', '대댓글 삭제 API'))
  @ApiOkResponse(
    apiResponse.success(
      '대댓글 삭제 성공 결과',
      HTTP_STATUS_CODE.success.ok,
      '대댓글 삭제 완료',
    ),
  )
  @ApiBearerAuth('access-token')
  @HttpCode(HTTP_STATUS_CODE.success.ok)
  @Delete(':replyNo')
  async deleteReply(
    @Param('replyNo') replyNo: number,
    @CurrentUser() loginUser: User,
  ): Promise<object> {
    await this.repliesService.deleteReply(replyNo, loginUser.no);

    return {
      msg: '대댓글 삭제 완료',
    };
  }
}
