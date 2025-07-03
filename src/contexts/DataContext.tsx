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
  setMemories: React.Dispatch<React.SetStateAction<Memory[]>>;
  addHealthMetric: (metric: Omit<HealthMetric, 'id'>) => void;
  updateHealthMetric: (id: string, updates: Partial<HealthMetric>) => void;
  deleteHealthMetric: (id: string) => void;
  addVaccination: (vaccination: Omit<Vaccination, 'id'>) => Promise<void>;
  updateVaccination: (id: string, updates: Partial<Vaccination>) => void;
  deleteVaccination: (id: string) => Promise<void>;
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

  // Fetch vaccinations from backend
  useEffect(() => {
    const fetchVaccinations = async () => {
      const token = localStorage.getItem('token');
      if (!token) {
        setError('Please log in to fetch vaccinations');
        setVaccinations([]);
        return;
      }
      try {
        const response = await fetch('http://localhost:5000/api/vaccinations', {
          method: 'GET',
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json'
          }
        });
        if (!response.ok) {
          const data = await response.json();
          setError(data.error || `HTTP error: ${response.status}`);
          setVaccinations([]);
          return;
        }
        const data = await response.json();
        const fetchedVaccinations: Vaccination[] = (data.vaccinations || []).map((item: any) => ({
          id: item.id.toString(),
          child_id: item.child_id,
          name: item.name,
          date: item.date,
          nextDue: item.nextDue,
          notes: item.notes
        }));
        setVaccinations(fetchedVaccinations);
        setError('');
      } catch (err) {
        console.error('Detailed fetch error:', {
          error: err,
          message: err instanceof Error ? err.message : 'Unknown error',
          stack: err instanceof Error ? err.stack : undefined
        });
        setError('Network error: Could not reach the server');
        setVaccinations([]);
      }
    };
    fetchVaccinations();
  }, [currentChild]);

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
        if (!response.ok) {
          const data = await response.json();
          console.error('Backend error:', data);
          setError(data.error || `HTTP error: ${response.status}`);
          return;
        }
        const data = await response.json();
        const fetchedMemories: Memory[] = data.images.map((item: any) => {
          let photo = item.image_url;
          if (!photo.startsWith('http')) {
            photo = `${import.meta.env.VITE_BACKEND_URL || 'http://localhost:5000'}`.replace(/\/?$/, '') + '/' + photo.replace(/^[\\/]+/, '').replace(/\\/g, '/');
          }
          return {
            id: item.id.toString(),
            child_id: currentChild?.id,
            photo,
            caption: item.description || '',
            date: item.uploaded_at,
            likes: 0,
            comments: 0,
          };
        });
        setMemories(fetchedMemories);
        setError('');
      } catch (err) {
        console.error('Detailed fetch error:', {
          error: err,
          message: err instanceof Error ? err.message : 'Unknown error',
          stack: err instanceof Error ? err.stack : undefined
        });
        setError('Network error: Could not reach the server');
      }
    };
    fetchMemories();
  }, [currentChild]);

  // Fetch appointments from backend
  useEffect(() => {
    const fetchAppointments = async () => {
      const token = localStorage.getItem('token');
      if (!token) {
        setError('Please log in to fetch appointments');
        setAppointments([]);
        return;
      }
      try {
        const response = await fetch('http://localhost:5000/api/get-calendar-events', {
          method: 'GET',
          headers: {
            'Authorization': `Bearer ${token}`,
          },
        });
        if (!response.ok) {
          const data = await response.json();
          setError(data.error || `HTTP error: ${response.status}`);
          setAppointments([]);
          return;
        }
        const data = await response.json();
        console.log('Fetched calendar_events:', data.calendar_events);
        const fetchedAppointments: Appointment[] = (data.calendar_events || []).map((item: any) => {
          let rawTime = item.event_time || '';
          let time = '00:00';
          let displayTime = '';
          if (/^\d+$/.test(rawTime)) {
            const seconds = parseInt(rawTime, 10);
            const date = new Date();
            date.setHours(0, 0, 0, 0);
            date.setSeconds(seconds);
            displayTime = date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', hour12: true });
            time = displayTime;
          } else if (/^\d{1,2}:\d{2}$/.test(rawTime)) {
            const [h, m] = rawTime.split(':');
            const date = new Date();
            date.setHours(Number(h), Number(m), 0, 0);
            displayTime = date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', hour12: true });
            time = displayTime;
          } else if (/^\d{1,2}:\d{2}:\d{2}$/.test(rawTime)) {
            const [h, m] = rawTime.split(':');
            const date = new Date();
            date.setHours(Number(h), Number(m), 0, 0);
            displayTime = date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', hour12: true });
            time = displayTime;
          } else if (rawTime) {
            time = rawTime;
          }
          return {
            id: item.id?.toString() ?? Math.random().toString(),
            child_id: item.child_id ?? currentChild?.id,
            title: item.title || item.event_type || '',
            date: item.event_date || '',
            time,
            doctor: item.doctor || '',
            location: item.location || '',
            notes: item.description || '',
          };
        });
        setAppointments(fetchedAppointments);
        setError('');
      } catch (err) {
        setError('Network error: Could not reach the server');
        setAppointments([]);
      }
    };
    fetchAppointments();
  }, [currentChild]);

  // Fetch health metrics from backend
  useEffect(() => {
    const fetchHealthMetrics = async () => {
      const token = localStorage.getItem('token');
      if (!token) {
        setError('Please log in to fetch health metrics');
        setHealthMetrics([]);
        return;
      }
      try {
        const response = await fetch('http://localhost:5000/api/trackers/today', {
          method: 'GET',
          headers: {
            'Authorization': `Bearer ${token}`,
          },
        });
        if (!response.ok) {
          const data = await response.json();
          setError(data.error || `HTTP error: ${response.status}`);
          setHealthMetrics([]);
          return;
        }
        const data = await response.json();
        const metrics: HealthMetric[] = [];
        if (data.water_intake !== undefined) {
          metrics.push({
            id: 'water',
            type: 'water',
            value: data.water_intake,
            unit: 'L',
            date: new Date().toISOString(),
          });
        }
        if (data.sleep_hours !== undefined) {
          metrics.push({
            id: 'sleep',
            type: 'sleep',
            value: data.sleep_hours,
            unit: 'hours',
            date: new Date().toISOString(),
          });
        }
        if (data.steps !== undefined) {
          metrics.push({
            id: 'steps',
            type: 'steps',
            value: data.steps,
            unit: 'steps',
            date: new Date().toISOString(),
          });
        }
        setHealthMetrics(metrics);
        setError('');
      } catch (err) {
        setError('Network error: Could not reach the server');
        setHealthMetrics([]);
      }
    };
    fetchHealthMetrics();
  }, [currentChild]);

  // Helper to build HealthMetric
  const buildMetric = (type: 'water' | 'sleep' | 'steps', value: number): HealthMetric => {
    let unit = '';
    if (type === 'water') unit = 'L';
    if (type === 'sleep') unit = 'hours';
    if (type === 'steps') unit = 'steps';
    return {
      id: type,
      type,
      value,
      unit,
      date: new Date().toISOString(),
      child_id: currentChild?.id,
    };
  };

  // Add or update health metric and sync with backend
  const addHealthMetric = async (metric: Omit<HealthMetric, 'id'>) => {
    const token = localStorage.getItem('token');
    if (!token) {
      setError('Please log in to add health metrics');
      return;
    }
    let endpoint = '';
    let body: any = {};
    if (metric.type === 'water') {
      endpoint = '/api/trackers/water';
      body = { water_intake: metric.value };
    } else if (metric.type === 'sleep') {
      endpoint = '/api/trackers/sleep';
      body = { sleep_hours: metric.value };
    } else if (metric.type === 'steps') {
      endpoint = '/api/trackers/steps';
      body = { steps: metric.value };
    } else {
      const newMetric = { ...metric, id: Math.random().toString(), child_id: currentChild?.id };
      setHealthMetrics(prev => [newMetric, ...prev]);
      return;
    }
    try {
      const response = await fetch(`http://localhost:5000${endpoint}`, {
        method: 'PATCH',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(body),
      });
      if (response.ok) {
        const res = await fetch('http://localhost:5000/api/trackers/today', {
          method: 'GET',
          headers: { 'Authorization': `Bearer ${token}` },
        });
        if (res.ok) {
          const data = await res.json();
          const metrics: HealthMetric[] = [];
          if (data.water !== undefined) metrics.push({ ...buildMetric('water', data.water) });
          if (data.sleep !== undefined) metrics.push({ ...buildMetric('sleep', data.sleep) });
          if (data.steps !== undefined) metrics.push({ ...buildMetric('steps', data.steps) });
          setHealthMetrics(metrics);
        }
        setError('');
      } else {
        const data = await response.json();
        setError(data.error || 'Failed to update health metric');
      }
    } catch (err) {
      setError('Network error: Could not reach the server');
    }
  };

  // Update health metric (same as add, but signature matches context)
  const updateHealthMetric = async (id: string, updates: Partial<HealthMetric>) => {
    if (!['water', 'sleep', 'steps'].includes(id)) return;
    await addHealthMetric({
      type: id as 'water' | 'sleep' | 'steps',
      value: updates.value ?? 0,
      unit: '',
      date: new Date().toISOString(),
      child_id: currentChild?.id,
    });
  };

  // Delete health metric (local only, as backend doesn't support deletion)
  const deleteHealthMetric = (id: string) => {
    setHealthMetrics(prev => prev.filter(metric => metric.id !== id));
  };

  // Add vaccination and sync with backend
  const addVaccination = async (vaccination: Omit<Vaccination, 'id'>) => {
    const token = localStorage.getItem('token');
    if (!token) {
      setError('Please log in to add vaccinations');
      return;
    }
    try {
      const response = await fetch('http://localhost:5000/api/vaccinations', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          name: vaccination.name,
          date: vaccination.date,
          nextDue: vaccination.nextDue || null,
          notes: vaccination.notes || null
        })
      });
      const data = await response.json();
      if (response.ok) {
        const newVaccination = {
          ...vaccination,
          id: data.vaccination_id.toString(),
          child_id: currentChild?.id
        };
        setVaccinations(prev => [newVaccination, ...prev]);
        setError('');
      } else {
        setError(data.error || 'Failed to add vaccination');
      }
    } catch (err) {
      setError('Network error: Could not reach the server');
    }
  };

  // Update vaccination (local only, as backend update not implemented)
  const updateVaccination = (id: string, updates: Partial<Vaccination>) => {
    setVaccinations(prev => prev.map(vaccination =>
      vaccination.id === id ? { ...vaccination, ...updates } : vaccination
    ));
  };

  // Delete vaccination and sync with backend
  const deleteVaccination = async (id: string) => {
    const token = localStorage.getItem('token');
    if (!token) {
      setError('Please log in to delete vaccinations');
      return;
    }
    try {
      const response = await fetch(`http://localhost:5000/api/vaccinations/${id}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });
      const data = await response.json();
      if (response.ok) {
        setVaccinations(prev => prev.filter(vaccination => vaccination.id !== id));
        setError('');
      } else {
        setError(data.error || 'Failed to delete vaccination');
      }
    } catch (err) {
      setError('Network error: Could not reach the server');
    }
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

  const deleteAppointment = async (id: string) => {
    const token = localStorage.getItem('token');
    if (!token) {
      setError('Please log in to delete appointments');
      return;
    }
    try {
      const response = await fetch(`http://localhost:5000/api/calendar-events/${id}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      });
      if (response.ok) {
        setAppointments(prev => prev.filter(appointment => appointment.id !== id));
        setError('');
      } else {
        const data = await response.json();
        setError(data.error || 'Failed to delete appointment');
      }
    } catch (err) {
      setError('Network error: Could not reach the server');
    }
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

  const deleteMemory = async (id: string) => {
    const token = localStorage.getItem('token');
    if (!token) {
      setError('Please log in to delete memories');
      return;
    }
    try {
      const response = await fetch(`http://localhost:5000/api/user-media/${id}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      });
      const data = await response.json();
      if (response.ok) {
        setMemories(prev => prev.filter(memory => memory.id !== id));
        setError('');
      } else {
        setError(data.error || 'Failed to delete memory');
      }
    } catch (err) {
      console.error('Error deleting memory:', err);
      setError('Network error: Could not reach the server');
    }
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
        healthMetrics,
        vaccinations,
        activities,
        appointments,
        memories,
        setMemories,
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