import React from 'react';
import { Baby, Weight } from 'lucide-react';

const PregnancyMilestone = () => {
  return (
    <div className="bg-white dark:bg-gray-800 rounded-xl p-4 shadow-sm">
      <h2 className="text-lg font-medium text-violet-900 dark:text-violet-200 mb-3">
        Pregnancy Milestone
      </h2>
      <div className="grid grid-cols-2 gap-4">
        <div className="bg-violet-50 dark:bg-gray-700 p-4 rounded-xl">
          <div className="flex items-center gap-2 mb-2">
            <Baby className="w-5 h-5 text-violet-600 dark:text-violet-400" />
            <span className="font-medium text-violet-900 dark:text-violet-200">Baby Size</span>
          </div>
          <p className="text-gray-600 dark:text-gray-300">Size of a lemon (Week 14)</p>
        </div>
        <div className="bg-violet-50 dark:bg-gray-700 p-4 rounded-xl">
          <div className="flex items-center gap-2 mb-2">
            <Weight className="w-5 h-5 text-violet-600 dark:text-violet-400" />
            <span className="font-medium text-violet-900 dark:text-violet-200">Weight Changes</span>
          </div>
          <p className="text-gray-600 dark:text-gray-300">+1.5 KG this month</p>
        </div>
      </div>
    </div>
  );
};

export default PregnancyMilestone;