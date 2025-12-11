import { CohereClient } from 'cohere-ai';
import { AIProvider, ChatRequest, ChatResponse, StreamChunk, ChatMessage } from '../BaseProvider';

export class CohereProvider extends AIProvider {
  private client: CohereClient;

  constructor(apiKey: string) {
    super(apiKey);
    this.client = new CohereClient({ token: apiKey });
  }

  getAvailableModels(): string[] {
    return [
      'command-r-plus',
      'command-r',
      'command',
      'command-light',
    ];
  }

  getDefaultModel(): string {
    return 'command-r-plus';
  }

  async validateApiKey(): Promise<boolean> {
    try {
      await this.client.chat({
        model: this.getDefaultModel(),
        message: 'test',
      });
      return true;
    } catch {
      return false;
    }
  }

  private convertMessages(messages: ChatMessage[]): { preamble?: string; chatHistory: Array<{ role: 'USER' | 'CHATBOT'; message: string }>; message: string } {
    const systemMessage = messages.find(m => m.role === 'system');
    const conversationMessages = messages.filter(m => m.role !== 'system');
    
    const chatHistory = conversationMessages.slice(0, -1).map(m => ({
      role: m.role === 'assistant' ? 'CHATBOT' as const : 'USER' as const,
      message: m.content,
    }));

    const lastMessage = conversationMessages[conversationMessages.length - 1];
    const message = lastMessage?.content || '';

    return {
      preamble: systemMessage?.content,
      chatHistory,
      message,
    };
  }

  async chat(request: ChatRequest): Promise<ChatResponse> {
    try {
      const { preamble, chatHistory, message } = this.convertMessages(request.messages);
      
      const response = await this.client.chat({
        model: request.model || this.getDefaultModel(),
        message,
        chatHistory,
        preamble,
        temperature: request.temperature ?? 0.7,
        maxTokens: request.maxTokens,
      });

      return {
        content: response.text,
        finishReason: response.finishReason,
        usage: response.meta?.billedUnits ? {
          promptTokens: response.meta.billedUnits.inputTokens || 0,
          completionTokens: response.meta.billedUnits.outputTokens || 0,
          totalTokens: (response.meta.billedUnits.inputTokens || 0) + (response.meta.billedUnits.outputTokens || 0),
        } : undefined,
      };
    } catch (error) {
      throw this.normalizeError(error);
    }
  }

  async *stream(request: ChatRequest): AsyncGenerator<StreamChunk> {
    try {
      const { preamble, chatHistory, message } = this.convertMessages(request.messages);
      
      const stream = await this.client.chatStream({
        model: request.model || this.getDefaultModel(),
        message,
        chatHistory,
        preamble,
        temperature: request.temperature ?? 0.7,
        maxTokens: request.maxTokens,
      });

      for await (const chunk of stream) {
        if (chunk.eventType === 'text-generation') {
          yield { content: chunk.text, done: false };
        } else if (chunk.eventType === 'stream-end') {
          yield { content: '', done: true };
        }
      }
    } catch (error) {
      throw this.normalizeError(error);
    }
  }
}
