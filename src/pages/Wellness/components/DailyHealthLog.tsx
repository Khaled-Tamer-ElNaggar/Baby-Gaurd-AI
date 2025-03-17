import React from 'react';
import { Moon, Droplets, Activity } from 'lucide-react';

const DailyHealthLog = () => {
  return (
    <div className="bg-white dark:bg-gray-800 rounded-xl p-4 shadow-sm">
      <h2 className="text-lg font-medium text-violet-900 dark:text-violet-200 mb-3">
        Daily Health Log
      </h2>
      <div className="grid grid-cols-3 gap-3">
        <LogCard icon={<Moon />} label="Sleep" value="8h" />
        <LogCard icon={<Droplets />} label="Water" value="2L" />
        <LogCard icon={<Activity />} label="Activity" value="30m" />
      </div>
    </div>
  );
};

const LogCard = ({ icon, label, value }) => (
  <div className="bg-violet-50 dark:bg-gray-700 p-3 rounded-xl flex flex-col items-center">
    <div className="text-violet-600 dark:text-violet-400 mb-1">{icon}</div>
    <span className="text-lg font-semibold text-violet-900 dark:text-violet-200">{value}</span>
    <span className="text-sm text-gray-600 dark:text-gray-400">{label}</span>
  </div>
);

export default DailyHealthLog;