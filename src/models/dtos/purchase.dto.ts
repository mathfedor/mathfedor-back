import { IsString, IsObject, IsOptional, IsDateString, ValidateNested } from 'class-validator';
import { Type } from 'class-transformer';

export class PaymentMethodExtraDto {
  @IsOptional()
  @IsString()
  external_identifier?: string;

  @IsOptional()
  @IsString()
  transaction_id?: string;
}

export class PaymentMethodDto {
  @IsString()
  type: string;

  @IsOptional()
  @IsString()
  phone_number?: string;

  @IsOptional()
  @IsString()
  phone_number_prefix?: string;

  @IsOptional()
  @IsString()
  legal_id?: string;

  @IsOptional()
  @IsString()
  legal_id_type?: string;

  @IsOptional()
  @IsObject()
  @ValidateNested()
  @Type(() => PaymentMethodExtraDto)
  extra?: PaymentMethodExtraDto;
}

export class TransactionDto {
  @IsString()
  id: string;

  @IsString()
  payment_method_type: string;

  @IsObject()
  @ValidateNested()
  @Type(() => PaymentMethodDto)
  payment_method: PaymentMethodDto;

  @IsString()
  reference: string;

  @IsString()
  status: string;
}

export class CreatePurchaseDto {
  @IsString()
  user_id: string;

  @IsString()
  module_id: string;

  @IsObject()
  @ValidateNested()
  @Type(() => TransactionDto)
  transaction: TransactionDto;

  @IsDateString()
  purchase_date: string;
} 