import React from 'react';
import { Plus, Minus } from 'lucide-react';

const Appointments = () => {
  return (
    <section className="space-y-3">
      <h2 className="text-lg font-medium text-violet-900 dark:text-violet-200">Today's Appointments</h2>
      <div className="space-y-2">
        <AppointmentCard
          time="13:00"
          date="22/1/2024"
          info="Regular checkup with Dr. Smith"
        />
        <AppointmentCard
          time="15:30"
          date="22/1/2024"
          info="Ultrasound scan"
        />
      </div>
      <div className="flex justify-between">
        <button className="p-2 rounded-full bg-violet-100 dark:bg-violet-900">
          <Plus className="w-5 h-5 text-violet-600 dark:text-violet-300" />
        </button>
        <button className="p-2 rounded-full bg-violet-100 dark:bg-violet-900">
          <Minus className="w-5 h-5 text-violet-600 dark:text-violet-300" />
        </button>
        <button className="text-violet-600 dark:text-violet-300 text-sm">View Calendar</button>
      </div>
    </section>
  );
};

const AppointmentCard = ({ time, date, info }) => (
  <div className="bg-white dark:bg-gray-800 p-4 rounded-xl shadow-sm">
    <div className="flex justify-between items-center mb-2">
      <span className="font-medium text-violet-900 dark:text-violet-200">{time}</span>
      <span className="text-sm text-gray-500 dark:text-gray-400">{date}</span>
    </div>
    <p className="text-sm text-gray-600 dark:text-gray-400">{info}</p>
  </div>
);

export default Appointments;