import { Mistral } from '@mistralai/mistralai';
import { AIProvider, ChatRequest, ChatResponse, StreamChunk } from '../BaseProvider';

export class MistralProvider extends AIProvider {
  private client: Mistral;

  constructor(apiKey: string, baseURL?: string) {
    super(apiKey, baseURL);
    this.client = new Mistral({ apiKey });
  }

  getAvailableModels(): string[] {
    return [
      'mistral-large-latest',
      'mistral-medium-latest',
      'mistral-small-latest',
      'open-mistral-7b',
      'open-mixtral-8x7b',
      'open-mixtral-8x22b',
    ];
  }

  getDefaultModel(): string {
    return 'mistral-large-latest';
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
      const response = await this.client.chat.complete({
        model: request.model || this.getDefaultModel(),
        messages: request.messages,
        temperature: request.temperature ?? 0.7,
        maxTokens: request.maxTokens,
      });

      const choice = response.choices?.[0];
      const content = choice?.message?.content;
      const contentString = typeof content === 'string' ? content : '';
      
      return {
        content: contentString,
        finishReason: choice?.finishReason,
        usage: response.usage ? {
          promptTokens: response.usage.promptTokens || 0,
          completionTokens: response.usage.completionTokens || 0,
          totalTokens: response.usage.totalTokens || 0,
        } : undefined,
      };
    } catch (error) {
      throw this.normalizeError(error);
    }
  }

  async *stream(request: ChatRequest): AsyncGenerator<StreamChunk> {
    try {
      const stream = await this.client.chat.stream({
        model: request.model || this.getDefaultModel(),
        messages: request.messages,
        temperature: request.temperature ?? 0.7,
        maxTokens: request.maxTokens,
      });

      for await (const chunk of stream) {
        const rawContent = chunk.data.choices?.[0]?.delta?.content;
        const content = typeof rawContent === 'string' ? rawContent : '';
        const done = chunk.data.choices?.[0]?.finishReason !== null && chunk.data.choices?.[0]?.finishReason !== undefined;
        
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
