import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

export enum UserRole {
  ADMIN = 'Admin',
  STUDENT = 'Student',
  TEACHER = 'Teacher',
  ACADEMY = 'Academy'
}

@Schema()
export class User extends Document {
  @Prop({ required: true })
  email: string;

  @Prop({ required: true })
  password: string;

  @Prop({ required: true })
  name: string;

  @Prop({ 
    type: String, 
    enum: UserRole, 
    default: UserRole.STUDENT 
  })
  role: UserRole;

  @Prop({ default: 'public/img/avatar_user.png' })
  avatar: string;
}

export const UserSchema = SchemaFactory.createForClass(User); 