import { IsArray, IsString, IsEnum } from 'class-validator';

export enum MessageRole {
  SYSTEM = 'system',
  USER = 'user',
  ASSISTANT = 'assistant'
}

export class MessageDto {
  @IsString()
  content: string;

  @IsEnum(MessageRole)
  role: MessageRole;
}

export class MathChatDto {
  @IsArray()
  messages: MessageDto[];
} 