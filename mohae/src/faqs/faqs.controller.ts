import {
  Body,
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
import { ApiOperation, ApiTags } from '@nestjs/swagger';
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

@ApiTags('Faqs')
@Controller('faqs')
export class FaqsController {
  constructor(private readonly faqsService: FaqsService) {}

  @ApiOperation({
    summary: 'FAQ 전체 조회 기능',
    description: 'FAQ를 전체 조회하는 API',
  })
  @HttpCode(HTTP_STATUS_CODE.success.ok)
  @Get()
  async readAllFaqs(): Promise<object> {
    const response: Faq | Faq[] = await this.faqsService.readAllFaqs();

    return {
      msg: `전체 FAQ가 조회되었습니다.`,
      response,
    };
  }

  @ApiOperation({
    summary: 'FAQ 생성 기능',
    description: 'FAQ를 생성하는 API',
  })
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

  @ApiOperation({
    summary: 'FAQ 수정 기능',
    description: 'FAQ를 수정하는 API',
  })
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

  @ApiOperation({
    summary: 'FAQ 삭제 기능',
    description: 'FAQ를 삭제하는 API',
  })
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
