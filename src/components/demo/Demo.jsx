import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Link } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import { SparklesIcon, CheckIcon } from '@heroicons/react/24/outline';

const DemoStep = ({ step, currentStep, title, content, isLast }) => {
  const isActive = currentStep === step;
  const isComplete = currentStep > step;

  return (
    <div className={`flex items-start space-x-4 ${isLast ? '' : 'pb-8'}`}>
      <div className="relative">
        <div
          className={`w-8 h-8 rounded-full flex items-center justify-center ${
            isComplete
              ? 'bg-green-500'
              : isActive
              ? 'bg-gradient-to-r from-purple-600 to-pink-600'
              : 'bg-gray-700'
          }`}
        >
          {isComplete ? (
            <CheckIcon className="w-5 h-5 text-white" />
          ) : (
            <span className="text-white font-semibold">{step + 1}</span>
          )}
        </div>
        {!isLast && (
          <div
            className={`absolute left-4 top-8 w-0.5 h-full -translate-x-1/2 ${
              isComplete ? 'bg-green-500' : 'bg-gray-700'
            }`}
          />
        )}
      </div>
      <div className="flex-1">
        <h3 className={`text-lg font-semibold mb-2 ${isActive ? 'text-white' : 'text-gray-400'}`}>
          {title}
        </h3>
        <div
          className={`transition-all duration-500 ${
            isActive ? 'opacity-100 max-h-96' : 'opacity-50 max-h-0 overflow-hidden'
          }`}
        >
          {content}
        </div>
      </div>
    </div>
  );
};

const TypewriterText = ({ text, onComplete }) => {
  const [displayText, setDisplayText] = useState('');
  const [currentIndex, setCurrentIndex] = useState(0);

  useEffect(() => {
    if (currentIndex < text.length) {
      const timeout = setTimeout(() => {
        setDisplayText(prev => prev + text[currentIndex]);
        setCurrentIndex(prev => prev + 1);
      }, 50);
      return () => clearTimeout(timeout);
    } else if (onComplete) {
      onComplete();
    }
  }, [currentIndex, text, onComplete]);

  return (
    <div className="font-mono">
      {displayText}
      {currentIndex < text.length && (
        <span className="animate-pulse">|</span>
      )}
    </div>
  );
};

const Demo = () => {
  const { user } = useAuth();
  const [currentStep, setCurrentStep] = useState(0);
  const [userInput, setUserInput] = useState('');
  const [isGenerating, setIsGenerating] = useState(false);
  const [generatedPreview, setGeneratedPreview] = useState(null);

  const handleInputSubmit = (e) => {
    e.preventDefault();
    if (userInput.trim()) {
      setIsGenerating(true);
      // Simuler la génération
      setTimeout(() => {
        setGeneratedPreview({
          title: "Landing Page Générée",
          description: "Une superbe landing page pour votre projet",
          features: [
            "Design moderne et responsive",
            "Textes optimisés pour la conversion",
            "Appels à l'action stratégiques"
          ]
        });
        setIsGenerating(false);
        setCurrentStep(2);
      }, 3000);
    }
  };

  const demoSteps = [
    {
      title: "Décrivez votre projet",
      content: (
        <div className="space-y-4">
          <p className="text-gray-400">
            Expliquez votre projet en quelques mots, notre IA s'occupe du reste.
          </p>
          <form onSubmit={handleInputSubmit} className="space-y-4">
            <textarea
              value={userInput}
              onChange={(e) => setUserInput(e.target.value)}
              placeholder="Ex: Je veux créer une landing page pour mon application mobile de méditation..."
              className="w-full h-32 px-4 py-3 bg-black/50 border border-gray-700 rounded-lg text-white placeholder-gray-500 focus:border-purple-500 focus:ring-1 focus:ring-purple-500"
            />
            <button
              type="submit"
              disabled={!userInput.trim()}
              className="px-6 py-3 bg-gradient-to-r from-purple-600 to-pink-600 rounded-lg font-semibold text-white hover:opacity-90 transition-opacity disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Générer ma landing page
            </button>
          </form>
        </div>
      )
    },
    {
      title: "L'IA génère votre page",
      content: (
        <div className="space-y-4">
          {isGenerating ? (
            <div className="space-y-4">
              <div className="flex items-center space-x-2 text-purple-400">
                <SparklesIcon className="w-5 h-5 animate-pulse" />
                <span>Génération en cours...</span>
              </div>
              <div className="bg-black/50 border border-gray-700 rounded-lg p-4">
                <TypewriterText
                  text="Analyse de votre projet... Création du design... Optimisation des textes... Génération des appels à l'action..."
                  onComplete={() => {}}
                />
              </div>
            </div>
          ) : (
            <div className="text-gray-400">
              En attente de vos instructions...
            </div>
          )}
        </div>
      )
    },
    {
      title: "Votre landing page est prête",
      content: (
        <div className="space-y-6">
          {generatedPreview && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="bg-black/50 border border-gray-700 rounded-lg p-6 space-y-4"
            >
              <h4 className="text-xl font-semibold text-white">{generatedPreview.title}</h4>
              <p className="text-gray-400">{generatedPreview.description}</p>
              <div className="space-y-2">
                {generatedPreview.features.map((feature, index) => (
                  <div key={index} className="flex items-center space-x-2">
                    <CheckIcon className="w-5 h-5 text-green-500" />
                    <span className="text-gray-300">{feature}</span>
                  </div>
                ))}
              </div>
              <div className="pt-4">
                <Link
                  to={user ? "/dashboard" : "/signup"}
                  className="inline-flex items-center px-6 py-3 bg-gradient-to-r from-purple-600 to-pink-600 rounded-lg font-semibold text-white hover:opacity-90 transition-opacity"
                >
                  {user ? "Créer une landing page" : "Créer mon compte pour publier"}
                  <svg className="w-5 h-5 ml-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
                  </svg>
                </Link>
              </div>
            </motion.div>
          )}
        </div>
      )
    }
  ];

  return (
    <div className="min-h-screen bg-black pt-32 pb-24">
      <div className="container mx-auto px-6">
        <div className="max-w-3xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center mb-16"
          >
            <div className="inline-flex items-center px-4 py-2 mb-6 rounded-full bg-purple-500/10 border border-purple-500/20 text-purple-400">
              <SparklesIcon className="w-5 h-5 mr-2" />
              <span>Démonstration interactive</span>
            </div>
            <h1 className="text-4xl md:text-5xl font-bold mb-6">
              Créez une landing page en <span className="bg-clip-text text-transparent bg-gradient-to-r from-purple-600 to-pink-600">temps réel</span>
            </h1>
            <p className="text-gray-400 text-lg max-w-2xl mx-auto">
              Testez notre outil sans inscription et découvrez comment l'IA peut transformer vos idées en landing pages performantes.
            </p>
          </motion.div>

          <div className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-xl p-8">
            {demoSteps.map((step, index) => (
              <DemoStep
                key={index}
                step={index}
                currentStep={currentStep}
                title={step.title}
                content={step.content}
                isLast={index === demoSteps.length - 1}
              />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Demo;
