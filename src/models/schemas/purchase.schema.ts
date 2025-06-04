import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

@Schema()
class PaymentMethodExtra {
  @Prop()
  external_identifier?: string;

  @Prop()
  transaction_id?: string;
}

@Schema()
class PaymentMethod {
  @Prop({ required: true })
  type: string;

  @Prop()
  phone_number?: string;

  @Prop()
  phone_number_prefix?: string;

  @Prop()
  legal_id?: string;

  @Prop()
  legal_id_type?: string;

  @Prop({ type: Object })
  extra?: PaymentMethodExtra;
}

@Schema()
class Transaction {
  @Prop({ required: true })
  id: string;

  @Prop({ required: true })
  payment_method_type: string;

  @Prop({ type: Object, required: true })
  payment_method: PaymentMethod;

  @Prop({ required: true })
  reference: string;

  @Prop({ required: true })
  status: string;
}

@Schema({ timestamps: true })
export class Purchase extends Document {
  @Prop({ required: true })
  user_id: string;

  @Prop({ required: true })
  module_id: string;

  @Prop({ type: Object, required: true })
  transaction: Transaction;

  @Prop({ required: true })
  purchase_date: Date;
}

export const PurchaseSchema = SchemaFactory.createForClass(Purchase); 