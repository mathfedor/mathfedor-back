import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

class Subjects {
  @Prop({ required: true })
  title: string;

  @Prop({ required: true })
  points: number;

  @Prop({ required: true })
  maxPoints: number;

  @Prop({ required: true })
  percentage: number;

  @Prop({ required: false })
  N1: string;

  @Prop({ required: false })
  N2: string;

  @Prop({ required: false })
  N3: string;

  @Prop({ required: false })
  N4: string;
}

class Student {
  @Prop({ required: true })
  name: string;

  @Prop({ required: true })
  userId: string;

  @Prop({ required: true })
  lastName: string;
}

class Teacher {
  @Prop({ required: true })
  name: string;

  @Prop({ required: true })
  userId: string;
}

@Schema({ timestamps: true })
export class DiagnosticsResult extends Document {
  @Prop({ required: true })
  diagnosticId: string;

  @Prop({ required: true })
  student: Student;

  @Prop({ required: false })
  teacher: Teacher;

  @Prop({ required: true })
  group: string;

  @Prop({ required: true })
  goodAnswers: number;

  @Prop({ required: true })
  wrongAnswers: number;

  @Prop({ required: true })
  rating: string;

  @Prop({ type: [Subjects], required: true })
  subjects: Subjects[];

  @Prop({ type: Object })
  answers: {
    exerciseId: string;
    selectedAnswer: string;
    isCorrect: boolean;
  }[];
}

export const DiagnosticsResultSchema = SchemaFactory.createForClass(DiagnosticsResult); 