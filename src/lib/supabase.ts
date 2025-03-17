export type UserType = 'pregnant' | 'parent';

export interface User {
  id: string;
  email: string;
  full_name: string;
  user_type: UserType;
  expected_due_date?: string;
  created_at: string;
  updated_at: string;
}

export interface Child {
  id: string;
  parent_id: string;
  name: string;
  birth_date: string;
  gender?: 'male' | 'female' | 'other';
  weight?: number;
  height?: number;
  blood_type?: string;
  allergies?: string;
  notes?: string;
  created_at: string;
  updated_at: string;
}