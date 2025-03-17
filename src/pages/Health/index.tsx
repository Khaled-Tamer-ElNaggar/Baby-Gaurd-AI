import React from 'react';
import Header from '../../components/Header';
import Navbar from '../../components/Navbar';
import HealthOverview from './components/HealthOverview';
import ProgressTracker from './components/ProgressTracker';
import VaccinationHistory from './components/VaccinationHistory';
import InfantHealth from './components/InfantHealth';

const Health = () => {
  return (
    <div className="min-h-screen bg-violet-50 dark:bg-gray-900">
      <Header title="Health" showChildSelector />

      <main className="max-w-lg mx-auto p-4 pb-24 space-y-6">
        <HealthOverview />
        <ProgressTracker />
        <VaccinationHistory />
        <InfantHealth />
      </main>

      <Navbar />
    </div>
  );
};

export default Health;