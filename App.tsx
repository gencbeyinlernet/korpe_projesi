import React, { useState } from 'react';
import { LandingPage } from './components/LandingPage';
import { StudentDashboard } from './components/StudentDashboard';
import { AssessmentFlow } from './components/AssessmentFlow';
import { LoginPage } from './components/LoginPage';
import { TeacherDashboard } from './components/TeacherDashboard';
import { PageView, User, CareerReport } from './types';
import { dbService } from './services/dbService';

function App() {
  const [currentPage, setCurrentPage] = useState<PageView>(PageView.LANDING);
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [viewingStudent, setViewingStudent] = useState<User | null>(null); 
  const [loginError, setLoginError] = useState<string>('');
  const [loading, setLoading] = useState(false);

  const handleNavigate = (page: PageView) => {
    setCurrentPage(page);
    setLoginError('');
    setViewingStudent(null);
  };

  const handleLogin = async (username: string, pass: string) => {
    setLoading(true);
    setLoginError('');
    try {
      const user = await dbService.login(username, pass);
      
      if (user) {
        setCurrentUser(user);
        
        if (user.role === 'teacher') {
          setCurrentPage(PageView.TEACHER_DASHBOARD);
        } else if (user.role === 'parent') {
          if (user.linkedStudentUsername) {
            const student = await dbService.getStudentByUsername(user.linkedStudentUsername);
            if (student) {
                // View as Parent: We set the current user context but render the dashboard with the student's data
                setCurrentUser({ ...user, name: `(Veli: ${user.name}) ${student.name}`}); 
                setViewingStudent(student); // Use viewingStudent state to pass data
                setCurrentPage(PageView.STUDENT_DASHBOARD);
            } else {
                setLoginError('Bağlı öğrenci bulunamadı.');
                setCurrentUser(null);
            }
          } else {
             setLoginError('Veli hesabında öğrenci bağlantısı yok.');
          }
        } else {
          // Student
          if (user.isAssessmentComplete) {
            setCurrentPage(PageView.STUDENT_DASHBOARD);
          } else {
            setCurrentPage(PageView.ASSESSMENT);
          }
        }
      } else {
        setLoginError('Kullanıcı adı veya şifre hatalı.');
      }
    } catch (err) {
      setLoginError('Giriş yapılırken bir hata oluştu.');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleGuestLogin = () => {
    setCurrentUser(null); 
    setCurrentPage(PageView.ASSESSMENT);
  };

  const handleRegister = async (newUserData: Omit<User, 'id'>, report?: CareerReport) => {
    setLoading(true);
    setLoginError('');
    
    try {
      // If we have a report (coming from assessment), attach it
      const userDataToSave = { ...newUserData, report };
      
      const newUser = await dbService.register(userDataToSave);
      
      if (newUser) {
        setCurrentUser(newUser);
        if (newUser.role === 'teacher') {
            setCurrentPage(PageView.TEACHER_DASHBOARD);
        } else if (newUser.role === 'student') {
            if (newUser.isAssessmentComplete) {
                setCurrentPage(PageView.STUDENT_DASHBOARD);
            } else {
                setCurrentPage(PageView.ASSESSMENT);
            }
        } else {
             handleLogin(newUser.username, newUser.password || '');
        }
      }
    } catch (error: any) {
      if (error.code === '23505') { // Postgres unique_violation code
        setLoginError('Bu kullanıcı adı zaten alınmış.');
      } else {
        setLoginError('Kayıt sırasında hata oluştu.');
      }
      // Stay on login/register page if error, but if coming from assessment we might need better UX
      // For now, if called from Login page, the error state will show there.
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = () => {
    setCurrentUser(null);
    setViewingStudent(null);
    setCurrentPage(PageView.LANDING);
  };

  const handleAddStudent = async (newStudentData: Omit<User, 'id'>) => {
    // Used by Teacher Dashboard to quick add
    try {
       await dbService.register(newStudentData);
       // TeacherDashboard will refresh its list on its own via state or trigger
       return true;
    } catch (e) {
       console.error(e);
       return false;
    }
  };

  const handleViewStudent = (student: User) => {
     setViewingStudent(student);
     setCurrentPage(PageView.STUDENT_DASHBOARD);
  };

  const handleBackToTeacherDashboard = () => {
    setViewingStudent(null);
    setCurrentPage(PageView.TEACHER_DASHBOARD);
  };

  // Called when assessment finishes
  const handleAssessmentComplete = async (report: CareerReport) => {
    if (currentUser && currentUser.id !== 'guest') {
      // Logged in user: Save to DB
      const success = await dbService.updateUserReport(currentUser.id, report);
      if (success) {
        const updatedUser = { ...currentUser, isAssessmentComplete: true, report };
        setCurrentUser(updatedUser);
        setCurrentPage(PageView.STUDENT_DASHBOARD);
      } else {
        alert("Rapor kaydedilirken bir hata oluştu, ancak sonuçları görüntüleyebilirsiniz.");
        const updatedUser = { ...currentUser, isAssessmentComplete: true, report };
        setCurrentUser(updatedUser);
        setCurrentPage(PageView.STUDENT_DASHBOARD);
      }
    } else {
        // Guest User: Just show dashboard temporarily
        setCurrentUser({ 
            id: 'guest', 
            username: 'guest', 
            name: 'Misafir Öğrenci', 
            role: 'student',
            report: report 
        });
        setCurrentPage(PageView.STUDENT_DASHBOARD);
    }
  };

  return (
    <div className="font-sans text-gray-900 antialiased">
      {loading && (
        <div className="fixed inset-0 bg-white/50 z-[100] flex items-center justify-center backdrop-blur-sm">
           <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-korpe-600"></div>
        </div>
      )}

      {currentPage === PageView.LANDING && (
        <LandingPage onNavigate={handleNavigate} />
      )}
      
      {currentPage === PageView.LOGIN && (
        <LoginPage 
            onLogin={handleLogin} 
            onRegister={handleRegister} 
            onGuestLogin={handleGuestLogin}
            error={loginError} 
        />
      )}

      {currentPage === PageView.TEACHER_DASHBOARD && currentUser?.role === 'teacher' && (
        <TeacherDashboard 
          currentUser={currentUser}
          onAddStudent={handleAddStudent} 
          onViewStudent={handleViewStudent}
          onLogout={handleLogout} 
        />
      )}

      {currentPage === PageView.ASSESSMENT && (
        <AssessmentFlow 
            isGuest={currentUser?.id === 'guest' || !currentUser}
            onComplete={handleAssessmentComplete} 
            onRegisterAndSave={handleRegister}
        />
      )}

      {currentPage === PageView.STUDENT_DASHBOARD && (
        <StudentDashboard 
            // If viewingStudent is set (Teacher/Parent viewing), use that. Otherwise use currentUser.
            user={viewingStudent || currentUser || undefined} 
            onLogout={handleLogout}
            viewerRole={currentUser?.role === 'teacher' ? 'teacher' : 'student'}
            onBackToTeacher={handleBackToTeacherDashboard}
        />
      )}
    </div>
  );
}

export default App;