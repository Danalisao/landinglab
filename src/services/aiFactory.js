import openaiService from './openai';
import claudeService from './claude';

class AIFactory {
  static getAIService(provider) {
    switch (provider) {
      case 'openai':
        return openaiService;
      case 'claude':
        return claudeService;
      default:
        throw new Error(`AI provider ${provider} not supported`);
    }
  }

  static getAvailableProviders() {
    return [
      {
        id: 'openai',
        name: 'OpenAI GPT-4',
        description: 'Le modèle le plus avancé d\'OpenAI, excellent pour la génération de contenu marketing.',
        features: [
          'Excellent pour le copywriting',
          'Optimisation SEO avancée',
          'Compréhension approfondie du marketing'
        ]
      },
      {
        id: 'claude',
        name: 'Claude AI 3.5 Sonnet',
        description: 'Le modèle d\'Anthropic, reconnu pour sa créativité et sa précision.',
        features: [
          'Créativité exceptionnelle',
          'Excellent pour le storytelling',
          'Forte compréhension du contexte'
        ]
      }
    ];
  }
}

export default AIFactory;
