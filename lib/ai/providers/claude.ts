import Anthropic from '@anthropic-ai/sdk';
import { AIProvider, ChatRequest, ChatResponse, StreamChunk, ChatMessage } from '../BaseProvider';

export class ClaudeProvider extends AIProvider {
  private client: Anthropic;

  constructor(apiKey: string, baseURL?: string) {
    super(apiKey, baseURL);
    this.client = new Anthropic({
      apiKey,
      baseURL,
    });
  }

  getAvailableModels(): string[] {
    return [
      'claude-3-5-sonnet-20241022',
      'claude-3-opus-20240229',
      'claude-3-sonnet-20240229',
      'claude-3-haiku-20240307',
    ];
  }

  getDefaultModel(): string {
    return 'claude-3-5-sonnet-20241022';
  }

  async validateApiKey(): Promise<boolean> {
    try {
      await this.client.messages.create({
        model: this.getDefaultModel(),
        max_tokens: 1,
        messages: [{ role: 'user', content: 'test' }],
      });
      return true;
    } catch {
      return false;
    }
  }

  private convertMessages(messages: ChatMessage[]): { system?: string; messages: Array<{ role: 'user' | 'assistant'; content: string }> } {
    const systemMessage = messages.find(m => m.role === 'system');
    const conversationMessages = messages
      .filter(m => m.role !== 'system')
      .map(m => ({
        role: m.role as 'user' | 'assistant',
        content: m.content,
      }));

    return {
      system: systemMessage?.content,
      messages: conversationMessages,
    };
  }

  async chat(request: ChatRequest): Promise<ChatResponse> {
    try {
      const { system, messages } = this.convertMessages(request.messages);
      
      const response = await this.client.messages.create({
        model: request.model || this.getDefaultModel(),
        max_tokens: request.maxTokens || 4096,
        temperature: request.temperature ?? 0.7,
        system,
        messages,
        stream: false,
      });

      const content = response.content[0];
      return {
        content: content.type === 'text' ? content.text : '',
        finishReason: response.stop_reason || undefined,
        usage: {
          promptTokens: response.usage.input_tokens,
          completionTokens: response.usage.output_tokens,
          totalTokens: response.usage.input_tokens + response.usage.output_tokens,
        },
      };
    } catch (error) {
      throw this.normalizeError(error);
    }
  }

  async *stream(request: ChatRequest): AsyncGenerator<StreamChunk> {
    try {
      const { system, messages } = this.convertMessages(request.messages);
      
      const stream = await this.client.messages.create({
        model: request.model || this.getDefaultModel(),
        max_tokens: request.maxTokens || 4096,
        temperature: request.temperature ?? 0.7,
        system,
        messages,
        stream: true,
      });

      for await (const event of stream) {
        if (event.type === 'content_block_delta' && event.delta.type === 'text_delta') {
          yield { content: event.delta.text, done: false };
        } else if (event.type === 'message_stop') {
          yield { content: '', done: true };
        }
      }
    } catch (error) {
      throw this.normalizeError(error);
    }
  }
}
