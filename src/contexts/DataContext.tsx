import React, { createContext, useContext, useState, useEffect } from 'react';
import { useUser } from './UserContext';

// Types
interface HealthMetric {
  id: string;
  child_id?: string;
  type: 'water' | 'sleep' | 'steps' | 'weight';
  value: number;
  unit: string;
  date: string;
}

interface Vaccination {
  id: string;
  child_id?: string;
  name: string;
  date: string;
  nextDue?: string;
  notes?: string;
}

interface Activity {
  id: string;
  child_id?: string;
  type: 'exercise' | 'meditation' | 'nutrition';
  title: string;
  duration?: number;
  notes?: string;
  date: string;
}

interface Appointment {
  id: string;
  child_id?: string;
  title: string;
  date: string;
  time: string;
  doctor?: string;
  location?: string;
  notes?: string;
}

interface Memory {
  id: string;
  child_id?: string;
  photo: string;
  caption: string;
  date: string;
  likes: number;
  comments: number;
}

interface DataContextType {
  healthMetrics: HealthMetric[];
  vaccinations: Vaccination[];
  activities: Activity[];
  appointments: Appointment[];
  memories: Memory[];
  addHealthMetric: (metric: Omit<HealthMetric, 'id'>) => void;
  updateHealthMetric: (id: string, updates: Partial<HealthMetric>) => void;
  deleteHealthMetric: (id: string) => void;
  addVaccination: (vaccination: Omit<Vaccination, 'id'>) => void;
  updateVaccination: (id: string, updates: Partial<Vaccination>) => void;
  deleteVaccination: (id: string) => void;
  addActivity: (activity: Omit<Activity, 'id'>) => void;
  updateActivity: (id: string, updates: Partial<Activity>) => void;
  deleteActivity: (id: string) => void;
  addAppointment: (appointment: Omit<Appointment, 'id'>) => void;
  updateAppointment: (id: string, updates: Partial<Appointment>) => void;
  deleteAppointment: (id: string) => void;
  addMemory: (memory: Omit<Memory, 'id' | 'likes' | 'comments'>) => void;
  updateMemory: (id: string, updates: Partial<Memory>) => void;
  deleteMemory: (id: string) => void;
}

const DataContext = createContext<DataContextType | undefined>(undefined);

// Sample data for development
const initialHealthMetrics: HealthMetric[] = [
  {
    id: '1',
    child_id: '1',
    type: 'water',
    value: 2,
    unit: 'L',
    date: new Date().toISOString(),
  },
  {
    id: '2',
    child_id: '1',
    type: 'sleep',
    value: 8,
    unit: 'hours',
    date: new Date().toISOString(),
  },
  {
    id: '3',
    child_id: '2',
    type: 'water',
    value: 1.5,
    unit: 'L',
    date: new Date().toISOString(),
  },
  {
    id: '4',
    child_id: '2',
    type: 'sleep',
    value: 10,
    unit: 'hours',
    date: new Date().toISOString(),
  },
];

const initialVaccinations: Vaccination[] = [
  {
    id: '1',
    child_id: '1',
    name: 'Tdap',
    date: '2024-02-15',
    nextDue: '2024-08-15',
    notes: 'Required during pregnancy',
  },
  {
    id: '2',
    child_id: '2',
    name: 'MMR',
    date: '2023-05-10',
    nextDue: '2026-05-10',
    notes: 'Measles, Mumps, Rubella',
  },
];

const initialActivities: Activity[] = [
  {
    id: '1',
    child_id: '1',
    type: 'exercise',
    title: 'Prenatal Yoga',
    duration: 30,
    date: new Date().toISOString(),
  },
  {
    id: '2',
    child_id: '2',
    type: 'exercise',
    title: 'Toddler Playtime',
    duration: 45,
    date: new Date().toISOString(),
  },
];

const initialAppointments: Appointment[] = [
  {
    id: '1',
    child_id: '1',
    title: 'Regular Checkup',
    date: '2024-03-01',
    time: '10:00',
    doctor: 'Dr. Smith',
    location: 'City Hospital',
  },
  {
    id: '2',
    child_id: '2',
    title: 'Pediatrician Visit',
    date: '2024-03-15',
    time: '14:30',
    doctor: 'Dr. Johnson',
    location: 'Children\'s Clinic',
  },
];

const initialMemories: Memory[] = [
  {
    id: '1',
    child_id: '1',
    photo: 'https://images.unsplash.com/photo-1557166983-5939644443b7?w=500&h=500&fit=crop',
    caption: 'First Ultrasound',
    date: new Date().toISOString(),
    likes: 0,
    comments: 0,
  },
  {
    id: '2',
    child_id: '2',
    photo: 'https://images.unsplash.com/photo-1555252333-9f8e92e65df9?w=500&h=500&fit=crop',
    caption: 'First Steps',
    date: new Date().toISOString(),
    likes: 0,
    comments: 0,
  },
];

export const DataProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { currentChild } = useUser();
  const [healthMetrics, setHealthMetrics] = useState<HealthMetric[]>(initialHealthMetrics);
  const [vaccinations, setVaccinations] = useState<Vaccination[]>(initialVaccinations);
  const [activities, setActivities] = useState<Activity[]>(initialActivities);
  const [appointments, setAppointments] = useState<Appointment[]>(initialAppointments);
  const [memories, setMemories] = useState<Memory[]>(initialMemories);

  // Filter data based on current child
  const filteredHealthMetrics = healthMetrics.filter(
    metric => !currentChild || metric.child_id === currentChild.id
  );
  
  const filteredVaccinations = vaccinations.filter(
    vaccination => !currentChild || vaccination.child_id === currentChild.id
  );
  
  const filteredActivities = activities.filter(
    activity => !currentChild || activity.child_id === currentChild.id
  );
  
  const filteredAppointments = appointments.filter(
    appointment => !currentChild || appointment.child_id === currentChild.id
  );
  
  const filteredMemories = memories.filter(
    memory => !currentChild || memory.child_id === currentChild.id
  );

  const addHealthMetric = (metric: Omit<HealthMetric, 'id'>) => {
    const newMetric = { 
      ...metric, 
      id: Math.random().toString(),
      child_id: currentChild?.id
    };
    setHealthMetrics(prev => [newMetric, ...prev]);
  };

  const updateHealthMetric = (id: string, updates: Partial<HealthMetric>) => {
    setHealthMetrics(prev => prev.map(metric => 
      metric.id === id ? { ...metric, ...updates } : metric
    ));
  };

  const deleteHealthMetric = (id: string) => {
    setHealthMetrics(prev => prev.filter(metric => metric.id !== id));
  };

  const addVaccination = (vaccination: Omit<Vaccination, 'id'>) => {
    const newVaccination = { 
      ...vaccination, 
      id: Math.random().toString(),
      child_id: currentChild?.id
    };
    setVaccinations(prev => [newVaccination, ...prev]);
  };

  const updateVaccination = (id: string, updates: Partial<Vaccination>) => {
    setVaccinations(prev => prev.map(vaccination => 
      vaccination.id === id ? { ...vaccination, ...updates } : vaccination
    ));
  };

  const deleteVaccination = (id: string) => {
    setVaccinations(prev => prev.filter(vaccination => vaccination.id !== id));
  };

  const addActivity = (activity: Omit<Activity, 'id'>) => {
    const newActivity = { 
      ...activity, 
      id: Math.random().toString(),
      child_id: currentChild?.id
    };
    setActivities(prev => [newActivity, ...prev]);
  };

  const updateActivity = (id: string, updates: Partial<Activity>) => {
    setActivities(prev => prev.map(activity => 
      activity.id === id ? { ...activity, ...updates } : activity
    ));
  };

  const deleteActivity = (id: string) => {
    setActivities(prev => prev.filter(activity => activity.id !== id));
  };

  const addAppointment = (appointment: Omit<Appointment, 'id'>) => {
    const newAppointment = { 
      ...appointment, 
      id: Math.random().toString(),
      child_id: currentChild?.id
    };
    setAppointments(prev => [newAppointment, ...prev]);
  };

  const updateAppointment = (id: string, updates: Partial<Appointment>) => {
    setAppointments(prev => prev.map(appointment => 
      appointment.id === id ? { ...appointment, ...updates } : appointment
    ));
  };

  const deleteAppointment = (id: string) => {
    setAppointments(prev => prev.filter(appointment => appointment.id !== id));
  };

  const addMemory = (memory: Omit<Memory, 'id' | 'likes' | 'comments'>) => {
    const newMemory = { 
      ...memory, 
      id: Math.random().toString(),
      child_id: currentChild?.id,
      likes: 0,
      comments: 0
    };
    setMemories(prev => [newMemory, ...prev]);
  };

  const updateMemory = (id: string, updates: Partial<Memory>) => {
    setMemories(prev => prev.map(memory => 
      memory.id === id ? { ...memory, ...updates } : memory
    ));
  };

  const deleteMemory = (id: string) => {
    setMemories(prev => prev.filter(memory => memory.id !== id));
  };

  return (
    <DataContext.Provider
      value={{
        healthMetrics: filteredHealthMetrics,
        vaccinations: filteredVaccinations,
        activities: filteredActivities,
        appointments: filteredAppointments,
        memories: filteredMemories,
        addHealthMetric,
        updateHealthMetric,
        deleteHealthMetric,
        addVaccination,
        updateVaccination,
        deleteVaccination,
        addActivity,
        updateActivity,
        deleteActivity,
        addAppointment,
        updateAppointment,
        deleteAppointment,
        addMemory,
        updateMemory,
        deleteMemory,
      }}
    >
      {children}
    </DataContext.Provider>
  );
};

export const useData = () => {
  const context = useContext(DataContext);
  if (context === undefined) {
    throw new Error('useData must be used within a DataProvider');
  }
  return context;
};