import { Injectable, Logger } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { CreateRequestDto } from './dto/create-request.dto';
import { IRequest } from './schemas/request.schema';
import { AiService } from '../ai/ai.service';

@Injectable()
export class RequestsService {
  private readonly logger = new Logger(RequestsService.name);

  constructor(
    @InjectModel('Request') private requestModel: Model<IRequest>,
    private aiService: AiService,
  ) {}

  /**
   * Create a new request and trigger async AI enrichment.
   * Returns the created request immediately without waiting for AI processing.
   */
  async create(createRequestDto: CreateRequestDto): Promise<IRequest> {
    try {
      // Save the request immediately
      const newRequest = new this.requestModel(createRequestDto);
      const savedRequest = await newRequest.save();

      this.logger.log(`✅ Request created: ${savedRequest._id}`);

      // Trigger AI enrichment asynchronously without waiting
      // Using setImmediate for fire-and-forget async call
      setImmediate(() => {
        this.aiService.enrichRequest(
          String(savedRequest._id),
          createRequestDto.name,
          createRequestDto.email,
          createRequestDto.message,
        );
      });

      return savedRequest.toObject();
    } catch (error) {
      this.logger.error(`❌ Error creating request: ${error.message}`);
      throw error;
    }
  }

  /**
   * Fetch all requests with optional category filtering and pagination.
   */
  async findAll(
    page: number = 1,
    limit: number = 10,
    category?: string,
  ): Promise<{
    data: IRequest[];
    total: number;
    page: number;
    limit: number;
    pages: number;
  }> {
    try {
      const skip = (page - 1) * limit;

      // Build filter query
      const filter: any = {};
      if (category && category !== 'all') {
        filter.category = category;
      }

      // Fetch requests and total count in parallel
      const [requests, total] = await Promise.all([
        this.requestModel
          .find(filter)
          .sort({ createdAt: -1 })
          .skip(skip)
          .limit(limit)
          .lean(),
        this.requestModel.countDocuments(filter),
      ]);

      const pages = Math.ceil(total / limit);

      this.logger.debug(
        `📋 Fetched ${requests.length} requests (page ${page}/${pages}, total ${total})`,
      );

      return {
        data: requests as any,
        total,
        page,
        limit,
        pages,
      };
    } catch (error) {
      this.logger.error(`❌ Error fetching requests: ${error.message}`);
      throw error;
    }
  }
}
