import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { 
  SparklesIcon, 
  ArrowTopRightOnSquareIcon, 
  XMarkIcon,
  CloudArrowUpIcon,
  GlobeAltIcon 
} from '@heroicons/react/24/outline';
import LandingPageTemplate from '../landing/LandingPageTemplate';
import DomainManager from '../domain/DomainManager';
import deploymentService from '../../services/deployment';

const LandingPagePreview = ({ landingPage }) => {
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [isDeploying, setIsDeploying] = useState(false);

  const handleDeploy = async () => {
    setIsDeploying(true);
    try {
      await deploymentService.deployLandingPage(landingPage, landingPage.userId);
    } catch (error) {
      console.error('Error deploying landing page:', error);
    } finally {
      setIsDeploying(false);
    }
  };

  const previewContent = {
    title: landingPage.title,
    description: landingPage.description,
    ctaText: landingPage.ctaText,
    benefits: landingPage.generatedContent?.benefits || []
  };

  const previewColors = {
    primaryColor: landingPage.primaryColor,
    secondaryColor: landingPage.secondaryColor
  };

  const handleFullscreenToggle = () => {
    setIsFullscreen(!isFullscreen);
  };

  return (
    <div className="min-h-screen bg-black pt-32 pb-24">
      <div className="container mx-auto px-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-16"
        >
          <div className="inline-flex items-center px-4 py-2 mb-6 rounded-full bg-purple-500/10 border border-purple-500/20 text-purple-400">
            <SparklesIcon className="w-5 h-5 mr-2" />
            <span>Prévisualisation</span>
          </div>
          <h1 className="text-4xl font-bold text-white mb-4">
            Aperçu de votre landing page
          </h1>
          <p className="text-xl text-gray-400 max-w-2xl mx-auto">
            Visualisez et déployez votre landing page en quelques clics
          </p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className={`relative ${isFullscreen ? 'fixed inset-0 z-50 bg-black' : ''}`}
        >
          {/* Preview Controls */}
          <div className={`sticky top-0 z-10 backdrop-blur-xl border-b border-white/10 p-6 flex justify-between items-center ${
            isFullscreen ? 'bg-black/80' : 'bg-black/50'
          }`}>
            <div className="flex items-center">
              <GlobeAltIcon className="w-6 h-6 text-purple-400 mr-3" />
              <h2 className="text-xl font-semibold text-white">Aperçu en direct</h2>
            </div>
            <div className="flex gap-4">
              <button
                onClick={handleDeploy}
                disabled={isDeploying}
                className="px-6 py-3 bg-gradient-to-r from-purple-600 to-pink-600 rounded-lg font-semibold text-white hover:opacity-90 transition-opacity disabled:opacity-50 disabled:cursor-not-allowed inline-flex items-center"
              >
                <CloudArrowUpIcon className="w-5 h-5 mr-2" />
                {isDeploying ? 'Déploiement...' : 'Déployer'}
              </button>
              <button
                onClick={handleFullscreenToggle}
                className="px-6 py-3 bg-white/5 hover:bg-white/10 border border-white/10 rounded-lg font-semibold text-white transition-colors inline-flex items-center"
              >
                {isFullscreen ? (
                  <>
                    <XMarkIcon className="w-5 h-5 mr-2" />
                    Fermer
                  </>
                ) : (
                  <>
                    <ArrowTopRightOnSquareIcon className="w-5 h-5 mr-2" />
                    Plein écran
                  </>
                )}
              </button>
            </div>
          </div>

          {/* Preview Content */}
          <div className={`${isFullscreen ? '' : 'rounded-xl overflow-hidden border border-white/10 my-6'}`}>
            <LandingPageTemplate
              content={previewContent}
              colors={previewColors}
              isPreview={!isFullscreen}
            />
          </div>
        </motion.div>

        {/* Domain Manager */}
        {landingPage.deployment && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="mt-8"
          >
            <DomainManager landingPage={landingPage} />
          </motion.div>
        )}
      </div>
    </div>
  );
};

export default LandingPagePreview;
