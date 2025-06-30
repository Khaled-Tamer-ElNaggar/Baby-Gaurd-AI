import React from 'react';
import { Trash2 } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useData } from '../contexts/DataContext';
import { format } from 'date-fns';

const Appointments = () => {
  const navigate = useNavigate();
  const { appointments, deleteAppointment } = useData();

  // Get today's appointments
  const todayAppointments = appointments.filter(appointment => {
    const appointmentDate = new Date(appointment.date);
    const today = new Date();
    return (
      appointmentDate.getDate() === today.getDate() &&
      appointmentDate.getMonth() === today.getMonth() &&
      appointmentDate.getFullYear() === today.getFullYear()
    );
  });

  return (
    <section className="space-y-3">
      <div className="flex justify-between items-center">
        <h2 className="text-lg font-medium text-violet-900 dark:text-violet-200">Today's Appointments</h2>
        <button 
          onClick={() => navigate('/calendar')}
          className="text-violet-600 dark:text-violet-300 text-sm hover:underline"
        >
          View Calendar
        </button>
      </div>
      
      <div className="space-y-2">
        {todayAppointments.length > 0 ? (
          todayAppointments.map((appointment) => (
            <AppointmentCard
              key={appointment.id}
              appointment={appointment}
              onDelete={() => deleteAppointment(appointment.id)}
            />
          ))
        ) : (
          <p className="text-center text-gray-500 dark:text-gray-400 py-4">
            No appointments for today
          </p>
        )}
      </div>
    </section>
  );
};

const AppointmentCard = ({ appointment, onDelete }) => {
  // Combine date and time for correct display
  let dateTimeString = appointment.date;
  if (appointment.time) {
    // If time is already in HH:mm or HH:mm:ss, append to date
    dateTimeString = `${appointment.date}T${appointment.time.length === 5 ? appointment.time : appointment.time + ':00'}`;
  }
  const dateObj = new Date(dateTimeString);
  return (
    <div className="bg-white dark:bg-gray-800 p-4 rounded-xl shadow-sm">
      <div className="flex justify-between items-center mb-2">
        <span className="font-medium text-violet-900 dark:text-violet-200">
          {isNaN(dateObj.getTime()) ? appointment.time : dateObj.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
        </span>
        <div className="flex items-center gap-2">
          <span className="text-sm text-gray-500 dark:text-gray-400">
            {isNaN(dateObj.getTime()) ? appointment.date : dateObj.toLocaleDateString('en-GB')}
          </span>
          <button
            onClick={onDelete}
            className="text-red-500 hover:text-red-600 dark:hover:text-red-400"
          >
            <Trash2 className="w-4 h-4" />
          </button>
        </div>
      </div>
      <p className="text-sm text-gray-600 dark:text-gray-400">{appointment.title}</p>
      {appointment.location && (
        <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
          📍 {appointment.location}
        </p>
      )}
    </div>
  );
};

export default Appointments;