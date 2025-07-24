import { Injectable, InternalServerErrorException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import axios from 'axios';

export type Slide = {
  slideNumber: number;
  title: string;
  content: string;
  image: string;
};

@Injectable()
export class GeminiService {
  private readonly apiKey: string;
  private readonly apiUrl = 'https://generativelanguage.googleapis.com/v1beta/models/gemini-pro:generateContent';

  constructor(private configService: ConfigService) {
    this.apiKey = this.configService.get('GEMINI_API_KEY') || '';
  }

  private async callGemini(prompt: string): Promise<any> {
    try {
      const response = await axios.post(
        `${this.apiUrl}?key=${this.apiKey}`,
        {
          contents: [{ parts: [{ text: prompt }] }],
        },
        {
          headers: { 'Content-Type': 'application/json' },
        },
      );
      return response.data;
    } catch (error) {
      throw new InternalServerErrorException('Gemini API error: ' + (error.response?.data?.error?.message || error.message));
    }
  }

  async generateDeck(prompt: string): Promise<Slide[]> {
    const geminiPrompt = `${prompt}

Using the above business idea, generate a full investor pitch deck. Return each slide as an object with slideNumber, title, content, and a placeholder image URL.\nCreate 8–10 slides, starting with an Introduction. Write content in a persuasive tone suitable for investors.`;
    const data = await this.callGemini(geminiPrompt);
    // Parse Gemini response to Slide[]
    try {
      const text = data.candidates?.[0]?.content?.parts?.[0]?.text || '';
      const slides = JSON.parse(text);
      return Array.isArray(slides) ? slides : [];
    } catch (e) {
      throw new InternalServerErrorException('Failed to parse Gemini deck response');
    }
  }

  async regenerateSlide(slide: Slide, feedback: string): Promise<Slide> {
    const geminiPrompt = `Revise this pitch deck slide based on user feedback. Return a slide object with updated title and content.\n\nSlide Title: ${slide.title}\nSlide Content: ${slide.content}\nUser Feedback: ${feedback}\n\nImprove clarity, persuasive tone, and include any requested details.`;
    const data = await this.callGemini(geminiPrompt);
    try {
      const text = data.candidates?.[0]?.content?.parts?.[0]?.text || '';
      const regenerated = JSON.parse(text);
      return regenerated;
    } catch (e) {
      throw new InternalServerErrorException('Failed to parse Gemini regenerate response');
    }
  }

  async generateSpeakerNotes(title: string, content: string): Promise<string> {
    const geminiPrompt = `You are an AI pitch assistant. Based on this slide, generate speaker notes a founder could use when presenting to investors.\n\nSlide Title: ${title}\nSlide Content: ${content}\n\nKeep notes concise (3–5 sentences), persuasive, and natural.`;
    const data = await this.callGemini(geminiPrompt);
    try {
      const text = data.candidates?.[0]?.content?.parts?.[0]?.text || '';
      return text.trim();
    } catch (e) {
      throw new InternalServerErrorException('Failed to parse Gemini speaker notes response');
    }
  }
} 