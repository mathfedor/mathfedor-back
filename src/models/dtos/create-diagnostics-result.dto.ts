import { IsNotEmpty, IsString, IsNumber, IsArray, ValidateNested } from 'class-validator';
import { Type } from 'class-transformer';

class SubjectDto {
  @IsNotEmpty()
  @IsString()
  title: string;

  @IsNotEmpty()
  @IsNumber()
  points: number;

  @IsNotEmpty()
  @IsNumber()
  maxPoints: number;

  @IsNotEmpty()
  @IsNumber()
  percentage: number;

  @IsString()
  N1?: string;

  @IsString()
  N2?: string;

  @IsString()
  N3?: string;

  @IsString()
  N4?: string;
}

class StudentDto {
  @IsNotEmpty()
  @IsString()
  name: string;

  @IsNotEmpty()
  @IsString()
  userId: string;

  @IsNotEmpty()
  @IsString()
  lastName: string;
}

class TeacherDto {
  @IsNotEmpty()
  @IsString()
  name: string;

  @IsNotEmpty()
  @IsString()
  userId: string;
}

export class CreateDiagnosticsResultDto {
  @IsNotEmpty()
  @IsString()
  diagnosticId: string;

  @IsNotEmpty()
  @ValidateNested()
  @Type(() => StudentDto)
  student: StudentDto;

  @IsNotEmpty()
  @ValidateNested()
  @Type(() => TeacherDto)
  teacher: TeacherDto;

  @IsNotEmpty()
  @IsString()
  group: string;

  @IsNotEmpty()
  @IsNumber()
  goodAnswers: number;

  @IsNotEmpty()
  @IsNumber()
  wrongAnswers: number;

  @IsNotEmpty()
  @IsString()
  rating: string;

  @IsNotEmpty()
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => SubjectDto)
  subjects: SubjectDto[];

  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => Object)
  answers: {
    exerciseId: string;
    selectedAnswer: string;
    isCorrect: boolean;
  }[];
} 