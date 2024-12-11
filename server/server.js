import express from 'express';
import cors from 'cors';
import { Anthropic } from '@anthropic-ai/sdk';
import OpenAI from 'openai';
import { createApi } from 'unsplash-js';
import nodeFetch from 'node-fetch';
import dotenv from 'dotenv';
import { fileURLToPath } from 'url';
import { dirname } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

dotenv.config();

const app = express();
app.use(cors());
app.use(express.json());

// Vérifier les clés API au démarrage
if (!process.env.ANTHROPIC_API_KEY && !process.env.OPENAI_API_KEY) {
  console.error('❌ Aucune clé API n\'est configurée (ANTHROPIC_API_KEY ou OPENAI_API_KEY)');
  if (process.env.NODE_ENV === 'production') {
    console.warn('⚠️ Running in production, continuing without API keys');
  } else {
    process.exit(1);
  }
}

if (!process.env.UNSPLASH_ACCESS_KEY) {
  console.error('⚠️ Unsplash API key not configured (UNSPLASH_ACCESS_KEY)');
}

let serviceStatus = {
  claude: process.env.ANTHROPIC_API_KEY ? '✅' : '❌',
  openai: process.env.OPENAI_API_KEY ? '✅' : '❌',
  unsplash: process.env.UNSPLASH_ACCESS_KEY ? '✅' : '❌'
};

console.log('Status des services :', serviceStatus);

// Initialiser les clients
const anthropic = process.env.ANTHROPIC_API_KEY ? new Anthropic({
  apiKey: process.env.ANTHROPIC_API_KEY,
}) : null;

const openai = process.env.OPENAI_API_KEY ? new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
}) : null;

const unsplash = process.env.UNSPLASH_ACCESS_KEY ? createApi({
  accessKey: process.env.UNSPLASH_ACCESS_KEY,
  fetch: nodeFetch,
}) : null;

// Structure commune pour le prompt
const getSystemPrompt = () => `Tu es un expert en marketing digital, UX/UI design et copywriting, spécialisé dans la création de landing pages ultra-performantes et modernes.

Tu dois générer uniquement des réponses au format JSON valide, sans texte avant ou après. Voici la structure exacte à suivre :

{
  "hero": {
    "title": "Titre principal accrocheur (max 60 caractères)",
    "subtitle": "Sous-titre explicatif (max 120 caractères)",
    "ctaText": "Texte du CTA principal (max 25 caractères)",
    "ctaUrl": "URL de redirection pour le bouton CTA",
    "customImageUrl": "URL de l'image personnalisée (facultatif)",
    "imageQuery": "Description précise en anglais pour la recherche d'une image pertinente sur Unsplash"
  },
  "content": {
    "mainHeadline": "Titre de la proposition de valeur (max 80 caractères)",
    "description": "Description persuasive et claire (150-200 mots)",
    "benefits": [
      {
        "title": "Titre avantage 1",
        "description": "Description courte de l'avantage 1",
        "icon": "Nom d'icône parmi : rocket, star, check, heart, shield, bolt, chart, users, cog, dollar, clock, trophy, target, light, smile, thumbs-up, magic, gift, crown, gem"
      },
      {
        "title": "Titre avantage 2",
        "description": "Description courte de l'avantage 2",
        "icon": "Nom d'icône parmi : rocket, star, check, heart, shield, bolt, chart, users, cog, dollar, clock, trophy, target, light, smile, thumbs-up, magic, gift, crown, gem"
      },
      {
        "title": "Titre avantage 3",
        "description": "Description courte de l'avantage 3",
        "icon": "Nom d'icône parmi : rocket, star, check, heart, shield, bolt, chart, users, cog, dollar, clock, trophy, target, light, smile, thumbs-up, magic, gift, crown, gem"
      }
    ],
    "features": [
      {
        "title": "Titre fonctionnalité 1",
        "description": "Description détaillée",
        "customImageUrl": "URL de l'image personnalisée (facultatif)",
        "imageQuery": "Description précise en anglais pour la recherche d'une image pertinente sur Unsplash"
      },
      {
        "title": "Titre fonctionnalité 2",
        "description": "Description détaillée",
        "customImageUrl": "URL de l'image personnalisée (facultatif)",
        "imageQuery": "Description précise en anglais pour la recherche d'une image pertinente sur Unsplash"
      },
      {
        "title": "Titre fonctionnalité 3",
        "description": "Description détaillée",
        "customImageUrl": "URL de l'image personnalisée (facultatif)",
        "imageQuery": "Description précise en anglais pour la recherche d'une image pertinente sur Unsplash"
      }
    ]
  },
  "social": {
    "testimonials": [
      {
        "quote": "Citation client 1",
        "author": "Nom et rôle"
      },
      {
        "quote": "Citation client 2",
        "author": "Nom et rôle"
      }
    ]
  },
  "closing": {
    "headline": "Titre du CTA final (max 80 caractères)",
    "ctaText": "Texte du bouton (max 25 caractères)",
    "ctaUrl": "URL de redirection pour le bouton CTA",
    "customImageUrl": "URL de l'image personnalisée (facultatif)",
    "imageQuery": "Description précise en anglais pour la recherche d'une image pertinente sur Unsplash"
  },
  "design": {
    "colors": {
      "primary": "Code couleur hex",
      "secondary": "Code couleur hex",
      "accent": "Code couleur hex"
    },
    "fonts": {
      "heading": "Police suggérée pour les titres",
      "body": "Police suggérée pour le texte"
    }
  }
}

Directives importantes :
1. Génère UNIQUEMENT du JSON valide, sans texte avant ou après
2. Respecte EXACTEMENT la structure fournie
3. Crée un contenu original et créatif
4. Adapte le style au secteur d'activité
5. Optimise pour la conversion
6. Pense mobile-first
7. Pour chaque imageQuery, fournis une description précise et pertinente EN ANGLAIS pour trouver la meilleure image possible sur Unsplash
8. Les descriptions d'images doivent être spécifiques et inclure des détails sur le style souhaité (ex: "modern office with natural light and plants, professional setting")`;

const getUserPrompt = (industry, targetAudience, mainGoal) => 
  `Crée un contenu optimisé pour une landing page moderne et performante avec les détails suivants :

Industrie : ${industry}
Public cible : ${targetAudience}
Objectif principal : ${mainGoal}

Le contenu doit être en français, professionnel et optimisé pour la conversion. Sois créatif tout en restant pertinent pour l'industrie.`;

// Fonction pour rechercher des images sur Unsplash
async function searchUnsplashImage(query) {
  if (!unsplash) {
    console.warn('⚠️ Unsplash API not configured, skipping image search');
    return null;
  }

  if (!query) {
    console.warn('⚠️ No query provided for image search');
    return null;
  }

  console.log('🔍 Searching Unsplash for:', query);

  try {
    const result = await unsplash.search.getPhotos({
      query,
      orientation: 'landscape',
      perPage: 1
    });

    console.log('📸 Unsplash search result:', result);

    if (result.response?.results?.length > 0) {
      const photo = result.response.results[0];
      const imageData = {
        url: photo.urls.regular,
        credit: {
          name: photo.user.name,
          link: photo.user.links.html
        }
      };
      console.log('✅ Found image:', imageData);
      return imageData;
    }
    
    console.warn('⚠️ No images found for query:', query);
    return null;
  } catch (error) {
    console.error('❌ Error fetching image from Unsplash:', error);
    return null;
  }
}

// Fonction pour enrichir le contenu avec des images
async function enrichContentWithImages(content) {
  // Hero image
  if (content.hero) {
    if (content.hero.customImageUrl) {
      content.hero.imageUrl = content.hero.customImageUrl;
    } else if (content.hero.imageQuery) {
      const unsplashImage = await searchUnsplashImage(content.hero.imageQuery);
      if (unsplashImage) {
        content.hero.imageUrl = unsplashImage.url;
        content.hero.imageCredit = unsplashImage.credit;
      }
    }
  }

  // Feature images
  if (content.content?.features) {
    for (const feature of content.content.features) {
      if (feature.customImageUrl) {
        feature.imageUrl = feature.customImageUrl;
      } else if (feature.imageQuery) {
        const unsplashImage = await searchUnsplashImage(feature.imageQuery);
        if (unsplashImage) {
          feature.imageUrl = unsplashImage.url;
          feature.imageCredit = unsplashImage.credit;
        }
      }
    }
  }

  // Closing section image
  if (content.closing) {
    if (content.closing.customImageUrl) {
      content.closing.imageUrl = content.closing.customImageUrl;
    } else if (content.closing.imageQuery) {
      const unsplashImage = await searchUnsplashImage(content.closing.imageQuery);
      if (unsplashImage) {
        content.closing.imageUrl = unsplashImage.url;
        content.closing.imageCredit = unsplashImage.credit;
      }
    }
  }

  return content;
}

// Fonction pour générer avec Claude
async function generateWithClaude(systemPrompt, userPrompt) {
  try {
    const message = await anthropic.messages.create({
      model: "claude-3-opus-20240229",
      max_tokens: 4000,
      temperature: 0.7,
      system: systemPrompt,
      messages: [
        {
          role: "user",
          content: userPrompt
        }
      ]
    });

    const content = message.content[0].text;
    console.log('Raw Claude response:', content);
    return content;
  } catch (error) {
    console.error('Error with Claude API:', error);
    throw new Error('Failed to generate content with Claude');
  }
}

// Fonction pour générer avec OpenAI
async function generateWithOpenAI(systemPrompt, userPrompt) {
  try {
    const completion = await openai.chat.completions.create({
      model: "gpt-4-1106-preview",
      temperature: 0.7,
      response_format: { type: "json_object" },
      messages: [
        {
          role: "system",
          content: systemPrompt
        },
        {
          role: "user",
          content: userPrompt
        }
      ]
    });

    const content = completion.choices[0].message.content;
    console.log('Raw OpenAI response:', content);
    return content;
  } catch (error) {
    console.error('Error with OpenAI API:', error);
    throw new Error('Failed to generate content with OpenAI');
  }
}

app.post('/api/generate', async (req, res) => {
  try {
    const { industry, targetAudience, mainGoal, service = 'claude' } = req.body;
    
    console.log('📝 Received request:', { industry, targetAudience, mainGoal, service });
    
    if (!industry || !targetAudience || !mainGoal) {
      return res.status(400).json({ error: 'Missing required fields' });
    }

    const systemPrompt = getSystemPrompt();
    const userPrompt = getUserPrompt(industry, targetAudience, mainGoal);

    console.log(`🤖 Sending request to ${service}...`);

    let content;
    try {
      if (service === 'openai' && openai) {
        content = await generateWithOpenAI(systemPrompt, userPrompt);
      } else if (service === 'claude' && anthropic) {
        content = await generateWithClaude(systemPrompt, userPrompt);
      } else {
        throw new Error(`Service ${service} non disponible`);
      }
    } catch (error) {
      console.error('Error generating content:', error);
      return res.status(500).json({ error: `Error generating content: ${error.message}` });
    }

    console.log('📄 Raw response:', content);

    try {
      // Nettoyer la réponse pour s'assurer qu'elle ne contient que du JSON
      const cleanedContent = content.trim().replace(/^[^{]*/, '').replace(/[^}]*$/, '');
      const parsedContent = JSON.parse(cleanedContent);
      console.log('✅ Successfully parsed JSON response');
      
      // Enrichir le contenu avec des images d'Unsplash
      console.log('🖼️ Fetching images from Unsplash...');
      const enrichedContent = await enrichContentWithImages(parsedContent);
      
      res.json({ generatedContent: enrichedContent });
    } catch (parseError) {
      console.error('❌ JSON parse error:', parseError);
      console.error('Content that failed to parse:', content);
      return res.status(500).json({ error: 'Failed to parse AI response as JSON' });
    }
  } catch (error) {
    console.error('❌ Error:', error);
    res.status(500).json({ error: error.message });
  }
});

// Pour le développement local
if (process.env.NODE_ENV !== 'production') {
  const PORT = process.env.PORT || 3000;
  app.listen(PORT, () => {
    console.log(`🚀 Serveur démarré sur le port ${PORT}`);
  });
}

// Pour Vercel
export default app;
