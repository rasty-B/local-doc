import { Model, Profile, Connection, Project, Schedule, EmbeddingModel } from '../types';

export const SAMPLE_MODELS: Model[] = [
  {
    id: 'llama2-7b-chat',
    name: 'LLaMA 2 7B Chat',
    size: '7B',
    quantization: '4-bit',
    parameters: '7 billion',
    provider: 'ollama'
  },
  {
    id: 'mistral-7b',
    name: 'Mistral 7B',
    size: '7B',
    quantization: '4-bit',
    parameters: '7 billion',
    provider: 'ollama'
  }
];

export const EMBEDDING_MODELS: EmbeddingModel[] = [
  {
    id: 'nomic-embed-text-v1',
    name: 'Nomic Embed Text v1',
    provider: 'nomic',
    dimensions: 768
  },
  {
    id: 'text-embedding-ada-002',
    name: 'OpenAI Ada 002',
    provider: 'openai',
    dimensions: 1536
  }
];

export const DEFAULT_PROFILES: Profile[] = [
  {
    id: 'default',
    name: 'Default Assistant',
    prompt: 'You are a helpful AI assistant that answers questions about documents in the current project.',
    isDefault: true
  }
];

export const DEFAULT_CONNECTIONS: Connection[] = [
  {
    id: 'local-ollama',
    name: 'Local Ollama',
    type: 'ollama',
    config: {
      baseUrl: import.meta.env.VITE_OLLAMA_HOST || 'http://localhost:11434',
      models: ['llama2-7b-chat', 'mistral-7b']
    },
    isActive: true
  }
];

export const SAMPLE_PROJECTS: Project[] = [
  {
    id: 'default',
    name: 'Default Project',
    description: 'Main documentation project',
    paths: ['/docs'],
    created: new Date(),
    updated: new Date(),
    isDefault: true
  }
];

export const SAMPLE_SCHEDULES: Schedule[] = [
  {
    id: 'daily-index',
    projectId: 'default',
    name: 'Daily Documentation Index',
    paths: ['/docs'],
    cronExpression: '0 0 * * *',
    lastRun: new Date(),
    enabled: true
  }
];