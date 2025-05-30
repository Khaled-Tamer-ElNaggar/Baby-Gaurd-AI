import React from 'react';
import { Plus, Trash2 } from 'lucide-react';
import { format, isSameDay } from 'date-fns';

const EventList = ({ selectedDate, events, onAddEvent, onDeleteEvent }) => {
  const dayEvents = events.filter(event => 
    isSameDay(new Date(event.date), selectedDate)
  );

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <h2 className="text-lg font-medium text-violet-900 dark:text-violet-200">
          Events for {format(selectedDate, 'MMMM d, yyyy')}
        </h2>
        <button
          onClick={onAddEvent}
          className="p-2 bg-violet-600 text-white rounded-full hover:bg-violet-700"
        >
          <Plus className="w-5 h-5" />
        </button>
      </div>

      {dayEvents.length === 0 ? (
        <p className="text-center text-gray-500 dark:text-gray-400 py-4">
          No events scheduled for this day
        </p>
      ) : (
        <div className="space-y-2">
          {dayEvents.map((event, index) => (
            <div
              key={index}
              className="bg-white dark:bg-gray-800 p-4 rounded-xl shadow-sm"
            >
              <div className="flex justify-between items-start">
                <div>
                  <h3 className="font-medium text-violet-900 dark:text-violet-200">{event.title}</h3>
                  <p className="text-sm text-gray-600 dark:text-gray-400">{event.description}</p>
                  <span className="text-sm text-violet-600 dark:text-violet-400">
                    {format(new Date(event.date), 'h:mm a')}
                  </span>
                </div>
                <button
                  onClick={() => onDeleteEvent(event.id)}
                  className="p-1 text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-full"
                >
                  <Trash2 className="w-5 h-5" />
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default EventList;