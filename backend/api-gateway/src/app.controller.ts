import { Controller, Get } from '@nestjs/common';
import { AppService } from '@/app.service';
import { ApiResponse } from '@/common/interfaces/api-response.interface';

@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {}

  @Get()
  async getHello(): Promise<ApiResponse<{ message: string }>> {
    return this.appService.getHello();
  }
}
