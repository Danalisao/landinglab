import React, { useState } from 'react';
import abTestingService from '../../services/abTesting';

const CreateABTest = ({ landingPageId, originalContent, onTestCreated }) => {
  const [variantContent, setVariantContent] = useState({
    title: originalContent.title,
    description: originalContent.description,
    ctaText: originalContent.ctaText,
    benefits: [...originalContent.benefits]
  });

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      const variants = [
        originalContent, // Variante A (originale)
        variantContent  // Variante B
      ];

      const testId = await abTestingService.createTest(landingPageId, variants);
      onTestCreated(testId);
    } catch (err) {
      setError("Erreur lors de la création du test A/B");
      console.error('Error creating A/B test:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleBenefitChange = (index, value) => {
    const newBenefits = [...variantContent.benefits];
    newBenefits[index] = value;
    setVariantContent(prev => ({
      ...prev,
      benefits: newBenefits
    }));
  };

  return (
    <div className="bg-white rounded-lg shadow-lg p-6">
      <h2 className="text-xl font-semibold mb-6">Créer un test A/B</h2>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
        {/* Variante A (originale) */}
        <div className="bg-gray-50 p-4 rounded-lg">
          <h3 className="text-lg font-medium mb-4">Variante A (originale)</h3>
          <div className="space-y-3">
            <p><strong>Titre:</strong> {originalContent.title}</p>
            <p><strong>Description:</strong> {originalContent.description}</p>
            <p><strong>CTA:</strong> {originalContent.ctaText}</p>
            <div>
              <strong>Avantages:</strong>
              <ul className="list-disc list-inside mt-2">
                {originalContent.benefits.map((benefit, index) => (
                  <li key={index} className="text-gray-700">{benefit}</li>
                ))}
              </ul>
            </div>
          </div>
        </div>

        {/* Variante B (nouvelle) */}
        <form onSubmit={handleSubmit} className="space-y-4">
          <h3 className="text-lg font-medium mb-4">Variante B</h3>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Titre
            </label>
            <input
              type="text"
              value={variantContent.title}
              onChange={(e) => setVariantContent(prev => ({
                ...prev,
                title: e.target.value
              }))}
              className="w-full px-3 py-2 border border-gray-300 rounded-md"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Description
            </label>
            <textarea
              value={variantContent.description}
              onChange={(e) => setVariantContent(prev => ({
                ...prev,
                description: e.target.value
              }))}
              className="w-full px-3 py-2 border border-gray-300 rounded-md"
              rows={3}
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Texte du CTA
            </label>
            <input
              type="text"
              value={variantContent.ctaText}
              onChange={(e) => setVariantContent(prev => ({
                ...prev,
                ctaText: e.target.value
              }))}
              className="w-full px-3 py-2 border border-gray-300 rounded-md"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Avantages
            </label>
            {variantContent.benefits.map((benefit, index) => (
              <div key={index} className="mb-2">
                <input
                  type="text"
                  value={benefit}
                  onChange={(e) => handleBenefitChange(index, e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md"
                  placeholder={`Avantage ${index + 1}`}
                  required
                />
              </div>
            ))}
          </div>

          {error && (
            <div className="text-red-600 text-sm">
              {error}
            </div>
          )}

          <div className="flex justify-end">
            <button
              type="submit"
              disabled={loading}
              className={`px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors ${
                loading ? 'opacity-50 cursor-not-allowed' : ''
              }`}
            >
              {loading ? 'Création...' : 'Lancer le test A/B'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default CreateABTest;
