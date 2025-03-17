import React, { useState, useRef } from 'react';
import { X, Upload, Camera } from 'lucide-react';

interface AddMemoryModalProps {
  isOpen: boolean;
  onClose: () => void;
  onAdd: (memory: { photo: File, caption: string, date: string }) => void;
}

const AddMemoryModal: React.FC<AddMemoryModalProps> = ({ isOpen, onClose, onAdd }) => {
  const [caption, setCaption] = useState('');
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [preview, setPreview] = useState<string>('');
  const fileInputRef = useRef<HTMLInputElement>(null);

  if (!isOpen) return null;

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setSelectedFile(file);
      const reader = new FileReader();
      reader.onloadend = () => {
        setPreview(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (selectedFile) {
      onAdd({
        photo: selectedFile,
        caption,
        date: new Date().toISOString(),
      });
      setCaption('');
      setSelectedFile(null);
      setPreview('');
      onClose();
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-white dark:bg-gray-800 rounded-2xl w-full max-w-md">
        <div className="p-4 border-b border-gray-100 dark:border-gray-700 flex justify-between items-center">
          <h2 className="text-lg font-medium text-violet-900 dark:text-violet-200">Add New Memory</h2>
          <button
            onClick={onClose}
            className="p-2 hover:bg-violet-100 dark:hover:bg-gray-700 rounded-full text-violet-600 dark:text-violet-400"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-4 space-y-4">
          <div className="space-y-2">
            {preview ? (
              <div className="relative aspect-square rounded-xl overflow-hidden">
                <img
                  src={preview}
                  alt="Preview"
                  className="w-full h-full object-cover"
                />
                <button
                  type="button"
                  onClick={() => {
                    setSelectedFile(null);
                    setPreview('');
                  }}
                  className="absolute top-2 right-2 p-2 bg-white dark:bg-gray-800 rounded-full shadow-lg"
                >
                  <X className="w-4 h-4 text-violet-600 dark:text-violet-400" />
                </button>
              </div>
            ) : (
              <div
                onClick={() => fileInputRef.current?.click()}
                className="aspect-square rounded-xl border-2 border-dashed border-violet-200 dark:border-violet-400/50 flex flex-col items-center justify-center space-y-2 cursor-pointer hover:border-violet-400 dark:hover:border-violet-400 transition-colors"
              >
                <div className="p-4 bg-violet-100 dark:bg-violet-400/20 rounded-full">
                  <Camera className="w-8 h-8 text-violet-600 dark:text-violet-400" />
                </div>
                <p className="text-sm text-violet-600 dark:text-violet-400 font-medium">Add Photo</p>
                <p className="text-xs text-gray-400 dark:text-gray-500">Click to upload</p>
              </div>
            )}
            <input
              ref={fileInputRef}
              type="file"
              accept="image/*"
              onChange={handleFileSelect}
              className="hidden"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              Caption this memory
            </label>
            <textarea
              value={caption}
              onChange={(e) => setCaption(e.target.value)}
              className="w-full p-3 border border-gray-200 dark:border-gray-700 rounded-xl focus:outline-none focus:ring-2 focus:ring-violet-200 dark:focus:ring-violet-400/20 resize-none bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100"
              rows={3}
              placeholder="Write something about this moment..."
            />
          </div>

          <button
            type="submit"
            disabled={!selectedFile}
            className="w-full py-3 bg-violet-600 text-white rounded-xl font-medium hover:bg-violet-700 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            Save Memory
          </button>
        </form>
      </div>
    </div>
  );
};
export default AddMemoryModal;