import React, { useState, useEffect } from "react";
import { useUser } from "../../../contexts/UserContext";
import { Child } from "../../../lib/supabase";

interface EditChildModalProps {
  isOpen: boolean;
  onClose: () => void;
  child: Child | null;
}

const EditChildModal: React.FC<EditChildModalProps> = ({ isOpen, onClose, child }) => {
  const { updateChild } = useUser();
  const [formData, setFormData] = useState({
    name: "",
    birth_date: "",
    gender: "",
    weight: "",
    height: "",
    blood_type: "",
    allergies: "",
    notes: "",
  });
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (child) {
      setFormData({
        name: child.name || "",
        birth_date: child.birth_date || "",
        gender: child.gender || "",
        weight: child.weight ? child.weight.toString() : "",
        height: child.height ? child.height.toString() : "",
        blood_type: child.blood_type || "",
        allergies: child.allergies || "",
        notes: child.notes || "",
      });
    }
  }, [child]);

  if (!isOpen || !child) return null;

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      await updateChild(child.id, {
        name: formData.name,
        birth_date: formData.birth_date,
        gender: formData.gender as "male" | "female" | "other",
        weight: formData.weight ? parseFloat(formData.weight) : undefined,
        height: formData.height ? parseFloat(formData.height) : undefined,
        blood_type: formData.blood_type || undefined,
        allergies: formData.allergies || undefined,
        notes: formData.notes || undefined,
      });

      onClose();
    } catch (error) {
      console.error("Error updating child:", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-white dark:bg-gray-800 rounded-xl w-full max-w-md">
        <div className="flex justify-between items-center p-4 border-b dark:border-gray-700">
          <h3 className="text-lg font-medium text-violet-900 dark:text-violet-200">
            Edit Child Profile
          </h3>
          <button
            onClick={onClose}
            className="text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-300"
          >
            Close
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-4">
          <div className="space-y-4">
            <input
              type="text"
              name="name"
              value={formData.name}
              onChange={handleInputChange}
              placeholder="Child's Name"
              className="w-full p-2 border rounded"
              required
            />
            <input
              type="date"
              name="birth_date"
              value={formData.birth_date}
              onChange={handleInputChange}
              className="w-full p-2 border rounded"
              required
            />
            <select
              name="gender"
              value={formData.gender}
              onChange={handleInputChange}
              className="w-full p-2 border rounded"
              required
            >
              <option value="">Select Gender</option>
              <option value="male">Male</option>
              <option value="female">Female</option>
              <option value="other">Other</option>
            </select>
          </div>

          <button
            type="submit"
            className="mt-4 w-full bg-violet-600 text-white py-2 rounded hover:bg-violet-700"
            disabled={loading}
          >
            {loading ? "Saving..." : "Save Changes"}
          </button>
        </form>
      </div>
    </div>
  );
};

export default EditChildModal;
