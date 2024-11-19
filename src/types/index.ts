export interface Message {
  text: string;
  isBot: boolean;
  timestamp: Date;
  projectId?: string;
}

export interface Profile {
  id: string;
  name: string;
  prompt: string;
  isDefault?: boolean;
}

export interface Model {
  id: string;
  name: string;
  size: string;
  quantization: string;
  parameters: string;
  provider: 'ollama' | 'openai' | 'anthropic';
}

export interface EmbeddingModel {
  id: string;
  name: string;
  provider: 'nomic' | 'openai' | 'local';
  dimensions: number;
}

export interface Settings {
  selectedModel: string;
  selectedEmbeddingModel: string;
  temperature: number;
  maxTokens: number;
  topP: number;
  streamResponse: boolean;
  responseFilter: string;
}

export interface Connection {
  id: string;
  name: string;
  type: 'ollama' | 'openai' | 'anthropic';
  config: {
    apiKey?: string;
    baseUrl?: string;
    models?: string[];
  };
  isActive: boolean;
  isDefault?: boolean;
}

export interface Project {
  id: string;
  name: string;
  description?: string;
  paths: string[];
  created: Date;
  updated: Date;
  isDefault?: boolean;
}

export interface Schedule {
  id: string;
  projectId: string;
  name: string;
  paths: string[];
  cronExpression: string;
  lastRun?: Date;
  nextRun?: Date;
  enabled: boolean;
}