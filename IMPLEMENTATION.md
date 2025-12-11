# Multi-AI Provider Implementation

## Overview

This document provides a technical overview of the multi-AI provider abstraction layer implemented in this Next.js application.

## Architecture

### Core Components

#### 1. BaseProvider (Abstract Class)
Located at: `lib/ai/BaseProvider.ts`

The foundation of the provider system, defining:
- **Interfaces**:
  - `ChatMessage`: Normalized message format (role, content)
  - `ChatRequest`: Unified request format
  - `ChatResponse`: Standardized response format
  - `StreamChunk`: Streaming data structure
  - `ProviderConfig`: Provider configuration

- **Abstract Methods**:
  - `chat()`: Non-streaming completion
  - `stream()`: Streaming completion
  - `getAvailableModels()`: List supported models
  - `getDefaultModel()`: Get default model
  - `validateApiKey()`: Verify API key

#### 2. Provider Adapters
Located at: `lib/ai/providers/*.ts`

Each provider implements the `AIProvider` abstract class:

- **OpenAI** (`openai.ts`): Uses the official OpenAI SDK
- **Anthropic** (`claude.ts`): Uses @anthropic-ai/sdk
- **Google** (`gemini.ts`): Uses @google/generative-ai
- **Mistral** (`mistral.ts`): Uses @mistralai/mistralai
- **Groq** (`groq.ts`): Uses groq-sdk
- **Cohere** (`cohere.ts`): Uses cohere-ai
- **Together AI** (`together.ts`): Uses together-ai

Each adapter handles:
- Provider-specific API client initialization
- Message format conversion (system messages, role mapping)
- Response normalization
- Error handling and transformation
- Streaming implementation

#### 3. ProviderFactory
Located at: `lib/ai/providerFactory.ts`

Factory pattern implementation providing:
- `createProvider()`: Instantiate provider with config
- `getProviderFromEnv()`: Create from environment variables
- `getAvailableProviders()`: List configured providers
- `getFirstAvailableProvider()`: Automatic fallback logic

#### 4. API Route
Located at: `app/api/ai/route.ts`

RESTful API endpoints:
- **POST /api/ai**: Chat completion
  - Supports both streaming and non-streaming
  - Client-side or server-side API keys
  - Automatic provider fallback
  - Comprehensive error handling
- **GET /api/ai**: List available providers

#### 5. UI Components

**AIProviderSelector** (`components/AIProviderSelector.tsx`):
- Provider selection dropdown
- API key input (with show/hide toggle)
- Model selection
- Temperature slider (0-2)
- Max tokens input
- localStorage persistence
- Security warning display

**AIChat** (`components/AIChat.tsx`):
- Message history display
- Input field with keyboard support
- Send button (complete response)
- Stream button (streaming response)
- Error display
- Loading states

## Data Flow

### Non-Streaming Request Flow

1. User enters message in `AIChat` component
2. Component reads settings from localStorage
3. POST request sent to `/api/ai` with:
   - Provider type
   - API key
   - Model
   - Parameters (temperature, maxTokens)
   - Messages array
4. API route:
   - Creates provider instance via factory
   - Validates configuration
   - Calls `provider.chat()`
5. Provider adapter:
   - Converts messages to provider format
   - Makes API call
   - Normalizes response
6. Response returned to client
7. UI updated with assistant message

### Streaming Request Flow

1. Same initial steps as non-streaming
2. API route creates ReadableStream
3. For each chunk from `provider.stream()`:
   - Encode as Server-Sent Events
   - Send to client
4. Client reads stream chunks
5. UI updates incrementally

## Provider-Specific Adaptations

### OpenAI
- Direct mapping (messages already in OpenAI format)
- Standard streaming with delta content

### Anthropic Claude
- System message extracted to separate parameter
- Role mapping: assistant → assistant
- Streaming via content_block_delta events

### Google Gemini
- System message → systemInstruction
- Messages converted to chat history
- Last message → prompt
- Role mapping: assistant → model
- Streaming via sendMessageStream

### Mistral
- Content can be string or ContentChunk[]
- Type checking required for content extraction
- Standard OpenAI-like format

### Groq
- OpenAI-compatible API
- Fast inference optimized for Llama models
- Standard streaming implementation

### Cohere
- System message → preamble
- Chat history format different from OpenAI
- Role mapping: assistant → CHATBOT, user → USER
- Streaming via chatStream with event types

### Together AI
- OpenAI-compatible API
- Access to multiple open-source models
- Standard streaming implementation

## Error Handling

### API-Level Errors
- **401 Unauthorized**: Invalid API key
- **429 Too Many Requests**: Rate limit/quota exceeded
- **503 Service Unavailable**: No providers configured
- **400 Bad Request**: Invalid parameters
- **500 Internal Server Error**: Unexpected errors

### Error Propagation
1. Provider throws error
2. `normalizeError()` converts to Error object
3. API route catches and categorizes
4. Appropriate HTTP status code returned
5. Client displays user-friendly message

## Security Considerations

### Client-Side API Keys
- Stored in localStorage
- Warning displayed to users
- Only recommended for development/personal use
- Keys sent in request body (not exposed in URL)

### Server-Side API Keys
- Stored in environment variables
- Never exposed to client
- Recommended for production
- Automatic fallback if client key not provided

### Best Practices
- Use server-side keys in production
- Implement rate limiting
- Add authentication/authorization
- Consider API key encryption
- Use HTTPS in production

## Extensibility

### Adding a New Provider

1. **Create adapter** (`lib/ai/providers/newprovider.ts`):
```typescript
export class NewProvider extends AIProvider {
  // Implement required methods
}
```

2. **Add to enum** (`lib/ai/BaseProvider.ts`):
```typescript
export enum ProviderType {
  NEW_PROVIDER = 'newprovider'
}
```

3. **Register in factory** (`lib/ai/providerFactory.ts`):
```typescript
case ProviderType.NEW_PROVIDER:
  return new NewProvider(config.apiKey);
```

4. **Update UI** (`components/AIProviderSelector.tsx`):
```typescript
const PROVIDER_MODELS = {
  [ProviderType.NEW_PROVIDER]: ['model-1', 'model-2']
};
```

5. **Add environment variable** (`.env.example`):
```
NEW_PROVIDER_API_KEY=your_key_here
```

6. **Update documentation** (`README.md`)

## Testing Strategy

### Unit Tests (Recommended)
- Test each provider adapter independently
- Mock API responses
- Test error handling
- Verify message conversion

### Integration Tests (Recommended)
- Test API route with different providers
- Test streaming vs non-streaming
- Test fallback logic
- Test error responses

### Manual Testing
1. Configure provider with valid API key
2. Send test messages
3. Verify responses
4. Test streaming
5. Test error scenarios
6. Switch providers and models

## Performance Considerations

### Streaming Benefits
- Immediate user feedback
- Reduced perceived latency
- Better UX for long responses
- Lower memory usage

### Provider Selection
- Groq: Fastest inference (optimized hardware)
- OpenAI: Best quality, higher latency
- Google Gemini: Good balance
- Together AI: Cost-effective for open models

### Optimization Tips
- Cache provider instances
- Implement request queuing
- Add response caching
- Use edge functions for global distribution

## Future Enhancements

### Potential Features
1. **Provider fallback chain**: Try multiple providers automatically
2. **Cost tracking**: Monitor API usage and costs
3. **Response caching**: Cache similar queries
4. **Model comparison**: Side-by-side comparison
5. **Conversation history**: Persistent chat history
6. **Custom system prompts**: Reusable prompt templates
7. **Rate limiting**: Client-side request throttling
8. **Analytics**: Track provider performance
9. **A/B testing**: Compare provider responses
10. **Batch processing**: Multiple requests in parallel

### Scalability
- Add Redis for session management
- Implement queue system for high load
- Add horizontal scaling support
- Implement proper logging and monitoring

## Troubleshooting

### Common Issues

**Build errors**: Check TypeScript types match SDK versions
**API errors**: Verify API keys are valid and have credits
**Streaming not working**: Check CORS and SSE support
**Provider not available**: Check environment variables
**Type errors**: Update SDK versions and type definitions

### Debug Mode
Add to `.env.local`:
```
DEBUG=true
```

Then check API responses and errors in detail.

## Maintenance

### Keeping Up-to-Date
- Monitor SDK updates
- Test new model releases
- Update model lists regularly
- Review provider documentation
- Check for breaking changes

### Version Compatibility
- Next.js 16+
- React 19+
- Node.js 18+
- TypeScript 5+

## License

MIT License - See LICENSE file for details
