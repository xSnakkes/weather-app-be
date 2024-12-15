import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { WeatherService } from './weather.service';
import { WeatherController } from './weather.controller';
import { Weather, WeatherSchema } from './schemas/weather.schema';
import { HttpModule } from '@nestjs/axios';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: Weather.name, schema: WeatherSchema }]),
    HttpModule,
  ],
  controllers: [WeatherController],
  providers: [WeatherService],
})
export class WeatherModule {}
