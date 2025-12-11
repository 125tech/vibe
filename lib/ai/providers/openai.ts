import OpenAI from 'openai';
import { AIProvider, ChatRequest, ChatResponse, StreamChunk } from '../BaseProvider';

export class OpenAIProvider extends AIProvider {
  private client: OpenAI;

  constructor(apiKey: string, baseURL?: string) {
    super(apiKey, baseURL);
    this.client = new OpenAI({
      apiKey,
      baseURL,
    });
  }

  getAvailableModels(): string[] {
    return [
      'gpt-4',
      'gpt-4-turbo',
      'gpt-4o',
      'gpt-4o-mini',
      'gpt-3.5-turbo',
    ];
  }

  getDefaultModel(): string {
    return 'gpt-4o';
  }

  async validateApiKey(): Promise<boolean> {
    try {
      await this.client.models.list();
      return true;
    } catch {
      return false;
    }
  }

  async chat(request: ChatRequest): Promise<ChatResponse> {
    try {
      const response = await this.client.chat.completions.create({
        model: request.model || this.getDefaultModel(),
        messages: request.messages,
        temperature: request.temperature ?? 0.7,
        max_tokens: request.maxTokens,
        stream: false,
      });

      const choice = response.choices[0];
      return {
        content: choice.message.content || '',
        finishReason: choice.finish_reason,
        usage: response.usage ? {
          promptTokens: response.usage.prompt_tokens,
          completionTokens: response.usage.completion_tokens,
          totalTokens: response.usage.total_tokens,
        } : undefined,
      };
    } catch (error) {
      throw this.normalizeError(error);
    }
  }

  async *stream(request: ChatRequest): AsyncGenerator<StreamChunk> {
    try {
      const stream = await this.client.chat.completions.create({
        model: request.model || this.getDefaultModel(),
        messages: request.messages,
        temperature: request.temperature ?? 0.7,
        max_tokens: request.maxTokens,
        stream: true,
      });

      for await (const chunk of stream) {
        const content = chunk.choices[0]?.delta?.content || '';
        const done = chunk.choices[0]?.finish_reason !== null;
        
        if (content) {
          yield { content, done: false };
        }
        
        if (done) {
          yield { content: '', done: true };
        }
      }
    } catch (error) {
      throw this.normalizeError(error);
    }
  }
}
