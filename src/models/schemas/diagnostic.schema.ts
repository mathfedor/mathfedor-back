import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

class Exercise {
  @Prop({ required: true })
  statement: string;

  @Prop({ type: [String], required: true })
  options: string[];

  @Prop({ required: true })
  correctAnswer: string;
}

class Topic {
  @Prop({ required: true })
  title: string;

  @Prop({ required: true })
  description: string;

  @Prop({ type: [Exercise], required: true })
  exercises: Exercise[];
}

@Schema({ timestamps: true })
export class Diagnostic extends Document {
  @Prop({ required: true })
  title: string;

  @Prop({ required: true })
  description: string;

  @Prop({ type: [String], required: true })
  tags: string[];

  @Prop({ type: [Topic], required: true })
  topics: Topic[];

  @Prop({ required: true })
  group: string;

  @Prop({ type: Object })
  file: any;

  @Prop({ type: Object })
  data: any;

  @Prop({ required: true })
  createdBy: string;
}

export const DiagnosticSchema = SchemaFactory.createForClass(Diagnostic); 