import React from 'react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { format, subMonths, startOfMonth } from 'date-fns';
import { useData } from '../../../contexts/DataContext';

const BabyGrowthCharts = () => {
  const { healthMetrics } = useData();

  // Process health metrics into quarterly data points
  const processMetrics = (type: 'height' | 'weight' | 'size') => {
    const metrics = healthMetrics
      .filter(metric => metric.type === type)
      .sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());

    if (metrics.length === 0) return [];

    // Get the last 4 quarters (12 months)
    const lastYear = Array.from({ length: 5 }, (_, i) => {
      const date = startOfMonth(subMonths(new Date(), i * 3));
      const metric = metrics.find(m => 
        new Date(m.date).getMonth() === date.getMonth() &&
        new Date(m.date).getFullYear() === date.getFullYear()
      );

      return {
        date: date.toISOString(),
        [type]: metric?.value || null
      };
    }).reverse();

    return lastYear;
  };

  const heightData = processMetrics('height');
  const weightData = processMetrics('weight');
  const headSizeData = processMetrics('size');

  const renderChart = (data, title: string, dataKey: string, color: string, unit: string) => (
    <div className="bg-white dark:bg-gray-800 rounded-xl p-4 shadow-sm mb-6">
      <h3 className="text-lg font-medium text-violet-900 dark:text-violet-200 mb-4">{title}</h3>
      <div className="h-[250px]">
        <ResponsiveContainer width="100%" height="100%">
          <LineChart data={data} margin={{ top: 5, right: 20, bottom: 5, left: 0 }}>
            <CartesianGrid strokeDasharray="3 3" stroke="#374151" opacity={0.1} />
            <XAxis 
              dataKey="date" 
              tickFormatter={(date) => format(new Date(date), 'MMM yyyy')}
              stroke="#9CA3AF"
              fontSize={12}
            />
            <YAxis 
              stroke="#9CA3AF"
              fontSize={12}
              tickFormatter={(value) => `${value}${unit}`}
            />
            <Tooltip
              contentStyle={{
                backgroundColor: '#1F2937',
                border: 'none',
                borderRadius: '0.5rem',
                padding: '8px 12px',
                boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)',
              }}
              labelFormatter={(date) => format(new Date(date), 'MMMM yyyy')}
              formatter={(value) => [`${value}${unit}`, title]}
            />
            <Line 
              type="monotone" 
              dataKey={dataKey} 
              stroke={color}
              strokeWidth={3}
              dot={{ fill: color, strokeWidth: 2 }}
              activeDot={{ r: 6 }}
              connectNulls
            />
          </LineChart>
        </ResponsiveContainer>
      </div>
    </div>
  );

  return (
    <div className="space-y-6">
      {renderChart(headSizeData, 'Head Size', 'size', '#8B5CF6', 'cm')}
      {renderChart(weightData, 'Weight', 'weight', '#EC4899', 'kg')}
      {renderChart(heightData, 'Height', 'height', '#10B981', 'cm')}
    </div>
  );
};

export default BabyGrowthCharts;