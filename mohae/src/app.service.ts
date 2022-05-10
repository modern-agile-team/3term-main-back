import { Injectable } from '@nestjs/common';

@Injectable()
export class AppService {
  getHello(): string {
    return 'Hello, Modern-Agile 3term Server! 승범';
  }
}
