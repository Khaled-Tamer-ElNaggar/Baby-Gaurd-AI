import React, { useState, useEffect } from 'react';
import { FileText, Plus, X, Clock, Calendar, AlertTriangle, ChevronDown, ChevronUp } from 'lucide-react';
import { format } from 'date-fns';

interface HealthRecord {
  id: string;
  type: 'prescription' | 'medication' | 'record';
  title: string;
  date: string;
  time?: string;
  notes?: string;
  duration?: string;
  dosage?: string;
  priority?: 'low' | 'medium' | 'high';
}

interface ConfirmDialogProps {
  isOpen: boolean;
  message: string;
  onConfirm: () => void;
  onCancel: () => void;
}

const ConfirmDialog: React.FC<ConfirmDialogProps> = ({ isOpen, message, onConfirm, onCancel }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div 
        className="bg-white dark:bg-gray-800 rounded-xl w-full max-w-sm p-6 transform transition-all duration-200 ease-out scale-100 opacity-100"
      >
        <h3 className="text-lg font-medium text-violet-900 dark:text-violet-200 mb-4">
          Confirm Deletion
        </h3>
        <p className="text-gray-600 dark:text-gray-400 mb-6">
          {message}
        </p>
        <div className="flex justify-end space-x-3">
          <button
            onClick={onCancel}
            className="px-4 py-2 text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors"
          >
            Cancel
          </button>
          <button
            onClick={onConfirm}
            className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors"
          >
            Delete
          </button>
        </div>
      </div>
    </div>
  );
};

const InfantHealth = () => {
  const [showAddModal, setShowAddModal] = useState(false);
  const [showHistory, setShowHistory] = useState(false);
  const [records, setRecords] = useState<HealthRecord[]>([]);
  const [newRecord, setNewRecord] = useState<Partial<HealthRecord>>({
    type: 'Vaccination',
    title: '',
    date: new Date().toISOString().split('T')[0],
    priority: 'medium'
  });
  const [confirmDialog, setConfirmDialog] = useState<{
    isOpen: boolean;
    recordId?: string;
    message: string;
  }>({
    isOpen: false,
    message: ''
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Fetch health records on component mount
  useEffect(() => {
    const fetchRecords = async () => {
      setLoading(true);
      setError(null);
      try {
        const token = localStorage.getItem('token'); // Assuming token is stored in localStorage
        const response = await fetch('http://localhost:5000/api/health_records', {
          method: 'GET',
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json'
          }
        });
        const data = await response.json();
        if (response.ok) {
          setRecords(data.records);
        } else {
          setError(data.error || 'Failed to fetch health records');
        }
      } catch (err) {
        setError('An error occurred while fetching records');
      } finally {
        setLoading(false);
      }
    };
    fetchRecords();
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    try {
      const token = localStorage.getItem('token');
      const response = await fetch('http://localhost:5000/api/health_records', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          record_type: newRecord.type,
          title: newRecord.title,
          date: newRecord.date,
          time: newRecord.time,
          dosage: newRecord.dosage,
          priority: newRecord.priority,
          notes: newRecord.notes
        })
      });
      const data = await response.json();
      if (response.ok) {
        setRecords(prev => [{ id: data.record_id.toString(), ...newRecord } as HealthRecord, ...prev]);
        setShowAddModal(false);
        setNewRecord({
          type: 'medication',
          title: '',
          date: new Date().toISOString().split('T')[0],
          priority: 'medium'
        });
      } else {
        setError(data.error || 'Failed to add health record');
      }
    } catch (err) {
      setError('An error occurred while adding the record');
    } finally {
      setLoading(false);
    }
  };

  const initiateDelete = (id: string) => {
    setConfirmDialog({
      isOpen: true,
      recordId: id,
      message: 'Are you sure you want to delete this health record? This action cannot be undone.'
    });
  };

  const deleteRecord = async () => {
  if (confirmDialog.recordId) {
    setLoading(true);
    setError(null);
    try {
      const token = localStorage.getItem('token');
      const response = await fetch(`http://localhost:5000/api/health_records/${confirmDialog.recordId}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });
      const data = await response.json();
      if (response.ok) {
        setRecords(prev => prev.filter(record => record.id !== confirmDialog.recordId));
      } else {
        setError(data.error || 'Failed to delete health record');
      }
    } catch (err) {
      setError('An unexpected error occurred while deleting the record');
    } finally {
      setLoading(false);
      setConfirmDialog({ isOpen: false, message: '' });
    }
  }
};

  const sortedRecords = [...records].sort((a, b) => 
    new Date(b.date).getTime() - new Date(a.date).getTime()
  );

  const recentRecords = sortedRecords.slice(0, 2);
  const olderRecords = sortedRecords.slice(2);

  return (
    <>
      <div className="bg-white dark:bg-gray-800 rounded-xl p-4 shadow-sm">
        <h2 className="text-lg font-medium text-violet-900 dark:text-violet-200 mb-3">
          Infant Health Records
        </h2>
        
        {error && (
          <div className="flex items-center gap-2 p-3 bg-red-100 text-red-600 rounded-lg mb-4">
            <AlertTriangle className="w-5 h-5" />
            <span>{error}</span>
          </div>
        )}

        {loading && (
          <div className="text-center text-gray-600 dark:text-gray-400 py-4">
            Loading...
          </div>
        )}

        <div className="flex justify-center mb-4">
          <button
            onClick={() => setShowAddModal(true)}
            className="flex items-center justify-center gap-2 p-3 bg-violet-50 dark:bg-gray-700 rounded-xl text-violet-600 dark:text-violet-400 hover:bg-violet-100 dark:hover:bg-gray-600"
            disabled={loading}
          >
            <Plus className="w-5 h-5" />
            <span>Add New Record</span>
          </button>
        </div>

        {!loading && records.length > 0 ? (
          <div className="space-y-3">
            {/* Recent Records */}
            {recentRecords.map(record => (
              <RecordCard
                key={record.id}
                record={record}
                onDelete={() => initiateDelete(record.id)}
              />
            ))}

            {/* Older Records (Expandable) */}
            {olderRecords.length > 0 && showHistory && (
              <div className="mt-4 pt-4 border-t dark:border-gray-700">
                <h3 className="text-sm font-medium text-gray-600 dark:text-gray-400 mb-3">
                  Older Records
                </h3>
                <div className="space-y-3">
                  {olderRecords.map(record => (
                    <RecordCard
                      key={record.id}
                      record={record}
                      onDelete={() => initiateDelete(record.id)}
                    />
                  ))}
                </div>
              </div>
            )}
          </div>
        ) : !loading && (
          <p className="text-center text-gray-500 dark:text-gray-400 py-4">
            No health records added yet
          </p>
        )}
      </div>

      {/* Add Record Modal */}
      {showAddModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white dark:bg-gray-800 rounded-xl w-full max-w-md">
            <div className="flex justify-between items-center p-4 border-b dark:border-gray-700">
              <h3 className="text-lg font-medium text-violet-900 dark:text-violet-200">
                Add Health Record
              </h3>
              <button
                onClick={() => setShowAddModal(false)}
                className="text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
            
            <form onSubmit={handleSubmit} className="p-4 space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Record Type
                </label>
                <select
                  value={newRecord.type}
                  onChange={(e) => setNewRecord({ ...newRecord, type: e.target.value as HealthRecord['type'] })}
                  className="w-full p-2 border rounded-lg dark:bg-gray-700 dark:border-gray-600"
                  required
                  disabled={loading}
                >
                  <option value="Vaccination">Vaccination</option>
                  <option value="Checkup">Checkup</option>
                  <option value="Growth">Growth</option>
                  <option value="Medical">Medical</option>
                  <option value="Milestone">Milestone</option>
                  <option value="Allergy">Allergy</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Title
                </label>
                <input
                  type="text"
                  value={newRecord.title}
                  onChange={(e) => setNewRecord({ ...newRecord, title: e.target.value })}
                  className="w-full p-2 border rounded-lg dark:bg-gray-700 dark:border-gray-600"
                  required
                  disabled={loading}
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                    Date
                  </label>
                  <input
                    type="date"
                    value={newRecord.date}
                    onChange={(e) => setNewRecord({ ...newRecord, date: e.target.value })}
                    className="w-full p-2 border rounded-lg dark:bg-gray-700 dark:border-gray-600"
                    required
                    disabled={loading}
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                    Time
                  </label>
                  <input
                    type="time"
                    value={newRecord.time || ""}
                    onChange={(e) => setNewRecord({ ...newRecord, time: e.target.value })}
                    className="w-full p-2 border rounded-lg dark:bg-gray-700 dark:border-gray-600"
                    disabled={loading}
                  />
                </div>
              </div>

              {(newRecord.type === 'Medical' || newRecord.type === 'Vaccination') && (
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                    Dosage
                  </label>
                  <input
                    type="text"
                    value={newRecord.dosage || ""}
                    onChange={(e) => setNewRecord({ ...newRecord, dosage: e.target.value })}
                    className="w-full p-2 border rounded-lg dark:bg-gray-700 dark:border-gray-600"
                    placeholder="e.g., 5ml twice daily"
                    disabled={loading}
                  />
                </div>
              )}

              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Priority
                </label>
                <select
                  value={newRecord.priority}
                  onChange={(e) => setNewRecord({ ...newRecord, priority: e.target.value as HealthRecord['priority'] })}
                  className="w-full p-2 border rounded-lg dark:bg-gray-700 dark:border-gray-600"
                  disabled={loading}
                >
                  <option value="low">Low</option>
                  <option value="medium">Medium</option>
                  <option value="high">High</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Notes
                </label>
                <textarea
                  value={newRecord.notes || ""}
                  onChange={(e) => setNewRecord({ ...newRecord, notes: e.target.value })}
                  className="w-full p-2 border rounded-lg dark:bg-gray-700 dark:border-gray-600"
                  rows={3}
                  placeholder="Add any additional information..."
                  disabled={loading}
                />
              </div>

              <button
                type="submit"
                className="w-full py-2 bg-violet-600 text-white rounded-lg hover:bg-violet-700 disabled:bg-violet-400"
                disabled={loading}
              >
                {loading ? 'Adding...' : 'Add Record'}
              </button>
            </form>
          </div>
        </div>
      )}

      {/* Confirmation Dialog */}
      <ConfirmDialog
        isOpen={confirmDialog.isOpen}
        message={confirmDialog.message}
        onConfirm={deleteRecord}
        onCancel={() => setConfirmDialog({ isOpen: false, message: '' })}
      />
    </>
  );
};

const RecordCard = ({ record, onDelete }) => (
  <div className="bg-violet-50 dark:bg-gray-700 p-3 rounded-xl relative animate-fade-in">
    <div className="flex justify-between items-start">
      <div>
        <h3 className="font-medium text-violet-900 dark:text-violet-200">
          {record.title}
        </h3>
        <div className="flex items-center gap-2 mt-1">
          <span className="text-sm text-gray-600 dark:text-gray-400">
            {record.type.charAt(0).toUpperCase() + record.type.slice(1)}
          </span>
          {record.priority && (
            <span className={`text-xs px-2 py-0.5 rounded-full ${
              record.priority === 'high' 
                ? 'bg-red-100 text-red-600 dark:bg-red-900/20 dark:text-red-400'
                : record.priority === 'medium'
                ? 'bg-yellow-100 text-yellow-600 dark:bg-yellow-900/20 dark:text-yellow-400'
                : 'bg-green-100 text-green-600 dark:bg-green-900/20 dark:text-green-400'
            }`}>
              {record.priority.charAt(0).toUpperCase() + record.priority.slice(1)} Priority
            </span>
          )}
        </div>
        <div className="flex items-center gap-2 mt-1 text-sm text-gray-600 dark:text-gray-400">
          <Calendar className="w-4 h-4" />
          <span>{format(new Date(record.date), 'MMM d, yyyy')}</span>
          {record.time && (
            <>
              <Clock className="w-4 h-4 ml-2" />
              <span>{record.time}</span>
            </>
          )}
        </div>
        {record.dosage && (
          <p className="text-sm text-violet-600 dark:text-violet-400 mt-1">
            Dosage: {record.dosage}
          </p>
        )}
        {record.notes && (
          <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
            {record.notes}
          </p>
        )}
      </div>
      <button
        onClick={onDelete}
        className="text-red-500 hover:text-red-700 dark:text-red-400 dark:hover:text-red-300"
      >
        <X className="w-5 h-5" />
      </button>
    </div>
  </div>
);

export default InfantHealth;