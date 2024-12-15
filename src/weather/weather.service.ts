import { Injectable, HttpException, HttpStatus, Logger } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Weather, WeatherDocument } from './schemas/weather.schema';
import { ConfigService } from '@nestjs/config';
import { HttpService } from '@nestjs/axios';
import { WeatherErrorHandler } from 'src/utils/ErrorHandler';

@Injectable()
export class WeatherService {
  private readonly apiKey: string;
  private readonly apiUrl: string =
    'https://api.openweathermap.org/data/2.5/weather';
  private readonly geocodingUrl: string =
    'http://api.openweathermap.org/geo/1.0/direct';
  private readonly logger = new Logger(WeatherService.name);

  private readonly weatherGroups: { [key: string]: string } = {
    '2': 'Thunderstorm',
    '3': 'Drizzle',
    '5': 'Rain',
    '6': 'Snow',
    '7': 'Atmosphere',
    '8': 'Clouds',
    '800': 'Clear',
  };

  constructor(
    private readonly httpService: HttpService,
    @InjectModel(Weather.name)
    private readonly weatherModel: Model<WeatherDocument>,
    private readonly configService: ConfigService,
  ) {
    this.apiKey = this.configService.get<string>('OPENWEATHERMAP_API_KEY');
  }

  async getWeather(city: string): Promise<Weather> {
    const coordinates = await this.getCoordinates(city);
    const weatherData = await this.fetchWeatherData(
      coordinates.lat,
      coordinates.lon,
    );
    const weatherCode = weatherData.weather[0].id;
    const weatherGroup = this.getWeatherGroup(weatherCode).toLowerCase();

    const newWeather = new this.weatherModel({
      city: coordinates.country ? `${city}, ${coordinates.country}` : city,
      temperature: weatherData.main.temp,
      description: weatherGroup,
      date: new Date(),
    });

    return newWeather.save();
  }

  private async getCoordinates(
    city: string,
  ): Promise<{ lat: number; lon: number; country?: string }> {
    try {
      this.logger.log(`Fetching coordinates for city: ${city}`);
      const response = await this.httpService
        .get(this.geocodingUrl, {
          params: {
            q: city,
            limit: 1,
            appid: this.apiKey,
          },
        })
        .toPromise();

      if (response.data.length === 0) {
        throw new HttpException('City not found', HttpStatus.NOT_FOUND);
      }

      const { lat, lon, country } = response.data[0];
      return { lat, lon, country };
    } catch (error: any) {
      this.logger.error('Error fetching coordinates', error);
      WeatherErrorHandler(error);
    }
  }

  private async fetchWeatherData(lat: number, lon: number): Promise<any> {
    try {
      const response = await this.httpService
        .get(this.apiUrl, {
          params: {
            lat,
            lon,
            appid: this.apiKey,
            units: 'metric',
          },
        })
        .toPromise();

      return response.data;
    } catch (error: any) {
      this.logger.error('Error fetching weather data', error);
      WeatherErrorHandler(error);
    }
  }

  private getWeatherGroup(weatherCode: number): string {
    if (weatherCode === 800) {
      return 'Clear';
    }
    const codePrefix = Math.floor(weatherCode / 100).toString();
    return this.weatherGroups[codePrefix] || 'Unknown';
  }

  async getAllWeather(): Promise<Weather[]> {
    return this.weatherModel.find().exec();
  }
}
