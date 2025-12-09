import React, { useState, useEffect } from 'react';
import { UserPlus, LogOut, Users, Search, GraduationCap, CheckCircle, XCircle, AlertCircle, FileText, Download, Loader2 } from 'lucide-react';
import { User } from '../types';
import { dbService } from '../services/dbService';

interface TeacherDashboardProps {
  currentUser?: User;
  onAddStudent: (student: Omit<User, 'id'>) => Promise<boolean>;
  onViewStudent: (student: User) => void;
  onLogout: () => void;
}

export const TeacherDashboard: React.FC<TeacherDashboardProps> = ({ currentUser, onAddStudent, onViewStudent, onLogout }) => {
  const [isAdding, setIsAdding] = useState(false);
  const [newStudent, setNewStudent] = useState({ name: '', username: '', password: '' });
  const [students, setStudents] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchStudents = async () => {
    if (currentUser?.username) {
      setLoading(true);
      const data = await dbService.getStudentsByTeacher(currentUser.username);
      setStudents(data);
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchStudents();
  }, [currentUser]);

  const handleAdd = async (e: React.FormEvent) => {
    e.preventDefault();
    const success = await onAddStudent({
      ...newStudent,
      role: 'student',
      teacherUsername: currentUser?.username, // Link to self
      isAssessmentComplete: false
    });
    
    if (success) {
        setNewStudent({ name: '', username: '', password: '' });
        setIsAdding(false);
        fetchStudents(); // Refresh list
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <nav className="bg-white border-b border-gray-200 px-6 py-4 flex justify-between items-center">
        <div className="flex items-center gap-3">
          <div className="bg-korpe-600 p-2 rounded-lg text-white">
            <GraduationCap size={24} />
          </div>
          <div>
            <h1 className="text-xl font-bold text-gray-800">Öğretmen Paneli</h1>
            <p className="text-xs text-gray-500">Hoşgeldin, {currentUser?.name}</p>
          </div>
        </div>
        <button 
          onClick={onLogout}
          className="flex items-center gap-2 text-gray-600 hover:text-red-600 transition"
        >
          <LogOut size={20} /> Çıkış Yap
        </button>
      </nav>

      <div className="container mx-auto px-6 py-8">
        <div className="flex justify-between items-center mb-8">
          <div>
             <h2 className="text-2xl font-bold text-gray-900">Öğrenci Listesi</h2>
             <p className="text-gray-500">Kullanıcı adı <strong>"{currentUser?.username}"</strong> olan ve size kayıtlı öğrenciler.</p>
          </div>
          <button 
            onClick={() => setIsAdding(true)}
            className="bg-korpe-600 hover:bg-korpe-700 text-white px-5 py-2.5 rounded-xl font-medium flex items-center gap-2 shadow-lg shadow-korpe-200 transition"
          >
            <UserPlus size={20} /> Yeni Öğrenci Ekle
          </button>
        </div>

        {/* Add Student Modal */}
        {isAdding && (
          <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-2xl p-8 w-full max-w-md shadow-2xl animate-fade-in">
              <h3 className="text-xl font-bold mb-6 text-gray-900">Hızlı Öğrenci Ekle</h3>
              <form onSubmit={handleAdd} className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Ad Soyad</label>
                  <input
                    type="text"
                    required
                    value={newStudent.name}
                    onChange={e => setNewStudent({...newStudent, name: e.target.value})}
                    className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:ring-2 focus:ring-korpe-500 outline-none"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Kullanıcı Adı</label>
                  <input
                    type="text"
                    required
                    value={newStudent.username}
                    onChange={e => setNewStudent({...newStudent, username: e.target.value})}
                    className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:ring-2 focus:ring-korpe-500 outline-none"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Şifre</label>
                  <input
                    type="text"
                    required
                    value={newStudent.password}
                    onChange={e => setNewStudent({...newStudent, password: e.target.value})}
                    className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:ring-2 focus:ring-korpe-500 outline-none"
                  />
                </div>
                <div className="flex gap-3 pt-4">
                  <button
                    type="button"
                    onClick={() => setIsAdding(false)}
                    className="flex-1 px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 font-medium"
                  >
                    İptal
                  </button>
                  <button
                    type="submit"
                    className="flex-1 px-4 py-2 bg-korpe-600 text-white rounded-lg hover:bg-korpe-700 font-medium"
                  >
                    Kaydet
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}

        {/* Student List Table */}
        <div className="bg-white rounded-2xl shadow-sm border border-gray-200 overflow-hidden">
          {loading ? (
             <div className="p-12 flex justify-center items-center">
                <Loader2 className="animate-spin text-korpe-600 w-8 h-8" />
             </div>
          ) : (
            <table className="w-full text-left">
              <thead className="bg-gray-50 border-b border-gray-200">
                <tr>
                  <th className="px-6 py-4 font-semibold text-gray-700">Öğrenci Adı</th>
                  <th className="px-6 py-4 font-semibold text-gray-700">Kullanıcı Adı</th>
                  <th className="px-6 py-4 font-semibold text-gray-700">Veli Bilgisi</th>
                  <th className="px-6 py-4 font-semibold text-gray-700">Durum</th>
                  <th className="px-6 py-4 font-semibold text-gray-700">İşlemler</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {students.length === 0 ? (
                  <tr>
                    <td colSpan={5} className="px-6 py-12 text-center text-gray-500">
                      <div className="flex flex-col items-center gap-2">
                         <Users size={48} className="text-gray-300" />
                         <p>Listenizde henüz öğrenci yok.</p>
                         <p className="text-xs">Öğrenciler kayıt olurken "Danışman Öğretmen" kısmına <strong>{currentUser?.username}</strong> yazmalıdır.</p>
                      </div>
                    </td>
                  </tr>
                ) : (
                  students.map(student => (
                    <tr key={student.id} className="hover:bg-gray-50">
                      <td className="px-6 py-4 font-medium text-gray-900">{student.name}</td>
                      <td className="px-6 py-4 text-gray-600">@{student.username}</td>
                      <td className="px-6 py-4 text-sm text-gray-600">
                         {student.parentName ? (
                           <div>
                             <span className="font-semibold">{student.parentName}</span>
                             <span className="block text-xs text-gray-400">{student.parentContact}</span>
                           </div>
                         ) : (
                           <span className="text-gray-400 italic">Girilmedi</span>
                         )}
                      </td>
                      <td className="px-6 py-4">
                        {student.isAssessmentComplete ? (
                          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-green-100 text-green-700">
                            <CheckCircle size={14} /> Rapor Hazır
                          </span>
                        ) : (
                          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-yellow-100 text-yellow-700">
                            <AlertCircle size={14} /> Test Bekleniyor
                          </span>
                        )}
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex gap-2">
                          <button 
                            onClick={() => student.isAssessmentComplete ? onViewStudent(student) : alert('Öğrenci henüz testi tamamlamamış.')}
                            className={`flex items-center gap-1 px-3 py-1.5 rounded-lg text-sm font-medium transition ${
                              student.isAssessmentComplete 
                              ? 'text-korpe-600 bg-korpe-50 hover:bg-korpe-100' 
                              : 'text-gray-400 bg-gray-100 cursor-not-allowed'
                            }`}
                          >
                            <FileText size={16} /> Görüntüle
                          </button>
                          {student.isAssessmentComplete && (
                            <button 
                             onClick={() => {
                               // Open view, then trigger print
                               onViewStudent(student); 
                               setTimeout(() => window.print(), 500);
                             }}
                             className="flex items-center gap-1 px-3 py-1.5 rounded-lg text-sm font-medium text-gray-600 bg-gray-50 hover:bg-gray-100 transition"
                            >
                             <Download size={16} />
                            </button>
                          )}
                        </div>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          )}
        </div>
      </div>
    </div>
  );
};