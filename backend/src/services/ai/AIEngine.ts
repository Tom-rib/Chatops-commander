import Anthropic from '@anthropic-ai/sdk';
import { ParsedCommand, RiskLevel } from '../../types/models';
import { logger } from '../../utils/logger';

const SYSTEM_PROMPT = `Tu es un assistant DevOps intelligent intégré dans ChatOps Commander.
Tu aides les administrateurs système à gérer leur infrastructure via une interface conversationnelle.

## Rôle et Capacités

Tu dois analyser les messages utilisateurs et déterminer leur intention.
Tu peux comprendre et traiter :

1. **Monitoring** : Demandes d'informations sur l'état des serveurs
2. **Actions** : Commandes nécessitant une exécution
3. **Queries** : Questions sur la configuration ou l'historique
4. **Aide** : Demandes d'assistance

## Format de Sortie

Tu dois TOUJOURS répondre avec un JSON valide :

{
  "intent": "monitoring | action | query | help",
  "confidence": 0.0-1.0,
  "parameters": {
    "server": "nom du serveur ou null",
    "service": "nom du service ou null",
    "action": "restart | stop | start | status | deploy | null",
    "timeRange": "1h | 24h | 7d | null",
    "query": "texte de la query si applicable"
  },
  "requiresConfirmation": true | false,
  "riskLevel": "low | medium | high | critical",
  "explanation": "explication courte de ce qui va être fait"
}

## Règles de Classification

**Risk Levels :**
- **low** : Lecture seule
- **medium** : Actions réversibles (restart service)
- **high** : Modifications système (deploy)
- **critical** : Actions irréversibles (delete)

**Confirmation Required :**
- TRUE si riskLevel >= medium
- FALSE uniquement pour lecture

IMPORTANT : Réponds UNIQUEMENT en JSON, rien d'autre.`;

export class AIEngine {
  private client: Anthropic;
  private conversationHistory: Map<string, any[]>;

  constructor() {
    if (!process.env.ANTHROPIC_API_KEY) {
      throw new Error('ANTHROPIC_API_KEY not found in environment');
    }

    this.client = new Anthropic({
      apiKey: process.env.ANTHROPIC_API_KEY,
    });
    
    this.conversationHistory = new Map();
  }

  async parseCommand(
    userMessage: string,
    context: { conversationId: string; userId: string }
  ): Promise<ParsedCommand> {
    try {
      logger.info(`Parsing command: "${userMessage}"`);

      // Get conversation history
      const history = this.conversationHistory.get(context.conversationId) || [];

      // Add user message to history
      const messages = [
        ...history,
        { role: 'user' as const, content: userMessage }
      ];

      // Call Claude API
      const response = await this.client.messages.create({
        model: 'claude-sonnet-4-20250514',
        max_tokens: 1024,
        system: SYSTEM_PROMPT,
        messages: messages
      });

      // Extract JSON from response
      const content = response.content[0];
      if (content.type !== 'text') {
        throw new Error('Unexpected response type from AI');
      }

      // Parse JSON response
      let parsed: ParsedCommand;
      try {
        // Clean response (remove markdown if present)
        let jsonText = content.text.trim();
        jsonText = jsonText.replace(/```json\n?/g, '').replace(/```\n?/g, '');
        parsed = JSON.parse(jsonText);
      } catch (parseError) {
        logger.error('Failed to parse AI response:', content.text);
        throw new Error('Invalid JSON response from AI');
      }

      // Update conversation history
      messages.push({ role: 'assistant' as const, content: content.text });
      this.conversationHistory.set(context.conversationId, messages);

      logger.info(`Parsed intent: ${parsed.intent}, confidence: ${parsed.confidence}`);
      
      return parsed;
    } catch (error) {
      logger.error('Error in AIEngine.parseCommand:', error);
      throw error;
    }
  }

  async explainResult(
    command: string,
    result: { success: boolean; output: string; exitCode?: number }
  ): Promise<string> {
    try {
      const prompt = `Explique ce résultat de commande système en langage naturel, en 2-4 phrases max.

Commande exécutée : ${command}
Succès : ${result.success}
Code de sortie : ${result.exitCode || 0}
Output : ${result.output.substring(0, 500)}

Format ta réponse ainsi :
- Commence par ✅ si succès, ❌ si échec
- Explique ce qui s'est passé
- Si échec, suggère une solution
- Si métriques anormales, alerte l'utilisateur`;

      const response = await this.client.messages.create({
        model: 'claude-sonnet-4-20250514',
        max_tokens: 512,
        messages: [{ role: 'user', content: prompt }]
      });

      const content = response.content[0];
      return content.type === 'text' ? content.text : 'Erreur lors de la génération de l\'explication';
    } catch (error) {
      logger.error('Error explaining result:', error);
      return `${result.success ? '✅' : '❌'} ${result.success ? 'Commande exécutée avec succès' : 'Échec de l\'exécution'}`;
    }
  }

  clearHistory(conversationId: string): void {
    this.conversationHistory.delete(conversationId);
  }
}

export const aiEngine = new AIEngine();