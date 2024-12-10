import { db } from '../config/firebase';
import { doc, updateDoc, collection, addDoc } from 'firebase/firestore';
import VercelService from './vercel';

class DeploymentService {
  constructor() {
    this.vercelService = new VercelService(import.meta.env.VITE_VERCEL_TOKEN);
  }

  async deployLandingPage(landingPage, userId) {
    try {
      // Générer le nom de sous-domaine
      const subdomain = this.generateSubdomain(landingPage.title, userId);
      
      // Préparer les fichiers pour le déploiement
      const files = this.prepareLandingPageFiles(landingPage);
      
      // Créer le déploiement sur Vercel
      const deployment = await this.vercelService.createDeployment(subdomain, files);
      
      // Mettre à jour le document dans Firestore
      const deploymentDoc = {
        deploymentId: deployment.id,
        url: `https://${subdomain}.landinglab.app`,
        status: 'deployed',
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      };

      await this.updateLandingPageDeployment(landingPage.id, deploymentDoc);
      
      return deploymentDoc;
    } catch (error) {
      console.error('Error deploying landing page:', error);
      throw error;
    }
  }

  async addCustomDomain(landingPageId, customDomain) {
    try {
      // Vérifier le domaine
      await this.vercelService.verifyDomain(customDomain);
      
      // Ajouter le domaine au projet
      const landingPageRef = doc(db, 'landingPages', landingPageId);
      await updateDoc(landingPageRef, {
        customDomain,
        customDomainStatus: 'pending',
      });

      // Démarrer la surveillance du statut du domaine
      this.watchDomainStatus(landingPageId, customDomain);
      
      return { status: 'pending', domain: customDomain };
    } catch (error) {
      console.error('Error adding custom domain:', error);
      throw error;
    }
  }

  async watchDomainStatus(landingPageId, domain) {
    const checkStatus = async () => {
      try {
        const status = await this.vercelService.getDomainStatus(domain);
        const landingPageRef = doc(db, 'landingPages', landingPageId);
        
        await updateDoc(landingPageRef, {
          customDomainStatus: status.verified ? 'active' : 'pending',
        });

        if (!status.verified) {
          // Vérifier à nouveau dans 5 minutes
          setTimeout(checkStatus, 5 * 60 * 1000);
        }
      } catch (error) {
        console.error('Error checking domain status:', error);
      }
    };

    // Démarrer la vérification
    checkStatus();
  }

  generateSubdomain(title, userId) {
    // Convertir le titre en slug
    const slug = title
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/(^-|-$)/g, '');
    
    // Prendre les 8 premiers caractères de l'ID utilisateur
    const userPrefix = userId.slice(0, 8);
    
    return `${userPrefix}-${slug}`;
  }

  prepareLandingPageFiles(landingPage) {
    // Créer les fichiers nécessaires pour le déploiement
    const htmlContent = this.generateHTML(landingPage);
    
    return [
      {
        file: 'index.html',
        data: htmlContent,
      },
      {
        file: 'vercel.json',
        data: JSON.stringify({
          version: 2,
          builds: [{ src: 'index.html', use: '@vercel/static' }],
          routes: [{ src: '/(.*)', dest: '/index.html' }],
        }),
      },
    ];
  }

  generateHTML(landingPage) {
    return `
      <!DOCTYPE html>
      <html lang="fr">
        <head>
          <meta charset="UTF-8">
          <meta name="viewport" content="width=device-width, initial-scale=1.0">
          <title>${landingPage.title}</title>
          <script src="https://cdn.tailwindcss.com"></script>
        </head>
        <body>
          <div class="min-h-screen bg-white">
            <main class="container mx-auto px-4 py-16">
              <h1 class="text-4xl font-bold text-center mb-8" style="color: ${landingPage.primaryColor}">
                ${landingPage.title}
              </h1>
              <div class="max-w-2xl mx-auto">
                <p class="text-lg text-gray-700 mb-8">
                  ${landingPage.description}
                </p>
                <div class="text-center">
                  <a
                    href="#"
                    class="inline-block px-8 py-3 rounded-lg text-white text-lg font-semibold"
                    style="background-color: ${landingPage.secondaryColor}"
                  >
                    ${landingPage.ctaText}
                  </a>
                </div>
              </div>
            </main>
          </div>
        </body>
      </html>
    `;
  }

  async updateLandingPageDeployment(landingPageId, deploymentData) {
    const landingPageRef = doc(db, 'landingPages', landingPageId);
    await updateDoc(landingPageRef, {
      deployment: deploymentData,
    });
  }
}

export default new DeploymentService();
