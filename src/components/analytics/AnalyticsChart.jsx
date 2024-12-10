import React from 'react';
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer
} from 'recharts';
import { format, parseISO } from 'date-fns';
import { fr } from 'date-fns/locale';

const AnalyticsChart = ({ data, metrics = ['pageViews', 'ctaClicks'] }) => {
  // Transformer les données pour Recharts
  const chartData = Object.entries(data).map(([date, values]) => ({
    date: parseISO(date),
    ...values
  }));

  // Configurer les couleurs pour chaque métrique
  const metricColors = {
    pageViews: '#3B82F6',
    ctaClicks: '#10B981'
  };

  // Configurer les noms d'affichage pour chaque métrique
  const metricNames = {
    pageViews: 'Visites',
    ctaClicks: 'Clics CTA'
  };

  return (
    <div className="w-full h-[400px]">
      <ResponsiveContainer width="100%" height="100%">
        <LineChart
          data={chartData}
          margin={{
            top: 5,
            right: 30,
            left: 20,
            bottom: 5
          }}
        >
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis
            dataKey="date"
            tickFormatter={(date) => format(date, 'dd MMM', { locale: fr })}
            tick={{ fontSize: 12 }}
          />
          <YAxis tick={{ fontSize: 12 }} />
          <Tooltip
            labelFormatter={(date) =>
              format(date, 'dd MMMM yyyy', { locale: fr })
            }
            contentStyle={{
              backgroundColor: 'white',
              border: '1px solid #e5e7eb',
              borderRadius: '0.375rem',
              padding: '0.5rem'
            }}
          />
          <Legend />
          {metrics.map((metric) => (
            <Line
              key={metric}
              type="monotone"
              dataKey={metric}
              stroke={metricColors[metric]}
              name={metricNames[metric]}
              strokeWidth={2}
              dot={false}
              activeDot={{ r: 6 }}
            />
          ))}
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
};

export default AnalyticsChart;
