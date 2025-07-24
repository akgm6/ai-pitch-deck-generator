import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { OutlineController } from './outline/outline.controller';
import { GeminiService } from './gemini/gemini.service';

@Module({
  imports: [ConfigModule.forRoot()],
  controllers: [AppController, OutlineController],
  providers: [AppService, GeminiService],
})
export class AppModule {}
