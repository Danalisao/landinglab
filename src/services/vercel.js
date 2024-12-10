import axios from 'axios';

const VERCEL_API_URL = 'https://api.vercel.com/v9';

class VercelService {
  constructor(token) {
    this.token = token;
    this.axiosInstance = axios.create({
      baseURL: VERCEL_API_URL,
      headers: {
        Authorization: `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
    });
  }

  async createDeployment(projectId, files) {
    try {
      const response = await this.axiosInstance.post('/deployments', {
        name: projectId,
        files,
        projectSettings: {
          framework: 'react',
        },
      });
      return response.data;
    } catch (error) {
      console.error('Error creating deployment:', error);
      throw error;
    }
  }

  async addDomain(projectId, domain) {
    try {
      const response = await this.axiosInstance.post(`/projects/${projectId}/domains`, {
        name: domain,
      });
      return response.data;
    } catch (error) {
      console.error('Error adding domain:', error);
      throw error;
    }
  }

  async verifyDomain(domain) {
    try {
      const response = await this.axiosInstance.post('/domains/verify', {
        name: domain,
      });
      return response.data;
    } catch (error) {
      console.error('Error verifying domain:', error);
      throw error;
    }
  }

  async getDomainStatus(domain) {
    try {
      const response = await this.axiosInstance.get(`/domains/${domain}/status`);
      return response.data;
    } catch (error) {
      console.error('Error getting domain status:', error);
      throw error;
    }
  }
}

export default VercelService;
