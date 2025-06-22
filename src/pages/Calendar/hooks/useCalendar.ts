// useCalendar.ts
import { useState, useEffect } from 'react';
import axios from 'axios';
import { useData } from '../../../contexts/DataContext';
import { format } from 'date-fns';

export const useCalendar = () => {
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [events, setEvents] = useState([]);
  const { addAppointment, deleteAppointment } = useData();

  // Helper function to convert seconds to HH:mm:ss
  const secondsToTimeString = (seconds) => {
    const hours = Math.floor(seconds / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);
    const secs = Math.floor(seconds % 60);
    return `${String(hours).padStart(2, '0')}:${String(minutes).padStart(2, '0')}:${String(secs).padStart(2, '0')}`;
  };

  const fetchEvents = async () => {
    try {
      const token = localStorage.getItem('token');
      if (!token) {
        console.error('No authentication token found');
        return;
      }

      const response = await axios.get('http://localhost:5000/api/get-calendar-events', {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      const formattedEvents = response.data.calendar_events.map((event) => {
        // Convert event_time from seconds to HH:mm:ss
        const timeString = secondsToTimeString(event.event_time);
        return {
          id: event.id.toString(),
          title: event.title,
          description: event.description || '',
          date: new Date(`${event.event_date}T${timeString}`).toISOString(),
          event_type: event.event_type,
          reminder_offset: event.reminder_offset,
          is_recurring: event.is_recurring,
        };
      });

      setEvents(formattedEvents);
    } catch (err) {
      console.error('Error fetching events:', err.response?.data?.error || err.message);
    }
  };

  useEffect(() => {
    fetchEvents();
  }, []);

  const addEvent = async (newEvent) => {
    try {
      const token = localStorage.getItem('token');
      if (!token) {
        throw new Error('No authentication token found');
      }

      const eventDate = new Date(newEvent.date);
      const eventData = {
        event_type: newEvent.event_type || 'appointment',
        event_date: format(eventDate, 'yyyy-MM-dd'),
        event_time: format(eventDate, 'HH:mm'),
        title: newEvent.title,
        description: newEvent.description || '',
        reminder_offset: newEvent.reminder_offset || 0,
        is_recurring: newEvent.is_recurring || false,
      };

      const response = await axios.post('http://localhost:5000/api/calendar-events', eventData, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      const createdEvent = {
        id: response.data.id?.toString() || Date.now().toString(),
        ...newEvent,
      };

      setEvents((prevEvents) => [...prevEvents, createdEvent]);
      addAppointment(createdEvent);
    } catch (err) {
      console.error('Error adding event:', err.response?.data?.error || err.message);
      throw err;
    }
  };

  const deleteEvent = async (eventId: string) => {
  try {
    const token = localStorage.getItem('token');
    if (!token) {
      throw new Error('No authentication token found');
    }

    await axios.delete(`http://localhost:5000/api/calendar-events/${eventId}`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    setEvents((prevEvents) => prevEvents.filter((event) => event.id !== eventId));
    deleteAppointment(eventId);
    console.log(`Event ${eventId} deleted successfully`);
  } catch (err) {
    const errorMessage = err.response?.data?.error || err.message;
    console.error('Error deleting event:', errorMessage);
    throw new Error(errorMessage);
  }
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