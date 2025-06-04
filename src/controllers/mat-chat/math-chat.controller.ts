import { Controller, Post, Body, UseGuards } from '@nestjs/common';
import { MathChatService } from '../../services/math-chat.service';
import { MathChatDto } from '../../models/dtos/math-chat.dto';
import { AuthGuard } from '../../modules/auth.guard';

@Controller('chat')
@UseGuards(AuthGuard)
export class MathChatController {
  constructor(private readonly mathChatService: MathChatService) {}

  @Post()
  async processMathQuery(@Body() mathChatDto: MathChatDto): Promise<{ response: string }> {
    const response = await this.mathChatService.processMathQuery(mathChatDto.messages);
    return { response };
  }
} 