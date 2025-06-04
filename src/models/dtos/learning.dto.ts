import { IsString, IsArray, IsMongoId, IsOptional, IsEnum, ValidateNested, IsNumber } from 'class-validator';


export class InputMultipleExerciseDto {
  @IsString()
  values: string;
}

export class InputAnswerDto {
  @IsString()
  expectedAnswer: string;
}

export class CreateLearningDto {
  @IsString()
  title: string;

  @IsString()
  description: string;

  @IsArray()
  @IsString({ each: true })
  tags: string[];

  @IsString()
  group: string;

  @IsMongoId()
  createdBy: string;

  @IsString()
  duration: string;

  @IsString()
  price: string;

  @IsString()
  @IsOptional()
  image: string;

  @IsString()
  status: string;

  @IsArray()
  topics: {
    title: string;
    description: string;
    duration: string;
    completed: boolean;
    image?: string;
    sheet: string;
    exampleExercises: InputMultipleExerciseDto[];
    exercises: {
      statement: string;
      options: string[];
      correctAnswer: string;
    }[];
  }[];
} 