import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { RequestsModule } from './requests/requests.module';
import { AiModule } from './ai/ai.module';

@Module({
  imports: [
    MongooseModule.forRoot(
      process.env.MONGODB_URI || 'mongodb://localhost:27017/ai-intake',
    ),
    RequestsModule,
    AiModule,
  ],
})
export class AppModule {}
