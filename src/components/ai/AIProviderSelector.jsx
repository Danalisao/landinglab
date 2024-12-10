import React from 'react';
import AIFactory from '../../services/aiFactory';

const AIProviderSelector = ({ value, onChange, disabled = false }) => {
  const providers = AIFactory.getAvailableProviders();

  return (
    <div className="space-y-4">
      <label className="block text-sm font-medium text-gray-700">
        Choisissez votre assistant IA
        {disabled && (
          <span className="ml-2 text-xs text-gray-500">
            (Ce choix ne peut pas être modifié après la création)
          </span>
        )}
      </label>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {providers.map((provider) => (
          <div
            key={provider.id}
            className={`relative rounded-lg border p-4 cursor-pointer transition-all ${
              value === provider.id
                ? 'border-blue-500 bg-blue-50'
                : 'border-gray-200 hover:border-gray-300'
            } ${disabled ? 'opacity-50 cursor-not-allowed' : ''}`}
            onClick={() => !disabled && onChange(provider.id)}
          >
            {value === provider.id && (
              <div className="absolute top-4 right-4">
                <svg
                  className="h-5 w-5 text-blue-500"
                  fill="currentColor"
                  viewBox="0 0 20 20"
                >
                  <path
                    fillRule="evenodd"
                    d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                    clipRule="evenodd"
                  />
                </svg>
              </div>
            )}

            <div className="space-y-3">
              <h3 className="text-lg font-medium text-gray-900">
                {provider.name}
              </h3>
              <p className="text-sm text-gray-500">{provider.description}</p>
              <ul className="space-y-2">
                {provider.features.map((feature, index) => (
                  <li
                    key={index}
                    className="flex items-start text-sm text-gray-600"
                  >
                    <svg
                      className="h-5 w-5 text-green-500 mr-2 flex-shrink-0"
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
                    {feature}
                  </li>
                ))}
              </ul>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default AIProviderSelector;
