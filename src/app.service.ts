import { Injectable } from '@nestjs/common';

@Injectable()
export class AppService {
  getHello(): Promise<string> {
    return new Promise((resolve) => {
      setTimeout(() => {
        resolve('Hello World!');
      }, 2000);
    });
  }
}
