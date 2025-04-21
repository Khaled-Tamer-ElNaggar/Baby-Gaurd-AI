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
    deleteEvent,
  } = useCalendar();

  return (
    <div className="min-h-screen bg-violet-50 dark:bg-gray-900">
      <Header title="Calendar" showChildSelector />

      <main className="p-4 md:p-6 max-w-screen-xl mx-auto">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          {/* Calendar Grid - Full width on mobile, 8 columns on large screens */}
          <div className="lg:col-span-8">
            <CalendarGrid
              selectedDate={selectedDate}
              events={events}
              onSelectDate={setSelectedDate}
            />
          </div>
          
          {/* Event List - Full width on mobile, 4 columns on large screens */}
          <div className="lg:col-span-4">
            <EventList 
              selectedDate={selectedDate}
              events={events}
              onAddEvent={() => setIsModalOpen(true)}
              onDeleteEvent={deleteEvent}
            />
          </div>
        </div>
      </main>

      <AddEventModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onAdd={addEvent}
        selectedDate={selectedDate}
      />

      <Navbar />
    </div>
  );
};

export default Calendar;