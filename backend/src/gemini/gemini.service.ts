import { Injectable, InternalServerErrorException, Logger } from '@nestjs/common';
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
  private readonly apiUrl = 'https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent';
  private readonly logger = new Logger(GeminiService.name);

  constructor(private configService: ConfigService) {
    this.apiKey = this.configService.get('GEMINI_API_KEY') || process.env.GEMINI_API_KEY || '';
    if (!this.apiKey) {
      this.logger.error('GEMINI_API_KEY is missing. Please set it in your .env file.');
      throw new InternalServerErrorException('GEMINI_API_KEY is missing. Please set it in your .env file.');
    }
  }

  /*
  private async callGemini(prompt: string): Promise<any> {
    try {
      const response = await axios.post(
        `${this.apiUrl}?key=${this.apiKey}`,
        {
          contents: [
            {
              parts: [
                { text: prompt },
              ],
            },
          ],
        },
        {
          headers: {
            'Content-Type': 'application/json',
            // No Authorization header for v1beta with key param
          },
        },
      );
      const data = response.data as any;
      if (!data || !data.candidates) {
        this.logger.error('Unexpected Gemini API response:', data);
        throw new InternalServerErrorException('Unexpected Gemini API response.');
      }
      return data;
    } catch (error) {
      this.logger.error('Gemini API error:', error.response?.data || error.message);
      throw new InternalServerErrorException('Gemini API error: ' + (error.response?.data?.error?.message || error.message));
    }
  }
  */

  // MOCK IMPLEMENTATION: Generate a mock deck of slides
  async generateDeck(prompt: string): Promise<Slide[]> {
    /*
    const geminiPrompt = `${prompt}
\nUsing the above business idea, generate a full investor pitch deck. Return each slide as an object with slideNumber, title, content, and a placeholder image URL.\nCreate 8–10 slides, starting with an Introduction. Write content in a persuasive tone suitable for investors.`;
    const data = await this.callGemini(geminiPrompt);
    try {
      const text = data.candidates?.[0]?.content?.parts?.[0]?.text || '';
      const slides = JSON.parse(text);
      return Array.isArray(slides) ? slides : [];
    } catch (e) {
      this.logger.error('Failed to parse Gemini deck response:', e, data);
      throw new InternalServerErrorException('Failed to parse Gemini deck response');
    }
    */
    // Simple mock: parse company name and problem from prompt
    const companyMatch = prompt.match(/Company Name: (.*)/);
    const company = companyMatch ? companyMatch[1].trim() : 'Your Company';
    const problemMatch = prompt.match(/Problem Statement: (.*)/);
    const problem = problemMatch ? problemMatch[1].trim() : 'a major problem';
    return [
      { slideNumber: 1, title: 'Introduction', content: `Welcome to ${company}, where we solve ${problem}.`, image: '' },
      { slideNumber: 2, title: 'Problem Statement', content: problem, image: '' },
      { slideNumber: 3, title: 'Our Solution', content: `How ${company} addresses the problem.`, image: '' },
      { slideNumber: 4, title: 'Market Opportunity', content: 'The size and growth of the target market.', image: '' },
      { slideNumber: 5, title: 'Business Model', content: 'How we make money.', image: '' },
      { slideNumber: 6, title: 'Go-to-Market Strategy', content: 'How we plan to acquire customers.', image: '' },
      { slideNumber: 7, title: 'Financials', content: 'Key financial projections and metrics.', image: '' },
      { slideNumber: 8, title: 'Team', content: 'Our experienced and passionate team.', image: '' },
      { slideNumber: 9, title: 'Closing', content: 'Thank you for your attention. Let’s build the future together!', image: '' },
    ];
  }

  // MOCK IMPLEMENTATION: Regenerate a single slide
  async regenerateSlide(slide: Slide, feedback: string): Promise<Slide> {
    /*
    const geminiPrompt = `Revise this pitch deck slide based on user feedback. Return a slide object with updated title and content.\n\nSlide Title: ${slide.title}\nSlide Content: ${slide.content}\nUser Feedback: ${feedback}\n\nImprove clarity, persuasive tone, and include any requested details.`;
    const data = await this.callGemini(geminiPrompt);
    try {
      const text = data.candidates?.[0]?.content?.parts?.[0]?.text || '';
      const regenerated = JSON.parse(text);
      return regenerated;
    } catch (e) {
      this.logger.error('Failed to parse Gemini regenerate response:', e, data);
      throw new InternalServerErrorException('Failed to parse Gemini regenerate response');
    }
    */
    // Mock: keep title, update content with feedback
    return {
      ...slide,
      content: `${slide.content} (Revised: ${feedback || 'improved wording'})`,
    };
  }

  // MOCK IMPLEMENTATION: Generate speaker notes
  async generateSpeakerNotes(title: string, content: string): Promise<string> {
    /*
    const geminiPrompt = `You are an AI pitch assistant. Based on this slide, generate speaker notes a founder could use when presenting to investors.\n\nSlide Title: ${title}\nSlide Content: ${content}\n\nKeep notes concise (3–5 sentences), persuasive, and natural.`;
    const data = await this.callGemini(geminiPrompt);
    try {
      const text = data.candidates?.[0]?.content?.parts?.[0]?.text || '';
      return text.trim();
    } catch (e) {
      this.logger.error('Failed to parse Gemini speaker notes response:', e, data);
      throw new InternalServerErrorException('Failed to parse Gemini speaker notes response');
    }
    */
    // Mock: return a generic speaker note
    return `When presenting "${title}", emphasize: ${content.slice(0, 60)}...`;
  }
} 