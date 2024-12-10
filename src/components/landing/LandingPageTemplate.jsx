import React, { useEffect, useState } from 'react';
import PropTypes from 'prop-types';
import { v4 as uuidv4 } from 'uuid';
import analyticsService from '../../services/analytics';
import abTestingService from '../../services/abTesting';

const LandingPageTemplate = ({ content, colors, landingPageId, isPreview = false }) => {
  const [activeVariant, setActiveVariant] = useState(null);
  const [sessionId, setSessionId] = useState(null);
  const [abTestId, setAbTestId] = useState(null);

  useEffect(() => {
    const initializeSession = async () => {
      if (!isPreview && landingPageId) {
        // Générer un ID de session unique pour ce visiteur
        const newSessionId = uuidv4();
        setSessionId(newSessionId);
        
        // Vérifier s'il y a un test A/B actif
        const activeTest = await abTestingService.getActiveTest(landingPageId);
        if (activeTest) {
          setAbTestId(activeTest.id);
          const selectedVariant = await abTestingService.selectVariant(activeTest.id);
          if (selectedVariant) {
            setActiveVariant(selectedVariant);
            // Tracker l'impression pour cette variante
            await abTestingService.trackImpression(activeTest.id, selectedVariant.id);
          }
        }

        // Tracker la vue de page
        analyticsService.trackPageView(landingPageId, newSessionId);
      }
    };

    initializeSession();
  }, [landingPageId, isPreview]);

  const handleCtaClick = async () => {
    if (!isPreview && landingPageId) {
      if (sessionId) {
        analyticsService.trackCTAClick(landingPageId, sessionId);
        
        // Si un test A/B est actif, tracker la conversion
        if (abTestId && activeVariant) {
          await abTestingService.trackConversion(abTestId, activeVariant.id);
        }
      }
    }
  };

  // Utiliser le contenu de la variante active si disponible, sinon utiliser le contenu par défaut
  const displayContent = activeVariant ? activeVariant.content : content;

  const { title, description, ctaText, benefits } = displayContent;
  const { primaryColor, secondaryColor } = colors;

  const headerStyle = {
    backgroundColor: primaryColor,
    background: `linear-gradient(135deg, ${primaryColor}, ${secondaryColor})`
  };

  const ctaStyle = {
    backgroundColor: secondaryColor,
    boxShadow: `0 4px 14px ${secondaryColor}50`
  };

  return (
    <div className={`min-h-screen flex flex-col ${isPreview ? 'scale-90' : ''}`}>
      {/* Header Section */}
      <header 
        className="py-16 px-4 text-white text-center"
        style={headerStyle}
      >
        <div className="container mx-auto max-w-4xl">
          <h1 className="text-4xl md:text-5xl font-bold mb-6">{title}</h1>
          <p className="text-xl md:text-2xl opacity-90">
            {description.split('\n')[0]}
          </p>
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-grow">
        {/* Description Section */}
        <section className="py-16 px-4 bg-white">
          <div className="container mx-auto max-w-4xl">
            <div className="prose lg:prose-xl mx-auto">
              {description.split('\n').map((paragraph, index) => (
                <p key={index} className="text-gray-700 leading-relaxed mb-4">
                  {paragraph}
                </p>
              ))}
            </div>
          </div>
        </section>

        {/* Benefits Section */}
        {benefits && benefits.length > 0 && (
          <section className="py-16 px-4 bg-gray-50">
            <div className="container mx-auto max-w-4xl">
              <h2 
                className="text-3xl font-bold mb-12 text-center"
                style={{ color: primaryColor }}
              >
                Pourquoi nous choisir ?
              </h2>
              <div className="grid md:grid-cols-3 gap-8">
                {benefits.map((benefit, index) => (
                  <div 
                    key={index}
                    className="p-6 bg-white rounded-lg shadow-lg"
                  >
                    <div 
                      className="w-12 h-12 flex items-center justify-center rounded-full mb-4"
                      style={{ backgroundColor: `${primaryColor}15` }}
                    >
                      <span 
                        className="text-2xl"
                        style={{ color: primaryColor }}
                      >
                        {index + 1}
                      </span>
                    </div>
                    <p className="text-gray-700">{benefit}</p>
                  </div>
                ))}
              </div>
            </div>
          </section>
        )}

        {/* CTA Section */}
        <section className="py-16 px-4 text-center bg-white">
          <div className="container mx-auto max-w-4xl">
            <button
              onClick={handleCtaClick}
              className="px-8 py-4 rounded-lg text-white text-lg font-semibold transform transition-all duration-200 hover:scale-105"
              style={ctaStyle}
            >
              {ctaText}
            </button>
          </div>
        </section>
      </main>

      {/* Footer */}
      <footer 
        className="py-8 px-4 text-center text-white"
        style={headerStyle}
      >
        <div className="container mx-auto">
          <p className="opacity-90"> {new Date().getFullYear()} Tous droits réservés</p>
        </div>
      </footer>
    </div>
  );
};

LandingPageTemplate.propTypes = {
  content: PropTypes.shape({
    title: PropTypes.string.isRequired,
    description: PropTypes.string.isRequired,
    ctaText: PropTypes.string.isRequired,
    benefits: PropTypes.arrayOf(PropTypes.string)
  }).isRequired,
  colors: PropTypes.shape({
    primaryColor: PropTypes.string.isRequired,
    secondaryColor: PropTypes.string.isRequired
  }).isRequired,
  landingPageId: PropTypes.string.isRequired,
  isPreview: PropTypes.bool
};

export default LandingPageTemplate;
