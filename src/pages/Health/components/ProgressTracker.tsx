import React, { useState, useEffect } from 'react';
import confetti from 'canvas-confetti';

const ProgressTracker = () => {
  const [metrics, setMetrics] = useState({
    water_intake: 0.0,
    sleep_hours: 0.0,
    steps: 0,
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Fetch today's tracker data on component mount
  useEffect(() => {
    const fetchTodayTracker = async () => {
      try {
        const token = localStorage.getItem('token');
        if (!token) {
          throw new Error('No authentication token found');
        }

        const response = await fetch('http://localhost:5000/api/trackers/today', {
          method: 'GET',
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json',
          },
        });

        if (!response.ok) {
          throw new Error('Failed to fetch tracker data');
        }

        const data = await response.json();
        setMetrics({
          water_intake: data.water_intake || 0.0,
          sleep_hours: data.sleep_hours || 0.0,
          steps: data.steps || 0,
        });
        setLoading(false);
      } catch (err: any) {
        setError(err.message);
        setLoading(false);
      }
    };

    fetchTodayTracker();
  }, []);

  // Update all metrics in the backend
  const updateMetrics = async (updatedMetrics: { water_intake: number; sleep_hours: number; steps: number }) => {
    try {
      const token = localStorage.getItem('token');
      if (!token) {
        throw new Error('No authentication token found');
      }

      console.log('Sending metrics update:', updatedMetrics);

      const response = await fetch('http://localhost:5000/api/trackers/all', {
        method: 'PATCH',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(updatedMetrics),
      });

      if (!response.ok) {
        throw new Error(`Failed to update metrics: ${response.statusText}`);
      }

      console.log('Successfully updated metrics');

      setMetrics(updatedMetrics);
      setError(null);
    } catch (err: any) {
      console.error('Error updating metrics:', err);
      setError(err.message);
    }
  };

  // Handle input change for a specific metric
  const handleMetricChange = (type: 'water' | 'sleep' | 'steps', value: number) => {
    const newMetrics = {
      water_intake: type === 'water' ? value : metrics.water_intake || 0,
      sleep_hours: type === 'sleep' ? value : metrics.sleep_hours || 0,
      steps: type === 'steps' ? value : metrics.steps || 0,
    };
    setMetrics(newMetrics);
    updateMetrics(newMetrics);
  };

  // Calculate completion percentage based on metrics
  const calculateCompletion = () => {
    const hasWater = metrics.water_intake >= 2;
    const hasSleep = metrics.sleep_hours >= 7;
    const hasSteps = metrics.steps >= 5000;
    const completed = [hasWater, hasSleep, hasSteps].filter(Boolean).length;
    return (completed / 3) * 100;
  };

  const completion = calculateCompletion();
  const strokeDashoffset = 283 - (283 * completion) / 100;

  // Trigger confetti when completion reaches 100%
  useEffect(() => {
    if (completion === 100) {
      confetti({
        particleCount: 100,
        spread: 70,
        origin: { y: 0.6 },
      });
    }
  }, [completion]);

  if (loading) {
    return <div className="text-center text-gray-600 dark:text-gray-400">Loading...</div>;
  }

  if (error) {
    return <div className="text-center text-red-600 dark:text-red-400">{error}</div>;
  }

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
          value={metrics.water_intake}
          completed={metrics.water_intake >= 2}
          onChange={(value) => handleMetricChange('water', value)}
        />
        <GoalItem
          label="Sleep"
          target="7-9 hours"
          value={metrics.sleep_hours}
          completed={metrics.sleep_hours >= 7}
          onChange={(value) => handleMetricChange('sleep', value)}
        />
        <GoalItem
          label="Daily Steps"
          target="5,000 steps"
          value={metrics.steps}
          completed={metrics.steps >= 5000}
          onChange={(value) => handleMetricChange('steps', value)}
        />
      </div>
    </div>
  );
};

interface GoalItemProps {
  label: string;
  target: string;
  value: number;
  completed: boolean;
  onChange: (value: number) => void;
}

const GoalItem = ({ label, target, value, completed, onChange }: GoalItemProps) => {
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newValue = parseFloat(e.target.value) || 0;
    console.log(`Input changed for ${label}: ${newValue}`);
    onChange(newValue);
  };

  return (
    <div className="flex items-center justify-between px-4 py-2 bg-violet-50 dark:bg-gray-700 rounded-lg">
      <div>
        <p className="text-sm font-medium text-violet-900 dark:text-violet-200">{label}</p>
        <p className="text-xs text-gray-600 dark:text-gray-400">Target: {target}</p>
        <input
          type="number"
          value={value}
          onChange={handleChange}
          className="mt-1 w-20 p-1 text-sm text-gray-900 dark:text-gray-200 bg-gray-100 dark:bg-gray-600 rounded"
          min="0"
          step={label === 'Daily Steps' ? '1' : '0.1'}
        />
      </div>
      <div
        className={`w-6 h-6 rounded-full flex items-center justify-center ${
          completed ? 'bg-violet-600 dark:bg-violet-500' : 'bg-violet-100 dark:bg-gray-600'
        }`}
      >
        {completed && (
          <svg className="w-4 h-4 text-white" fill="none" viewBox="0 0 24 24" personally identifiable informationstroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
          </svg>
        )}
      </div>
    </div>
  );
};

export default ProgressTracker;