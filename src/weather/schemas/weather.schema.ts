import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';
import { ApiProperty } from '@nestjs/swagger';

export type WeatherDocument = Weather & Document;

@Schema()
export class Weather {
  @ApiProperty({ example: 'London', description: 'The name of the city' })
  @Prop({ required: true })
  city: string;

  @ApiProperty({ example: 15.5, description: 'The temperature in the city' })
  @Prop({ required: true })
  temperature: number;

  @ApiProperty({ example: 'clear sky', description: 'The weather description' })
  @Prop({ required: true })
  description: string;

  @ApiProperty({
    example: '2023-10-10T10:00:00Z',
    description: 'The date of the weather data',
  })
  @Prop({ default: Date.now })
  date: Date;
}

export const WeatherSchema = SchemaFactory.createForClass(Weather);
