import React from 'react';

const LandingPageContent = ({ landingPage }) => {
  if (!landingPage) {
    return null;
  }

  const { 
    generatedContent: { title, description, ctaText, benefits },
    primaryColor,
    secondaryColor
  } = landingPage;

  // Créer des styles dynamiques basés sur les couleurs choisies
  const styles = {
    header: {
      backgroundColor: primaryColor,
    },
    button: {
      backgroundColor: secondaryColor,
      color: 'white',
    },
    benefitIcon: {
      color: primaryColor,
    }
  };

  return (
    <div className="min-h-screen bg-white">
      {/* Hero Section */}
      <header 
        className="py-20 px-4 text-white text-center"
        style={styles.header}
      >
        <div className="container mx-auto max-w-4xl">
          <h1 className="text-4xl md:text-5xl font-bold mb-6">
            {title}
          </h1>
          <p className="text-lg md:text-xl mb-8 max-w-2xl mx-auto">
            {description}
          </p>
          <button
            className="px-8 py-3 rounded-full text-lg font-semibold transform transition hover:scale-105"
            style={styles.button}
          >
            {ctaText}
          </button>
        </div>
      </header>

      {/* Benefits Section */}
      <section className="py-16 px-4">
        <div className="container mx-auto max-w-4xl">
          <h2 className="text-3xl font-bold text-center mb-12">
            Principaux avantages
          </h2>
          <div className="grid md:grid-cols-3 gap-8">
            {benefits.map((benefit, index) => (
              <div 
                key={index}
                className="text-center p-6 rounded-lg shadow-lg bg-white"
              >
                <div 
                  className="w-12 h-12 mx-auto mb-4 flex items-center justify-center rounded-full"
                  style={{ backgroundColor: `${primaryColor}20` }}
                >
                  <svg
                    className="w-6 h-6"
                    style={styles.benefitIcon}
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M5 13l4 4L19 7"
                    />
                  </svg>
                </div>
                <p className="text-gray-700">{benefit}</p>
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
};

export default LandingPageContent;
