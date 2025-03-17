import React from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import {
  format,
  startOfMonth,
  endOfMonth,
  eachDayOfInterval,
  isSameMonth,
  isSameDay,
  addMonths,
  subMonths
} from 'date-fns';

const CalendarGrid = ({ selectedDate, events, onSelectDate }) => {
  const [currentMonth, setCurrentMonth] = React.useState(new Date());

  const days = eachDayOfInterval({
    start: startOfMonth(currentMonth),
    end: endOfMonth(currentMonth)
  });

  const hasEvents = (date) => {
    return events.some(event => isSameDay(new Date(event.date), date));
  };

  return (
    <div className="bg-white dark:bg-gray-800 rounded-xl p-4 shadow-sm">
      <div className="flex justify-between items-center mb-4">
        <button
          onClick={() => setCurrentMonth(prev => subMonths(prev, 1))}
          className="p-2 hover:bg-violet-100 dark:hover:bg-gray-700 rounded-full"
        >
          <ChevronLeft className="w-5 h-5 text-violet-600 dark:text-violet-400" />
        </button>
        
        <h2 className="text-lg font-medium text-violet-900 dark:text-violet-200">
          {format(currentMonth, 'MMMM yyyy')}
        </h2>
        
        <button
          onClick={() => setCurrentMonth(prev => addMonths(prev, 1))}
          className="p-2 hover:bg-violet-100 dark:hover:bg-gray-700 rounded-full"
        >
          <ChevronRight className="w-5 h-5 text-violet-600 dark:text-violet-400" />
        </button>
      </div>

      <div className="grid grid-cols-7 gap-1">
        {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map(day => (
          <div key={day} className="text-center text-sm text-gray-500 dark:text-gray-400 py-2">
            {day}
          </div>
        ))}
        
        {days.map(day => (
          <button
            key={day.toString()}
            onClick={() => onSelectDate(day)}
            className={`
              aspect-square p-2 rounded-lg relative
              ${isSameMonth(day, currentMonth) ? 'text-gray-900 dark:text-gray-100' : 'text-gray-400 dark:text-gray-600'}
              ${isSameDay(day, selectedDate) ? 'bg-violet-600 text-white' : ''}
              hover:bg-violet-100 dark:hover:bg-gray-700
            `}
          >
            {format(day, 'd')}
            {hasEvents(day) && (
              <span className="absolute bottom-1 left-1/2 transform -translate-x-1/2 w-1 h-1 bg-violet-500 dark:bg-violet-400 rounded-full" />
            )}
          </button>
        ))}
      </div>
    </div>
  );
};

export default CalendarGrid;