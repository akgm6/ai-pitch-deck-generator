// MOCK USAGE: This controller uses generateMockSlides instead of the real OpenAI service
// because OpenAI free credit has run out. This is a temporary change to allow continued development/testing.
// Replace with the real OpenAI call when access is restored.
import { Controller, Post, Body } from '@nestjs/common';
import { generateMockSlides, Slide } from '../openai/openai.service';

@Controller('generate-outline')
export class OutlineController {
  @Post()
  async generate(@Body('prompt') prompt: string): Promise<{ slides: Slide[] }> {
    const slides = generateMockSlides(prompt);
    return { slides };
  }
}
