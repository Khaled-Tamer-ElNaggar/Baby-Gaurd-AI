import React, { createContext, useContext, useState, useEffect } from 'react';
import { useUser } from './UserContext';

// Types
interface HealthMetric {
  id: string;
  child_id?: string;
  type: 'water' | 'sleep' | 'steps' | 'weight' | 'height' | 'size';
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
  updateBabyMetrics: (metrics: { size?: string; weight?: string; height?: string }) => void;
}

const DataContext = createContext<DataContextType | undefined>(undefined);

export const DataProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { currentChild } = useUser();
  const [healthMetrics, setHealthMetrics] = useState<HealthMetric[]>([]);
  const [vaccinations, setVaccinations] = useState<Vaccination[]>([]);
  const [activities, setActivities] = useState<Activity[]>([]);
  const [appointments, setAppointments] = useState<Appointment[]>([]);
  const [memories, setMemories] = useState<Memory[]>([]);
  const [error, setError] = useState<string>('');

  // Fetch memories from backend
  useEffect(() => {
    const fetchMemories = async () => {
      const token = localStorage.getItem('token');
      if (!token) {
        setError('Please log in to fetch memories');
        return;
      }

      try {
        const response = await fetch('http://localhost:5000/api/user-media', {
          method: 'GET',
          headers: {
            'Authorization': `Bearer ${token}`,
          },
        });

        const data = await response.json();
        if (response.ok) {
          const fetchedMemories: Memory[] = data.images.map((item: any) => ({
            id: item.id.toString(),
            child_id: currentChild?.id,
            photo: item.image_url.startsWith('http') ? item.image_url : `http://localhost:5000${item.image_url}`,
            caption: item.description || '',
            date: item.uploaded_at,
            likes: 0,
            comments: 0,
          }));
          setMemories(fetchedMemories);
          setError('');
        } else {
          setError(data.error || 'Failed to fetch memories');
        }
      } catch (err) {
        console.error('Error fetching memories:', err);
        setError('Network error: Could not reach the server');
      }
    };

    fetchMemories();
  }, [currentChild]);

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
    setMemories(prev => prev.filter((memory) => memory.id !== id));
  };

  const updateBabyMetrics = (metrics: { size?: string; weight?: string; height?: string }) => {
    const now = new Date().toISOString();
    
    if (metrics.weight) {
      addHealthMetric({
        type: 'weight',
        value: parseFloat(metrics.weight),
        unit: 'kg',
        date: now
      });
    }
    
    if (metrics.height) {
      addHealthMetric({
        type: 'height',
        value: parseFloat(metrics.height),
        unit: 'cm',
        date: now
      });
    }
    
    if (metrics.size) {
      addHealthMetric({
        type: 'size',
        value: parseFloat(metrics.size),
        unit: 'cm',
        date: now
      });
    }
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
        updateBabyMetrics,
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