import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { AiService } from './ai.service';
import { RequestSchema } from '../requests/schemas/request.schema';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: 'Request', schema: RequestSchema },
    ]),
  ],
  providers: [AiService],
  exports: [AiService],
})
export class AiModule {}
