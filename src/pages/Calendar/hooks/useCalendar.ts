import { useState, useEffect } from 'react';
import axios from 'axios';
import { useData } from '../../../contexts/DataContext';
import { format } from 'date-fns';

export const useCalendar = () => {
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [events, setEvents] = useState([]);
  const { addAppointment, deleteAppointment } = useData(); // Keep for compatibility, if needed

  // Fetch events from backend
  const fetchEvents = async () => {
    try {
      const token = localStorage.getItem('token');
      if (!token) {
        console.error('No authentication token found');
        return;
      }

      const response = await axios.get('http://localhost:5000/api/calendar-events', {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      // Ensure events are formatted consistently
      const formattedEvents = response.data.events.map((event) => ({
        id: event.id.toString(), // Convert to string for consistency with frontend
        title: event.title,
        description: event.description || '',
        date: new Date(`${event.event_date}T${event.event_time}`).toISOString(),
        event_type: event.event_type,
        reminder_offset: event.reminder_offset,
        is_recurring: event.is_recurring,
      }));

      setEvents(formattedEvents);
    } catch (err) {
      console.error('Error fetching events:', err.response?.data?.error || err.message);
    }
  };

  // Load events on mount
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
        event_type: newEvent.event_type || 'appointment', // Default to 'appointment' if not provided
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
        id: response.data.id?.toString() || Date.now().toString(), // Use backend ID if available
        ...newEvent,
      };

      // Update local state
      setEvents((prevEvents) => [...prevEvents, createdEvent]);

      // Optionally, update DataContext (if still needed)
      addAppointment(createdEvent);
    } catch (err) {
      console.error('Error adding event:', err.response?.data?.error || err.message);
      throw err; // Let the caller (e.g., AddEventModal) handle the error
    }
  };

  const deleteEvent = async (eventId) => {
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

      // Update local state
      setEvents((prevEvents) => prevEvents.filter((event) => event.id !== eventId));

      // Optionally, update DataContext (if still needed)
      deleteAppointment(eventId);
    } catch (err) {
      console.error('Error deleting event:', err.response?.data?.error || err.message);
      throw err; // Let the caller handle the error
    }
  };

  return {
    selectedDate,
    events, // Use local state instead of appointments from DataContext
    isModalOpen,
    setSelectedDate,
    setIsModalOpen,
    addEvent,
    deleteEvent,
  };
};

export default useCalendar;