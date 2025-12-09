import React, { useState } from 'react';
import { User, Lock, ArrowRight, Brain, AlertCircle, UserPlus, Users, GraduationCap, PlayCircle } from 'lucide-react';
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
  
  // Form States
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  
  // Specific Fields
  const [teacherUsername, setTeacherUsername] = useState('');
  const [parentName, setParentName] = useState('');
  const [parentContact, setParentContact] = useState('');
  const [linkedStudentUsername, setLinkedStudentUsername] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (isSubmitting) return;
    
    setIsSubmitting(true);
    // Add small delay to prevent double clicks being processed before parent sets loading state
    setTimeout(() => setIsSubmitting(false), 2000);

    if (mode === 'login') {
      onLogin(username, password);
    } else {
      // Register logic
      onRegister({
        username,
        password,
        name,
        role,
        teacherUsername: role === 'student' ? teacherUsername : undefined,
        parentName: role === 'student' ? parentName : undefined,
        parentContact: role === 'student' ? parentContact : undefined,
        linkedStudentUsername: role === 'parent' ? linkedStudentUsername : undefined,
        isAssessmentComplete: false
      });
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 to-white flex items-center justify-center p-4">
      <div className="bg-white w-full max-w-md rounded-2xl shadow-xl border border-gray-100 overflow-hidden animate-fade-in">
        <div className="p-8 bg-korpe-600 text-center">
          <div className="w-16 h-16 bg-white/20 rounded-full flex items-center justify-center mx-auto mb-4 backdrop-blur-sm">
            <Brain className="text-white w-8 h-8" />
          </div>
          <h2 className="text-2xl font-bold text-white">KÖRPE AI</h2>
          <p className="text-korpe-100 text-sm mt-1">Geleceğini tasarlamaya başla</p>
        </div>

        {/* Tabs */}
        <div className="flex border-b border-gray-200">
          <button 
            onClick={() => setMode('login')}
            className={`flex-1 py-4 text-sm font-medium transition ${mode === 'login' ? 'text-korpe-600 border-b-2 border-korpe-600' : 'text-gray-500 hover:text-gray-700'}`}
          >
            Giriş Yap
          </button>
          <button 
             onClick={() => setMode('register')}
             className={`flex-1 py-4 text-sm font-medium transition ${mode === 'register' ? 'text-korpe-600 border-b-2 border-korpe-600' : 'text-gray-500 hover:text-gray-700'}`}
          >
            Kayıt Ol
          </button>
        </div>

        <div className="p-8 space-y-5">
          <form onSubmit={handleSubmit} className="space-y-5">
            {error && (
              <div className="bg-red-50 text-red-600 p-3 rounded-lg text-sm flex items-center gap-2 border border-red-100">
                <AlertCircle size={16} />
                {error}
              </div>
            )}

            {mode === 'register' && (
              <div className="grid grid-cols-3 gap-2 mb-4">
                <button type="button" onClick={() => setRole('student')} className={`p-2 rounded-lg border text-xs font-medium flex flex-col items-center gap-1 ${role === 'student' ? 'bg-korpe-50 border-korpe-500 text-korpe-700' : 'border-gray-200 text-gray-500'}`}>
                  <User size={16} /> Öğrenci
                </button>
                <button type="button" onClick={() => setRole('teacher')} className={`p-2 rounded-lg border text-xs font-medium flex flex-col items-center gap-1 ${role === 'teacher' ? 'bg-korpe-50 border-korpe-500 text-korpe-700' : 'border-gray-200 text-gray-500'}`}>
                  <GraduationCap size={16} /> Öğretmen
                </button>
                <button type="button" onClick={() => setRole('parent')} className={`p-2 rounded-lg border text-xs font-medium flex flex-col items-center gap-1 ${role === 'parent' ? 'bg-korpe-50 border-korpe-500 text-korpe-700' : 'border-gray-200 text-gray-500'}`}>
                  <Users size={16} /> Veli
                </button>
              </div>
            )}

            {/* Common Fields */}
            {mode === 'register' && (
               <div className="space-y-1">
                <label className="text-xs font-medium text-gray-700">Ad Soyad</label>
                <input
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-korpe-500 outline-none text-sm"
                  required
                />
              </div>
            )}

            <div className="space-y-1">
              <label className="text-xs font-medium text-gray-700">Kullanıcı Adı</label>
              <div className="relative">
                <User className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 w-5 h-5" />
                <input
                  type="text"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  className="w-full pl-10 pr-4 py-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-korpe-500 outline-none text-sm"
                  placeholder={mode === 'register' ? "Benzersiz bir isim seç" : "Kullanıcı adınız"}
                  required
                />
              </div>
            </div>

            <div className="space-y-1">
              <label className="text-xs font-medium text-gray-700">Şifre</label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 w-5 h-5" />
                <input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full pl-10 pr-4 py-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-korpe-500 outline-none text-sm"
                  placeholder="••••••"
                  required
                />
              </div>
            </div>

            {/* Role Specific Fields during Registration */}
            {mode === 'register' && role === 'student' && (
              <div className="space-y-4 pt-2 border-t border-dashed border-gray-200">
                 <div className="bg-blue-50 p-3 rounded-lg flex items-start gap-2">
                   <AlertCircle className="w-4 h-4 text-blue-600 mt-0.5" />
                   <p className="text-xs text-blue-700">Öğretmeninizin sizi görebilmesi için kullanıcı adını doğru giriniz.</p>
                 </div>
                 <div>
                    <label className="text-xs font-medium text-gray-700">Danışman Öğretmen Kullanıcı Adı</label>
                    <input
                      type="text"
                      value={teacherUsername}
                      onChange={(e) => setTeacherUsername(e.target.value)}
                      className="w-full px-4 py-2 rounded-xl border border-gray-200 focus:ring-2 focus:ring-korpe-500 outline-none text-sm"
                      placeholder="Örn: rizebist"
                    />
                 </div>
                 <div className="grid grid-cols-2 gap-3">
                   <div>
                      <label className="text-xs font-medium text-gray-700">Veli Adı</label>
                      <input
                        type="text"
                        value={parentName}
                        onChange={(e) => setParentName(e.target.value)}
                        className="w-full px-4 py-2 rounded-xl border border-gray-200 focus:ring-2 focus:ring-korpe-500 outline-none text-sm"
                      />
                   </div>
                   <div>
                      <label className="text-xs font-medium text-gray-700">Veli İletişim</label>
                      <input
                        type="text"
                        value={parentContact}
                        onChange={(e) => setParentContact(e.target.value)}
                        className="w-full px-4 py-2 rounded-xl border border-gray-200 focus:ring-2 focus:ring-korpe-500 outline-none text-sm"
                        placeholder="05..."
                      />
                   </div>
                 </div>
              </div>
            )}

            {mode === 'register' && role === 'parent' && (
               <div className="pt-2">
                  <label className="text-xs font-medium text-gray-700">Takip Edilecek Öğrenci Kullanıcı Adı</label>
                  <input
                    type="text"
                    value={linkedStudentUsername}
                    onChange={(e) => setLinkedStudentUsername(e.target.value)}
                    className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-korpe-500 outline-none text-sm"
                    required
                  />
               </div>
            )}

            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full bg-korpe-600 hover:bg-korpe-700 text-white font-bold py-3.5 rounded-xl shadow-lg shadow-korpe-200 flex items-center justify-center gap-2 transition transform active:scale-95 disabled:opacity-70"
            >
              {isSubmitting 
                ? 'İşleniyor...' 
                : (mode === 'login' ? 'Giriş Yap' : 'Kaydı Tamamla')} 
              {!isSubmitting && <ArrowRight size={20} />}
            </button>
          </form>

          {/* Guest Login Option */}
          {mode === 'login' && onGuestLogin && (
            <>
              <div className="relative flex py-2 items-center">
                <div className="flex-grow border-t border-gray-200"></div>
                <span className="flex-shrink-0 mx-4 text-gray-400 text-xs">veya</span>
                <div className="flex-grow border-t border-gray-200"></div>
              </div>
              <button
                onClick={onGuestLogin}
                className="w-full bg-white border-2 border-korpe-100 hover:bg-korpe-50 text-korpe-600 font-bold py-3 rounded-xl flex items-center justify-center gap-2 transition"
              >
                <PlayCircle size={20} /> Kayıt Olmadan Teste Başla
              </button>
            </>
          )}

          <div className="text-center text-xs text-gray-400 mt-2">
             Demo: admin/admin (Öğretmen), ogrenci/123
          </div>
        </div>
      </div>
    </div>
  );
};