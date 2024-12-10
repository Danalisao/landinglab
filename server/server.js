const express = require('express');
const cors = require('cors');
const { Anthropic } = require('@anthropic-ai/sdk');
require('dotenv').config();

const app = express();
app.use(cors());
app.use(express.json());

console.log('ANTHROPIC_API_KEY:', process.env.ANTHROPIC_API_KEY ? 'Defined' : 'Undefined');

if (!process.env.ANTHROPIC_API_KEY) {
  console.error('ANTHROPIC_API_KEY is not defined in environment variables');
  process.exit(1);
}

const anthropic = new Anthropic({
  apiKey: process.env.ANTHROPIC_API_KEY,
});

app.post('/api/generate', async (req, res) => {
  try {
    const { industry, targetAudience, mainGoal } = req.body;
    
    console.log('Received request:', { industry, targetAudience, mainGoal });
    
    if (!industry || !targetAudience || !mainGoal) {
      return res.status(400).json({ error: 'Missing required fields' });
    }

    const prompt = `En tant qu'expert en marketing et copywriting, crée un contenu optimisé pour une landing page avec les détails suivants :

Industrie : ${industry}
Public cible : ${targetAudience}
Objectif principal : ${mainGoal}

Génère une réponse structurée au format JSON avec les éléments suivants :
{
  "title": "Titre accrocheur (max 60 caractères)",
  "description": "Description persuasive (150-200 mots)",
  "ctaText": "Texte d'appel à l'action (max 25 caractères)",
  "benefits": ["3 principaux avantages sous forme de liste"]
}

Le contenu doit être en français, professionnel et optimisé pour la conversion.`;

    console.log('Creating Claude message...');

    try {
      const completion = await anthropic.messages.create({
        model: "claude-3-opus-20240229",
        max_tokens: 1000,
        messages: [{
          role: "user",
          content: prompt
        }],
        system: "Tu es un expert en marketing et copywriting. Tu génères uniquement des réponses en JSON valide, sans texte avant ou après."
      });

      console.log('Received response from Claude:', completion);
      
      if (!completion.content || !completion.content[0] || !completion.content[0].text) {
        throw new Error('Invalid response format from Claude');
      }

      const content = completion.content[0].text;
      console.log('Claude response text:', content);
      
      try {
        const parsedContent = JSON.parse(content);
        res.json({ generatedContent: parsedContent });
      } catch (parseError) {
        console.error('JSON parse error:', parseError);
        throw new Error('Failed to parse Claude response as JSON');
      }
    } catch (claudeError) {
      console.error('Claude API error:', claudeError);
      throw new Error(`Claude API error: ${claudeError.message}`);
    }
  } catch (error) {
    console.error('Server error:', error);
    res.status(500).json({ 
      error: error.message || 'Internal server error',
      details: error.toString()
    });
  }
});

const PORT = process.env.PORT || 5001;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
