import React from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { format, subDays } from 'date-fns';
import { useData } from '../../../contexts/DataContext';

const SleepTracker = () => {
  const { healthMetrics } = useData();

  // Get sleep metrics for the last 7 days
  const sleepData = Array.from({ length: 7 }, (_, i) => {
    const date = subDays(new Date(), 6 - i);
    const metric = healthMetrics.find(m => 
      m.type === 'sleep' && 
      new Date(m.date).toDateString() === date.toDateString()
    );

    return {
      date: date.toISOString(),
      hours: metric?.value || 0
    };
  });

  const averageSleep = sleepData.reduce((acc, curr) => acc + curr.hours, 0) / sleepData.length;
  const lastNightSleep = sleepData[sleepData.length - 1].hours;

  return (
    <div className="bg-white dark:bg-gray-800 rounded-xl p-4 shadow-sm">
      <h2 className="text-lg font-medium text-violet-900 dark:text-violet-200 mb-6">
        Sleep Tracking
      </h2>

      <div className="h-[300px]">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={sleepData}>
            <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
            <XAxis 
              dataKey="date" 
              tickFormatter={(date) => format(new Date(date), 'EEE')}
              stroke="#9CA3AF"
            />
            <YAxis 
              stroke="#9CA3AF"
              label={{ 
                value: 'Hours', 
                angle: -90, 
                position: 'insideLeft',
                style: { fill: '#9CA3AF' }
              }} 
            />
            <Tooltip
              contentStyle={{
                backgroundColor: '#1F2937',
                border: 'none',
                borderRadius: '0.5rem',
                color: '#F3F4F6'
              }}
              labelFormatter={(date) => format(new Date(date), 'MMM d, yyyy')}
            />
            <Bar 
              dataKey="hours" 
              fill="#8B5CF6"
              radius={[4, 4, 0, 0]}
            />
          </BarChart>
        </ResponsiveContainer>
      </div>

      <div className="mt-6 grid grid-cols-2 gap-4">
        <div className="bg-violet-50 dark:bg-gray-700 p-4 rounded-xl">
          <p className="text-sm text-gray-600 dark:text-gray-400">Average Sleep</p>
          <p className="text-2xl font-semibold text-violet-900 dark:text-violet-200">
            {averageSleep.toFixed(1)}h
          </p>
        </div>
        <div className="bg-violet-50 dark:bg-gray-700 p-4 rounded-xl">
          <p className="text-sm text-gray-600 dark:text-gray-400">Last Night</p>
          <p className="text-2xl font-semibold text-violet-900 dark:text-violet-200">
            {lastNightSleep}h
          </p>
        </div>
      </div>
    </div>
  );
};

export default SleepTracker;