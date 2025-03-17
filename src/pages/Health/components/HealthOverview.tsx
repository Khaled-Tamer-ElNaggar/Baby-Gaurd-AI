import React, { useState } from 'react';
import { Moon, Droplets, FootprintsIcon, Plus, Edit2 } from 'lucide-react';
import { useData } from '../../../contexts/DataContext';

const HealthOverview = () => {
  const { healthMetrics, addHealthMetric, updateHealthMetric } = useData();
  const [isEditing, setIsEditing] = useState<string | null>(null);
  const [editValue, setEditValue] = useState<string>('');

  const getLatestMetric = (type: 'sleep' | 'water' | 'steps') => {
    return healthMetrics
      .filter(metric => metric.type === type)
      .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())[0];
  };

  const handleAdd = (type: 'sleep' | 'water' | 'steps') => {
    let value = 0;
    let unit = '';

    switch (type) {
      case 'sleep':
        value = 8;
        unit = 'hours';
        break;
      case 'water':
        value = 2;
        unit = 'L';
        break;
      case 'steps':
        value = 5000;
        unit = 'steps';
        break;
    }

    addHealthMetric({
      type,
      value,
      unit,
      date: new Date().toISOString()
    });
  };

  const handleUpdate = (id: string, type: 'sleep' | 'water' | 'steps') => {
    let value = parseFloat(editValue);
    if (isNaN(value)) return;

    // Validate ranges
    switch (type) {
      case 'sleep':
        value = Math.min(Math.max(value, 0), 24);
        break;
      case 'water':
        value = Math.min(Math.max(value, 0), 10);
        break;
      case 'steps':
        value = Math.min(Math.max(value, 0), 100000);
        break;
    }

    updateHealthMetric(id, { value });
    setIsEditing(null);
  };

  return (
    <div className="bg-white dark:bg-gray-800 rounded-xl p-4 shadow-sm">
      <h2 className="text-lg font-medium text-violet-900 dark:text-violet-200 mb-3">Health Overview</h2>
      <div className="grid grid-cols-3 gap-3">
        <MetricCard
          icon={<Moon />}
          label="Sleep"
          metric={getLatestMetric('sleep')}
          isEditing={isEditing === 'sleep'}
          onEdit={() => {
            const metric = getLatestMetric('sleep');
            if (metric) {
              setIsEditing('sleep');
              setEditValue(metric.value.toString());
            }
          }}
          onAdd={() => handleAdd('sleep')}
          onUpdate={() => {
            const metric = getLatestMetric('sleep');
            if (metric) handleUpdate(metric.id, 'sleep');
          }}
          editValue={editValue}
          onEditChange={setEditValue}
        />
        <MetricCard
          icon={<Droplets />}
          label="Water"
          metric={getLatestMetric('water')}
          isEditing={isEditing === 'water'}
          onEdit={() => {
            const metric = getLatestMetric('water');
            if (metric) {
              setIsEditing('water');
              setEditValue(metric.value.toString());
            }
          }}
          onAdd={() => handleAdd('water')}
          onUpdate={() => {
            const metric = getLatestMetric('water');
            if (metric) handleUpdate(metric.id, 'water');
          }}
          editValue={editValue}
          onEditChange={setEditValue}
        />
        <MetricCard
          icon={<FootprintsIcon />}
          label="Steps"
          metric={getLatestMetric('steps')}
          isEditing={isEditing === 'steps'}
          onEdit={() => {
            const metric = getLatestMetric('steps');
            if (metric) {
              setIsEditing('steps');
              setEditValue(metric.value.toString());
            }
          }}
          onAdd={() => handleAdd('steps')}
          onUpdate={() => {
            const metric = getLatestMetric('steps');
            if (metric) handleUpdate(metric.id, 'steps');
          }}
          editValue={editValue}
          onEditChange={setEditValue}
        />
      </div>
    </div>
  );
};

const MetricCard = ({
  icon,
  label,
  metric,
  isEditing,
  onEdit,
  onAdd,
  onUpdate,
  editValue,
  onEditChange
}) => (
  <div className="bg-violet-50 dark:bg-gray-700 p-3 rounded-xl flex flex-col items-center relative">
    <div className="text-violet-600 dark:text-violet-400 mb-1">{icon}</div>
    {metric ? (
      <>
        {isEditing ? (
          <div className="flex items-center gap-2">
            <input
              type="number"
              value={editValue}
              onChange={(e) => onEditChange(e.target.value)}
              className="w-20 p-1 text-center rounded border border-violet-300 dark:border-violet-500 bg-white dark:bg-gray-600 text-violet-900 dark:text-violet-100"
              onKeyDown={(e) => {
                if (e.key === 'Enter') onUpdate();
                if (e.key === 'Escape') onEdit(null);
              }}
            />
            <span className="text-sm text-gray-600 dark:text-gray-400">{metric.unit}</span>
          </div>
        ) : (
          <span className="text-lg font-semibold text-violet-900 dark:text-violet-200">
            {metric.value} {metric.unit}
          </span>
        )}
        <button
          onClick={onEdit}
          className="absolute top-2 right-2 p-1 text-violet-600 dark:text-violet-400 hover:bg-violet-100 dark:hover:bg-gray-600 rounded-full"
        >
          <Edit2 className="w-4 h-4" />
        </button>
      </>
    ) : (
      <button
        onClick={onAdd}
        className="p-2 text-violet-600 dark:text-violet-400 hover:bg-violet-100 dark:hover:bg-gray-600 rounded-full"
      >
        <Plus className="w-5 h-5" />
      </button>
    )}
    <span className="text-sm text-gray-600 dark:text-gray-400">{label}</span>
  </div>
);

export default HealthOverview;