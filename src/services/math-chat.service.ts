import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import OpenAI from 'openai';
import { MessageDto, MessageRole } from '../models/dtos/math-chat.dto';

@Injectable()
export class MathChatService {
  private openai: OpenAI;
  private readonly mathTopics = [
    'divisores', 'múltiplos', 'máximo común divisor', 'mínimo común múltiplo',
    'simplificación de fracciones', 'fraccionarios', 'operaciones básicas',
    'números enteros', 'inecuaciones', 'teoría de números', 'números fraccionarios',
    'problemas', 'sucesión numérica', 'derivada', 'integral', 'probabilidad',
    'ecuaciones lineales', 'ecuaciones racionales', 'ecuaciones álgebraicas',
    'valor absoluto', 'factorización', 'límites de funciones', 'límites especiales'
  ];

  constructor(private configService: ConfigService) {
    this.openai = new OpenAI({
      apiKey: this.configService.get<string>('OPENAI_API_KEY'),
    });
  }

  private isMathRelated(prompt: string): boolean {
    const lowerPrompt = prompt.toLowerCase();
    return this.mathTopics.some(topic => lowerPrompt.includes(topic.toLowerCase()));
  }

  async processMathQuery(messages: MessageDto[]): Promise<string> {
    const lastMessage = messages[messages.length - 1];
    
    if (!this.isMathRelated(lastMessage.content)) {
      return 'Lo siento, solo puedo responder preguntas relacionadas con matemáticas. Por favor, haz una pregunta sobre alguno de estos temas: ' + this.mathTopics.join(', ');
    }

    try {
      const completion = await this.openai.chat.completions.create({
        model: "gpt-3.5-turbo",
        messages: [
          {
            role: MessageRole.SYSTEM,
            content: "Eres un tutor experto en matemáticas. Responde de manera clara y didáctica, incluyendo ejemplos cuando sea apropiado. Si la pregunta no está relacionada con matemáticas, indica que solo puedes responder preguntas matemáticas."
          },
          ...messages.map(msg => ({
            role: msg.role,
            content: msg.content
          }))
        ],
        temperature: 0.7,
        max_tokens: 1000
      });

      return completion.choices[0].message.content;
    } catch (error) {
      console.error('Error al procesar la consulta con OpenAI:', error);
      throw new Error('Error al procesar la consulta matemática');
    }
  }
} 