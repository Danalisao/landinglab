import React from 'react';
import { motion } from 'framer-motion';
import ImageField from './ImageField';

const LandingPageContentForm = ({ content, onChange, onSave }) => {
  const handleChange = (section, field, value, index = null) => {
    const newContent = { ...content };
    
    if (index !== null) {
      newContent[section][field][index] = {
        ...newContent[section][field][index],
        ...value
      };
    } else {
      newContent[section][field] = value;
    }
    
    onChange(newContent);
  };

  if (!content) return null;

  return (
    <div className="space-y-8">
      {/* Hero Section */}
      <section className="p-6 rounded-xl bg-white/5 border border-white/10">
        <h3 className="text-xl font-semibold text-white mb-4">Section Hero</h3>
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-300">Titre</label>
            <input
              type="text"
              value={content.hero.title}
              onChange={(e) => handleChange('hero', 'title', e.target.value)}
              className="mt-1 block w-full rounded-md bg-gray-800 border-gray-700 text-white px-4 py-2"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-300">Sous-titre</label>
            <input
              type="text"
              value={content.hero.subtitle}
              onChange={(e) => handleChange('hero', 'subtitle', e.target.value)}
              className="mt-1 block w-full rounded-md bg-gray-800 border-gray-700 text-white px-4 py-2"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-300">Texte du CTA</label>
            <input
              type="text"
              value={content.hero.ctaText}
              onChange={(e) => handleChange('hero', 'ctaText', e.target.value)}
              className="mt-1 block w-full rounded-md bg-gray-800 border-gray-700 text-white px-4 py-2"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-300">URL du CTA</label>
            <input
              type="url"
              value={content.hero.ctaUrl}
              onChange={(e) => handleChange('hero', 'ctaUrl', e.target.value)}
              placeholder="https://example.com"
              className="mt-1 block w-full rounded-md bg-gray-800 border-gray-700 text-white px-4 py-2"
            />
          </div>
          <ImageField
            label="Image Hero"
            imageUrl={content.hero.imageUrl}
            imageQuery={content.hero.imageQuery}
            customImageUrl={content.hero.customImageUrl}
            onQueryChange={(value) => handleChange('hero', 'imageQuery', value)}
            onCustomUrlChange={(value) => handleChange('hero', 'customImageUrl', value)}
          />
        </div>
      </section>

      {/* Content Section */}
      <section className="p-6 rounded-xl bg-white/5 border border-white/10">
        <h3 className="text-xl font-semibold text-white mb-4">Contenu Principal</h3>
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-300">Titre Principal</label>
            <input
              type="text"
              value={content.content.mainHeadline}
              onChange={(e) => handleChange('content', 'mainHeadline', e.target.value)}
              className="mt-1 block w-full rounded-md bg-gray-800 border-gray-700 text-white px-4 py-2"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-300">Description</label>
            <textarea
              value={content.content.description}
              onChange={(e) => handleChange('content', 'description', e.target.value)}
              rows={4}
              className="mt-1 block w-full rounded-md bg-gray-800 border-gray-700 text-white px-4 py-2"
            />
          </div>
        </div>

        {/* Benefits */}
        <div className="mt-6">
          <h4 className="text-lg font-medium text-white mb-4">Avantages</h4>
          <div className="space-y-4">
            {content.content.benefits.map((benefit, index) => (
              <div key={index} className="p-4 bg-white/5 rounded-lg">
                <div className="space-y-3">
                  <div>
                    <label className="block text-sm font-medium text-gray-300">Titre</label>
                    <input
                      type="text"
                      value={benefit.title}
                      onChange={(e) => handleChange('content', 'benefits', { ...benefit, title: e.target.value }, index)}
                      className="mt-1 block w-full rounded-md bg-gray-800 border-gray-700 text-white px-4 py-2"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-300">Description</label>
                    <textarea
                      value={benefit.description}
                      onChange={(e) => handleChange('content', 'benefits', { ...benefit, description: e.target.value }, index)}
                      rows={2}
                      className="mt-1 block w-full rounded-md bg-gray-800 border-gray-700 text-white px-4 py-2"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-300">Icône</label>
                    <input
                      type="text"
                      value={benefit.icon}
                      onChange={(e) => handleChange('content', 'benefits', { ...benefit, icon: e.target.value }, index)}
                      className="mt-1 block w-full rounded-md bg-gray-800 border-gray-700 text-white px-4 py-2"
                    />
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Features */}
        <div className="mt-6">
          <h4 className="text-lg font-medium text-white mb-4">Fonctionnalités</h4>
          <div className="space-y-4">
            {content.content.features.map((feature, index) => (
              <div key={index} className="p-4 bg-white/5 rounded-lg">
                <div className="space-y-3">
                  <div>
                    <label className="block text-sm font-medium text-gray-300">Titre</label>
                    <input
                      type="text"
                      value={feature.title}
                      onChange={(e) => handleChange('content', 'features', { ...feature, title: e.target.value }, index)}
                      className="mt-1 block w-full rounded-md bg-gray-800 border-gray-700 text-white px-4 py-2"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-300">Description</label>
                    <textarea
                      value={feature.description}
                      onChange={(e) => handleChange('content', 'features', { ...feature, description: e.target.value }, index)}
                      rows={2}
                      className="mt-1 block w-full rounded-md bg-gray-800 border-gray-700 text-white px-4 py-2"
                    />
                  </div>
                  <ImageField
                    label="Image de la fonctionnalité"
                    imageUrl={feature.imageUrl}
                    imageQuery={feature.imageQuery}
                    customImageUrl={feature.customImageUrl}
                    onQueryChange={(value) => handleChange('content', 'features', { ...feature, imageQuery: value }, index)}
                    onCustomUrlChange={(value) => handleChange('content', 'features', { ...feature, customImageUrl: value }, index)}
                  />
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section className="p-6 rounded-xl bg-white/5 border border-white/10">
        <h3 className="text-xl font-semibold text-white mb-4">Témoignages</h3>
        <div className="space-y-4">
          {content.social.testimonials.map((testimonial, index) => (
            <div key={index} className="p-4 bg-white/5 rounded-lg">
              <div className="space-y-3">
                <div>
                  <label className="block text-sm font-medium text-gray-300">Citation</label>
                  <textarea
                    value={testimonial.quote}
                    onChange={(e) => handleChange('social', 'testimonials', { ...testimonial, quote: e.target.value }, index)}
                    rows={2}
                    className="mt-1 block w-full rounded-md bg-gray-800 border-gray-700 text-white px-4 py-2"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-300">Auteur</label>
                  <input
                    type="text"
                    value={testimonial.author}
                    onChange={(e) => handleChange('social', 'testimonials', { ...testimonial, author: e.target.value }, index)}
                    className="mt-1 block w-full rounded-md bg-gray-800 border-gray-700 text-white px-4 py-2"
                  />
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Closing Section */}
      <section className="p-6 rounded-xl bg-white/5 border border-white/10">
        <h3 className="text-xl font-semibold text-white mb-4">Section de Clôture</h3>
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-300">Titre</label>
            <input
              type="text"
              value={content.closing.headline}
              onChange={(e) => handleChange('closing', 'headline', e.target.value)}
              className="mt-1 block w-full rounded-md bg-gray-800 border-gray-700 text-white px-4 py-2"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-300">Texte du CTA</label>
            <input
              type="text"
              value={content.closing.ctaText}
              onChange={(e) => handleChange('closing', 'ctaText', e.target.value)}
              className="mt-1 block w-full rounded-md bg-gray-800 border-gray-700 text-white px-4 py-2"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-300">URL du CTA</label>
            <input
              type="url"
              value={content.closing.ctaUrl}
              onChange={(e) => handleChange('closing', 'ctaUrl', e.target.value)}
              placeholder="https://example.com"
              className="mt-1 block w-full rounded-md bg-gray-800 border-gray-700 text-white px-4 py-2"
            />
          </div>
          <ImageField
            label="Image de clôture"
            imageUrl={content.closing.imageUrl}
            imageQuery={content.closing.imageQuery}
            customImageUrl={content.closing.customImageUrl}
            onQueryChange={(value) => handleChange('closing', 'imageQuery', value)}
            onCustomUrlChange={(value) => handleChange('closing', 'customImageUrl', value)}
          />
        </div>
      </section>

      {/* Save Button */}
      <div className="flex justify-end">
        <motion.button
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          onClick={onSave}
          className="px-6 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
        >
          Enregistrer les modifications
        </motion.button>
      </div>
    </div>
  );
};

export default LandingPageContentForm;
