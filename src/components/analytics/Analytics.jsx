import React, { useState, useEffect } from 'react';
import analyticsService from '../../services/analytics';
import AnalyticsChart from './AnalyticsChart';
import StatsCard from './StatsCard';

const Analytics = ({ landingPageId }) => {
  const [analytics, setAnalytics] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [timeRange, setTimeRange] = useState('30d'); // '7d', '30d', '90d'

  useEffect(() => {
    loadAnalytics();
  }, [landingPageId]);

  const loadAnalytics = async () => {
    try {
      setLoading(true);
      const data = await analyticsService.getPageAnalytics(landingPageId);
      setAnalytics(data);
      setError(null);
    } catch (err) {
      setError('Erreur lors du chargement des analytics');
      console.error('Error loading analytics:', err);
    } finally {
      setLoading(false);
    }
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

  if (!analytics) {
    return null;
  }

  const {
    totalPageViews,
    totalCtaClicks,
    conversionRate,
    bounceRate,
    dailyMetrics
  } = analytics;

  return (
    <div className="space-y-6">
      {/* En-tête */}
      <div className="flex justify-between items-center">
        <h2 className="text-xl font-semibold">Statistiques de performance</h2>
        <div className="flex space-x-2">
          <button
            onClick={() => setTimeRange('7d')}
            className={`px-3 py-1 rounded-md text-sm ${
              timeRange === '7d'
                ? 'bg-blue-100 text-blue-700'
                : 'text-gray-600 hover:bg-gray-100'
            }`}
          >
            7 jours
          </button>
          <button
            onClick={() => setTimeRange('30d')}
            className={`px-3 py-1 rounded-md text-sm ${
              timeRange === '30d'
                ? 'bg-blue-100 text-blue-700'
                : 'text-gray-600 hover:bg-gray-100'
            }`}
          >
            30 jours
          </button>
          <button
            onClick={() => setTimeRange('90d')}
            className={`px-3 py-1 rounded-md text-sm ${
              timeRange === '90d'
                ? 'bg-blue-100 text-blue-700'
                : 'text-gray-600 hover:bg-gray-100'
            }`}
          >
            90 jours
          </button>
        </div>
      </div>

      {/* Cartes de statistiques */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatsCard
          title="Visites totales"
          value={totalPageViews.toLocaleString()}
          icon={(props) => (
            <svg {...props} fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
              />
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"
              />
            </svg>
          )}
        />
        <StatsCard
          title="Clics sur CTA"
          value={totalCtaClicks.toLocaleString()}
          icon={(props) => (
            <svg {...props} fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M15 15l-2 5L9 9l11 4-5 2zm0 0l5 5M7.188 2.239l.777 2.897M5.136 7.965l-2.898-.777M13.95 4.05l-2.122 2.122m-5.657 5.656l-2.12 2.122"
              />
            </svg>
          )}
        />
        <StatsCard
          title="Taux de conversion"
          value={`${conversionRate.toFixed(1)}%`}
          icon={(props) => (
            <svg {...props} fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6"
              />
            </svg>
          )}
        />
        <StatsCard
          title="Taux de rebond"
          value={`${bounceRate.toFixed(1)}%`}
          icon={(props) => (
            <svg {...props} fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M9 11l3-3m0 0l3 3m-3-3v8m0-13a9 9 0 110 18 9 9 0 010-18z"
              />
            </svg>
          )}
        />
      </div>

      {/* Graphique */}
      <div className="bg-white rounded-lg shadow-lg p-6">
        <h3 className="text-lg font-medium mb-6">Évolution des performances</h3>
        <AnalyticsChart data={dailyMetrics} />
      </div>
    </div>
  );
};

export default Analytics;
