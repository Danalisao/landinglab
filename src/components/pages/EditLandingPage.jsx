import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { doc, getDoc, updateDoc } from 'firebase/firestore';
import { motion } from 'framer-motion';
import { SparklesIcon, EyeIcon } from '@heroicons/react/24/outline';
import { db } from '../../firebase';
import { useAuth } from '../../contexts/AuthContext';
import LandingPageForm from '../forms/LandingPageForm';
import LandingPageContentForm from '../forms/LandingPageContentForm';
import AIProviderSelector from '../ai/AIProviderSelector';
import AIFactory from '../../services/aiFactory';

const EditLandingPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user, loading } = useAuth();
  const [landingPage, setLandingPage] = useState(null);
  const [pageLoading, setPageLoading] = useState(true);
  const [error, setError] = useState('');
  const [isGenerating, setIsGenerating] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [selectedAiProvider, setSelectedAiProvider] = useState('openai');
  const [activeTab, setActiveTab] = useState('settings');

  useEffect(() => {
    const fetchLandingPage = async () => {
      try {
        if (!user) {
          setError('Vous devez être connecté pour accéder à cette page');
          navigate('/login');
          return;
        }

        const docRef = doc(db, 'landingPages', id);
        const docSnap = await getDoc(docRef);
        
        if (docSnap.exists()) {
          const data = docSnap.data();
          if (data.userId !== user.uid) {
            setError('Vous n\'avez pas accès à cette page');
            navigate('/dashboard');
            return;
          }
          setLandingPage(data);
          setSelectedAiProvider(data.aiProvider || 'openai');
        } else {
          setError('Page non trouvée');
          navigate('/dashboard');
        }
      } catch (error) {
        console.error('Erreur lors de la récupération de la landing page:', error);
        setError('Erreur lors de la récupération de la landing page');
      } finally {
        setPageLoading(false);
      }
    };

    if (!loading) {
      fetchLandingPage();
    }
  }, [id, user, loading, navigate]);

  const handleSubmit = async (formData) => {
    try {
      if (!user) {
        throw new Error('Vous devez être connecté pour effectuer cette action');
      }

      const docRef = doc(db, 'landingPages', id);
      await updateDoc(docRef, {
        ...formData,
        updatedAt: new Date().toISOString()
      });
      navigate('/dashboard');
    } catch (error) {
      console.error('Erreur lors de la mise à jour:', error);
      setError('Erreur lors de la mise à jour de la landing page');
    }
  };

  const handleRegenerate = async () => {
    try {
      setError('');
      setIsGenerating(true);

      // Obtenir le service d'IA sélectionné
      const aiService = AIFactory.getAIService(selectedAiProvider);
      
      // Générer le nouveau contenu
      const { generatedContent } = await aiService.generateLandingPage({
        industry: landingPage.industry,
        targetAudience: landingPage.targetAudience,
        mainGoal: landingPage.mainGoal
      });

      if (!generatedContent) {
        throw new Error('Le contenu généré est vide');
      }

      // Mettre à jour la landing page avec le nouveau contenu
      const docRef = doc(db, 'landingPages', id);
      await updateDoc(docRef, {
        generatedContent: generatedContent,
        aiProvider: selectedAiProvider,
        updatedAt: new Date().toISOString()
      });

      // Mettre à jour l'état local
      setLandingPage({
        ...landingPage,
        generatedContent: generatedContent,
        aiProvider: selectedAiProvider
      });

    } catch (error) {
      console.error('Erreur lors de la régénération:', error);
      setError(error.message);
    } finally {
      setIsGenerating(false);
    }
  };

  const handleContentChange = async (newContent) => {
    try {
      setIsSaving(true);
      setError('');

      // Vérifier si les images ont changé en comparant avec l'état actuel
      const needsImageUpdate = (
        // Vérifier les sections hero et closing
        (newContent.hero?.imageQuery !== landingPage.generatedContent?.hero?.imageQuery) ||
        (newContent.hero?.customImageUrl !== landingPage.generatedContent?.hero?.customImageUrl) ||
        (newContent.closing?.imageQuery !== landingPage.generatedContent?.closing?.imageQuery) ||
        (newContent.closing?.customImageUrl !== landingPage.generatedContent?.closing?.customImageUrl) ||
        // Vérifier les features
        newContent.content?.features?.some((feature, index) => {
          const oldFeature = landingPage.generatedContent?.content?.features?.[index];
          return (
            feature.imageQuery !== oldFeature?.imageQuery ||
            feature.customImageUrl !== oldFeature?.customImageUrl
          );
        })
      );

      let contentToSave = newContent;

      if (needsImageUpdate) {
        // Obtenir le service d'IA sélectionné pour les images
        const aiService = AIFactory.getAIService(selectedAiProvider);
        
        // Enrichir le contenu avec de nouvelles images
        const { generatedContent } = await aiService.generateLandingPage({
          industry: landingPage.industry,
          targetAudience: landingPage.targetAudience,
          mainGoal: landingPage.mainGoal,
          existingContent: newContent
        });

        contentToSave = generatedContent;
      }

      // Mettre à jour la landing page
      const docRef = doc(db, 'landingPages', id);
      await updateDoc(docRef, {
        generatedContent: contentToSave,
        updatedAt: new Date().toISOString()
      });

      // Mettre à jour l'état local
      setLandingPage({
        ...landingPage,
        generatedContent: contentToSave
      });

    } catch (error) {
      console.error('Erreur lors de la sauvegarde:', error);
      setError('Erreur lors de la sauvegarde des modifications');
    } finally {
      setIsSaving(false);
    }
  };

  const handlePreview = () => {
    navigate(`/preview/${id}`);
  };

  const handleContentSave = async () => {
    try {
      setIsSaving(true);
      setError('');

      const docRef = doc(db, 'landingPages', id);
      await updateDoc(docRef, {
        generatedContent: landingPage.generatedContent,
        updatedAt: new Date().toISOString()
      });

      // Afficher une notification de succès
      alert('Modifications sauvegardées avec succès !');
    } catch (error) {
      console.error('Erreur lors de la sauvegarde:', error);
      setError('Erreur lors de la sauvegarde des modifications');
    } finally {
      setIsSaving(false);
    }
  };

  if (loading || pageLoading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-purple-600"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-center p-4">
        <p className="text-red-500">{error}</p>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8 mt-20">
      <div className="flex justify-between items-center mb-8 sticky top-20 z-40 bg-black/50 backdrop-blur-sm py-4 px-6 rounded-xl border border-white/10">
        <h1 className="text-3xl font-bold text-white">
          Modifier la Landing Page
        </h1>
        <div className="flex space-x-4">
          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            onClick={handlePreview}
            className="px-4 py-2 bg-purple-600 text-white rounded-lg flex items-center space-x-2 hover:bg-purple-700 transition-colors"
          >
            <EyeIcon className="w-5 h-5" />
            <span>Prévisualiser</span>
          </motion.button>
        </div>
      </div>

      {landingPage && (
        <div className="space-y-8">
          {/* Tabs de navigation */}
          <div className="flex space-x-4 border-b border-white/10">
            <button
              onClick={() => setActiveTab('settings')}
              className={`px-4 py-2 font-medium ${
                activeTab === 'settings'
                  ? 'text-purple-500 border-b-2 border-purple-500'
                  : 'text-gray-400 hover:text-white'
              }`}
            >
              Paramètres
            </button>
            <button
              onClick={() => setActiveTab('content')}
              className={`px-4 py-2 font-medium ${
                activeTab === 'content'
                  ? 'text-purple-500 border-b-2 border-purple-500'
                  : 'text-gray-400 hover:text-white'
              }`}
            >
              Contenu
            </button>
          </div>

          {activeTab === 'settings' ? (
            <>
              {/* Section Régénération */}
              <div className="p-6 rounded-xl bg-white/5 border border-purple-500/20 backdrop-blur-sm">
                <h2 className="text-xl font-semibold text-white mb-4">Régénération du contenu</h2>
                <div className="space-y-4">
                  <AIProviderSelector
                    value={selectedAiProvider}
                    onChange={setSelectedAiProvider}
                  />
                  <motion.button
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    onClick={handleRegenerate}
                    disabled={isGenerating}
                    className={`w-full px-6 py-4 bg-gradient-to-r from-purple-600 to-pink-600 rounded-xl font-semibold text-white hover:opacity-90 transition-opacity disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center space-x-2 ${
                      isGenerating ? 'animate-pulse' : ''
                    }`}
                  >
                    {isGenerating ? (
                      <>
                        <svg className="animate-spin h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                        </svg>
                        <span>Régénération en cours...</span>
                      </>
                    ) : (
                      <>
                        <SparklesIcon className="w-5 h-5" />
                        <span>Régénérer le contenu</span>
                      </>
                    )}
                  </motion.button>
                </div>
              </div>

              {/* Formulaire d'édition des paramètres */}
              <LandingPageForm
                initialValues={landingPage}
                onSubmit={handleSubmit}
                submitButtonText="Mettre à jour"
              />
            </>
          ) : (
            /* Formulaire d'édition du contenu */
            <LandingPageContentForm
              content={landingPage.generatedContent}
              onChange={handleContentChange}
              onSave={handleContentSave}
            />
          )}
        </div>
      )}
    </div>
  );
};

export default EditLandingPage;
