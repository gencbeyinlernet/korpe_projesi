
import { supabase } from './supabaseClient';
import { User, CareerReport } from '../types';

// DB satırını User nesnesine eşleyen yardımcı fonksiyon
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

// User nesnesini DB satırına eşleyen yardımcı fonksiyon
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
  
  Object.keys(row).forEach(key => row[key] === undefined && delete row[key]);
  return row;
};

export const dbService = {
  // Giriş
  async login(username: string, password: string): Promise<User | null> {
    const { data, error } = await supabase
      .from('users')
      .select('*')
      .eq('username', username)
      .eq('password', password)
      .single();

    if (error) {
      if (error.code === 'PGRST116') return null; // Kayıt bulunamadı
      throw error;
    }

    return mapRowToUser(data);
  },

  // Kayıt
  async register(user: Omit<User, 'id'>): Promise<User | null> {
    const row = mapUserToRow(user);
    
    const { data, error } = await supabase
      .from('users')
      .insert([row])
      .select()
      .single();

    if (error) {
      throw error;
    }

    return mapRowToUser(data);
  },

  // Rapor Güncelleme
  async updateUserReport(userId: string, report: CareerReport): Promise<boolean> {
    const { error } = await supabase
      .from('users')
      .update({ 
        report: report,
        is_assessment_complete: true 
      })
      .eq('id', userId);

    if (error) {
      throw error;
    }
    return true;
  },

  // Öğretmene Bağlı Öğrencileri Getir
  async getStudentsByTeacher(teacherUsername: string): Promise<User[]> {
    const { data, error } = await supabase
      .from('users')
      .select('*')
      .eq('role', 'student')
      .eq('teacher_username', teacherUsername);

    if (error) {
      throw error;
    }

    return data.map(mapRowToUser);
  }
};
