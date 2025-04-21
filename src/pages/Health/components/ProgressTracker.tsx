import React from 'react';
import { useData } from '../../../contexts/DataContext';
import confetti from 'canvas-confetti';

const ProgressTracker = () => {
  const { healthMetrics } = useData();
  
  // Calculate completion percentage based on today's metrics
  const calculateCompletion = () => {
    const today = new Date().toISOString().split('T')[0];
    const todayMetrics = healthMetrics.filter(metric => 
      metric.date.startsWith(today)
    );

    const hasWater = todayMetrics.some(m => m.type === 'water' && m.value >= 2);
    const hasSleep = todayMetrics.some(m => m.type === 'sleep' && m.value >= 7);
    const hasSteps = todayMetrics.some(m => m.type === 'steps' && m.value >= 5000);

    const completed = [hasWater, hasSleep, hasSteps].filter(Boolean).length;
    return (completed / 3) * 100;
  };

  const completion = calculateCompletion();
  const strokeDashoffset = 283 - (283 * completion) / 100;

  // Trigger confetti when completion reaches 100%
  React.useEffect(() => {
    if (completion === 100) {
      confetti({
        particleCount: 100,
        spread: 70,
        origin: { y: 0.6 }
      });
    }
  }, [completion]);

  return (
    <div className="bg-white dark:bg-gray-900 rounded-xl p-4 shadow-sm min-h-[600px] flex flex-col justify-between">
      <h2 className="text-lg font-medium text-violet-900 dark:text-violet-200 mb-3">Daily Progress</h2>
      <div className="relative w-48 h-46 mx-auto">
        <svg className="w-full h-full transform -rotate-90" viewBox="0 0 100 100">
          <circle
            cx="50"
            cy="50"
            r="45"
            fill="none"
            stroke="currentColor"
            strokeWidth="10"
            className="text-violet-100 dark:text-gray-700"
          />
          <circle
            cx="50"
            cy="50"
            r="45"
            fill="none"
            stroke="currentColor"
            strokeWidth="10"
            strokeDasharray="283"
            strokeDashoffset={strokeDashoffset}
            className="text-violet-600 dark:text-violet-400 transition-all duration-1000 ease-out"
          />
        </svg>
        <div className="absolute inset-0 flex items-center justify-center flex-col">
          <span className="text-2xl font-bold text-violet-900 dark:text-violet-200">
            {Math.round(completion)}%
          </span>
          <span className="text-sm text-gray-600 dark:text-gray-400">Daily Goals</span>
        </div>
      </div>
      <div className="mt-4 space-y-2">
        <GoalItem
          label="Water Intake"
          target="2L"
          completed={healthMetrics.some(m => 
            m.type === 'water' && 
            m.date.startsWith(new Date().toISOString().split('T')[0]) && 
            m.value >= 2
          )}
        />
        <GoalItem
          label="Sleep"
          target="7-9 hours"
          completed={healthMetrics.some(m => 
            m.type === 'sleep' && 
            m.date.startsWith(new Date().toISOString().split('T')[0]) && 
            m.value >= 7
          )}
        />
        <GoalItem
          label="Daily Steps"
          target="5,000 steps"
          completed={healthMetrics.some(m => 
            m.type === 'steps' && 
            m.date.startsWith(new Date().toISOString().split('T')[0]) && 
            m.value >= 5000
          )}
        />
      </div>
    </div>
  );
};

const GoalItem = ({ label, target, completed }) => (
  <div className="flex items-center justify-between px-4 py-2 bg-violet-50 dark:bg-gray-700 rounded-lg">
    <div>
      <p className="text-sm font-medium text-violet-900 dark:text-violet-200">{label}</p>
      <p className="text-xs text-gray-600 dark:text-gray-400">Target: {target}</p>
    </div>
    <div className={`w-6 h-6 rounded-full flex items-center justify-center ${
      completed 
        ? 'bg-violet-600 dark:bg-violet-500' 
        : 'bg-violet-100 dark:bg-gray-600'
    }`}>
      {completed && (
        <svg className="w-4 h-4 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
        </svg>
      )}
    </div>
  </div>
);

export default ProgressTracker;