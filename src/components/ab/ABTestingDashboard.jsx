import React, { useState, useEffect } from 'react';
import abTestingService from '../../services/abTesting';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer
} from 'recharts';

const ABTestingDashboard = ({ landingPageId }) => {
  const [test, setTest] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    loadTestData();
  }, [landingPageId]);

  const loadTestData = async () => {
    try {
      setLoading(true);
      const activeTest = await abTestingService.getActiveTest(landingPageId);
      if (activeTest) {
        const results = await abTestingService.getTestResults(activeTest.id);
        setTest(results);
      }
      setError(null);
    } catch (err) {
      setError("Erreur lors du chargement des données de test A/B");
      console.error('Error loading A/B test data:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleDetermineWinner = async () => {
    if (!test) return;

    try {
      const winner = await abTestingService.determineWinner(test.id);
      if (winner) {
        await loadTestData();
      } else {
        setError("Pas assez de données pour déterminer un gagnant");
      }
    } catch (err) {
      setError("Erreur lors de la détermination du gagnant");
      console.error('Error determining winner:', err);
    }
  };

  const formatVariantName = (variant) => {
    return `Variante ${variant.id.split('_')[1]}`;
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center py-12">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-red-50 border border-red-200 rounded-md p-4 text-red-600">
        {error}
      </div>
    );
  }

  if (!test) {
    return (
      <div className="bg-gray-50 border border-gray-200 rounded-md p-6 text-center">
        <p className="text-gray-600 mb-4">Aucun test A/B actif pour cette page</p>
        <button
          className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
          onClick={() => {/* Logique pour créer un nouveau test */}}
        >
          Créer un test A/B
        </button>
      </div>
    );
  }

  const chartData = test.variants.map(variant => ({
    name: formatVariantName(variant),
    'Taux de conversion': variant.conversionRate.toFixed(2),
    Impressions: variant.impressions,
    Conversions: variant.conversions,
  }));

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-xl font-semibold">Test A/B</h2>
        <div className="flex space-x-4">
          <span className="text-sm text-gray-600">
            Statut: {test.status === 'active' ? (
              <span className="text-green-600 font-medium">Actif</span>
            ) : (
              <span className="text-gray-600 font-medium">Terminé</span>
            )}
          </span>
          {test.status === 'active' && (
            <button
              onClick={handleDetermineWinner}
              className="px-4 py-2 bg-blue-600 text-white text-sm rounded-md hover:bg-blue-700 transition-colors"
            >
              Déterminer le gagnant
            </button>
          )}
        </div>
      </div>

      {/* Graphique des résultats */}
      <div className="bg-white rounded-lg shadow-lg p-6">
        <h3 className="text-lg font-medium mb-6">Comparaison des performances</h3>
        <div className="h-80">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={chartData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="name" />
              <YAxis yAxisId="left" />
              <YAxis yAxisId="right" orientation="right" />
              <Tooltip />
              <Legend />
              <Bar
                yAxisId="left"
                dataKey="Taux de conversion"
                fill="#3B82F6"
                name="Taux de conversion (%)"
              />
              <Bar
                yAxisId="right"
                dataKey="Conversions"
                fill="#10B981"
                name="Conversions"
              />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Détails des variantes */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {test.variants.map(variant => (
          <div
            key={variant.id}
            className={`bg-white rounded-lg shadow-lg p-6 ${
              test.winningVariantId === variant.id
                ? 'ring-2 ring-blue-500'
                : ''
            }`}
          >
            <div className="flex justify-between items-start mb-4">
              <h4 className="text-lg font-medium">
                {formatVariantName(variant)}
                {test.winningVariantId === variant.id && (
                  <span className="ml-2 text-blue-600 text-sm">
                    (Gagnant)
                  </span>
                )}
              </h4>
            </div>
            <div className="space-y-2">
              <div className="flex justify-between">
                <span className="text-gray-600">Impressions:</span>
                <span className="font-medium">{variant.impressions}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Conversions:</span>
                <span className="font-medium">{variant.conversions}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Taux de conversion:</span>
                <span className="font-medium">
                  {variant.conversionRate.toFixed(2)}%
                </span>
              </div>
            </div>
            <div className="mt-4">
              <h5 className="text-sm font-medium text-gray-600 mb-2">
                Contenu
              </h5>
              <div className="text-sm bg-gray-50 p-3 rounded-md">
                <p><strong>Titre:</strong> {variant.content.title}</p>
                <p><strong>Description:</strong> {variant.content.description}</p>
                <p><strong>CTA:</strong> {variant.content.ctaText}</p>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default ABTestingDashboard;
