# Multi-AI Provider Platform

A flexible Next.js 16 application that provides a unified interface to interact with multiple AI model providers. This platform allows users to seamlessly switch between different AI services and models while maintaining a consistent interface.

## 🚀 Features

- **Multi-Provider Support**: Integrate with 7 different AI providers
- **Flexible Model Selection**: Choose from various models within each provider
- **Real-time Streaming**: Support for streaming responses across all providers
- **Settings Management**: Configure API keys, models, temperature, and max tokens
- **Fallback System**: Automatic fallback to available providers
- **Error Handling**: User-friendly error messages for provider-specific issues
- **Dark Mode**: Built-in dark mode support
- **Secure Configuration**: Support for both client-side and server-side API key management

## 🤖 Supported AI Providers

### OpenAI
- **Models**: GPT-4, GPT-4 Turbo, GPT-4o, GPT-4o Mini, GPT-3.5-turbo
- **Get API Key**: [https://platform.openai.com/api-keys](https://platform.openai.com/api-keys)
- **Documentation**: [OpenAI API Docs](https://platform.openai.com/docs)

### Anthropic Claude
- **Models**: Claude 3.5 Sonnet, Claude 3 Opus, Claude 3 Sonnet, Claude 3 Haiku
- **Get API Key**: [https://console.anthropic.com/settings/keys](https://console.anthropic.com/settings/keys)
- **Documentation**: [Anthropic API Docs](https://docs.anthropic.com/)

### Google Gemini
- **Models**: Gemini 2.0 Flash Exp, Gemini 1.5 Pro, Gemini 1.5 Flash, Gemini 1.5 Flash 8B
- **Get API Key**: [https://makersuite.google.com/app/apikey](https://makersuite.google.com/app/apikey)
- **Documentation**: [Google AI Docs](https://ai.google.dev/docs)

### Mistral AI
- **Models**: Mistral Large, Mistral Medium, Mistral Small, Open Mistral, Mixtral
- **Get API Key**: [https://console.mistral.ai/api-keys/](https://console.mistral.ai/api-keys/)
- **Documentation**: [Mistral AI Docs](https://docs.mistral.ai/)

### Groq (Fastest Inference)
- **Models**: Llama 3.3 70B, Llama 3.1 70B, Llama 3.1 8B, Mixtral 8x7B, Gemma2 9B
- **Get API Key**: [https://console.groq.com/keys](https://console.groq.com/keys)
- **Documentation**: [Groq Docs](https://console.groq.com/docs)

### Cohere
- **Models**: Command R Plus, Command R, Command, Command Light
- **Get API Key**: [https://dashboard.cohere.com/api-keys](https://dashboard.cohere.com/api-keys)
- **Documentation**: [Cohere API Docs](https://docs.cohere.com/)

### Together AI (Open-Source Models)
- **Models**: Llama, Mixtral, Qwen, Gemma, and more
- **Get API Key**: [https://api.together.xyz/settings/api-keys](https://api.together.xyz/settings/api-keys)
- **Documentation**: [Together AI Docs](https://docs.together.ai/)

## 📋 Prerequisites

- Node.js 18+ 
- npm, yarn, pnpm, or bun
- API keys for at least one AI provider

## 🛠️ Installation

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd <project-directory>
   ```

2. **Install dependencies**
   ```bash
   npm install
   # or
   yarn install
   # or
   pnpm install
   ```

3. **Configure environment variables** (Optional for server-side API keys)
   
   Copy the example environment file:
   ```bash
   cp .env.example .env
   ```

   Add your API keys to the `.env` file:
   ```env
   OPENAI_API_KEY=your_openai_api_key_here
   ANTHROPIC_API_KEY=your_anthropic_api_key_here
   GOOGLE_API_KEY=your_google_api_key_here
   MISTRAL_API_KEY=your_mistral_api_key_here
   GROQ_API_KEY=your_groq_api_key_here
   COHERE_API_KEY=your_cohere_api_key_here
   TOGETHER_API_KEY=your_together_api_key_here
   ```

   **Note**: You only need to configure the providers you plan to use.

4. **Run the development server**
   ```bash
   npm run dev
   # or
   yarn dev
   # or
   pnpm dev
   ```

5. **Open your browser**
   
   Navigate to [http://localhost:3000](http://localhost:3000)

## 🔧 Configuration

### Client-Side Configuration

The application supports client-side API key management through the Settings UI:

1. Select your preferred AI provider from the dropdown
2. Enter your API key (stored securely in localStorage)
3. Choose a specific model
4. Adjust temperature (0-2) for response creativity
5. Set max tokens for response length
6. Click "Save Settings"

**⚠️ Security Warning**: Client-side API keys are stored in localStorage. Only use this method on trusted devices. For production applications, use server-side environment variables.

### Server-Side Configuration

For production deployments, configure API keys as environment variables:

1. Add keys to your `.env` file (for local development)
2. Configure environment variables in your hosting platform:
   - **Vercel**: Project Settings → Environment Variables
   - **Netlify**: Site Settings → Environment Variables
   - **AWS/Azure/GCP**: Use their respective secret management services

## 📡 API Usage

### Chat Endpoint

**POST** `/api/ai`

Request body:
```json
{
  "provider": "openai",
  "apiKey": "optional-client-side-key",
  "model": "gpt-4o",
  "temperature": 0.7,
  "maxTokens": 2048,
  "messages": [
    { "role": "user", "content": "Hello, how are you?" }
  ],
  "stream": false
}
```

Response (non-streaming):
```json
{
  "content": "I'm doing well, thank you! How can I help you today?",
  "finishReason": "stop",
  "usage": {
    "promptTokens": 10,
    "completionTokens": 15,
    "totalTokens": 25
  }
}
```

Response (streaming):
```
data: {"content":"I'm","done":false}
data: {"content":" doing","done":false}
data: {"content":" well","done":false}
data: {"content":"","done":true}
```

### Get Available Providers

**GET** `/api/ai`

Response:
```json
{
  "providers": ["openai", "anthropic", "google"],
  "hasAnyProvider": true
}
```

## 🏗️ Architecture

### Directory Structure

```
├── app/
│   ├── api/
│   │   └── ai/
│   │       └── route.ts          # API route handler
│   ├── globals.css               # Global styles
│   ├── layout.tsx                # Root layout
│   └── page.tsx                  # Home page
├── components/
│   ├── AIChat.tsx                # Chat interface component
│   └── AIProviderSelector.tsx   # Settings component
├── lib/
│   └── ai/
│       ├── BaseProvider.ts       # Abstract base class
│       ├── providerFactory.ts    # Provider factory
│       └── providers/
│           ├── openai.ts         # OpenAI adapter
│           ├── claude.ts         # Anthropic adapter
│           ├── gemini.ts         # Google adapter
│           ├── mistral.ts        # Mistral adapter
│           ├── groq.ts           # Groq adapter
│           ├── cohere.ts         # Cohere adapter
│           └── together.ts       # Together AI adapter
└── .env.example                  # Environment variables template
```

### Key Components

#### BaseProvider
Abstract class defining the interface all providers must implement:
- `chat()`: Send a message and receive a complete response
- `stream()`: Send a message and receive a streaming response
- `getAvailableModels()`: List supported models
- `getDefaultModel()`: Get the default model
- `validateApiKey()`: Verify API key validity

#### ProviderFactory
Factory class for creating and managing provider instances:
- `createProvider()`: Instantiate a provider with configuration
- `getProviderFromEnv()`: Create provider from environment variables
- `getAvailableProviders()`: List all configured providers
- `getFirstAvailableProvider()`: Get the first working provider (fallback)

## 🔌 Adding a New Provider

To add support for a new AI provider:

1. **Create a provider adapter** in `lib/ai/providers/your-provider.ts`:

```typescript
import { AIProvider, ChatRequest, ChatResponse, StreamChunk } from '../BaseProvider';

export class YourProvider extends AIProvider {
  private client: any;

  constructor(apiKey: string, baseURL?: string) {
    super(apiKey, baseURL);
    // Initialize your provider's client
  }

  getAvailableModels(): string[] {
    return ['model-1', 'model-2'];
  }

  getDefaultModel(): string {
    return 'model-1';
  }

  async validateApiKey(): Promise<boolean> {
    // Implement API key validation
  }

  async chat(request: ChatRequest): Promise<ChatResponse> {
    // Implement chat completion
  }

  async *stream(request: ChatRequest): AsyncGenerator<StreamChunk> {
    // Implement streaming chat
  }
}
```

2. **Add provider type** to `lib/ai/BaseProvider.ts`:

```typescript
export enum ProviderType {
  // ... existing providers
  YOUR_PROVIDER = 'your-provider'
}
```

3. **Register in factory** (`lib/ai/providerFactory.ts`):

```typescript
case ProviderType.YOUR_PROVIDER:
  return new YourProvider(config.apiKey, config.baseURL);
```

4. **Add to UI** (`components/AIProviderSelector.tsx`):

```typescript
const PROVIDER_MODELS: ProviderModels = {
  // ... existing providers
  [ProviderType.YOUR_PROVIDER]: ['model-1', 'model-2'],
};

const PROVIDER_NAMES: Record<ProviderType, string> = {
  // ... existing providers
  [ProviderType.YOUR_PROVIDER]: 'Your Provider',
};
```

5. **Update documentation** with API key instructions and model information.

## 🛡️ Error Handling

The platform provides comprehensive error handling:

- **Invalid API Key** (401): Returned when authentication fails
- **Rate Limit Exceeded** (429): Returned when quota is exceeded
- **Provider Unavailable** (503): No configured providers available
- **Bad Request** (400): Invalid request parameters
- **Internal Error** (500): Unexpected server errors

All errors include descriptive messages to help users troubleshoot issues.

## 🚀 Deployment

### Vercel (Recommended)

1. Push your code to GitHub
2. Import project in Vercel
3. Add environment variables in Project Settings
4. Deploy

### Other Platforms

The application can be deployed to any platform that supports Next.js:
- Netlify
- AWS Amplify
- Azure Static Web Apps
- Google Cloud Run
- Self-hosted with Docker

## 🧪 Testing

To test the application with different providers:

1. Configure at least one provider with a valid API key
2. Open the application
3. Enter a test message in the chat
4. Try both "Send" (complete response) and "Stream" (real-time response)
5. Switch providers and models to test different configurations

## 📝 License

This project is licensed under the MIT License.

## 🤝 Contributing

Contributions are welcome! To contribute:

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests if applicable
5. Submit a pull request

## 📞 Support

For issues, questions, or suggestions:
- Open an issue on GitHub
- Check provider-specific documentation for API-related questions
- Review the error messages for troubleshooting guidance

## 🔗 Resources

- [Next.js Documentation](https://nextjs.org/docs)
- [React Documentation](https://react.dev)
- [TypeScript Documentation](https://www.typescriptlang.org/docs)
- [Tailwind CSS Documentation](https://tailwindcss.com/docs)
