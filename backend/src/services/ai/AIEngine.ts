import Anthropic from '@anthropic-ai/sdk';

export class AIEngine {
  private client: Anthropic;

  constructor() {
    this.client = new Anthropic({
      apiKey: process.env.ANTHROPIC_API_KEY,
    });
  }

  async parse(message: string, _conversationId?: string) {
    try {
      const response = await this.client.messages.create({
        model: 'claude-sonnet-4-20250514',
        max_tokens: 1024,
        messages: [
          {
            role: 'user',
            content: message,
          },
        ],
      });

      const content = response.content[0];
      const text = content.type === 'text' ? content.text : '';

      return {
        response: text,
        intent: 'chat',
        confidence: 0.9,
      };
    } catch (error) {
      console.error('AI Engine error:', error);
      throw new Error('Failed to process message with AI');
    }
  }
}