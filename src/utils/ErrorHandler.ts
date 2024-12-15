import { HttpException, HttpStatus } from '@nestjs/common';

interface IError {
  message: string;
  status?: number;
  data?: any;
}

export const WeatherErrorHandler = (error: IError): never => {
  if (error.status) {
    const { status, data } = error;

    switch (status) {
      case 400:
        throw new HttpException(
          'Bad Request: Invalid city name',
          HttpStatus.BAD_REQUEST,
        );
      case 401:
        throw new HttpException(
          'Unauthorized: Invalid API key',
          HttpStatus.UNAUTHORIZED,
        );
      case 404:
        throw new HttpException('City not found', HttpStatus.NOT_FOUND);
      default:
        throw new HttpException(
          'An error occurred',
          HttpStatus.INTERNAL_SERVER_ERROR,
        );
    }
  } else {
    throw new HttpException(
      'Internal server error',
      HttpStatus.INTERNAL_SERVER_ERROR,
    );
  }
};
