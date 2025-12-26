
import React, { useState } from 'react';
import { User, Lock, ArrowRight, Brain, AlertCircle, UserPlus, Users, GraduationCap, PlayCircle, Database } from 'lucide-react';
import { UserRole, User as UserType } from '../types';

interface LoginPageProps {
  onLogin: (username: string, password: string) => void;
  onRegister: (userData: Omit<UserType, 'id'>) => void;
  onGuestLogin?: () => void;
  error?: string;
}

export const LoginPage: React.FC<LoginPageProps> = ({ onLogin, onRegister, onGuestLogin, error }) => {
  const [mode, setMode] = useState<'login' | 'register'>('login');
  const [role, setRole] = useState<UserRole>('student');
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const [teacherUsername, setTeacherUsername] = useState('');
  const [parentName, setParentName] = useState('');
  const [parentContact, setParentContact] = useState('');
  const [linkedStudentUsername, setLinkedStudentUsername] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (isSubmitting) return;
    setIsSubmitting(true);
    setTimeout(() => setIsSubmitting(false), 2000);

    if (mode === 'login') {
      onLogin(username, password);
    } else {
      onRegister({
        username, password, name, role,
        teacherUsername: role === 'student' ? teacherUsername : undefined,
        parentName: role === 'student' ? parentName : undefined,
        parentContact: role === 'student' ? parentContact : undefined,
        linkedStudentUsername: role === 'parent' ? linkedStudentUsername : undefined,
        isAssessmentComplete: false
      });
    }
  };

  const isDbError = error?.includes('tablosu bulunamadı');

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 to-white flex items-center justify-center p-4">
      <div className="bg-white w-full max-w-md rounded-3xl shadow-2xl border border-gray-100 overflow-hidden animate-fade-in">
        <div className="p-8 bg-korpe-700 text-center">
          <div className="w-16 h-16 bg-white/20 rounded-full flex items-center justify-center mx-auto mb-4 backdrop-blur-md">
            <Brain className="text-white w-8 h-8" />
          </div>
          <h2 className="text-2xl font-bold text-white">KÖRPE</h2>
          <p className="text-korpe-200 text-xs mt-1 font-medium tracking-wide">Kariyer Planlama ve Analiz Sistemi</p>
        </div>

        <div className="flex border-b border-gray-100">
          <button onClick={() => setMode('login')} className={`flex-1 py-4 text-sm font-bold transition-all ${mode === 'login' ? 'text-korpe-600 border-b-4 border-korpe-600 bg-korpe-50/30' : 'text-gray-400 hover:bg-gray-50'}`}>Giriş Yap</button>
          <button onClick={() => setMode('register')} className={`flex-1 py-4 text-sm font-bold transition-all ${mode === 'register' ? 'text-korpe-600 border-b-4 border-korpe-600 bg-korpe-50/30' : 'text-gray-400 hover:bg-gray-50'}`}>Kayıt Ol</button>
        </div>

        <div className="p-8">
          {error && (
            <div className={`mb-6 p-4 rounded-xl border flex items-start gap-3 animate-shake ${isDbError ? 'bg-red-50 border-red-200 text-red-800' : 'bg-orange-50 border-orange-200 text-orange-800'}`}>
              {isDbError ? <Database className="shrink-0 w-5 h-5 mt-0.5" /> : <AlertCircle className="shrink-0 w-5 h-5 mt-0.5" />}
              <div>
                <p className="text-sm font-bold">{error}</p>
                {isDbError && <p className="text-[11px] mt-1 opacity-80">Veritabanı tablosu henüz kurulmamış.</p>}
              </div>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            {mode === 'register' && (
              <div className="grid grid-cols-3 gap-2 mb-4 bg-gray-50 p-1 rounded-xl">
                {(['student', 'teacher', 'parent'] as UserRole[]).map(r => (
                  <button key={r} type="button" onClick={() => setRole(r)} className={`py-2 rounded-lg text-[11px] font-bold flex flex-col items-center gap-1 transition-all ${role === r ? 'bg-white shadow-sm text-korpe-700' : 'text-gray-400 hover:text-gray-600'}`}>
                    {r === 'student' ? <User size={14} /> : r === 'teacher' ? <GraduationCap size={14} /> : <Users size={14} />}
                    {r === 'student' ? 'Öğrenci' : r === 'teacher' ? 'Öğretmen' : 'Veli'}
                  </button>
                ))}
              </div>
            )}

            <div className="space-y-4">
              {mode === 'register' && (
                <div className="space-y-1">
                  <label className="text-[11px] font-bold text-gray-400 uppercase ml-1">Ad Soyad</label>
                  <input type="text" value={name} onChange={e => setName(e.target.value)} className="w-full px-4 py-3 rounded-xl bg-gray-50 border border-gray-100 focus:bg-white focus:ring-2 focus:ring-korpe-500 outline-none text-sm transition" required />
                </div>
              )}
              <div className="space-y-1">
                <label className="text-[11px] font-bold text-gray-400 uppercase ml-1">Kullanıcı Adı</label>
                <div className="relative">
                  <User className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-300 w-4 h-4" />
                  <input type="text" value={username} onChange={e => setUsername(e.target.value)} className="w-full pl-10 pr-4 py-3 rounded-xl bg-gray-50 border border-gray-100 focus:bg-white focus:ring-2 focus:ring-korpe-500 outline-none text-sm transition" placeholder="kullanıcıadı" required />
                </div>
              </div>
              <div className="space-y-1">
                <label className="text-[11px] font-bold text-gray-400 uppercase ml-1">Şifre</label>
                <div className="relative">
                  <Lock className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-300 w-4 h-4" />
                  <input type="password" value={password} onChange={e => setPassword(e.target.value)} className="w-full pl-10 pr-4 py-3 rounded-xl bg-gray-50 border border-gray-100 focus:bg-white focus:ring-2 focus:ring-korpe-500 outline-none text-sm transition" placeholder="••••••••" required />
                </div>
              </div>
            </div>

            {mode === 'register' && role === 'student' && (
              <div className="pt-2 space-y-3">
                <div className="bg-blue-50/50 p-3 rounded-xl text-[10px] text-blue-700 font-medium">Öğretmeninizle eşleşmek için onun kullanıcı adını girin.</div>
                <input type="text" value={teacherUsername} onChange={e => setTeacherUsername(e.target.value)} className="w-full px-4 py-3 rounded-xl bg-gray-50 border border-gray-100 focus:bg-white focus:ring-2 focus:ring-korpe-500 outline-none text-sm transition" placeholder="Öğretmen Kullanıcı Adı" />
              </div>
            )}

            <button type="submit" disabled={isSubmitting} className="w-full bg-korpe-600 hover:bg-korpe-700 text-white font-bold py-4 rounded-xl shadow-lg shadow-korpe-100 flex items-center justify-center gap-2 transition transform active:scale-95 disabled:opacity-50 mt-6">
              {isSubmitting ? 'Lütfen bekleyin...' : (mode === 'login' ? 'Giriş Yap' : 'Kaydı Tamamla')} 
              {!isSubmitting && <ArrowRight size={18} />}
            </button>
          </form>

          {mode === 'login' && onGuestLogin && (
            <div className="mt-4">
              <div className="relative flex py-4 items-center">
                <div className="flex-grow border-t border-gray-100"></div>
                <span className="flex-shrink-0 mx-4 text-gray-300 text-[10px] font-bold uppercase">veya</span>
                <div className="flex-grow border-t border-gray-100"></div>
              </div>
              <button onClick={onGuestLogin} className="w-full bg-white border-2 border-korpe-50 hover:bg-korpe-50 text-korpe-600 font-bold py-3 rounded-xl flex items-center justify-center gap-2 transition">
                <PlayCircle size={18} /> Misafir Olarak Başla
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
