import { IsString, IsNumber, IsOptional, IsEnum, IsBoolean } from 'class-validator';
import { DeliveryZoneType } from '@prisma/client';

export class CreateDeliveryZoneDto {
  @IsString()
  name: string;

  @IsNumber()
  fee: number;

  @IsNumber()
  minOrder: number;

  @IsNumber()
  estimatedTime: number;

  @IsOptional()
  @IsBoolean()
  isActive?: boolean;

  @IsEnum(DeliveryZoneType)
  type: DeliveryZoneType;

  @IsOptional()
  @IsNumber()
  radius?: number;

  @IsOptional()
  @IsNumber()
  centerLat?: number;

  @IsOptional()
  @IsNumber()
  centerLng?: number;

  @IsOptional()
  @IsString()
  zipCodes?: string;

  @IsOptional()
  @IsString()
  polygon?: string;
}

