import { Injectable, Logger } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import axios from 'axios';
import { IRequest } from '../requests/schemas/request.schema';

interface AIResponse {
  category: 'billing' | 'support' | 'feedback' | 'general';
  summary: string;
  urgency: 'low' | 'medium' | 'high';
}

@Injectable()
export class AiService {
  private readonly logger = new Logger(AiService.name);
  private readonly openrouterApiKey = process.env.OPENROUTER_API_KEY;
  private readonly openrouterApiUrl = 'https://openrouter.ai/api/v1/chat/completions';

  constructor(
    @InjectModel('Request') private requestModel: Model<IRequest>,
  ) {}

  /**
   * Enriches a request with AI-generated category, summary, and urgency.
   * This method is designed to run asynchronously without blocking the initial response.
   * It gracefully handles errors and stores null values if enrichment fails.
   */
  async enrichRequest(requestId: string, name: string, email: string, message: string): Promise<void> {
    try {
      this.logger.debug(`🤖 Starting AI enrichment for request ${requestId}`);

      const aiResponse = await this.callOpenRouter(name, email, message);

      if (!aiResponse) {
        this.logger.warn(`⚠️ No AI response for request ${requestId}. Storing null fields.`);
        return;
      }

      // Update the request record with AI-generated fields
      await this.requestModel.findByIdAndUpdate(
        requestId,
        {
          category: aiResponse.category,
          summary: aiResponse.summary,
          urgency: aiResponse.urgency,
        },
        { new: true },
      );

      this.logger.log(`✅ Successfully enriched request ${requestId} with category: ${aiResponse.category}, urgency: ${aiResponse.urgency}`);
    } catch (error) {
      this.logger.error(
        `❌ Error enriching request ${requestId}: ${error.message}`,
        error.stack,
      );
      // Silently fail - the request already exists in DB with null AI fields
    }
  }

  /**
   * Calls OpenRouter API with a structured prompt.
   * The prompt is designed to return ONLY valid JSON matching the required schema.
   */
  private async callOpenRouter(
    name: string,
    email: string,
    message: string,
  ): Promise<AIResponse | null> {
    try {
      const systemPrompt = this.buildSystemPrompt();
      const userMessage = `Name: ${name}\nEmail: ${email}\nMessage: ${message}`;

      this.logger.debug(`📡 Calling OpenRouter API...`);

      const response = await axios.post(
        this.openrouterApiUrl,
        {
          model: 'mistralai/mistral-7b-instruct:free',
          messages: [
            {
              role: 'system',
              content: systemPrompt,
            },
            {
              role: 'user',
              content: userMessage,
            },
          ],
          max_tokens: 500,
        },
        {
          headers: {
            'Authorization': `Bearer ${this.openrouterApiKey}`,
            'Content-Type': 'application/json',
          },
          timeout: 30000,
        },
      );

      const content = response.data?.choices?.[0]?.message?.content;

      if (!content) {
        this.logger.warn('🤔 Empty response from OpenRouter');
        return null;
      }

      return this.parseAIResponse(content);
    } catch (error) {
      this.logger.error(`🔴 OpenRouter API error: ${error.message}`);
      return null;
    }
  }

  /**
   * Parses the AI response and validates it matches our schema.
   * Includes fallback values if parsing fails.
   */
  private parseAIResponse(content: string): AIResponse | null {
    try {
      // Try to extract JSON from the response
      // The model might include extra text, so we look for JSON pattern
      const jsonMatch = content.match(/\{[\s\S]*\}/);

      if (!jsonMatch) {
        this.logger.warn('⚠️ No JSON found in AI response');
        return this.getFallbackResponse();
      }

      const parsed = JSON.parse(jsonMatch[0]);

      // Validate the response has required fields
      if (!parsed.category || !parsed.summary || !parsed.urgency) {
        this.logger.warn('⚠️ AI response missing required fields');
        return this.getFallbackResponse();
      }

      // Validate enum values
      if (!['billing', 'support', 'feedback', 'general'].includes(parsed.category)) {
        this.logger.warn(`⚠️ Invalid category: ${parsed.category}`);
        return this.getFallbackResponse();
      }

      if (!['low', 'medium', 'high'].includes(parsed.urgency)) {
        this.logger.warn(`⚠️ Invalid urgency: ${parsed.urgency}`);
        return this.getFallbackResponse();
      }

      return {
        category: parsed.category,
        summary: String(parsed.summary).substring(0, 200), // Cap at 200 chars
        urgency: parsed.urgency,
      };
    } catch (error) {
      this.logger.error(`🔴 JSON parse error: ${error.message}`);
      return this.getFallbackResponse();
    }
  }

  /**
   * Returns a sensible fallback response when AI parsing fails.
   */
  private getFallbackResponse(): AIResponse {
    return {
      category: 'general',
      summary: 'Request received and will be reviewed by support team.',
      urgency: 'medium',
    };
  }

  /**
   * Constructs the system prompt that guides the AI model.
   * Emphasizes JSON-only output to maximize parsing success.
   */
  private buildSystemPrompt(): string {
    return `You are an expert support triage assistant for a customer request intake system.

Your task is to analyze incoming customer requests and categorize them for appropriate handling.

You MUST respond with ONLY a valid JSON object. Do not include any markdown, code blocks, explanations, or additional text.

The JSON response must have exactly this structure:
{
  "category": "billing" | "support" | "feedback" | "general",
  "summary": "A concise one-sentence summary of the main issue or request",
  "urgency": "low" | "medium" | "high"
}

Categorization rules:
- "billing": Issues related to payments, subscriptions, refunds, or charges
- "support": Technical issues, feature requests, or account problems
- "feedback": General feedback, suggestions, or non-urgent comments
- "general": Anything that doesn't fit the above categories

Urgency rules:
- "high": Critical issues, security concerns, or account access problems
- "medium": Standard requests or moderate issues requiring quick attention
- "low": General feedback, non-urgent inquiries, or compliments

Respond only with the JSON object. No explanations, no markdown, no extra text.`;
  }
}
