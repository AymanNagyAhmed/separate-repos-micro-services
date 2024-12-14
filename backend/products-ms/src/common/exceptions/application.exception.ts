import { HttpException, HttpStatus } from '@nestjs/common';

export class ApplicationException extends HttpException {
  constructor(
    message: string, 
    status: HttpStatus = HttpStatus.BAD_REQUEST,
    path: string = ''
  ) {
    super(
      {
        success: false,
        statusCode: status,
        message,
        path,
        timestamp: new Date().toISOString(),
        data: undefined
      },
      status,
    );
  }
} 