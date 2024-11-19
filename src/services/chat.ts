import { Settings, Profile } from '../types';

interface ChatOptions {
  settings: Settings;
  profile: Profile;
  projectId: string;
}

export async function sendChatMessage(message: string, options: ChatOptions): Promise<ReadableStream | string> {
  const { settings, profile, projectId } = options;

  // Construct the system prompt
  const systemPrompt = `${profile.prompt}\n\nResponse Filter Instructions:\n${settings.responseFilter}`;

  try {
    const response = await fetch(`${import.meta.env.VITE_OLLAMA_HOST || 'http://localhost:11434'}/api/chat`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: settings.selectedModel,
        messages: [
          {
            role: 'system',
            content: systemPrompt,
          },
          {
            role: 'user',
            content: message,
          },
        ],
        options: {
          temperature: settings.temperature,
          top_p: settings.topP,
          num_predict: settings.maxTokens,
          stream: settings.streamResponse,
        },
        context: {
          projectId,
        },
      }),
    });

    if (!response.ok) {
      throw new Error('Failed to get response from LLM');
    }

    if (settings.streamResponse) {
      return response.body!;
    } else {
      const data = await response.json();
      return data.message.content;
    }
  } catch (error) {
    console.error('Error sending chat message:', error);
    throw error;
  }
}