import React, { useState } from 'react';
import { X } from 'lucide-react';
import { format } from 'date-fns';
import axios from 'axios';

const AddEventModal = ({ isOpen, onClose, onAdd, selectedDate }) => {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [time, setTime] = useState('12:00');
  const [eventType, setEventType] = useState('appointment'); // Example: Add event type///////////////////////////////////
  const [error, setError] = useState(null);

  if (!isOpen) return null;

  const handleSubmit = async (e) => {
  e.preventDefault();
  setError(null);

  const [hours, minutes] = time.split(':');
  const eventDate = new Date(selectedDate);
  eventDate.setHours(parseInt(hours), parseInt(minutes));

  const eventData = {
    title,
    description,
    date: eventDate.toISOString(),
    event_type: eventType, // Added in previous update
  };

  try {
    await onAdd(eventData); // Call addEvent from useCalendar
    setTitle('');
    setDescription('');
    setTime('12:00');
    setEventType('appointment');
    onClose();
  } catch (err) {
    setError(err.message || 'Failed to create event');
    console.error('Error creating event:', err);
  }
};

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4">
      <div className="bg-white dark:bg-gray-800 rounded-xl p-6 w-full max-w-md">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-lg font-medium text-violet-900 dark:text-violet-200">Add New Event</h2>
          <button
            onClick={onClose}
            className="p-2 hover:bg-violet-100 dark:hover:bg-gray-700 rounded-full"
          >
            <X className="w-5 h-5 text-violet-600 dark:text-violet-400" />
          </button>
        </div>

        {error && (
          <div className="mb-4 p-2 bg-red-100 text-red-700 rounded-lg">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              Date
            </label>
            <input
              type="text"
              value={format(selectedDate, 'MMMM d, yyyy')}
              disabled
              className="w-full p-2 border rounded-lg bg-gray-50 dark:bg-gray-700 dark:text-gray-300 dark:border-gray-600"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              Event Type
            </label>
            <select
              value={eventType}
              onChange={(e) => setEventType(e.target.value)}
              className="w-full p-2 border rounded-lg dark:bg-gray-700 dark:text-gray-300 dark:border-gray-600"
              required
            >
              <option value="appointment">Appointment</option>
              <option value="reminder">Reminder</option>
              <option value="task">Task</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              Time
            </label>
            <input
              type="time"
              value={time}
              onChange={(e) => setTime(e.target.value)}
              className="w-full p-2 border rounded-lg dark:bg-gray-700 dark:text-gray-300 dark:border-gray-600"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              Title
            </label>
            <input
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="w-full p-2 border rounded-lg dark:bg-gray-700 dark:text-gray-300 dark:border-gray-600"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              Description
            </label>
            <textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className="w-full p-2 border rounded-lg dark:bg-gray-700 dark:text-gray-300 dark:border-gray-600"
              rows={3}
            />
          </div>

          <button
            type="submit"
            className="w-full bg-violet-600 text-white py-2 rounded-lg hover:bg-violet-700 dark:hover:bg-violet-500"
          >
            Add Event
          </button>
        </form>
      </div>
    </div>
  );
};

export default AddEventModal;