'use client';

import { useState } from 'react';
import { ProviderType } from '@/lib/ai/BaseProvider';

interface ProviderModels {
  [key: string]: string[];
}

const PROVIDER_MODELS: ProviderModels = {
  [ProviderType.OPENAI]: ['gpt-4', 'gpt-4-turbo', 'gpt-4o', 'gpt-4o-mini', 'gpt-3.5-turbo'],
  [ProviderType.ANTHROPIC]: [
    'claude-3-5-sonnet-20241022',
    'claude-3-opus-20240229',
    'claude-3-sonnet-20240229',
    'claude-3-haiku-20240307',
  ],
  [ProviderType.GOOGLE]: [
    'gemini-2.0-flash-exp',
    'gemini-1.5-pro',
    'gemini-1.5-flash',
    'gemini-1.5-flash-8b',
  ],
  [ProviderType.MISTRAL]: [
    'mistral-large-latest',
    'mistral-medium-latest',
    'mistral-small-latest',
    'open-mistral-7b',
    'open-mixtral-8x7b',
    'open-mixtral-8x22b',
  ],
  [ProviderType.GROQ]: [
    'llama-3.3-70b-versatile',
    'llama-3.1-70b-versatile',
    'llama-3.1-8b-instant',
    'mixtral-8x7b-32768',
    'gemma2-9b-it',
  ],
  [ProviderType.COHERE]: ['command-r-plus', 'command-r', 'command', 'command-light'],
  [ProviderType.TOGETHER]: [
    'meta-llama/Meta-Llama-3.1-70B-Instruct-Turbo',
    'meta-llama/Meta-Llama-3.1-8B-Instruct-Turbo',
    'mistralai/Mixtral-8x7B-Instruct-v0.1',
    'mistralai/Mistral-7B-Instruct-v0.2',
    'Qwen/Qwen2.5-72B-Instruct-Turbo',
    'google/gemma-2-27b-it',
  ],
};

const PROVIDER_NAMES: Record<ProviderType, string> = {
  [ProviderType.OPENAI]: 'OpenAI',
  [ProviderType.ANTHROPIC]: 'Anthropic Claude',
  [ProviderType.GOOGLE]: 'Google Gemini',
  [ProviderType.MISTRAL]: 'Mistral AI',
  [ProviderType.GROQ]: 'Groq',
  [ProviderType.COHERE]: 'Cohere',
  [ProviderType.TOGETHER]: 'Together AI',
};

interface AISettings {
  provider: ProviderType;
  apiKey: string;
  model: string;
  temperature: number;
  maxTokens: number;
}

const getInitialSettings = (): AISettings => {
  if (typeof window !== 'undefined') {
    const savedSettings = localStorage.getItem('aiProviderSettings');
    if (savedSettings) {
      try {
        return JSON.parse(savedSettings);
      } catch (error) {
        console.error('Failed to parse saved settings:', error);
      }
    }
  }
  return {
    provider: ProviderType.OPENAI,
    apiKey: '',
    model: 'gpt-4o',
    temperature: 0.7,
    maxTokens: 2048,
  };
};

export default function AIProviderSelector() {
  const [settings, setSettings] = useState<AISettings>(getInitialSettings);

  const [showApiKey, setShowApiKey] = useState(false);
  const [isSaved, setIsSaved] = useState(false);

  const handleProviderChange = (provider: ProviderType) => {
    const defaultModels: Record<ProviderType, string> = {
      [ProviderType.OPENAI]: 'gpt-4o',
      [ProviderType.ANTHROPIC]: 'claude-3-5-sonnet-20241022',
      [ProviderType.GOOGLE]: 'gemini-1.5-pro',
      [ProviderType.MISTRAL]: 'mistral-large-latest',
      [ProviderType.GROQ]: 'llama-3.3-70b-versatile',
      [ProviderType.COHERE]: 'command-r-plus',
      [ProviderType.TOGETHER]: 'meta-llama/Meta-Llama-3.1-70B-Instruct-Turbo',
    };

    setSettings({
      ...settings,
      provider,
      model: defaultModels[provider],
    });
  };

  const handleSave = () => {
    localStorage.setItem('aiProviderSettings', JSON.stringify(settings));
    setIsSaved(true);
    setTimeout(() => setIsSaved(false), 2000);
  };

  const handleClear = () => {
    localStorage.removeItem('aiProviderSettings');
    setSettings({
      provider: ProviderType.OPENAI,
      apiKey: '',
      model: 'gpt-4o',
      temperature: 0.7,
      maxTokens: 2048,
    });
  };

  return (
    <div className="w-full max-w-2xl mx-auto p-6 bg-white dark:bg-gray-800 rounded-lg shadow-lg">
      <h2 className="text-2xl font-bold mb-6 text-gray-900 dark:text-white">
        AI Provider Settings
      </h2>

      <div className="bg-yellow-50 dark:bg-yellow-900/20 border border-yellow-200 dark:border-yellow-700 rounded-md p-4 mb-6">
        <p className="text-sm text-yellow-800 dark:text-yellow-200">
          ⚠️ <strong>Security Warning:</strong> API keys are stored in your browser&apos;s localStorage.
          Only use this on trusted devices. For production, use environment variables on the server.
        </p>
      </div>

      <div className="space-y-6">
        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
            AI Provider
          </label>
          <select
            value={settings.provider}
            onChange={(e) => handleProviderChange(e.target.value as ProviderType)}
            className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-white"
          >
            {Object.entries(PROVIDER_NAMES).map(([value, label]) => (
              <option key={value} value={value}>
                {label}
              </option>
            ))}
          </select>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
            API Key
          </label>
          <div className="flex gap-2">
            <input
              type={showApiKey ? 'text' : 'password'}
              value={settings.apiKey}
              onChange={(e) => setSettings({ ...settings, apiKey: e.target.value })}
              placeholder="Enter your API key"
              className="flex-1 px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-white"
            />
            <button
              type="button"
              onClick={() => setShowApiKey(!showApiKey)}
              className="px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md hover:bg-gray-50 dark:hover:bg-gray-600 dark:text-white"
            >
              {showApiKey ? '🙈' : '👁️'}
            </button>
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
            Model
          </label>
          <select
            value={settings.model}
            onChange={(e) => setSettings({ ...settings, model: e.target.value })}
            className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-white"
          >
            {PROVIDER_MODELS[settings.provider]?.map((model) => (
              <option key={model} value={model}>
                {model}
              </option>
            ))}
          </select>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
            Temperature: {settings.temperature}
          </label>
          <input
            type="range"
            min="0"
            max="2"
            step="0.1"
            value={settings.temperature}
            onChange={(e) => setSettings({ ...settings, temperature: parseFloat(e.target.value) })}
            className="w-full"
          />
          <div className="flex justify-between text-xs text-gray-500 dark:text-gray-400">
            <span>Precise</span>
            <span>Balanced</span>
            <span>Creative</span>
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
            Max Tokens
          </label>
          <input
            type="number"
            min="1"
            max="32000"
            value={settings.maxTokens}
            onChange={(e) => setSettings({ ...settings, maxTokens: parseInt(e.target.value) })}
            className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-white"
          />
        </div>

        <div className="flex gap-3 pt-4">
          <button
            onClick={handleSave}
            className="flex-1 bg-blue-600 hover:bg-blue-700 text-white font-medium py-2 px-4 rounded-md transition-colors"
          >
            {isSaved ? '✓ Saved!' : 'Save Settings'}
          </button>
          <button
            onClick={handleClear}
            className="px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-md hover:bg-gray-50 dark:hover:bg-gray-700 dark:text-white transition-colors"
          >
            Clear
          </button>
        </div>
      </div>
    </div>
  );
}
