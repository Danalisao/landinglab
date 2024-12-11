import axios from 'axios';

class OpenAIService {
  constructor() {
    this.apiUrl = 'http://localhost:5001/api/generate';
  }

  async generateLandingPage({ industry, targetAudience, mainGoal }) {
    try {
      console.log('Generating landing page with OpenAI:', { industry, targetAudience, mainGoal });

      const response = await axios.post(this.apiUrl, {
        industry,
        targetAudience,
        mainGoal,
        service: 'openai'
      });

      console.log('OpenAI API response:', response.data);

      const { generatedContent } = response.data;

      // Valider la structure de la réponse
      if (!this.validateGeneratedContent(generatedContent)) {
        throw new Error('Invalid content structure received from API');
      }

      return {
        generatedContent
      };
    } catch (error) {
      console.error('Error generating landing page content:', {
        message: error.message,
        response: error.response?.data,
        status: error.response?.status
      });
      throw new Error(error.response?.data?.error || error.message || 'Failed to generate content');
    }
  }

  validateGeneratedContent(content) {
    // Validation de base des sections principales
    return (
      content &&
      this.validateHeroSection(content.hero) &&
      this.validateContentSection(content.content) &&
      this.validateSocialSection(content.social) &&
      this.validateClosingSection(content.closing) &&
      this.validateDesignSection(content.design)
    );
  }

  validateHeroSection(hero) {
    return (
      hero &&
      typeof hero.title === 'string' &&
      typeof hero.subtitle === 'string' &&
      typeof hero.ctaText === 'string'
    );
  }

  validateContentSection(content) {
    return (
      content &&
      typeof content.mainHeadline === 'string' &&
      typeof content.description === 'string' &&
      Array.isArray(content.benefits) &&
      content.benefits.length === 3 &&
      content.benefits.every(benefit => 
        typeof benefit.title === 'string' &&
        typeof benefit.description === 'string' &&
        typeof benefit.icon === 'string'
      ) &&
      Array.isArray(content.features) &&
      content.features.length === 3 &&
      content.features.every(feature =>
        typeof feature.title === 'string' &&
        typeof feature.description === 'string' &&
        typeof feature.imageQuery === 'string'
      )
    );
  }

  validateSocialSection(social) {
    return (
      social &&
      Array.isArray(social.testimonials) &&
      social.testimonials.length === 2 &&
      social.testimonials.every(testimonial =>
        typeof testimonial.quote === 'string' &&
        typeof testimonial.author === 'string'
      )
    );
  }

  validateClosingSection(closing) {
    return (
      closing &&
      typeof closing.headline === 'string' &&
      typeof closing.ctaText === 'string'
    );
  }

  validateDesignSection(design) {
    return (
      design &&
      design.colors &&
      typeof design.colors.primary === 'string' &&
      typeof design.colors.secondary === 'string' &&
      typeof design.colors.accent === 'string' &&
      design.fonts &&
      typeof design.fonts.heading === 'string' &&
      typeof design.fonts.body === 'string'
    );
  }
}

const openaiService = new OpenAIService();
export default openaiService;
