// MOCK IMPLEMENTATION: generateMockSlides is used as a temporary replacement for OpenAI API calls
// because the OpenAI free credit has run out. This function simulates realistic pitch deck slide titles
// for a given prompt and should be removed or replaced when OpenAI access is restored.
import { Injectable } from '@nestjs/common';
import OpenAI from 'openai';
import { ConfigService } from '@nestjs/config';

export type Slide = {
  slideNumber: number;
  title: string;
  content: string;
  image: string;
};

function parsePrompt(prompt: string) {
  // Very basic parsing for demo purposes
  const companyName = /Company Name:\s*(.*)/i.exec(prompt)?.[1]?.trim() || '';
  const industry = /Industry:\s*(.*)/i.exec(prompt)?.[1]?.trim() || '';
  const problem = /Problem Statement:\s*(.*)/i.exec(prompt)?.[1]?.trim() || '';
  const solution = /Solution:\s*(.*)/i.exec(prompt)?.[1]?.trim() || '';
  const businessModel = /Business Model:\s*(.*)/i.exec(prompt)?.[1]?.trim() || '';
  const financials = /Financials:\s*(.*)/i.exec(prompt)?.[1]?.trim() || '';
  return { companyName, industry, problem, solution, businessModel, financials };
}

@Injectable()
export class OpenaiService {
  private openai: OpenAI;

  constructor(private configService: ConfigService) {
    this.openai = new OpenAI({
      apiKey: this.configService.get('OPENAI_API_KEY'),
    });
  }

  async generateOutline(prompt: string): Promise<string[]> {
    const response = await this.openai.chat.completions.create({
      model: 'gpt-3.5-turbo',
      messages: [{ role: 'user', content: prompt }],
      temperature: 0.7,
    });

    return response.choices[0].message?.content
      ?.split('\n')
      .filter(line => line.trim()) ?? [];
  }
}

// Enhanced mock: returns full slide objects with realistic, prompt-relevant content
export function generateMockSlides(prompt: string): Slide[] {
  const { companyName, industry, problem, solution, businessModel, financials } = parsePrompt(prompt);
  return [
    {
      slideNumber: 1,
      title: 'Introduction',
      content:
        companyName && problem
          ? `Welcome to ${companyName}, an innovative leader in the ${industry || 'industry'}. ${companyName} was founded to solve a critical challenge: ${problem} Our mission is to transform the way our clients and partners achieve success through our unique approach and commitment to excellence.`
          : `Welcome to ${companyName || 'our company'}, an innovative leader in the ${industry || 'industry'}. We are dedicated to transforming the way our clients and partners achieve success through our unique approach and commitment to excellence.`,
      image: 'https://via.placeholder.com/400x200',
    },
    {
      slideNumber: 2,
      title: 'Problem Statement',
      content:
        companyName && problem
          ? `At ${companyName}, we recognize the core challenge: ${problem} This issue affects countless individuals and businesses in the ${industry || 'industry'}, and addressing it is at the heart of our mission.`
          : problem
            ? `The core challenge we address is: ${problem}`
            : 'Our target market faces significant challenges that have not been adequately addressed by existing solutions.',
      image: 'https://via.placeholder.com/400x200',
    },
    {
      slideNumber: 3,
      title: 'Our Solution',
      content:
        solution
          ? `Our solution: ${solution} This approach is designed to directly address the pain points of our customers and deliver measurable value.`
          : 'We have developed a comprehensive solution that is tailored to the needs of our market, leveraging the latest technology and best practices.',
      image: 'https://via.placeholder.com/400x200',
    },
    {
      slideNumber: 4,
      title: 'Market Opportunity',
      content:
        industry
          ? `The ${industry} sector is experiencing rapid growth, presenting a significant opportunity for ${companyName || 'our company'} to capture market share and expand our impact.`
          : 'The market is expanding rapidly, and our company is well-positioned to take advantage of these trends.',
      image: 'https://via.placeholder.com/400x200',
    },
    {
      slideNumber: 5,
      title: 'Business Model',
      content:
        businessModel
          ? `Our business model: ${businessModel} This model ensures sustainable revenue and scalability as we grow.`
          : 'We operate on a proven business model that supports long-term growth and profitability.',
      image: 'https://via.placeholder.com/400x200',
    },
    {
      slideNumber: 6,
      title: 'Financials',
      content:
        financials
          ? `Key financial highlights: ${financials}`
          : 'Our financial projections demonstrate strong growth potential and a clear path to profitability.',
      image: 'https://via.placeholder.com/400x200',
    },
    {
      slideNumber: 7,
      title: 'Go-to-Market Strategy',
      content:
        `We will launch ${companyName || 'our solution'} through targeted marketing, strategic partnerships, and a robust sales pipeline. Our approach is designed to maximize reach and accelerate adoption in the ${industry || 'target'} market.`,
      image: 'https://via.placeholder.com/400x200',
    },
    {
      slideNumber: 8,
      title: 'Team',
      content:
        `${companyName || 'Our company'} is led by a team of experienced professionals with deep expertise in the ${industry || 'industry'}. Our collective skills and passion drive our mission forward.`,
      image: 'https://via.placeholder.com/400x200',
    },
    {
      slideNumber: 9,
      title: 'Closing & Call to Action',
      content:
        `Join us as we revolutionize the ${industry || 'industry'} with ${companyName || 'our company'}. We invite you to partner with us and be part of our journey to success.`,
      image: 'https://via.placeholder.com/400x200',
    },
  ];
}