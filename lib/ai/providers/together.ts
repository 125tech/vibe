import Together from 'together-ai';
import { AIProvider, ChatRequest, ChatResponse, StreamChunk } from '../BaseProvider';

export class TogetherProvider extends AIProvider {
  private client: Together;

  constructor(apiKey: string, baseURL?: string) {
    super(apiKey, baseURL);
    this.client = new Together({ apiKey });
  }

  getAvailableModels(): string[] {
    return [
      'meta-llama/Meta-Llama-3.1-70B-Instruct-Turbo',
      'meta-llama/Meta-Llama-3.1-8B-Instruct-Turbo',
      'mistralai/Mixtral-8x7B-Instruct-v0.1',
      'mistralai/Mistral-7B-Instruct-v0.2',
      'Qwen/Qwen2.5-72B-Instruct-Turbo',
      'google/gemma-2-27b-it',
    ];
  }

  getDefaultModel(): string {
    return 'meta-llama/Meta-Llama-3.1-70B-Instruct-Turbo';
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
        content: choice.message?.content || '',
        finishReason: choice.finish_reason || undefined,
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
