import { Controller, Get } from '@nestjs/common';
import { NoticesService } from './notices.service';

@Controller('notices')
export class NoticesController {
  constructor(private noticesService: NoticesService) {}

  @Get()
  async getAllNotices() {
    const response = await this.noticesService.getAllNotices();

    return response;
  }
}
