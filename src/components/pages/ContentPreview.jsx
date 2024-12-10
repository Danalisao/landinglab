import React from 'react';

const ContentPreview = ({ content, colors }) => {
  if (!content) return null;

  const { title, description, ctaText, benefits } = content;
  const { primaryColor, secondaryColor } = colors;

  return (
    <div className="mt-8 p-6 border rounded-lg">
      <h2 className="text-2xl font-bold mb-6">Prévisualisation</h2>
      
      <div 
        className="p-8 rounded-lg"
        style={{ 
          backgroundColor: primaryColor + '10',
          border: `1px solid ${primaryColor}`
        }}
      >
        <h3 
          className="text-3xl font-bold mb-6"
          style={{ color: primaryColor }}
        >
          {title}
        </h3>
        
        <p className="text-gray-700 mb-6 leading-relaxed">
          {description}
        </p>
        
        {benefits && benefits.length > 0 && (
          <div className="mb-8">
            <h4 className="text-xl font-semibold mb-4">Principaux avantages :</h4>
            <ul className="space-y-2">
              {benefits.map((benefit, index) => (
                <li 
                  key={index}
                  className="flex items-start space-x-2"
                >
                  <span 
                    className="text-lg"
                    style={{ color: secondaryColor }}
                  >
                    •
                  </span>
                  <span>{benefit}</span>
                </li>
              ))}
            </ul>
          </div>
        )}
        
        <button
          className="px-8 py-3 rounded-lg text-white font-semibold transition-all duration-200 transform hover:scale-105"
          style={{ 
            backgroundColor: secondaryColor,
            boxShadow: `0 4px 14px ${secondaryColor}50`
          }}
        >
          {ctaText}
        </button>
      </div>
    </div>
  );
};

export default ContentPreview;
