import { Injectable } from '@nestjs/common';

@Injectable()
export class AppService {
  getHello(): string {
    return 'Hello Modern-Agile Jenkins TEST GOOD';
  }
}
