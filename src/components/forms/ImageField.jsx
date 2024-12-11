import React from 'react';

const ImageField = ({ label, imageUrl, imageQuery, customImageUrl, onQueryChange, onCustomUrlChange }) => {
  return (
    <div className="space-y-3">
      <label className="block text-sm font-medium text-gray-300">{label}</label>
      
      {/* Image Preview */}
      {(customImageUrl || imageUrl) && (
        <div className="relative w-full h-48 mb-3">
          <img
            src={customImageUrl || imageUrl}
            alt={imageQuery}
            className="w-full h-full object-cover rounded-lg"
          />
        </div>
      )}
      
      {/* Custom Image URL Input */}
      <div>
        <label className="block text-sm font-medium text-gray-300">URL personnalisée de l'image</label>
        <input
          type="url"
          value={customImageUrl || ''}
          onChange={(e) => onCustomUrlChange(e.target.value)}
          className="mt-1 block w-full rounded-md bg-gray-800 border-gray-700 text-white px-4 py-2"
          placeholder="https://exemple.com/mon-image.jpg"
        />
        <p className="mt-1 text-sm text-gray-400">
          Laissez vide pour utiliser une image d'Unsplash
        </p>
      </div>
      
      {/* Image Query Input (for Unsplash) */}
      <div className={customImageUrl ? 'opacity-50' : ''}>
        <label className="block text-sm font-medium text-gray-300">
          Description pour Unsplash (en anglais)
          {customImageUrl && ' - Désactivé car une URL personnalisée est définie'}
        </label>
        <textarea
          value={imageQuery || ''}
          onChange={(e) => onQueryChange(e.target.value)}
          rows={2}
          disabled={!!customImageUrl}
          className="mt-1 block w-full rounded-md bg-gray-800 border-gray-700 text-white px-4 py-2 disabled:opacity-50"
          placeholder={customImageUrl ? 'URL personnalisée utilisée' : 'Décrivez l\'image souhaitée en anglais...'}
        />
      </div>
    </div>
  );
};

export default ImageField;
