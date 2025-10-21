import Anthropic from '@anthropic-ai/sdk';

export class AIEngine {
  private client: Anthropic;
  private model: string = 'claude-3-5-sonnet-20241022';

  constructor() {
    const apiKey = process.env.ANTHROPIC_API_KEY;
    if (!apiKey) {
      throw new Error('ANTHROPIC_API_KEY not configured');
    }
    this.client = new Anthropic({ apiKey });
  }

  async parse(message: string, conversationId?: number): Promise<any> {
    try {
      // Cast vers any pour contourner les erreurs TypeScript
      const anthropicClient = this.client as any;
      
      const response = await anthropicClient.messages.create({
        model: this.model,
        max_tokens: 1024,
        messages: [{ role: 'user', content: message }],
      });

      const textContent = response.content.find((block: any) => block.type === 'text');
      
      if (!textContent || textContent.type !== 'text') {
        throw new Error('No text response from Claude');
      }

      return {
        response: textContent.text,
        conversationId,
      };
    } catch (error: any) {
      console.error('AI processing error:', error);
      throw new Error(`AI Error: ${error.message}`);
    }
  }
}