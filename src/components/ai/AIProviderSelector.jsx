import React from 'react';
import AIFactory from '../../services/aiFactory';

const AIProviderSelector = ({ value, onChange, disabled = false }) => {
  const providers = AIFactory.getAvailableProviders();

  return (
    <div className="space-y-4">
      <label className="block text-sm font-medium text-white">
        Choisissez votre assistant IA
        {disabled && (
          <span className="ml-2 text-xs text-gray-400">
            (Ce choix ne peut pas être modifié après la création)
          </span>
        )}
      </label>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {providers.map((provider) => (
          <div
            key={provider.id}
            className={`relative rounded-xl border p-4 cursor-pointer transition-all ${
              value === provider.id
                ? 'border-purple-500 bg-purple-500/10'
                : 'border-white/10 hover:border-white/20 bg-white/5'
            } ${disabled ? 'opacity-50 cursor-not-allowed' : ''}`}
            onClick={() => !disabled && onChange(provider.id)}
          >
            {value === provider.id && (
              <div className="absolute top-4 right-4">
                <svg
                  className="h-5 w-5 text-purple-500"
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
              <h3 className="text-lg font-medium text-white">
                {provider.name}
              </h3>
              <p className="text-sm text-gray-300">{provider.description}</p>
              <ul className="space-y-2">
                {provider.features.map((feature, index) => (
                  <li
                    key={index}
                    className="flex items-start text-sm text-gray-200"
                  >
                    <svg
                      className="h-5 w-5 text-purple-500 mr-2 flex-shrink-0"
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
