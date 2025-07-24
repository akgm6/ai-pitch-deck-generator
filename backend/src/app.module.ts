import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { OpenaiService } from './openai/openai.service';
import { OutlineController } from './outline/outline.controller';

@Module({
  imports: [ConfigModule.forRoot()],
  controllers: [AppController, OutlineController],
  providers: [AppService, OpenaiService],
})
export class AppModule {}
