import { Configuration, OpenAIApi } from 'openai';

const configuration = new Configuration({
  apiKey: import.meta.env.VITE_OPENAI_API_KEY
});

const openai = new OpenAIApi(configuration);

const openaiService = {
  generateLandingPage: async ({ industry, targetAudience, mainGoal }) => {
    try {
      const completion = await openai.createChatCompletion({
        model: "gpt-4",
        messages: [
          {
            role: "system",
            content: "You are a professional copywriter specialized in creating compelling landing page content in French."
          },
          {
            role: "user",
            content: `Crée un contenu de landing page pour une entreprise de ${industry} ciblant ${targetAudience} avec l'objectif principal de ${mainGoal}.
            
            Format de réponse attendu en JSON :
            {
              "title": "Titre accrocheur (max 60 caractères)",
              "description": "Description persuasive (150-200 mots)",
              "ctaText": "Texte d'appel à l'action (max 25 caractères)",
              "benefits": ["3 principaux avantages"]
            }`
          }
        ]
      });

      return {
        generatedContent: JSON.parse(completion.data.choices[0].message.content)
      };
    } catch (error) {
      console.error('Erreur lors de la génération du contenu:', error);
      throw new Error('Échec de la génération du contenu');
    }
  }
};

export default openaiService;
