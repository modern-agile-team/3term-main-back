import {
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
  Logger,
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
import { SuccesseInterceptor } from 'src/common/interceptors/success.interceptor';

@UseInterceptors(SuccesseInterceptor)
@ApiTags('Faqs')
@Controller('faqs')
export class FaqsController {
  constructor(private readonly faqsService: FaqsService) {}

  @ApiOperation({
    summary: 'FAQ 전체 조회 기능',
    description: 'FAQ를 전체 조회하는 API',
  })
  @HttpCode(200)
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
  @UseGuards(AuthGuard())
  @HttpCode(201)
  @Post()
  async createFaq(
    @Body() createFaqDto: CreateFaqDto,
    @CurrentUser() manager: User,
  ): Promise<object> {
    const response: boolean = await this.faqsService.createFaq(
      createFaqDto,
      manager,
    );

    return {
      msg: `FAQ 생성 완료`,
      success: response,
    };
  }

  @ApiOperation({
    summary: 'FAQ 수정 기능',
    description: 'FAQ를 수정하는 API',
  })
  @Role(true)
  @UseGuards(RolesGuard)
  @UseGuards(AuthGuard())
  @HttpCode(201)
  @Patch('/:faqNo')
  async updateFaq(
    @Param('faqNo') faqNo: number,
    @Body() updateFaqDto: UpdateFaqDto,
    @CurrentUser() manager: User,
  ): Promise<object> {
    const response: boolean = await this.faqsService.updateFaq(
      faqNo,
      updateFaqDto,
      manager,
    );

    return {
      msg: `FAQ 수정 완료`,
      success: response,
    };
  }

  @ApiOperation({
    summary: 'FAQ 삭제 기능',
    description: 'FAQ를 삭제하는 API',
  })
  @Role(true)
  @UseGuards(RolesGuard)
  @UseGuards(AuthGuard())
  @HttpCode(201)
  @Delete('/:faqNo')
  async deleteFaq(@Param('faqNo') faqNo: number): Promise<object> {
    const response: boolean = await this.faqsService.deleteFaq(faqNo);

    return {
      msg: `FAQ 삭제 완료`,
      success: response,
    };
  }
}
