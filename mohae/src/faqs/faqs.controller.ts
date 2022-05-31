import {
  Body,
  Controller,
  Delete,
  Get,
  Logger,
  Param,
  Patch,
  Post,
  UseGuards,
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

@Controller('faqs')
@ApiTags('Faqs')
export class FaqsController {
  private logger = new Logger('FaqsController');
  constructor(private readonly faqsService: FaqsService) {}

  @ApiOperation({
    summary: 'FAQ 전체 조회 기능',
    description: 'FAQ를 전체 조회하는 API',
  })
  @Get()
  async readAllFaqs(): Promise<object> {
    try {
      const response: Faq | Faq[] = await this.faqsService.readAllFaqs();

      return Object.assign({
        statusCode: 200,
        msg: `전체 FAQ가 조회되었습니다.`,
        response,
      });
    } catch (err) {
      throw new Error(err);
    }
  }

  @ApiOperation({
    summary: 'FAQ 생성 기능',
    description: 'FAQ를 생성하는 API',
  })
  @Post()
  @Role(true)
  @UseGuards(RolesGuard)
  @UseGuards(AuthGuard())
  async createFaq(
    @Body() createFaqDto: CreateFaqDto,
    @CurrentUser() manager: User,
  ): Promise<object> {
    try {
      const response: boolean = await this.faqsService.createFaq(
        createFaqDto,
        manager,
      );

      return Object.assign({
        statusCode: 201,
        msg: `FAQ 생성 완료`,
        success: response,
      });
    } catch (err) {
      throw new Error(err);
    }
  }

  @ApiOperation({
    summary: 'FAQ 수정 기능',
    description: 'FAQ를 수정하는 API',
  })
  @Patch('/:faqNo')
  @Role(true)
  @UseGuards(RolesGuard)
  @UseGuards(AuthGuard())
  async updateFaq(
    @Param('faqNo') faqNo: number,
    @Body() updateFaqDto: UpdateFaqDto,
    @CurrentUser() manager: User,
  ): Promise<object> {
    try {
      const response: boolean = await this.faqsService.updateFaq(
        faqNo,
        updateFaqDto,
        manager,
      );

      return Object.assign({
        statusCode: 204,
        msg: `FAQ 수정 완료`,
        success: response,
      });
    } catch (err) {
      throw new Error(err);
    }
  }

  @ApiOperation({
    summary: 'FAQ 삭제 기능',
    description: 'FAQ를 삭제하는 API',
  })
  @Delete('/:faqNo')
  @Role(true)
  @UseGuards(RolesGuard)
  @UseGuards(AuthGuard())
  async deleteFaq(@Param('faqNo') faqNo: number): Promise<object> {
    try {
      const response: boolean = await this.faqsService.deleteFaq(faqNo);

      return Object.assign({
        statusCode: 204,
        msg: `FAQ 삭제 완료`,
        success: response,
      });
    } catch (err) {
      throw new Error(err);
    }
  }
}
