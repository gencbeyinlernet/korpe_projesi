
import { useState } from 'react';
import { LandingPage } from './components/LandingPage';
import { StudentDashboard } from './components/StudentDashboard';
import { AssessmentFlow } from './components/AssessmentFlow';
import { LoginPage } from './components/LoginPage';
import { TeacherDashboard } from './components/TeacherDashboard';
import { PageView, User, CareerReport } from './types';
import { dbService } from './services/dbService';
import { AlertCircle, Copy, CheckCircle, Database } from 'lucide-react';

function App() {
  const [currentPage, setCurrentPage] = useState<PageView>(PageView.LANDING);
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [viewingStudent, setViewingStudent] = useState<User | null>(null); 
  const [loginError, setLoginError] = useState<string>('');
  const [showDbFix, setShowDbFix] = useState(false);
  const [loading, setLoading] = useState(false);

  const translateError = (error: any): string => {
    if (!error) return 'Beklenmedik bir hata oluştu.';
    const code = error.code;
    const message = error.message || '';

    if (code === '42P01' || message.includes('relation "public.users" does not exist') || message.includes('schema cache')) {
      setShowDbFix(true);
      return 'Veritabanı Hatası: "users" tablosu bulunamadı. Lütfen veritabanını güncelleyin.';
    }
    if (code === '23505') return 'Bu kullanıcı adı zaten alınmış.';
    if (code === 'PGRST116') return 'Kullanıcı adı veya şifre yanlış.';
    if (message.includes('Failed to fetch')) return 'Bağlantı Hatası: Sunucuya ulaşılamıyor. Lütfen internet bağlantınızı kontrol edin ve Supabase URL adresinin doğru olduğundan emin olun.';
    
    return message || 'İşlem sırasında bir hata oluştu.';
  };

  const sqlCode = `CREATE TABLE IF NOT EXISTS public.users (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  username TEXT UNIQUE NOT NULL,
  password TEXT NOT NULL,
  name TEXT,
  role TEXT,
  is_assessment_complete BOOLEAN DEFAULT false,
  teacher_username TEXT,
  parent_name TEXT,
  parent_contact TEXT,
  linked_student_username TEXT,
  report JSONB,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now())
);
ALTER TABLE public.users ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Herkes okuyabilir" ON public.users FOR SELECT USING (true);
CREATE POLICY "Herkes ekleyebilir" ON public.users FOR INSERT WITH CHECK (true);
CREATE POLICY "Herkes güncelleyebilir" ON public.users FOR UPDATE USING (true);`;

  const handleLogin = async (username: string, pass: string) => {
    setLoading(true);
    setLoginError('');
    try {
      const user = await dbService.login(username, pass);
      if (user) {
        setCurrentUser(user);
        if (user.role === 'teacher') setCurrentPage(PageView.TEACHER_DASHBOARD);
        else if (user.isAssessmentComplete) setCurrentPage(PageView.STUDENT_DASHBOARD);
        else setCurrentPage(PageView.ASSESSMENT);
      } else {
        setLoginError('Kullanıcı adı veya şifre hatalı.');
      }
    } catch (err: any) {
      setLoginError(translateError(err));
    } finally {
      setLoading(false);
    }
  };

  const handleRegister = async (newUserData: Omit<User, 'id'>, report?: CareerReport) => {
    setLoading(true);
    setLoginError('');
    try {
      const newUser = await dbService.register({ ...newUserData, report });
      if (newUser) {
        setCurrentUser(newUser);
        if (newUser.role === 'teacher') {
          setCurrentPage(PageView.TEACHER_DASHBOARD);
        } else { // For students and parents
          setCurrentPage(newUser.isAssessmentComplete ? PageView.STUDENT_DASHBOARD : PageView.ASSESSMENT);
        }
      }
    } catch (error: any) {
      setLoginError(translateError(error));
    } finally {
      setLoading(false);
    }
  };

  const handleAssessmentComplete = async (report: CareerReport) => {
    if (currentUser && currentUser.id !== 'guest') {
      try {
        await dbService.updateUserReport(currentUser.id, report);
        setCurrentUser({ ...currentUser, isAssessmentComplete: true, report });
        setCurrentPage(PageView.STUDENT_DASHBOARD);
      } catch (error) {
        alert('Rapor kaydedilirken hata oluştu: ' + translateError(error));
      }
    } else {
      setCurrentUser({ id: 'guest', username: 'guest', name: 'Misafir', role: 'student', report });
      setCurrentPage(PageView.STUDENT_DASHBOARD);
    }
  };

  return (
    <div className="font-sans text-gray-900 antialiased relative">
      {loading && (
        <div className="fixed inset-0 bg-white/60 z-[100] flex items-center justify-center backdrop-blur-sm">
           <div className="flex flex-col items-center gap-3">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-korpe-600"></div>
              <p className="text-korpe-700 font-bold">İşleniyor...</p>
           </div>
        </div>
      )}

      {showDbFix && (
        <div className="fixed inset-0 bg-black/80 z-[200] flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl p-8 max-w-2xl w-full shadow-2xl animate-scale-up">
            <div className="flex items-center gap-4 text-red-600 mb-6">
              <Database size={40} className="animate-pulse" />
              <h2 className="text-2xl font-bold">Veritabanı Kurulumu Gerekli!</h2>
            </div>
            <p className="text-gray-600 mb-6 leading-relaxed">
              Supabase projenizde <strong>'users'</strong> tablosu bulunamadı. Lütfen Supabase panelinize gidin ve <strong>SQL Editor</strong> kısmına aşağıdaki kodu yapıştırıp <strong>RUN</strong> tuşuna basın.
            </p>
            <div className="bg-gray-900 rounded-xl p-4 mb-6 relative group">
              <pre className="text-green-400 text-xs overflow-x-auto max-h-48 scrollbar-thin">
                {sqlCode}
              </pre>
              <button 
                onClick={() => { navigator.clipboard.writeText(sqlCode); alert('Kod panoya kopyalandı!'); }}
                className="absolute top-2 right-2 bg-white/10 hover:bg-white/20 text-white p-2 rounded-lg transition"
              >
                <Copy size={16} />
              </button>
            </div>
            <div className="flex gap-4">
              <button 
                onClick={() => setShowDbFix(false)}
                className="flex-1 bg-korpe-600 text-white py-3 rounded-xl font-bold hover:bg-korpe-700 transition"
              >
                Kapat ve Tekrar Dene
              </button>
              <a 
                href={`https://supabase.com/dashboard/project/valmmufubkndxcygnrgk/sql/new`}
                target="_blank"
                rel="noopener noreferrer"
                className="flex-1 bg-gray-100 text-gray-700 py-3 rounded-xl font-bold hover:bg-gray-200 transition text-center flex items-center justify-center gap-2"
              >
                SQL Editor'ı Aç
              </a>
            </div>
          </div>
        </div>
      )}

      {currentPage === PageView.LANDING && <LandingPage onNavigate={setCurrentPage} />}
      {currentPage === PageView.LOGIN && <LoginPage onLogin={handleLogin} onRegister={handleRegister} onGuestLogin={() => { setCurrentUser(null); setCurrentPage(PageView.ASSESSMENT); }} error={loginError} />}
      {currentPage === PageView.ASSESSMENT && <AssessmentFlow isGuest={!currentUser} onComplete={handleAssessmentComplete} onRegisterAndSave={handleRegister} />}
      {currentPage === PageView.STUDENT_DASHBOARD && <StudentDashboard user={viewingStudent || currentUser || undefined} onLogout={() => setCurrentPage(PageView.LANDING)} viewerRole={currentUser?.role === 'teacher' ? 'teacher' : 'student'} onBackToTeacher={() => setCurrentPage(PageView.TEACHER_DASHBOARD)} />}
      {currentPage === PageView.TEACHER_DASHBOARD && <TeacherDashboard currentUser={currentUser || undefined} onAddStudent={async (s) => { try { await dbService.register(s); return true; } catch (e) { alert(translateError(e)); return false; } }} onViewStudent={(s) => { setViewingStudent(s); setCurrentPage(PageView.STUDENT_DASHBOARD); }} onLogout={() => setCurrentPage(PageView.LANDING)} />}
    </div>
  );
}
export default App;
