import React, { useState } from 'react';
import { Baby, Weight, Ruler, Edit2, Check } from 'lucide-react';

const PregnancyMilestone = () => {
  const [isEditing, setIsEditing] = useState(false);
  const [babyData, setBabyData] = useState({
    size: 'Size of a lemon (Week 14)',
    weight: '1.5',
    height: '25',
  });
  const [editData, setEditData] = useState({ ...babyData });

  const handleSave = () => {
    setBabyData(editData);
    setIsEditing(false);
  };

  return (
    <div className="bg-white dark:bg-gray-800 rounded-xl p-4 shadow-sm">
      <div className="flex justify-between items-center mb-3">
        <h2 className="text-lg font-medium text-violet-900 dark:text-violet-200">
          Pregnancy Milestone
        </h2>
        <button
          onClick={() => isEditing ? handleSave() : setIsEditing(true)}
          className="p-2 text-violet-600 dark:text-violet-400 hover:bg-violet-50 dark:hover:bg-gray-700 rounded-full"
        >
          {isEditing ? <Check className="w-5 h-5" /> : <Edit2 className="w-5 h-5" />}
        </button>
      </div>
      <div className="grid grid-cols-3 gap-4">
        <div className="bg-violet-50 dark:bg-gray-700 p-4 rounded-xl">
          <div className="flex items-center gap-2 mb-2">
            <Baby className="w-5 h-5 text-violet-600 dark:text-violet-400" />
            <span className="font-medium text-violet-900 dark:text-violet-200">Size</span>
          </div>
          {isEditing ? (
            <input
              type="text"
              value={editData.size}
              onChange={(e) => setEditData({ ...editData, size: e.target.value })}
              className="w-full p-2 bg-white dark:bg-gray-600 border border-violet-200 dark:border-gray-500 rounded-lg text-sm"
            />
          ) : (
            <p className="text-gray-600 dark:text-gray-300">{babyData.size}</p>
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
              />
              <span className="text-sm text-gray-500 dark:text-gray-400">kg</span>
            </div>
          ) : (
            <p className="text-gray-600 dark:text-gray-300">{babyData.weight} kg</p>
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
              />
              <span className="text-sm text-gray-500 dark:text-gray-400">cm</span>
            </div>
          ) : (
            <p className="text-gray-600 dark:text-gray-300">{babyData.height} cm</p>
          )}
        </div>
      </div>
    </div>
  );
};

export default PregnancyMilestone;