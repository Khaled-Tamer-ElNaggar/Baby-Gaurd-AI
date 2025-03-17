import React from 'react';
import Header from '../../components/Header';
import Navbar from '../../components/Navbar';
import CalendarGrid from './components/CalendarGrid';
import EventList from './components/EventList';
import AddEventModal from './components/AddEventModal';
import { useCalendar } from './hooks/useCalendar';

const Calendar = () => {
  const {
    selectedDate,
    events,
    isModalOpen,
    setSelectedDate,
    setIsModalOpen,
    addEvent,
  } = useCalendar();

  return (
    <div className="min-h-screen bg-violet-50 dark:bg-gray-900">
      <Header title="Calendar" showChildSelector />

      <main className="max-w-lg mx-auto p-4 pb-20 space-y-6">
        <CalendarGrid
          selectedDate={selectedDate}
          events={events}
          onSelectDate={setSelectedDate}
        />
        
        <EventList 
          selectedDate={selectedDate}
          events={events}
          onAddEvent={() => setIsModalOpen(true)}
        />

        <AddEventModal
          isOpen={isModalOpen}
          onClose={() => setIsModalOpen(false)}
          onAdd={addEvent}
          selectedDate={selectedDate}
        />
      </main>

      <Navbar />
    </div>
  );
};

export default Calendar;