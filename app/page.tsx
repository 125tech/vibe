import AIProviderSelector from '@/components/AIProviderSelector';
import AIChat from '@/components/AIChat';
import BinaryCalculator from '@/components/BinaryCalculator';

export default function Home() {
  return (
    <div className="min-h-screen bg-zinc-50 font-sans dark:bg-black py-8 px-4">
      <main className="container mx-auto max-w-7xl">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-black dark:text-white mb-4">
            Multi-AI Provider Platform & Tools
          </h1>
          <p className="text-gray-600 dark:text-gray-400 text-lg">
            Connect to multiple AI providers, chat with your preferred model, and use our binary calculator
          </p>
        </div>

        {/* Binary Calculator - Featured Section */}
        <div className="mb-8">
          <BinaryCalculator />
        </div>

        {/* AI Provider Section */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
          <AIProviderSelector />
          <AIChat />
        </div>

        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-6 mt-8">
          <h2 className="text-2xl font-bold mb-4 text-gray-900 dark:text-white">
            Supported AI Providers
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            <div className="border border-gray-200 dark:border-gray-700 rounded-lg p-4">
              <h3 className="font-semibold text-lg text-gray-900 dark:text-white mb-2">
                OpenAI
              </h3>
              <p className="text-sm text-gray-600 dark:text-gray-400 mb-2">
                GPT-4, GPT-4o, GPT-3.5-turbo
              </p>
              <a
                href="https://platform.openai.com/api-keys"
                target="_blank"
                rel="noopener noreferrer"
                className="text-blue-600 dark:text-blue-400 text-sm hover:underline"
              >
                Get API Key →
              </a>
            </div>

            <div className="border border-gray-200 dark:border-gray-700 rounded-lg p-4">
              <h3 className="font-semibold text-lg text-gray-900 dark:text-white mb-2">
                Anthropic Claude
              </h3>
              <p className="text-sm text-gray-600 dark:text-gray-400 mb-2">
                Claude 3.5 Sonnet, Opus, Haiku
              </p>
              <a
                href="https://console.anthropic.com/settings/keys"
                target="_blank"
                rel="noopener noreferrer"
                className="text-blue-600 dark:text-blue-400 text-sm hover:underline"
              >
                Get API Key →
              </a>
            </div>

            <div className="border border-gray-200 dark:border-gray-700 rounded-lg p-4">
              <h3 className="font-semibold text-lg text-gray-900 dark:text-white mb-2">
                Google Gemini
              </h3>
              <p className="text-sm text-gray-600 dark:text-gray-400 mb-2">
                Gemini 2.0, 1.5 Pro, 1.5 Flash
              </p>
              <a
                href="https://makersuite.google.com/app/apikey"
                target="_blank"
                rel="noopener noreferrer"
                className="text-blue-600 dark:text-blue-400 text-sm hover:underline"
              >
                Get API Key →
              </a>
            </div>

            <div className="border border-gray-200 dark:border-gray-700 rounded-lg p-4">
              <h3 className="font-semibold text-lg text-gray-900 dark:text-white mb-2">
                Mistral AI
              </h3>
              <p className="text-sm text-gray-600 dark:text-gray-400 mb-2">
                Mistral Large, Medium, Small
              </p>
              <a
                href="https://console.mistral.ai/api-keys/"
                target="_blank"
                rel="noopener noreferrer"
                className="text-blue-600 dark:text-blue-400 text-sm hover:underline"
              >
                Get API Key →
              </a>
            </div>

            <div className="border border-gray-200 dark:border-gray-700 rounded-lg p-4">
              <h3 className="font-semibold text-lg text-gray-900 dark:text-white mb-2">
                Groq
              </h3>
              <p className="text-sm text-gray-600 dark:text-gray-400 mb-2">
                Llama models - Fastest inference
              </p>
              <a
                href="https://console.groq.com/keys"
                target="_blank"
                rel="noopener noreferrer"
                className="text-blue-600 dark:text-blue-400 text-sm hover:underline"
              >
                Get API Key →
              </a>
            </div>

            <div className="border border-gray-200 dark:border-gray-700 rounded-lg p-4">
              <h3 className="font-semibold text-lg text-gray-900 dark:text-white mb-2">
                Cohere
              </h3>
              <p className="text-sm text-gray-600 dark:text-gray-400 mb-2">
                Command models
              </p>
              <a
                href="https://dashboard.cohere.com/api-keys"
                target="_blank"
                rel="noopener noreferrer"
                className="text-blue-600 dark:text-blue-400 text-sm hover:underline"
              >
                Get API Key →
              </a>
            </div>

            <div className="border border-gray-200 dark:border-gray-700 rounded-lg p-4">
              <h3 className="font-semibold text-lg text-gray-900 dark:text-white mb-2">
                Together AI
              </h3>
              <p className="text-sm text-gray-600 dark:text-gray-400 mb-2">
                Open-source models
              </p>
              <a
                href="https://api.together.xyz/settings/api-keys"
                target="_blank"
                rel="noopener noreferrer"
                className="text-blue-600 dark:text-blue-400 text-sm hover:underline"
              >
                Get API Key →
              </a>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
