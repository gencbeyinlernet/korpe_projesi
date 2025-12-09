import { supabase } from './supabaseClient';
import { User, CareerReport } from '../types';

// Helper to map DB row to User object
// Converts snake_case (DB) to camelCase (App)
const mapRowToUser = (row: any): User => ({
  id: row.id,
  username: row.username,
  password: row.password,
  name: row.name,
  role: row.role as any,
  isAssessmentComplete: row.is_assessment_complete,
  teacherUsername: row.teacher_username,
  parentName: row.parent_name,
  parentContact: row.parent_contact,
  linkedStudentUsername: row.linked_student_username,
  report: row.report
});

// Helper to map User object to DB row
// Converts camelCase (App) to snake_case (DB)
const mapUserToRow = (user: Partial<User>) => {
  const row: any = {
    username: user.username,
    password: user.password,
    name: user.name,
    role: user.role,
    is_assessment_complete: user.isAssessmentComplete,
    teacher_username: user.teacherUsername,
    parent_name: user.parentName,
    parent_contact: user.parentContact,
    linked_student_username: user.linkedStudentUsername,
    report: user.report
  };
  
  // Remove undefined keys so Supabase doesn't complain or overwrite with null if we didn't intend to
  Object.keys(row).forEach(key => row[key] === undefined && delete row[key]);
  return row;
};

export const dbService = {
  // Login
  async login(username: string, password: string): Promise<User | null> {
    const { data, error } = await supabase
      .from('users')
      .select('*')
      .eq('username', username)
      .eq('password', password) // Note: In production, hash passwords!
      .single();

    if (error) {
      // PGRST116 is "JSON object requested, multiple (or no) rows returned". 
      // In .single() context, it means no user found.
      if (error.code !== 'PGRST116') {
        console.error('Login error:', error);
      }
      return null;
    }

    if (!data) return null;

    return mapRowToUser(data);
  },

  // Register
  async register(user: Omit<User, 'id'>): Promise<User | null> {
    const row = mapUserToRow(user);
    
    const { data, error } = await supabase
      .from('users')
      .insert([row])
      .select()
      .single();

    if (error) {
      console.error('Registration error:', error);
      throw error;
    }

    return mapRowToUser(data);
  },

  // Update Report (e.g. after assessment)
  async updateUserReport(userId: string, report: CareerReport): Promise<boolean> {
    const { error } = await supabase
      .from('users')
      .update({ 
        report: report,
        is_assessment_complete: true 
      })
      .eq('id', userId);

    if (error) {
      console.error('Update report error:', error);
      return false;
    }
    return true;
  },

  // Get Students for a Teacher
  async getStudentsByTeacher(teacherUsername: string): Promise<User[]> {
    const { data, error } = await supabase
      .from('users')
      .select('*')
      .eq('role', 'student')
      .eq('teacher_username', teacherUsername);

    if (error) {
      console.error('Fetch students error:', error);
      return [];
    }

    return data.map(mapRowToUser);
  },

  // Get a single student (e.g. for Parent view)
  async getStudentByUsername(username: string): Promise<User | null> {
    const { data, error } = await supabase
      .from('users')
      .select('*')
      .eq('role', 'student')
      .eq('username', username)
      .single();

    if (error) {
        // Only log if it's not a "not found" error for cleaner console
        if (error.code !== 'PGRST116') console.error('Fetch student error:', error);
        return null;
    }
    return mapRowToUser(data);
  }
};