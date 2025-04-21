import { useState } from 'react';

export const useCalendar = () => {
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [events, setEvents] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const addEvent = (newEvent) => {
    const eventWithId = {
      ...newEvent,
      id: Date.now().toString()
    };
    setEvents(prev => [...prev, eventWithId]);
  };

  const deleteEvent = (eventId) => {
    setEvents(prev => prev.filter(event => event.id !== eventId));
  };

  return {
    selectedDate,
    events,
    isModalOpen,
    setSelectedDate,
    setIsModalOpen,
    addEvent,
    deleteEvent,
  };
};

export default useCalendar;