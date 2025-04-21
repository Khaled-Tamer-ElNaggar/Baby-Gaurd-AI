import React from 'react';
import { Moon, Droplets, FootprintsIcon } from 'lucide-react';
import { useData } from '../contexts/DataContext';

const HealthOverview = () => {
  const { healthMetrics } = useData();

  const getLatestMetric = (type: 'sleep' | 'water' | 'steps') => {
    return healthMetrics
      .filter(metric => metric.type === type)
      .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())[0];
  };

  const sleepMetric = getLatestMetric('sleep');
  const waterMetric = getLatestMetric('water');
  const stepsMetric = getLatestMetric('steps');

  return (
    <div className="bg-white dark:bg-gray-800 rounded-xl p-4 shadow-sm">
      <h2 className="text-lg font-medium text-violet-900 dark:text-violet-200 mb-3">Health Overview</h2>
      <div className="grid grid-cols-3 gap-3">
        <MetricCard 
          icon={<Moon />} 
          label="Sleep" 
          value={sleepMetric ? `${sleepMetric.value}h` : '0h'} 
        />
        <MetricCard 
          icon={<Droplets />} 
          label="Water" 
          value={waterMetric ? `${waterMetric.value}L` : '0L'} 
        />
        <MetricCard 
          icon={<FootprintsIcon />} 
          label="Steps" 
          value={stepsMetric ? `${stepsMetric.value}k` : '0k'} 
        />
      </div>
    </div>
  );
};

const MetricCard = ({ icon, label, value }) => (
  <div className="bg-violet-50 dark:bg-gray-700 p-3 rounded-xl flex flex-col items-center">
    <div className="text-violet-600 dark:text-violet-400 mb-1">{icon}</div>
    <span className="text-lg font-semibold text-violet-900 dark:text-violet-200">{value}</span>
    <span className="text-sm text-gray-600 dark:text-gray-400">{label}</span>
  </div>
);

export default HealthOverview;