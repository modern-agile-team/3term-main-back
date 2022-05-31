import { Body, Controller, Post } from '@nestjs/common';
import { BasketsService } from './baskets.service';
import { BasketDto } from './dto/basket.dto';

@Controller('baskets')
export class BasketsController {
  constructor(private basketsService: BasketsService) {}

  @Post()
  async checkBasket(@Body() basketDto: BasketDto): Promise<object> {
    const response: object = await this.basketsService.checkConfirm(basketDto);

    return Object.assign({
      statusCode: 201,
      response,
    });
  }
}
