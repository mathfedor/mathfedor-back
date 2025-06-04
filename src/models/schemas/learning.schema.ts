import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Schema as MongooseSchema } from 'mongoose';

@Schema({ timestamps: true })
export class Learning extends Document {
  @Prop({ required: true })
  title: string;

  @Prop({ required: true })
  description: string;

  @Prop({ required: true, type: [String] })
  tags: string[];

  @Prop({ required: true })
  group: string;

  @Prop({ required: true, type: MongooseSchema.Types.ObjectId, ref: 'User' })
  createdBy: string;

  @Prop({ required: true })
  duration: string;

  @Prop({ required: true, type: Number })
  price: number;

  @Prop({ type: String })
  image: string;

  @Prop({ required: true, type: String })
  status: string;

  @Prop({
    type: [{
      title: { type: String, required: true },
      description: { type: String, required: true },
      duration: { type: String, required: true },
      completed: { type: Boolean },
      image: { type: String },
      sheet: { type: String, required: true },
      exampleExercises: [{
        values: { type: String, required: true }
      }],
      exercises: [{
        statement: String,
        options: [String],
        correctAnswer: String
      }]
    }]
  })
  topics: {
    title: string;
    description: string;
    duration: string;
    completed: boolean;
    image?: string;
    sheet: string;
    exampleExercises: {
      values: string;
    }[];
    exercises: {
      statement: string;
      options: string[];
      correctAnswer: string;
    }[];
  }[];
}

export const LearningSchema = SchemaFactory.createForClass(Learning);