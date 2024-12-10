import React, { useState } from 'react';
import deploymentService from '../../services/deployment';

const DomainManager = ({ landingPage }) => {
  const [customDomain, setCustomDomain] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setError(null);

    try {
      await deploymentService.addCustomDomain(landingPage.id, customDomain);
      setCustomDomain('');
    } catch (err) {
      setError(err.message);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="bg-white rounded-lg shadow-lg p-6">
      <h2 className="text-xl font-semibold mb-4">Gestion du domaine</h2>
      
      {/* Afficher le sous-domaine actuel */}
      <div className="mb-6">
        <h3 className="text-sm font-medium text-gray-700 mb-2">URL actuelle</h3>
        <div className="flex items-center space-x-2">
          <a
            href={landingPage.deployment?.url}
            target="_blank"
            rel="noopener noreferrer"
            className="text-blue-500 hover:text-blue-600"
          >
            {landingPage.deployment?.url}
          </a>
          <button
            onClick={() => navigator.clipboard.writeText(landingPage.deployment?.url)}
            className="text-gray-400 hover:text-gray-600"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 5H6a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2v-1M8 5a2 2 0 002 2h2a2 2 0 002-2M8 5a2 2 0 012-2h2a2 2 0 012 2m0 0h2a2 2 0 012 2v3m2 4H10m0 0l3-3m-3 3l3 3" />
            </svg>
          </button>
        </div>
      </div>

      {/* Afficher le domaine personnalisé s'il existe */}
      {landingPage.customDomain && (
        <div className="mb-6">
          <h3 className="text-sm font-medium text-gray-700 mb-2">Domaine personnalisé</h3>
          <div className="flex items-center space-x-2">
            <span className="text-gray-900">{landingPage.customDomain}</span>
            <span className={`px-2 py-1 text-xs rounded ${
              landingPage.customDomainStatus === 'active'
                ? 'bg-green-100 text-green-800'
                : 'bg-yellow-100 text-yellow-800'
            }`}>
              {landingPage.customDomainStatus === 'active' ? 'Actif' : 'En attente'}
            </span>
          </div>
        </div>
      )}

      {/* Formulaire d'ajout de domaine personnalisé */}
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label htmlFor="customDomain" className="block text-sm font-medium text-gray-700">
            Ajouter un domaine personnalisé
          </label>
          <div className="mt-1">
            <input
              type="text"
              id="customDomain"
              value={customDomain}
              onChange={(e) => setCustomDomain(e.target.value)}
              placeholder="exemple.com"
              className="shadow-sm focus:ring-blue-500 focus:border-blue-500 block w-full sm:text-sm border-gray-300 rounded-md"
            />
          </div>
          {error && (
            <p className="mt-2 text-sm text-red-600">
              {error}
            </p>
          )}
        </div>

        <button
          type="submit"
          disabled={isLoading || !customDomain}
          className={`w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white ${
            isLoading || !customDomain
              ? 'bg-gray-400 cursor-not-allowed'
              : 'bg-blue-600 hover:bg-blue-700'
          }`}
        >
          {isLoading ? 'Configuration...' : 'Ajouter le domaine'}
        </button>
      </form>

      {/* Instructions de configuration DNS */}
      {landingPage.customDomain && landingPage.customDomainStatus === 'pending' && (
        <div className="mt-6 p-4 bg-yellow-50 rounded-md">
          <h4 className="text-sm font-medium text-yellow-800 mb-2">Configuration DNS requise</h4>
          <p className="text-sm text-yellow-700">
            Pour activer votre domaine personnalisé, ajoutez ces enregistrements DNS :
          </p>
          <ul className="mt-2 text-sm text-yellow-700 list-disc list-inside">
            <li>Type: CNAME</li>
            <li>Nom: @</li>
            <li>Valeur: cname.vercel-dns.com</li>
          </ul>
        </div>
      )}
    </div>
  );
};

export default DomainManager;
