export interface BaseExercise {
  type: string;
  statement: string;
}

export interface MultipleChoiceExercise extends BaseExercise {
  type: 'multiple_choice';
  options: string[];
  correctAnswer: string;
}

export interface InputSingleExercise extends BaseExercise {
  type: 'input_single';
  expectedAnswer: string;
}

export interface InputMultipleExercise extends BaseExercise {
  type: 'input_multiple';
  pairs: Array<{
    pair: string;
    expectedAnswer: string;
  }>;
}

export type ExampleExercise = MultipleChoiceExercise | InputSingleExercise | InputMultipleExercise;

export interface Topic {
  id: string;
  title: string;
  description: string;
  duration: string;
  completed: boolean;
  image?: string;
  exampleExercises: ExampleExercise[];
  tags: string[];
  group: string;
  createdBy: string;
  sheet: string;
}

export interface Exercise {
  topicId: string;
  statement: string;
  options: string[];
  correctAnswer: string;
}

export interface TopicData extends Topic {
  exercises: Exercise[];
} 