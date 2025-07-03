import React, { useState } from 'react';
import { Plus, Eye, X, Calendar, FileText } from 'lucide-react';
import { useData } from '../../../contexts/DataContext';

const VaccinationHistory = () => {
  const { vaccinations, addVaccination, deleteVaccination } = useData();
  const [showModal, setShowModal] = useState(false);
  const [showHistory, setShowHistory] = useState(false);
  const [newVaccination, setNewVaccination] = useState({
    name: '',
    date: '',
    nextDue: '',
    notes: ''
  });
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  // Helper function to format dates
  const formatDate = (dateStr: string): string => {
    try {
      const date = new Date(dateStr);
      if (isNaN(date.getTime())) throw new Error('Invalid date');
      return date.toLocaleDateString('en-US', {
        year: 'numeric',
        month: '2-digit',
        day: '2-digit'
      });
    } catch {
      return 'Invalid date';
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    const token = localStorage.getItem('token');
    if (!token) {
      setError('No authentication token found. Please log in.');
      setLoading(false);
      return;
    }

    try {
      await addVaccination({
        name: newVaccination.name,
        date: newVaccination.date,
        nextDue: newVaccination.nextDue || undefined,
        notes: newVaccination.notes || undefined
      });
      setNewVaccination({ name: '', date: '', nextDue: '', notes: '' });
      setShowModal(false);
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Unknown error';
      setError(`An error occurred while adding the vaccination: ${errorMessage}`);
      console.error('Add Vaccination Error:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (vaccinationId: string) => {
    if (!confirm('Are you sure you want to delete this vaccination record?')) return;
    setLoading(true);
    setError(null);
    try {
      await deleteVaccination(vaccinationId);
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Unknown error';
      setError(`An error occurred while deleting the vaccination: ${errorMessage}`);
    } finally {
      setLoading(false);
    }
  };

  const getNextVaccination = () => {
    const future = (vaccinations || [])
      .filter(v => v.nextDue && new Date(v.nextDue) > new Date())
      .sort((a, b) => new Date(a.nextDue!).getTime() - new Date(b.nextDue!).getTime())[0];

    if (future) {
      const days = Math.ceil(
        (new Date(future.nextDue!).getTime() - new Date().getTime()) / (1000 * 60 * 60 * 24)
      );
      return `${future.name} due in ${days} day${days === 1 ? '' : 's'} on ${formatDate(future.nextDue!)}`;
    }
    return 'No upcoming vaccinations';
  };

  console.log('Vaccinations to render:', vaccinations);
  return (
    <>
      <div className="bg-white dark:bg-gray-800 rounded-xl p-4 shadow-sm">
        <h2 className="text-lg font-medium text-violet-900 dark:text-violet-200 mb-3">
          Vaccination & Medical History
        </h2>
        <div className="space-y-3">
          <div className="grid grid-cols-2 gap-3">
            <button
              onClick={() => setShowHistory(true)}
              className="flex items-center justify-center gap-2 p-3 bg-violet-50 dark:bg-gray-700 rounded-xl text-violet-600 dark:text-violet-400 hover:bg-violet-100 dark:hover:bg-gray-600"
              disabled={loading}
            >
              <Eye className="w-5 h-5" />
              <span>View vaccinations</span>
            </button>
            <button
              onClick={() => setShowModal(true)}
              className="flex items-center justify-center gap-2 p-3 bg-violet-50 dark:bg-gray-700 rounded-xl text-violet-600 dark:text-violet-400 hover:bg-violet-100 dark:hover:bg-gray-600"
              disabled={loading}
            >
              <Plus className="w-5 h-5" />
              <span>Add Vaccination</span>
            </button>
          </div>
          <div className="p-3 bg-violet-50 dark:bg-gray-700 rounded-xl text-center">
            <span className="text-violet-600 dark:text-violet-400">{getNextVaccination()}</span>
          </div>
        </div>
      </div>

      {/* Add Vaccination Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white dark:bg-gray-800 rounded-xl w-full max-w-md">
            <div className="flex justify-between items-center p-4 border-b dark:border-gray-700">
              <h3 className="text-lg font-medium text-violet-900 dark:text-violet-200">
                Add New Vaccination
              </h3>
              <button
                onClick={() => setShowModal(false)}
                className="text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
            <form onSubmit={handleSubmit} className="p-4 space-y-4">
              {error && (
                <div className="text-red-600 mb-4">{error}</div>
              )}
              {loading && (
                <div className="text-center text-gray-600 dark:text-gray-400 mb-4">Loading...</div>
              )}
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Vaccination Name
                </label>
                <input
                  type="text"
                  value={newVaccination.name}
                  onChange={(e) => setNewVaccination({ ...newVaccination, name: e.target.value })}
                  className="w-full p-2 border rounded-lg dark:bg-gray-700 dark:border-gray-600"
                  required
                  disabled={loading}
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Date Received
                </label>
                <input
                  type="date"
                  value={newVaccination.date}
                  onChange={(e) => setNewVaccination({ ...newVaccination, date: e.target.value })}
                  className="w-full p-2 border rounded-lg dark:bg-gray-700 dark:border-gray-600"
                  required
                  disabled={loading}
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Next Due Date
                </label>
                <input
                  type="date"
                  value={newVaccination.nextDue}
                  onChange={(e) => setNewVaccination({ ...newVaccination, nextDue: e.target.value })}
                  className="w-full p-2 border rounded-lg dark:bg-gray-700 dark:border-gray-600"
                  disabled={loading}
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Notes
                </label>
                <textarea
                  value={newVaccination.notes}
                  onChange={(e) => setNewVaccination({ ...newVaccination, notes: e.target.value })}
                  className="w-full p-2 border rounded-lg dark:bg-gray-700 dark:border-gray-600"
                  rows={3}
                  disabled={loading}
                />
              </div>
              <button
                type="submit"
                className="w-full py-2 bg-violet-600 text-white rounded-lg hover:bg-violet-700 disabled:bg-violet-400"
                disabled={loading}
              >
                {loading ? 'Adding...' : 'Add Vaccination'}
              </button>
            </form>
          </div>
        </div>
      )}

      {/* View History Modal */}
      {showHistory && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white dark:bg-gray-800 rounded-xl w-full max-w-md">
            <div className="flex justify-between items-center p-4 border-b dark:border-gray-700">
              <h3 className="text-lg font-medium text-violet-900 dark:text-violet-200">
                Vaccination History
              </h3>
              <button
                onClick={() => setShowHistory(false)}
                className="text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
            <div className="p-4 max-h-96 overflow-y-auto">
              {loading ? (
                <p className="text-center text-gray-600 dark:text-gray-400">Loading...</p>
              ) : (vaccinations || []).length === 0 ? (
                <p className="text-center text-gray-500 dark:text-gray-400">
                  No vaccinations recorded yet
                </p>
              ) : (
                <div className="space-y-4">
                  {(vaccinations || []).map((vaccination) => (
                    <div
                      key={vaccination.id}
                      className="bg-violet-50 dark:bg-gray-700 p-4 rounded-lg"
                    >
                      <div className="flex justify-between items-start">
                        <div>
                          <h4 className="font-medium text-violet-900 dark:text-violet-200">
                            {vaccination.name}
                          </h4>
                          <div className="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-400 mt-1">
                            <Calendar className="w-4 h-4" />
                            <span>{formatDate(vaccination.date)}</span>
                          </div>
                          {vaccination.nextDue && (
                            <div className="flex items-center gap-2 text-sm text-violet-600 dark:text-violet-400 mt-1">
                              <Calendar className="w-4 h-4" />
                              <span>Next: {formatDate(vaccination.nextDue)}</span>
                            </div>
                          )}
                          {vaccination.notes && (
                            <div className="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-400 mt-1">
                              <FileText className="w-4 h-4" />
                              <span>{vaccination.notes}</span>
                            </div>
                          )}
                        </div>
                        <button
                          onClick={() => handleDelete(vaccination.id)}
                          className="text-red-500 hover:text-red-700 dark:text-red-400 dark:hover:text-red-300"
                        >
                          <X className="w-5 h-5" />
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
              {error && (
                <div className="text-red-600 text-center mt-4">{error}</div>
              )}
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default VaccinationHistory;