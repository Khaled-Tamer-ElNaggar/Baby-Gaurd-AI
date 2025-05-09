import { useState, useEffect } from 'react';
import { useData } from '../../../contexts/DataContext';

export const useCalendar = () => {
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [isModalOpen, setIsModalOpen] = useState(false);
  const { appointments, addAppointment, deleteAppointment } = useData();

  const addEvent = (newEvent) => {
    const eventWithId = {
      ...newEvent,
      id: Date.now().toString()
    };
    addAppointment(eventWithId);
  };

  const deleteEvent = (eventId) => {
    deleteAppointment(eventId);
  };

  return {
    selectedDate,
    events: appointments,
    isModalOpen,
    setSelectedDate,
    setIsModalOpen,
    addEvent,
    deleteEvent,
  };
};

export default useCalendar;