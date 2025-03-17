import { useState } from 'react';

export const useCalendar = () => {
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [events, setEvents] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const addEvent = (newEvent) => {
    setEvents(prev => [...prev, newEvent]);
  };

  return {
    selectedDate,
    events,
    isModalOpen,
    setSelectedDate,
    setIsModalOpen,
    addEvent,
  };
};

export default useCalendar;