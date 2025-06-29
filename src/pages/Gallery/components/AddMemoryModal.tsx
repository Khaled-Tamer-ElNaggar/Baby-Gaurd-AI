import React, { useState, useRef } from 'react';
import { X, Camera } from 'lucide-react';
import { useData } from '../../../contexts/DataContext';
import { useUser } from '../../../contexts/UserContext';

interface AddMemoryModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const AddMemoryModal: React.FC<AddMemoryModalProps> = ({ isOpen, onClose }) => {
  const [caption, setCaption] = useState('');
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [preview, setPreview] = useState<string>('');
  const [error, setError] = useState<string>('');
  const fileInputRef = useRef<HTMLInputElement>(null);
  const { addMemory, memories, setMemories } = useData();
  const { currentChild } = useUser();

  if (!isOpen) return null;

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const validTypes = ['image/png', 'image/jpeg', 'image/gif'];
      if (!validTypes.includes(file.type)) {
        setError('Only PNG, JPEG, or GIF files are allowed');
        return;
      }
      if (file.size > 5 * 1024 * 1024) {
        setError('File size exceeds 5MB limit');
        return;
      }
      setError('');
      setSelectedFile(file);
      const reader = new FileReader();
      reader.onloadend = () => {
        setPreview(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedFile) {
      setError('Please select an image');
      return;
    }

    const token = localStorage.getItem('token');
    if (!token) {
      setError('Please log in to upload images');
      return;
    }

    const formData = new FormData();
    formData.append('file', selectedFile);
    formData.append('description', caption);
    if (currentChild?.id) {
      formData.append('child_id', currentChild.id);
    }

    try {
      const response = await fetch('http://localhost:5000/api/user-media', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
        },
        body: formData,
      });

      const data = await response.json();
      if (response.ok) {
        console.log('Image uploaded successfully:', data);
        // Refetch memories to sync with backend
        const fetchResponse = await fetch('http://localhost:5000/api/user-media', {
          method: 'GET',
          headers: {
            'Authorization': `Bearer ${token}`,
          },
        });
        const fetchData = await fetchResponse.json();
        if (fetchResponse.ok) {
          const fetchedMemories: Memory[] = fetchData.images.map((item: any) => ({
            id: item.id.toString(),
            child_id: item.child_id || currentChild?.id,
            photo: item.image_url.startsWith('http') ? item.image_url : `http://localhost:5000${item.image_url}`,
            caption: item.description || '',
            date: item.uploaded_at,
            likes: 0,
            comments: 0,
          }));
          setMemories(fetchedMemories);
        }
        setCaption('');
        setSelectedFile(null);
        setPreview('');
        setError('');
        onClose();
      } else {
        console.error('Upload failed:', data.error);
        setError(data.error || 'Failed to upload image');
      }
    } catch (error) {
      console.error('Error uploading image:', error);
      setError('Network error: Could not reach the server');
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-white dark:bg-gray-800 rounded-2xl w-full max-w-md">
        <div className="p-4 border-b border-gray-100 dark:border-gray-700 flex justify-between items-center">
          <h2 className="text-lg font-medium text-violet-900 dark:text-violet-200">Add New Memory</h2>
          <button
            onClick={() => {
              onClose();
              setError('');
              setSelectedFile(null);
              setPreview('');
              setCaption('');
            }}
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
                    setError('');
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
              accept="image/png,image/jpeg,image/gif"
              onChange={handleFileSelect}
              className="hidden"
            />
            {error && (
              <p className="text-sm text-red-500">{error}</p>
            )}
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