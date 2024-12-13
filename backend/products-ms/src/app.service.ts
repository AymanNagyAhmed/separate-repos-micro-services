import { Injectable, HttpStatus, BadRequestException } from '@nestjs/common';
import { ApiResponse } from '@/common/interfaces/api-response.interface';

@Injectable()
export class AppService {
  async getHello(): Promise<ApiResponse<{ message: string }>> {
    try {
      const someCondition = false; // Your condition logic here
      if (someCondition) {
        throw new BadRequestException('Custom error message');
      }
      
      return {
        success: true,
        statusCode: HttpStatus.OK,
        message: 'Products microservice is running',
        path: '/',
        timestamp: new Date().toISOString(),
        data: { message: 'PRODUCTS-MS' }
      };
    } catch (error) {
      throw new BadRequestException('Failed to process request');
    }
  }
}
