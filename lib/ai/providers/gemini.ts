import { GoogleGenerativeAI } from '@google/generative-ai';
import { AIProvider, ChatRequest, ChatResponse, StreamChunk, ChatMessage } from '../BaseProvider';

export class GeminiProvider extends AIProvider {
  private client: GoogleGenerativeAI;

  constructor(apiKey: string) {
    super(apiKey);
    this.client = new GoogleGenerativeAI(apiKey);
  }

  getAvailableModels(): string[] {
    return [
      'gemini-2.0-flash-exp',
      'gemini-1.5-pro',
      'gemini-1.5-flash',
      'gemini-1.5-flash-8b',
    ];
  }

  getDefaultModel(): string {
    return 'gemini-1.5-pro';
  }

  async validateApiKey(): Promise<boolean> {
    try {
      const model = this.client.getGenerativeModel({ model: this.getDefaultModel() });
      await model.generateContent('test');
      return true;
    } catch {
      return false;
    }
  }

  private convertMessages(messages: ChatMessage[]): { systemInstruction?: string; history: Array<{ role: string; parts: Array<{ text: string }> }>; prompt: string } {
    const systemMessage = messages.find(m => m.role === 'system');
    const conversationMessages = messages.filter(m => m.role !== 'system');
    
    const history = conversationMessages.slice(0, -1).map(m => ({
      role: m.role === 'assistant' ? 'model' : 'user',
      parts: [{ text: m.content }],
    }));

    const lastMessage = conversationMessages[conversationMessages.length - 1];
    const prompt = lastMessage?.content || '';

    return {
      systemInstruction: systemMessage?.content,
      history,
      prompt,
    };
  }

  async chat(request: ChatRequest): Promise<ChatResponse> {
    try {
      const { systemInstruction, history, prompt } = this.convertMessages(request.messages);
      
      const model = this.client.getGenerativeModel({ 
        model: request.model || this.getDefaultModel(),
        systemInstruction,
      });

      const chat = model.startChat({
        history,
        generationConfig: {
          temperature: request.temperature ?? 0.7,
          maxOutputTokens: request.maxTokens,
        },
      });

      const result = await chat.sendMessage(prompt);
      const response = result.response;
      const text = response.text();

      return {
        content: text,
        finishReason: response.candidates?.[0]?.finishReason,
        usage: response.usageMetadata ? {
          promptTokens: response.usageMetadata.promptTokenCount || 0,
          completionTokens: response.usageMetadata.candidatesTokenCount || 0,
          totalTokens: response.usageMetadata.totalTokenCount || 0,
        } : undefined,
      };
    } catch (error) {
      throw this.normalizeError(error);
    }
  }

  async *stream(request: ChatRequest): AsyncGenerator<StreamChunk> {
    try {
      const { systemInstruction, history, prompt } = this.convertMessages(request.messages);
      
      const model = this.client.getGenerativeModel({ 
        model: request.model || this.getDefaultModel(),
        systemInstruction,
      });

      const chat = model.startChat({
        history,
        generationConfig: {
          temperature: request.temperature ?? 0.7,
          maxOutputTokens: request.maxTokens,
        },
      });

      const result = await chat.sendMessageStream(prompt);

      for await (const chunk of result.stream) {
        const text = chunk.text();
        if (text) {
          yield { content: text, done: false };
        }
      }

      yield { content: '', done: true };
    } catch (error) {
      throw this.normalizeError(error);
    }
  }
}
