import { Controller, Get, Query } from '@nestjs/common';
import { ApiResponse, ApiTags } from '@nestjs/swagger';
import { WeatherService } from './weather.service';
import { Weather } from './schemas/weather.schema';

@ApiTags('weather')
@Controller('weather')
export class WeatherController {
  constructor(private readonly weatherService: WeatherService) {}

  @Get()
  @ApiResponse({
    status: 200,
    description: 'Weather data retrieved successfully.',
    type: Weather,
  })
  @ApiResponse({ status: 400, description: 'Invalid city name.' })
  @ApiResponse({ status: 401, description: 'Unauthorized: Invalid API key.' })
  @ApiResponse({ status: 404, description: 'City not found.' })
  @ApiResponse({ status: 500, description: 'Internal server error.' })
  async getWeather(@Query('city') city: string) {
    return this.weatherService.getWeather(city);
  }

  @Get('all')
  @ApiResponse({
    status: 200,
    description: 'All weather data retrieved successfully.',
    type: [Weather],
  })
  @ApiResponse({ status: 500, description: 'Internal server error.' })
  async getAllWeather() {
    return this.weatherService.getAllWeather();
  }
}
