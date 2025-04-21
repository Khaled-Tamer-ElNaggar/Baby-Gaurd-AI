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

      <main className="p-4 md:p-6 max-w-screen-xl mx-auto">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          {/* Left Section: Health Overview + Vaccination + Infant Health */}
          <div className="lg:col-span-8 space-y-6">
            <HealthOverview />
            <VaccinationHistory />
            <InfantHealth />
          </div>

          {/* Right Section: Progress Tracker */}
          <div className="lg:col-span-4">
            <ProgressTracker />
          </div>
        </div>
      </main>

      <Navbar />
    </div>
  );
};

export default Health;