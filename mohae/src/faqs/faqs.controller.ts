import {
  Body,
  CacheInterceptor,
  Controller,
  Delete,
  Get,
  HttpCode,
  Param,
  Patch,
  Post,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import {
  ApiBearerAuth,
  ApiOkResponse,
  ApiOperation,
  ApiTags,
} from '@nestjs/swagger';
import { CreateFaqDto } from './dto/create-faq.dto';
import { Faq } from './entity/faq.entity';
import { FaqsService } from './faqs.service';
import { Role } from 'src/common/decorators/roles.decorator';
import { RolesGuard } from 'src/common/guards/roles.guard';
import { AuthGuard } from '@nestjs/passport';
import { UpdateFaqDto } from './dto/update-faq.dto';
import { CurrentUser } from 'src/common/decorators/current-user.decorator';
import { User } from 'src/auth/entity/user.entity';
import { HTTP_STATUS_CODE } from 'src/common/configs/http-status.config';
import { operationConfig } from 'src/common/swagger-apis/api-operation.swagger';
import { apiResponse } from 'src/common/swagger-apis/api-response.swagger';

@ApiTags('Faqs')
@Controller('faqs')
export class FaqsController {
  constructor(private readonly faqsService: FaqsService) {}

  @ApiOperation(
    operationConfig('FAQ 전체 조회 기능', 'FAQ를 전체 조회하는 API'),
  )
  @ApiOkResponse(
    apiResponse.success(
      'FAQ 전체 조회',
      HTTP_STATUS_CODE.success.ok,
      'FAQ 전체 조회 결과 성공',
    ),
  )
  @HttpCode(HTTP_STATUS_CODE.success.ok)
  @Get()
  async readAllFaqs(): Promise<object> {
    const faqCacheData: Faq | Faq[] = await this.faqsService.getFaqCacheData(
      'faqs',
    );

    if (faqCacheData) {
      return {
        msg: '전체 FAQ가 조회되었습니다.',
        response: faqCacheData,
      };
    }

    const response: Faq | Faq[] = await this.faqsService.readAllFaqs();

    return {
      msg: `전체 FAQ가 조회되었습니다.`,
      response,
    };
  }

  @ApiOperation(operationConfig('FAQ 저장 기능', 'FAQ를 저장하는 API'))
  @ApiOkResponse(
    apiResponse.success(
      'FAQ 저장',
      HTTP_STATUS_CODE.success.created,
      'FAQ 저장 결과 성공',
    ),
  )
  @ApiBearerAuth('access-token')
  @Role(true)
  @UseGuards(RolesGuard)
  @UseGuards(AuthGuard('jwt'))
  @HttpCode(HTTP_STATUS_CODE.success.created)
  @Post()
  async createFaq(
    @CurrentUser() manager: User,
    @Body() createFaqDto: CreateFaqDto,
  ): Promise<object> {
    await this.faqsService.createFaq(manager, createFaqDto);

    return {
      msg: `FAQ 생성 완료`,
    };
  }

  @ApiOperation(operationConfig('FAQ 수정 기능', 'FAQ를 수정하는 API'))
  @ApiOkResponse(
    apiResponse.success(
      'FAQ 수정',
      HTTP_STATUS_CODE.success.ok,
      'FAQ 수정 결과 성공',
    ),
  )
  @ApiBearerAuth('access-token')
  @Role(true)
  @UseGuards(RolesGuard)
  @UseGuards(AuthGuard('jwt'))
  @HttpCode(HTTP_STATUS_CODE.success.ok)
  @Patch(':faqNo')
  async updateFaq(
    @CurrentUser() manager: User,
    @Param('faqNo') faqNo: number,
    @Body() updateFaqDto: UpdateFaqDto,
  ): Promise<object> {
    await this.faqsService.updateFaq(manager, faqNo, updateFaqDto);

    return {
      msg: `FAQ 수정 완료`,
    };
  }

  @ApiOperation(operationConfig('FAQ 삭제 기능', 'FAQ를 삭제하는 API'))
  @ApiOkResponse(
    apiResponse.success(
      'FAQ 삭제',
      HTTP_STATUS_CODE.success.ok,
      'FAQ 삭제 결과 성공',
    ),
  )
  @ApiBearerAuth('access-token')
  @Role(true)
  @UseGuards(RolesGuard)
  @UseGuards(AuthGuard('jwt'))
  @HttpCode(HTTP_STATUS_CODE.success.ok)
  @Delete(':faqNo')
  async deleteFaq(@Param('faqNo') faqNo: number): Promise<object> {
    await this.faqsService.deleteFaq(faqNo);

    return {
      msg: `FAQ 삭제 완료`,
    };
  }
}
