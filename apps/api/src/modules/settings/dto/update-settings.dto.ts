import { IsString, IsNumber, IsOptional, IsBoolean, IsJSON } from 'class-validator';

export class UpdateSettingsDto {
  @IsOptional()
  @IsString()
  restaurantName?: string;

  @IsOptional()
  @IsString()
  contactEmail?: string;

  @IsOptional()
  @IsString()
  restaurantAddress?: string;

  @IsOptional()
  @IsNumber()
  lat?: number;

  @IsOptional()
  @IsNumber()
  lng?: number;

  @IsOptional()
  @IsNumber()
  minOrderValue?: number;

  @IsOptional()
  @IsNumber()
  deliveryFee?: number;

  @IsOptional()
  @IsNumber()
  preparationTime?: number;

  @IsOptional()
  @IsNumber()
  deliveryTime?: number;

  @IsOptional()
  @IsNumber()
  maxOrdersPerSlot?: number;

  @IsOptional()
  @IsJSON()
  openingHours?: string;

  @IsOptional()
  @IsBoolean()
  isOpen?: boolean;
}
