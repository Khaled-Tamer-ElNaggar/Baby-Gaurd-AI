import React, { useState } from 'react';
import { X } from 'lucide-react';

interface EditMemoryModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (caption: string) => void;
  initialCaption: string;
}

const EditMemoryModal: React.FC<EditMemoryModalProps> = ({
  isOpen,
  onClose,
  onSave,
  initialCaption,
}) => {
  const [caption, setCaption] = useState(initialCaption);

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSave(caption);
    onClose();
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-2xl w-full max-w-md">
        <div className="p-4 border-b border-gray-100 flex justify-between items-center">
          <h2 className="text-lg font-medium text-violet-900">Edit Memory</h2>
          <button
            onClick={onClose}
            className="p-2 hover:bg-violet-100 rounded-full text-violet-600"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-4 space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Edit caption
            </label>
            <textarea
              value={caption}
              onChange={(e) => setCaption(e.target.value)}
              className="w-full p-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-violet-200 resize-none"
              rows={3}
              placeholder="Write something about this moment..."
            />
          </div>

          <button
            type="submit"
            className="w-full py-3 bg-violet-600 text-white rounded-xl font-medium hover:bg-violet-700"
          >
            Save Changes
          </button>
        </form>
      </div>
    </div>
  );
};

export default EditMemoryModal;