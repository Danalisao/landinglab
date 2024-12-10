import axios from 'axios';

class ClaudeService {
  constructor() {
    this.apiUrl = 'http://localhost:5001/api/generate';
  }

  async generateLandingPage({ industry, targetAudience, mainGoal }) {
    try {
      console.log('Generating landing page with Claude:', { industry, targetAudience, mainGoal });

      const response = await axios.post(this.apiUrl, {
        industry,
        targetAudience,
        mainGoal
      });

      console.log('Claude API response:', response.data);

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
    return (
      content &&
      typeof content.title === 'string' &&
      typeof content.description === 'string' &&
      typeof content.ctaText === 'string' &&
      Array.isArray(content.benefits) &&
      content.benefits.length > 0
    );
  }
}

const claudeService = new ClaudeService();
export default claudeService;
