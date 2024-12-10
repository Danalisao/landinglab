import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { SparklesIcon, SwatchIcon } from '@heroicons/react/24/outline';
import { useAuth } from '../../contexts/AuthContext';
import landingPageSchema from '../../validations/landingPageSchema';
import AIProviderSelector from '../ai/AIProviderSelector';
import AIFactory from '../../services/aiFactory';
import { db } from '../../firebase';
import { collection, addDoc } from 'firebase/firestore';

const CreateLandingPage = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [isGenerating, setIsGenerating] = useState(false);
  const [generatedContent, setGeneratedContent] = useState(null);
  const [error, setError] = useState(null);

  const {
    register,
    handleSubmit,
    watch,
    setValue,
    formState: { errors, isSubmitting }
  } = useForm({
    resolver: yupResolver(landingPageSchema),
    defaultValues: {
      aiProvider: 'openai',
      primaryColor: '#6D28D9',
      secondaryColor: '#DB2777'
    }
  });

  const selectedAiProvider = watch('aiProvider');

  const onSubmit = async (data) => {
    setError(null);
    setIsGenerating(true);
    try {
      console.log('Starting landing page generation with data:', data);
      
      // Obtenir le service d'IA sélectionné
      const aiService = AIFactory.getAIService(data.aiProvider);
      console.log('Using AI service:', data.aiProvider);
      
      // Générer le contenu
      console.log('Calling AI service with params:', {
        industry: data.industry,
        targetAudience: data.targetAudience,
        mainGoal: data.mainGoal
      });
      
      const { generatedContent } = await aiService.generateLandingPage({
        industry: data.industry,
        targetAudience: data.targetAudience,
        mainGoal: data.mainGoal
      });

      console.log('Generated content:', generatedContent);

      if (!generatedContent) {
        throw new Error('Le contenu généré est vide');
      }

      // Créer la landing page dans Firestore
      const landingPage = {
        ...data,
        generatedContent,
        userId: user.uid,
        status: 'draft',
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      };

      console.log('Saving to Firestore:', landingPage);
      const docRef = await addDoc(collection(db, 'landingPages'), landingPage);
      console.log('Saved to Firestore with ID:', docRef.id);
      
      // Rediriger vers la page d'édition
      navigate(`/edit-landing-page/${docRef.id}`);
    } catch (error) {
      console.error('Error creating landing page:', error);
      setError(error.message || 'Une erreur est survenue lors de la génération de la landing page');
    } finally {
      setIsGenerating(false);
    }
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
            <span>Nouvelle landing page</span>
          </div>
          <h1 className="text-4xl font-bold text-white mb-4">
            Créez votre landing page
          </h1>
          <p className="text-xl text-gray-400 max-w-2xl mx-auto">
            Notre IA va générer une landing page optimisée pour vos objectifs
          </p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="max-w-3xl mx-auto"
        >
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-8">
            {error && (
              <div className="p-4 rounded-lg bg-red-500/10 border border-red-500/20 text-red-500">
                <p>{error}</p>
              </div>
            )}
            {/* Sélecteur d'IA */}
            <div className="mb-8">
              <AIProviderSelector
                value={selectedAiProvider}
                onChange={(value) => setValue('aiProvider', value)}
              />
              {errors.aiProvider && (
                <p className="mt-1 text-sm text-red-500">
                  {errors.aiProvider.message}
                </p>
              )}
            </div>

            {/* Informations de base */}
            <div className="p-6 rounded-xl bg-white/5 border border-purple-500/20 backdrop-blur-sm space-y-6">
              <h2 className="text-xl font-semibold text-white mb-6">Informations de base</h2>
              
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  Industrie / Secteur d'activité
                </label>
                <input
                  type="text"
                  {...register('industry')}
                  className="w-full px-4 py-3 bg-black/50 border border-gray-700 rounded-lg text-white placeholder-gray-500 focus:border-purple-500 focus:ring-1 focus:ring-purple-500"
                  placeholder="Ex: Tech, E-commerce, Santé..."
                />
                {errors.industry && (
                  <p className="mt-1 text-sm text-red-500">
                    {errors.industry.message}
                  </p>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  Public cible
                </label>
                <input
                  type="text"
                  {...register('targetAudience')}
                  className="w-full px-4 py-3 bg-black/50 border border-gray-700 rounded-lg text-white placeholder-gray-500 focus:border-purple-500 focus:ring-1 focus:ring-purple-500"
                  placeholder="Ex: Entrepreneurs, Étudiants, Professionnels..."
                />
                {errors.targetAudience && (
                  <p className="mt-1 text-sm text-red-500">
                    {errors.targetAudience.message}
                  </p>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  Objectif principal
                </label>
                <select
                  {...register('mainGoal')}
                  className="w-full px-4 py-3 bg-black/50 border border-gray-700 rounded-lg text-white placeholder-gray-500 focus:border-purple-500 focus:ring-1 focus:ring-purple-500"
                >
                  <option value="">Sélectionnez un objectif</option>
                  <option value="lead">Générer des leads</option>
                  <option value="sale">Vendre un produit</option>
                  <option value="signup">Inscription newsletter</option>
                  <option value="contact">Demande de contact</option>
                  <option value="download">Téléchargement</option>
                </select>
                {errors.mainGoal && (
                  <p className="mt-1 text-sm text-red-500">
                    {errors.mainGoal.message}
                  </p>
                )}
              </div>
            </div>

            {/* Personnalisation */}
            <div className="p-6 rounded-xl bg-white/5 border border-purple-500/20 backdrop-blur-sm space-y-6">
              <div className="flex items-center mb-6">
                <SwatchIcon className="w-6 h-6 text-purple-400 mr-3" />
                <h2 className="text-xl font-semibold text-white">Personnalisation</h2>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">
                    Couleur principale
                  </label>
                  <input
                    type="color"
                    {...register('primaryColor')}
                    className="w-full h-12 rounded-lg border border-gray-700 bg-black/50 cursor-pointer"
                  />
                  {errors.primaryColor && (
                    <p className="mt-1 text-sm text-red-500">
                      {errors.primaryColor.message}
                    </p>
                  )}
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">
                    Couleur secondaire
                  </label>
                  <input
                    type="color"
                    {...register('secondaryColor')}
                    className="w-full h-12 rounded-lg border border-gray-700 bg-black/50 cursor-pointer"
                  />
                  {errors.secondaryColor && (
                    <p className="mt-1 text-sm text-red-500">
                      {errors.secondaryColor.message}
                    </p>
                  )}
                </div>
              </div>
            </div>

            {/* Bouton de soumission */}
            <div className="flex justify-center pt-6">
              <button
                type="submit"
                disabled={isGenerating || isSubmitting}
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
                    <span>Génération en cours...</span>
                  </>
                ) : (
                  <>
                    <SparklesIcon className="w-5 h-5" />
                    <span>Générer ma landing page</span>
                  </>
                )}
              </button>
            </div>
          </form>
        </motion.div>
      </div>
    </div>
  );
};

export default CreateLandingPage;
