import React from 'react';

const StatsCard = ({ title, value, description, trend, icon: Icon }) => {
  const getTrendColor = (trend) => {
    if (!trend) return 'text-gray-500';
    return trend > 0 ? 'text-green-500' : 'text-red-500';
  };

  const getTrendIcon = (trend) => {
    if (!trend) return null;
    return trend > 0 ? (
      <svg
        className="w-4 h-4"
        fill="none"
        stroke="currentColor"
        viewBox="0 0 24 24"
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth={2}
          d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6"
        />
      </svg>
    ) : (
      <svg
        className="w-4 h-4"
        fill="none"
        stroke="currentColor"
        viewBox="0 0 24 24"
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth={2}
          d="M13 17h8m0 0v-8m0 8l-8-8-4 4-6-6"
        />
      </svg>
    );
  };

  return (
    <div className="bg-white rounded-lg shadow-lg p-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center">
          {Icon && (
            <div className="mr-4 p-3 bg-blue-100 rounded-full">
              <Icon className="w-6 h-6 text-blue-600" />
            </div>
          )}
          <div>
            <p className="text-sm font-medium text-gray-600">{title}</p>
            <p className="mt-1 text-xl font-semibold text-gray-900">{value}</p>
          </div>
        </div>
        {trend !== undefined && (
          <div className={`flex items-center ${getTrendColor(trend)}`}>
            {getTrendIcon(trend)}
            <span className="ml-1 text-sm font-medium">
              {Math.abs(trend)}%
            </span>
          </div>
        )}
      </div>
      {description && (
        <p className="mt-3 text-sm text-gray-500">{description}</p>
      )}
    </div>
  );
};

export default StatsCard;
