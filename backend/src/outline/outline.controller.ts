import { Controller, Post, Body } from '@nestjs/common';
import { GeminiService, Slide } from '../gemini/gemini.service';

@Controller()
export class OutlineController {
  constructor(private readonly geminiService: GeminiService) {}

  @Post('generate-outline')
  async generate(@Body('prompt') prompt: string): Promise<{ slides: Slide[] }> {
    const slides = await this.geminiService.generateDeck(prompt);
    return { slides };
  }

  @Post('regenerate-slide')
  async regenerateSlide(@Body() body: { slide: Slide; feedback: string }): Promise<{ slide: Slide }> {
    const slide = await this.geminiService.regenerateSlide(body.slide, body.feedback);
    return { slide };
  }

  @Post('speaker-notes')
  async speakerNotes(@Body() body: { title: string; content: string }): Promise<{ notes: string }> {
    const notes = await this.geminiService.generateSpeakerNotes(body.title, body.content);
    return { notes };
  }
}
