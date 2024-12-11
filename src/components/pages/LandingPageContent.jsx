import React from 'react';

const LandingPageContent = ({ landingPage }) => {
  if (!landingPage || !landingPage.generatedContent) {
    return null;
  }

  const iconMap = {
    'rocket': 'fa-rocket',
    'star': 'fa-star',
    'check': 'fa-check',
    'heart': 'fa-heart',
    'shield': 'fa-shield',
    'bolt': 'fa-bolt',
    'chart': 'fa-chart-line',
    'users': 'fa-users',
    'cog': 'fa-cog',
    'dollar': 'fa-dollar-sign',
    'clock': 'fa-clock',
    'trophy': 'fa-trophy',
    'target': 'fa-bullseye',
    'light': 'fa-lightbulb',
    'smile': 'fa-smile',
    'thumbs-up': 'fa-thumbs-up',
    'magic': 'fa-magic',
    'gift': 'fa-gift',
    'crown': 'fa-crown',
    'gem': 'fa-gem'
  };

  const getIconClass = (iconName) => {
    // Remove any 'fa-' prefix if it exists in the input
    const cleanIconName = iconName.replace(/^fa-/, '');
    // Return the mapped icon class or a default icon if not found
    return iconMap[cleanIconName] || 'fa-star';
  };

  const { generatedContent } = landingPage;
  const { 
    hero,
    content,
    social,
    closing,
    design
  } = generatedContent;

  return (
    <div className="min-h-screen bg-white">
      {/* Hero Section */}
      <header 
        className="relative py-20 px-4 text-white text-center overflow-hidden"
        style={{ backgroundColor: design.colors.primary }}
      >
        {(hero.customImageUrl || hero.imageUrl) && (
          <div className="absolute inset-0">
            <img 
              src={hero.customImageUrl || hero.imageUrl}
              alt="Hero background"
              className="w-full h-full object-cover opacity-50"
            />
          </div>
        )}
        <div className="container mx-auto max-w-4xl relative z-10">
          <h1 className="text-4xl md:text-5xl font-bold mb-6" style={{ fontFamily: design.fonts.heading }}>
            {hero.title}
          </h1>
          <p className="text-lg md:text-xl mb-8 max-w-2xl mx-auto" style={{ fontFamily: design.fonts.body }}>
            {hero.subtitle}
          </p>
          <button
            className="px-8 py-3 rounded-full text-lg font-semibold transform transition hover:scale-105"
            style={{ backgroundColor: design.colors.accent }}
            onClick={() => hero.ctaUrl && window.open(hero.ctaUrl, '_blank')}
          >
            {hero.ctaText}
          </button>
        </div>
      </header>

      {/* Main Content Section */}
      <section className="py-16 px-4 bg-gray-50">
        <div className="container mx-auto max-w-4xl">
          <h2 className="text-3xl font-bold text-center mb-8" style={{ fontFamily: design.fonts.heading, color: design.colors.primary }}>
            {content.mainHeadline}
          </h2>
          <p className="text-lg text-center mb-12 text-gray-600" style={{ fontFamily: design.fonts.body }}>
            {content.description}
          </p>

          {/* Benefits */}
          <div className="grid md:grid-cols-3 gap-8 mb-16">
            {content.benefits.map((benefit, index) => (
              <div 
                key={index}
                className="text-center p-6 rounded-lg shadow-lg bg-white"
              >
                <div 
                  className="w-12 h-12 mx-auto mb-4 flex items-center justify-center rounded-full"
                  style={{ backgroundColor: `${design.colors.primary}20` }}
                >
                  <i className={`fa-solid ${getIconClass(benefit.icon)} text-xl`} style={{ color: design.colors.primary }} />
                </div>
                <h3 className="text-xl font-semibold mb-2" style={{ fontFamily: design.fonts.heading, color: design.colors.primary }}>
                  {benefit.title}
                </h3>
                <p className="text-gray-600" style={{ fontFamily: design.fonts.body }}>
                  {benefit.description}
                </p>
              </div>
            ))}
          </div>

          {/* Features */}
          <div className="space-y-12">
            {content.features.map((feature, index) => (
              <div key={index} className={`flex flex-col ${index % 2 === 0 ? 'md:flex-row' : 'md:flex-row-reverse'} items-center gap-8`}>
                <div className="w-full md:w-1/2">
                  {(feature.customImageUrl || feature.imageUrl) ? (
                    <img 
                      src={feature.customImageUrl || feature.imageUrl}
                      alt={feature.title}
                      className="w-full h-full object-cover rounded-lg"
                    />
                  ) : (
                    <div className="aspect-video bg-gray-200 rounded-lg" />
                  )}
                </div>
                <div className="w-full md:w-1/2">
                  <h3 className="text-2xl font-semibold mb-4" style={{ fontFamily: design.fonts.heading, color: design.colors.primary }}>
                    {feature.title}
                  </h3>
                  <p className="text-gray-600" style={{ fontFamily: design.fonts.body }}>
                    {feature.description}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Testimonials Section */}
      <section className="py-16 px-4">
        <div className="container mx-auto max-w-4xl">
          <div className="grid md:grid-cols-2 gap-8">
            {social.testimonials.map((testimonial, index) => (
              <div key={index} className="p-6 rounded-lg shadow-lg bg-white">
                <p className="text-lg mb-4 text-gray-600 italic" style={{ fontFamily: design.fonts.body }}>
                  "{testimonial.quote}"
                </p>
                <p className="font-semibold" style={{ fontFamily: design.fonts.heading, color: design.colors.primary }}>
                  {testimonial.author}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Closing Section */}
      <section className="relative py-16 px-4 text-white text-center">
        {(closing.customImageUrl || closing.imageUrl) && (
          <div className="absolute inset-0">
            <img 
              src={closing.customImageUrl || closing.imageUrl}
              alt="Closing background"
              className="w-full h-full object-cover"
            />
            <div className="absolute inset-0 bg-black opacity-50"></div>
          </div>
        )}
        <div className="container mx-auto max-w-4xl relative z-10">
          <h2 className="text-3xl font-bold mb-8" style={{ fontFamily: design.fonts.heading }}>
            {closing.headline}
          </h2>
          <button
            className="px-8 py-3 rounded-full text-lg font-semibold transform transition hover:scale-105"
            style={{ backgroundColor: design.colors.accent }}
            onClick={() => closing.ctaUrl && window.open(closing.ctaUrl, '_blank')}
          >
            {closing.ctaText}
          </button>
        </div>
      </section>
    </div>
  );
};

export default LandingPageContent;
