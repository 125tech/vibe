import { NextRequest, NextResponse } from 'next/server';
import { ProviderFactory } from '@/lib/ai/providerFactory';
import { ProviderType, ChatRequest } from '@/lib/ai/BaseProvider';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { 
      provider: providerType, 
      apiKey: clientApiKey, 
      messages, 
      model, 
      temperature, 
      maxTokens, 
      stream 
    } = body as ChatRequest & { 
      provider?: ProviderType; 
      apiKey?: string;
    };

    if (!messages || !Array.isArray(messages) || messages.length === 0) {
      return NextResponse.json(
        { error: 'Messages are required and must be a non-empty array' },
        { status: 400 }
      );
    }

    let provider;
    const errors: string[] = [];

    if (providerType && clientApiKey) {
      try {
        provider = ProviderFactory.createProvider({
          type: providerType,
          apiKey: clientApiKey,
          model,
        });
      } catch (error) {
        errors.push(`Failed to create provider ${providerType}: ${error instanceof Error ? error.message : String(error)}`);
      }
    }

    if (!provider && providerType) {
      provider = ProviderFactory.getProviderFromEnv(providerType);
      if (!provider) {
        errors.push(`Provider ${providerType} not configured in environment variables`);
      }
    }

    if (!provider) {
      provider = await ProviderFactory.getFirstAvailableProvider();
      if (!provider) {
        return NextResponse.json(
          { 
            error: 'No AI provider available', 
            details: 'Please configure at least one AI provider with a valid API key',
            attemptedProviders: errors 
          },
          { status: 503 }
        );
      }
    }

    const chatRequest: ChatRequest = {
      messages,
      model,
      temperature,
      maxTokens,
      stream,
    };

    if (stream) {
      const encoder = new TextEncoder();
      const readable = new ReadableStream({
        async start(controller) {
          try {
            for await (const chunk of provider!.stream(chatRequest)) {
              const data = JSON.stringify(chunk);
              controller.enqueue(encoder.encode(`data: ${data}\n\n`));
              
              if (chunk.done) {
                controller.close();
                break;
              }
            }
          } catch (error) {
            const errorMessage = error instanceof Error ? error.message : String(error);
            const errorData = JSON.stringify({ error: errorMessage });
            controller.enqueue(encoder.encode(`data: ${errorData}\n\n`));
            controller.close();
          }
        },
      });

      return new NextResponse(readable, {
        headers: {
          'Content-Type': 'text/event-stream',
          'Cache-Control': 'no-cache',
          'Connection': 'keep-alive',
        },
      });
    } else {
      const response = await provider.chat(chatRequest);
      return NextResponse.json(response);
    }
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : String(error);
    
    if (errorMessage.includes('quota') || errorMessage.includes('rate limit')) {
      return NextResponse.json(
        { error: 'Rate limit or quota exceeded', details: errorMessage },
        { status: 429 }
      );
    }
    
    if (errorMessage.includes('authentication') || errorMessage.includes('API key')) {
      return NextResponse.json(
        { error: 'Invalid API key', details: errorMessage },
        { status: 401 }
      );
    }

    return NextResponse.json(
      { error: 'Internal server error', details: errorMessage },
      { status: 500 }
    );
  }
}

export async function GET() {
  try {
    const availableProviders = await ProviderFactory.getAvailableProviders();
    
    return NextResponse.json({
      providers: availableProviders,
      hasAnyProvider: availableProviders.length > 0,
    });
  } catch {
    return NextResponse.json(
      { error: 'Failed to fetch providers' },
      { status: 500 }
    );
  }
}
