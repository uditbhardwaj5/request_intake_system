import {
  Controller,
  Post,
  Get,
  Body,
  Query,
  HttpCode,
  HttpStatus,
  Logger,
} from '@nestjs/common';
import { RequestsService } from './requests.service';
import { CreateRequestDto } from './dto/create-request.dto';
import { IRequest } from './schemas/request.schema';

@Controller('requests')
export class RequestsController {
  private readonly logger = new Logger(RequestsController.name);

  constructor(private readonly requestsService: RequestsService) {}

  /**
   * POST /requests
   * Accept user input, save immediately, trigger AI enrichment async, respond 201.
   * The controller delegates all business logic to the service.
   * AI enrichment happens fire-and-forget; this endpoint doesn't wait for it.
   */
  @Post()
  @HttpCode(HttpStatus.CREATED)
  async create(@Body() createRequestDto: CreateRequestDto): Promise<{
    statusCode: number;
    message: string;
    data: any;
  }> {
    this.logger.log(`📝 New request submission from: ${createRequestDto.email}`);

    const request = await this.requestsService.create(createRequestDto);

    return {
      statusCode: HttpStatus.CREATED,
      message: 'Request submitted successfully. Our AI is analyzing your request.',
      data: request,
    };
  }

  /**
   * GET /requests
   * Fetch paginated list of requests with optional category filtering.
   * Query params: page=1, limit=10, category=billing|support|feedback|general|all
   */
  @Get()
  async findAll(
    @Query('page') page: number = 1,
    @Query('limit') limit: number = 10,
    @Query('category') category?: string,
  ): Promise<{
    statusCode: number;
    message: string;
    data: any;
  }> {
    const result = await this.requestsService.findAll(page, limit, category);

    return {
      statusCode: HttpStatus.OK,
      message: 'Requests retrieved successfully',
      data: result,
    };
  }
}
