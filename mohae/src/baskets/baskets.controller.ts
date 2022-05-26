import {
  Body,
  Controller,
  Delete,
  Post,
  UseInterceptors,
} from '@nestjs/common';
import { BasketsService } from './baskets.service';
import { BasketDto } from './dto/busket.dto';

@Controller('baskets')
export class BasketsController {
  constructor(private basketsService: BasketsService) {}

  @Post('check')
  async checkBasket(@Body() basketDto: BasketDto): Promise<object> {
    const response = await this.basketsService.checkBasket(basketDto);

    return Object.assign({
      statusCode: 201,
      msg: '성공적으로 요청이 처리되었습니다.',
      response,
    });
  }
}
