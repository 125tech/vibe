import { AIProvider, ProviderType, ProviderConfig } from './BaseProvider';
import { OpenAIProvider } from './providers/openai';
import { ClaudeProvider } from './providers/claude';
import { GeminiProvider } from './providers/gemini';
import { MistralProvider } from './providers/mistral';
import { GroqProvider } from './providers/groq';
import { CohereProvider } from './providers/cohere';
import { TogetherProvider } from './providers/together';

export class ProviderFactory {
  static createProvider(config: ProviderConfig): AIProvider {
    if (!config.apiKey) {
      throw new Error(`API key is required for provider: ${config.type}`);
    }

    switch (config.type) {
      case ProviderType.OPENAI:
        return new OpenAIProvider(config.apiKey, config.baseURL);
      
      case ProviderType.ANTHROPIC:
        return new ClaudeProvider(config.apiKey, config.baseURL);
      
      case ProviderType.GOOGLE:
        return new GeminiProvider(config.apiKey);
      
      case ProviderType.MISTRAL:
        return new MistralProvider(config.apiKey, config.baseURL);
      
      case ProviderType.GROQ:
        return new GroqProvider(config.apiKey, config.baseURL);
      
      case ProviderType.COHERE:
        return new CohereProvider(config.apiKey);
      
      case ProviderType.TOGETHER:
        return new TogetherProvider(config.apiKey, config.baseURL);
      
      default:
        throw new Error(`Unsupported provider type: ${config.type}`);
    }
  }

  static getProviderFromEnv(type: ProviderType): AIProvider | null {
    const envKeyMap: Record<ProviderType, string> = {
      [ProviderType.OPENAI]: 'OPENAI_API_KEY',
      [ProviderType.ANTHROPIC]: 'ANTHROPIC_API_KEY',
      [ProviderType.GOOGLE]: 'GOOGLE_API_KEY',
      [ProviderType.MISTRAL]: 'MISTRAL_API_KEY',
      [ProviderType.GROQ]: 'GROQ_API_KEY',
      [ProviderType.COHERE]: 'COHERE_API_KEY',
      [ProviderType.TOGETHER]: 'TOGETHER_API_KEY',
    };

    const apiKey = process.env[envKeyMap[type]];
    
    if (!apiKey) {
      return null;
    }

    return this.createProvider({ type, apiKey });
  }

  static async getAvailableProviders(): Promise<ProviderType[]> {
    const providers: ProviderType[] = [];
    
    for (const type of Object.values(ProviderType)) {
      const provider = this.getProviderFromEnv(type);
      if (provider) {
        providers.push(type);
      }
    }

    return providers;
  }

  static async getFirstAvailableProvider(): Promise<AIProvider | null> {
    for (const type of Object.values(ProviderType)) {
      const provider = this.getProviderFromEnv(type);
      if (provider) {
        try {
          const isValid = await provider.validateApiKey();
          if (isValid) {
            return provider;
          }
        } catch {
          continue;
        }
      }
    }

    return null;
  }
}
