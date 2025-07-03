import React, { useState, useEffect } from 'react';
import { Baby, Weight, Ruler, Edit2, Check } from 'lucide-react';
import { useData } from '../../../contexts/DataContext';

const PregnancyMilestone = () => {
  const { updateBabyMetrics, fetchBabyMetrics } = useData();
  const [isEditing, setIsEditing] = useState(false);
  const [babyData, setBabyData] = useState({
    size: '',
    weight: '',
    height: '',
    notes: '',
  });
  const [editData, setEditData] = useState({ ...babyData });
  const [error, setError] = useState<string | null>(null);

  // Fetch the latest growth record for today on component mount
  useEffect(() => {
    const loadBabyMetrics = async () => {
      try {
        const response = await fetch('http://localhost:5000/api/baby-growth', {
          method: 'GET',
          headers: {
            Authorization: `Bearer ${localStorage.getItem('token')}`,
            'Content-Type': 'application/json',
          },
        });
        const result = await response.json();
        if (response.ok && result.growth_records && result.growth_records.length > 0) {
          // Find today's record
          const today = new Date().toISOString().split('T')[0];
          const todayRecord = result.growth_records.find(
            (record: any) => record.record_date === today
          );
          if (todayRecord) {
            setBabyData({
              size: todayRecord.head_circumference || '',
              weight: todayRecord.weight || '',
              height: todayRecord.height || '',
              notes: todayRecord.notes || '',
            });
            setEditData({
              size: todayRecord.head_circumference || '',
              weight: todayRecord.weight || '',
              height: todayRecord.height || '',
              notes: todayRecord.notes || '',
            });
          } else {
            setBabyData({ size: '', weight: '', height: '', notes: '' });
            setEditData({ size: '', weight: '', height: '', notes: '' });
          }
        } else {
          setBabyData({ size: '', weight: '', height: '', notes: '' });
          setEditData({ size: '', weight: '', height: '', notes: '' });
        }
      } catch (err) {
        setError('Failed to fetch baby growth data');
        console.error('Error fetching baby metrics:', err);
      }
    };

    loadBabyMetrics();
  }, []);

  // Handle save action to update today's growth record
  const handleSave = async () => {
    try {
      // Only include fields that have changed or are non-empty
      const payload: any = {};
      if (editData.weight) payload.weight = parseFloat(editData.weight) || 0;
      if (editData.height) payload.height = parseFloat(editData.height) || 0;
      if (editData.size) payload.head_circumference = parseFloat(editData.size) || 0;
      if (editData.notes) payload.notes = editData.notes;

      if (Object.keys(payload).length === 0) {
        setError('At least one field must be provided');
        return;
      }

      const response = await fetch('http://localhost:5000/api/baby-growth', {
        method: 'PATCH',
        headers: {
          Authorization: `Bearer ${localStorage.getItem('token')}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(payload),
      });

      const result = await response.json();
      if (response.ok) {
        setBabyData({ ...editData });
        updateBabyMetrics({
          size: editData.size,
          weight: editData.weight,
          height: editData.height,
          notes: editData.notes,
        });
        setIsEditing(false);
        setError(null);
      } else {
        setError(result.error || 'Failed to update baby growth data');
      }
    } catch (err) {
      setError('Failed to update baby growth data');
      console.error('Error updating baby metrics:', err);
    }
  };

  return (
    <div className="bg-white dark:bg-gray-800 rounded-xl p-4 shadow-sm">
      <div className="flex justify-between items-center mb-3">
        <h2 className="text-lg font-medium text-violet-900 dark:text-violet-200">
          Baby Growth Tracking
        </h2>
        <button
          onClick={() => (isEditing ? handleSave() : setIsEditing(true))}
          className="p-2 text-violet-600 dark:text-violet-400 hover:bg-violet-50 dark:hover:bg-gray-700 rounded-full"
        >
          {isEditing ? <Check className="w-5 h-5" /> : <Edit2 className="w-5 h-5" />}
        </button>
      </div>
      {error && (
        <div className="mb-3 text-red-500 dark:text-red-400 text-sm">
          {error}
        </div>
      )}
      <div className="grid grid-cols-3 gap-4">
        <div className="bg-violet-50 dark:bg-gray-700 p-4 rounded-xl">
          <div className="flex items-center gap-2 mb-2">
            <Baby className="w-5 h-5 text-violet-600 dark:text-violet-400" />
            <span className="font-medium text-violet-900 dark:text-violet-200">Head Size</span>
          </div>
          {isEditing ? (
            <div className="flex items-center gap-1">
              <input
                type="number"
                value={editData.size}
                onChange={(e) => setEditData({ ...editData, size: e.target.value })}
                className="w-full p-2 bg-white dark:bg-gray-600 border border-violet-200 dark:border-gray-500 rounded-lg text-sm"
                step="0.1"
                placeholder="Enter head size"
              />
              <span className="text-sm text-gray-500 dark:text-gray-400">cm</span>
            </div>
          ) : (
            <p className="text-gray-600 dark:text-gray-300">
              {babyData.size ? `${babyData.size} cm` : 'Not set'}
            </p>
          )}
        </div>
        <div className="bg-violet-50 dark:bg-gray-700 p-4 rounded-xl">
          <div className="flex items-center gap-2 mb-2">
            <Weight className="w-5 h-5 text-violet-600 dark:text-violet-400" />
            <span className="font-medium text-violet-900 dark:text-violet-200">Weight</span>
          </div>
          {isEditing ? (
            <div className="flex items-center gap-1">
              <input
                type="number"
                value={editData.weight}
                onChange={(e) => setEditData({ ...editData, weight: e.target.value })}
                className="w-full p-2 bg-white dark:bg-gray-600 border border-violet-200 dark:border-gray-500 rounded-lg text-sm"
                step="0.1"
                placeholder="Enter weight"
              />
              <span className="text-sm text-gray-500 dark:text-gray-400">kg</span>
            </div>
          ) : (
            <p className="text-gray-600 dark:text-gray-300">
              {babyData.weight ? `${babyData.weight} kg` : 'Not set'}
            </p>
          )}
        </div>
        <div className="bg-violet-50 dark:bg-gray-700 p-4 rounded-xl">
          <div className="flex items-center gap-2 mb-2">
            <Ruler className="w-5 h-5 text-violet-600 dark:text-violet-400" />
            <span className="font-medium text-violet-900 dark:text-violet-200">Height</span>
          </div>
          {isEditing ? (
            <div className="flex items-center gap-1">
              <input
                type="number"
                value={editData.height}
                onChange={(e) => setEditData({ ...editData, height: e.target.value })}
                className="w-full p-2 bg-white dark:bg-gray-600 border border-violet-200 dark:border-gray-500 rounded-lg text-sm"
                step="0.1"
                placeholder="Enter height"
              />
              <span className="text-sm text-gray-500 dark:text-gray-400">cm</span>
            </div>
          ) : (
            <p className="text-gray-600 dark:text-gray-300">
              {babyData.height ? `${babyData.height} cm` : 'Not set'}
            </p>
          )}
        </div>
      </div>
      <div className="mt-4">
        <div className="flex items-center gap-2 mb-2">
          <span className="font-medium text-violet-900 dark:text-violet-200">Notes</span>
        </div>
        {isEditing ? (
          <textarea
            value={editData.notes}
            onChange={(e) => setEditData({ ...editData, notes: e.target.value })}
            className="w-full p-2 bg-white dark:bg-gray-600 border border-violet-200 dark:border-gray-500 rounded-lg text-sm"
            placeholder="Add any notes about the growth record"
          />
        ) : (
          <p className="text-gray-600 dark:text-gray-300">
            {babyData.notes || 'No notes available'}
          </p>
        )}
      </div>
    </div>
  );
};

export default PregnancyMilestone;