import { Injectable } from '@nestjs/common'

@Injectable()
export class AppService {
  getHello(): string {
    return `Ecommerce API version 1.0. Visit /api-documents to acccess swagger documents`
  }
}
