import React, { useState } from 'react';
import { 
  User, BookOpen, Briefcase, Calendar, FileText, 
  Menu, Bell, CheckCircle, Download,
  MessageSquare, GraduationCap, TrendingUp, 
  Brain, BarChart3, ArrowRight, Star, LogOut, ArrowLeft
} from 'lucide-react';
import { PersonalityRadar, InterestPieChart } from './ChartComponents';
import { StudentProfile, WeeklyPlan, CareerSuggestion, UniversitySuggestion, SkillGap, AcademicMatch, User as UserType } from '../types';
import { ChatAssistant } from './ChatAssistant';

interface StudentDashboardProps {
  user?: UserType;
  onLogout?: () => void;
  viewerRole?: 'student' | 'teacher' | 'parent'; 
  onBackToTeacher?: () => void;
}

// MOCK Fallback (Eğer AI çalışmazsa veya eski veri varsa)
const mockStudent: StudentProfile = {
  name: "Örnek Öğrenci",
  grade: "11. Sınıf",
  academicFocus: "Sayısal",
  personalityScores: [
    { subject: 'Sorumluluk', A: 85, fullMark: 100 },
    { subject: 'Dışadönüklük', A: 60, fullMark: 100 },
    { subject: 'Duygusal Denge', A: 70, fullMark: 100 },
    { subject: 'Uyumluluk', A: 80, fullMark: 100 },
    { subject: 'Açıklık', A: 75, fullMark: 100 },
  ]
};

export const StudentDashboard: React.FC<StudentDashboardProps> = ({ user, onLogout, viewerRole = 'student', onBackToTeacher }) => {
  const [activeTab, setActiveTab] = useState<'report' | 'plan'>('report');
  const [isChatOpen, setIsChatOpen] = useState(false);

  // Use Generated Report if available, otherwise mock
  const report = user?.report;
  const displayName = user ? user.name : mockStudent.name;
  
  // Convert RIASEC scores to Pie Chart Data if available
  const interestData = report?.riasecScores ? [
    { name: 'Gerçekçi (R)', value: report.riasecScores.R || 1 },
    { name: 'Araştırmacı (I)', value: report.riasecScores.I || 1 },
    { name: 'Sanatsal (A)', value: report.riasecScores.A || 1 },
    { name: 'Sosyal (S)', value: report.riasecScores.S || 1 },
    { name: 'Girişimci (E)', value: report.riasecScores.E || 1 },
    { name: 'Geleneksel (C)', value: report.riasecScores.C || 1 },
  ] : undefined;

  // Use Report data or empty arrays/mock
  const careers = report?.careers || [];
  const skills = report?.skills || [];
  const matches = report?.academicMatches || [];
  const universities = report?.universities || [];
  const plan = report?.weeklyPlan || [];
  const personalityText = report?.personalityAnalysis || "Analiz bekleniyor...";
  const interestText = report?.interestAnalysis || "Analiz bekleniyor...";

  return (
    <div className="flex h-screen bg-gray-50 overflow-hidden font-sans">
      
      {/* Sidebar - Hide when printing */}
      <aside className="w-64 bg-white border-r border-gray-200 hidden md:flex flex-col flex-shrink-0 print:hidden">
        <div className="p-6 border-b border-gray-100">
          <h2 className="text-2xl font-bold text-korpe-700 flex items-center gap-2">
            <span className="bg-korpe-100 p-1 rounded">
                <BookOpen className="w-6 h-6" />
            </span>
            KÖRPE AI
          </h2>
        </div>
        
        {viewerRole === 'teacher' && (
           <div className="px-4 pt-4">
             <button 
               onClick={onBackToTeacher}
               className="w-full flex items-center gap-2 px-4 py-2 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-lg text-sm font-medium transition"
             >
               <ArrowLeft size={16} /> Paneline Dön
             </button>
           </div>
        )}

        <div className="flex-1 py-6 px-4 space-y-1">
          <button 
            onClick={() => setActiveTab('report')}
            className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl transition ${activeTab === 'report' ? 'bg-korpe-50 text-korpe-700 font-medium' : 'text-gray-600 hover:bg-gray-50'}`}
          >
            <FileText size={20} /> Analiz Raporu
          </button>
          <button 
            onClick={() => setActiveTab('plan')}
            className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl transition ${activeTab === 'plan' ? 'bg-korpe-50 text-korpe-700 font-medium' : 'text-gray-600 hover:bg-gray-50'}`}
          >
            <Calendar size={20} /> 6 Haftalık Plan
          </button>
        </div>

        <div className="p-4 border-t border-gray-100">
          <div className="flex items-center gap-3 px-2 mb-4">
            <div className="w-10 h-10 rounded-full bg-korpe-200 flex items-center justify-center text-korpe-700 font-bold">
              {displayName.split(' ').map(n => n[0]).join('')}
            </div>
            <div className="overflow-hidden">
              <p className="text-sm font-semibold text-gray-900 truncate">{displayName}</p>
              <p className="text-xs text-gray-500">{user?.role === 'student' ? 'Öğrenci' : user?.role}</p>
            </div>
          </div>
          {onLogout && viewerRole === 'student' && (
             <button 
               onClick={onLogout}
               className="w-full flex items-center justify-center gap-2 text-sm text-red-500 hover:bg-red-50 py-2 rounded-lg transition"
             >
               <LogOut size={16} /> Çıkış Yap
             </button>
          )}
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 flex flex-col h-full overflow-hidden relative w-full">
        <header className="h-16 bg-white border-b border-gray-200 flex justify-between items-center px-6 flex-shrink-0 print:hidden">
          <div className="flex items-center gap-4">
            {viewerRole === 'teacher' && (
              <button onClick={onBackToTeacher} className="md:hidden p-2 text-gray-600">
                <ArrowLeft size={24} />
              </button>
            )}
            <h1 className="text-xl font-semibold text-gray-800">
              Yapay Zeka Destekli Kariyer Analizi
            </h1>
          </div>
          <div className="flex items-center gap-4">
            <button 
              onClick={() => setIsChatOpen(true)}
              className="bg-gradient-to-r from-korpe-500 to-korpe-600 text-white px-4 py-2 rounded-lg flex items-center gap-2 shadow-md hover:shadow-lg transition"
            >
              <MessageSquare size={18} />
              <span className="hidden sm:inline">AI Asistan'a Sor</span>
            </button>
            <button 
              onClick={() => window.print()}
              className="p-2 text-gray-400 hover:text-korpe-600 transition"
              title="Raporu İndir / Yazdır"
            >
              <Download size={20} />
            </button>
            <button className="p-2 text-gray-400 hover:text-korpe-600 transition">
              <Bell size={20} />
            </button>
          </div>
        </header>

        {/* Scrollable Area */}
        <div className="flex-1 overflow-y-auto p-4 lg:p-8 print:overflow-visible print:p-0">
          
          {activeTab === 'report' && (
            <div className="max-w-6xl mx-auto space-y-8 animate-fade-in print:max-w-none">
              
              <div className="hidden print:block mb-8 text-center border-b pb-4">
                <h1 className="text-3xl font-bold text-gray-900">KÖRPE AI Kariyer Raporu</h1>
                <p className="text-gray-600 mt-2">Öğrenci: {displayName} | Tarih: {new Date().toLocaleDateString('tr-TR')}</p>
              </div>

              {/* 1. Kişilik ve İlgi Profili */}
              <section className="grid lg:grid-cols-2 gap-6 print:grid-cols-2 print:gap-4 print:break-inside-avoid">
                {/* Kişilik */}
                <div className="bg-white p-6 rounded-2xl border border-gray-200 shadow-sm print:border-2">
                   <div className="flex items-center gap-3 mb-4">
                      <div className="p-2 bg-purple-100 text-purple-600 rounded-lg print:bg-transparent"><User size={24} /></div>
                      <h2 className="text-xl font-bold text-gray-900">Kişilik Analizi</h2>
                   </div>
                   <div className="flex flex-col gap-4">
                      <p className="text-gray-600 text-sm leading-relaxed italic">
                        "{personalityText}"
                      </p>
                      <div className="h-48 w-full">
                         <PersonalityRadar data={mockStudent.personalityScores} />
                      </div>
                   </div>
                </div>

                {/* İlgi */}
                <div className="bg-white p-6 rounded-2xl border border-gray-200 shadow-sm print:border-2">
                   <div className="flex items-center gap-3 mb-4">
                      <div className="p-2 bg-indigo-100 text-indigo-600 rounded-lg print:bg-transparent"><Brain size={24} /></div>
                      <h2 className="text-xl font-bold text-gray-900">İlgi Alanları (RIASEC)</h2>
                   </div>
                   <div className="flex flex-col gap-4">
                      <p className="text-gray-600 text-sm leading-relaxed italic">
                        "{interestText}"
                      </p>
                      {interestData && (
                        <div className="h-48 w-full">
                          <InterestPieChart /> 
                        </div>
                      )}
                   </div>
                </div>
              </section>

              {/* 2. Önerilen Meslekler */}
              <section className="print:break-inside-avoid print:mt-4">
                <div className="flex items-center gap-3 mb-4">
                  <div className="p-2 bg-indigo-100 text-indigo-600 rounded-lg print:bg-transparent">
                    <Briefcase size={24} />
                  </div>
                  <h2 className="text-2xl font-bold text-gray-900">Önerilen Meslekler</h2>
                </div>
                <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-4 print:grid-cols-2">
                  {careers.length > 0 ? careers.map((career, idx) => (
                    <div key={idx} className="bg-white rounded-xl border border-gray-200 p-5 shadow-sm hover:shadow-md transition relative group flex flex-col h-full print:border-2 print:shadow-none">
                      <div className="flex justify-between items-start mb-3">
                         <div className="p-2 bg-gray-100 rounded-lg text-gray-600 group-hover:bg-korpe-100 group-hover:text-korpe-600 transition print:hidden">
                            {idx === 0 ? <Briefcase size={20}/> : <Star size={20}/>}
                         </div>
                         <span className="text-lg font-bold text-green-600">%{career.matchPercentage}</span>
                      </div>
                      <h3 className="text-lg font-bold text-gray-900 mb-2">{career.title}</h3>
                      <p className="text-gray-600 text-xs mb-4 flex-1">{career.description}</p>
                      <div className="flex flex-wrap gap-1 mt-auto">
                        {career.requiredSkills?.slice(0, 3).map(s => (
                          <span key={s} className="text-[10px] bg-gray-50 border border-gray-100 text-gray-600 px-2 py-1 rounded print:border-gray-300">
                            {s}
                          </span>
                        ))}
                      </div>
                    </div>
                  )) : (
                    <div className="col-span-4 text-center text-gray-500 py-8">Meslek önerileri oluşturulamadı.</div>
                  )}
                </div>
              </section>

              {/* 3. Akademik - Meslek Eşleşmesi */}
              <section className="print:break-inside-avoid print:mt-4">
                <div className="flex items-center gap-3 mb-4">
                  <div className="p-2 bg-blue-100 text-blue-600 rounded-lg print:bg-transparent">
                    <BarChart3 size={24} />
                  </div>
                  <h2 className="text-2xl font-bold text-gray-900">Akademik - Meslek Eşleşmesi</h2>
                </div>
                <div className="bg-white rounded-2xl border border-gray-200 overflow-hidden shadow-sm print:border-2">
                  <div className="overflow-x-auto">
                    <table className="w-full text-left text-sm">
                      <thead className="bg-gray-50 border-b border-gray-200">
                        <tr>
                          <th className="p-4 font-semibold text-gray-700">Ders / Alan</th>
                          <th className="p-4 font-semibold text-gray-700">Tahmini Başarı</th>
                          <th className="p-4 font-semibold text-gray-700">Uygunluk</th>
                          <th className="p-4 font-semibold text-gray-700">Analiz</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-gray-100">
                        {matches.length > 0 ? matches.map((item, idx) => (
                          <tr key={idx} className="hover:bg-gray-50 transition">
                            <td className="p-4 font-medium text-gray-900">{item.course}</td>
                            <td className="p-4">
                              <span className={`px-2 py-1 rounded text-xs font-bold ${
                                item.score >= 85 ? 'bg-green-100 text-green-700' :
                                item.score >= 70 ? 'bg-yellow-100 text-yellow-700' :
                                'bg-red-100 text-red-700'
                              }`}>
                                {item.score}
                              </span>
                            </td>
                            <td className="p-4">
                               <span className={`flex items-center gap-1 text-xs font-bold uppercase ${
                                 item.relevance === 'Yüksek' ? 'text-green-600' :
                                 item.relevance === 'Orta' ? 'text-orange-500' : 'text-gray-500'
                               }`}>
                                 {item.relevance}
                               </span>
                            </td>
                            <td className="p-4 text-gray-600 italic">"{item.impactAnalysis}"</td>
                          </tr>
                        )) : (
                           <tr><td colSpan={4} className="p-4 text-center text-gray-500">Veri bulunamadı.</td></tr>
                        )}
                      </tbody>
                    </table>
                  </div>
                </div>
              </section>

              {/* 4. Temel Beceriler */}
               <section className="print:break-inside-avoid print:mt-4">
                <div className="flex items-center gap-3 mb-4">
                  <div className="p-2 bg-green-100 text-green-600 rounded-lg print:bg-transparent">
                    <Brain size={24} />
                  </div>
                  <h2 className="text-2xl font-bold text-gray-900">Beceriler</h2>
                </div>
                <div className="grid md:grid-cols-2 gap-6 print:gap-4">
                  {/* Güçlü */}
                  <div className="bg-white p-6 rounded-2xl border border-gray-200 print:border-2">
                    <h3 className="font-bold text-gray-800 mb-4 flex items-center gap-2">
                      <CheckCircle className="text-green-500" size={20} /> Güçlü Yönler
                    </h3>
                    <div className="space-y-4">
                      {skills.filter(s => s.type === 'core').map((skill, i) => (
                        <div key={i}>
                          <div className="flex justify-between text-sm mb-1">
                            <span className="font-medium text-gray-700">{skill.skill}</span>
                            <span className="font-bold text-green-600">%{skill.score}</span>
                          </div>
                          <div className="h-2 bg-gray-100 rounded-full overflow-hidden print:border print:border-gray-200">
                            <div className="h-full bg-green-500 rounded-full print:bg-green-600" style={{ width: `${skill.score}%` }}></div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                  {/* Gelişime Açık */}
                  <div className="bg-white p-6 rounded-2xl border border-gray-200 print:border-2">
                    <h3 className="font-bold text-gray-800 mb-4 flex items-center gap-2">
                      <TrendingUp className="text-orange-500" size={20} /> Gelişime Açık
                    </h3>
                    <div className="space-y-4">
                      {skills.filter(s => s.type === 'developmental').map((skill, i) => (
                        <div key={i}>
                          <div className="flex justify-between text-sm mb-1">
                            <span className="font-medium text-gray-700">{skill.skill}</span>
                            <span className="font-bold text-orange-600">%{skill.score}</span>
                          </div>
                          <div className="h-2 bg-gray-100 rounded-full overflow-hidden print:border print:border-gray-200">
                            <div className="h-full bg-orange-400 rounded-full print:bg-orange-500" style={{ width: `${skill.score}%` }}></div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </section>

              {/* 5. Üniversite */}
              <section className="print:break-inside-avoid print:mt-4">
                 <div className="flex items-center gap-3 mb-4">
                  <div className="p-2 bg-red-100 text-red-600 rounded-lg print:bg-transparent">
                    <GraduationCap size={24} />
                  </div>
                  <h2 className="text-2xl font-bold text-gray-900">Üniversite & Bölüm</h2>
                </div>
                <div className="grid md:grid-cols-3 gap-6 print:grid-cols-3 print:gap-4">
                  {universities.map((uni, idx) => (
                    <div key={idx} className="bg-white p-5 rounded-2xl border border-gray-200 hover:border-korpe-300 transition group print:border-2 print:shadow-none">
                      <div className="flex justify-between items-start mb-2">
                         <span className="text-xs bg-gray-100 text-gray-600 px-2 py-1 rounded-md font-medium">{uni.city}</span>
                         <span className="text-xs bg-korpe-50 text-korpe-700 px-2 py-1 rounded-md font-bold">% {uni.matchScore} Hedef</span>
                      </div>
                      <h4 className="font-bold text-gray-900 text-lg mt-2">{uni.university}</h4>
                      <p className="text-korpe-600 font-medium text-sm mb-4 print:text-black">{uni.department}</p>
                    </div>
                  ))}
                </div>
              </section>

              {/* 6. Plan Teaser */}
              <section className="bg-gradient-to-br from-gray-900 to-indigo-900 rounded-3xl p-8 text-white relative overflow-hidden print:hidden">
                 <div className="relative z-10 flex flex-col md:flex-row items-center justify-between gap-8">
                   <div className="space-y-4">
                      <div className="flex items-center gap-2 text-korpe-300 font-bold uppercase tracking-widest text-sm">
                        <Calendar size={16} /> Aksiyon Planı
                      </div>
                      <h2 className="text-3xl font-bold leading-tight">6 Haftalık Gelişim Rotası</h2>
                      <button 
                        onClick={() => setActiveTab('plan')}
                        className="bg-white text-gray-900 px-6 py-3 rounded-xl font-bold hover:bg-gray-100 transition flex items-center gap-2"
                      >
                        Planı Görüntüle <ArrowRight size={20} />
                      </button>
                   </div>
                 </div>
              </section>

            </div>
          )}

          {activeTab === 'plan' && (
            <div className="max-w-4xl mx-auto animate-fade-in print:max-w-none">
               <div className="mb-8 flex items-center gap-4 print:hidden">
                 <button onClick={() => setActiveTab('report')} className="p-2 hover:bg-gray-100 rounded-full transition">
                   <ArrowRight className="rotate-180 text-gray-500" />
                 </button>
                 <div>
                    <h2 className="text-2xl font-bold text-gray-900">6 Haftalık Kişisel Gelişim Planı</h2>
                 </div>
              </div>
              
              <div className="space-y-4 print:space-y-6">
                {plan.length > 0 ? plan.map((week, index) => (
                  <div key={week.week} className="relative pl-8 pb-8 border-l-2 border-gray-200 last:pb-0 print:border-l-0 print:pl-0 print:pb-0">
                    <div className="absolute -left-[9px] top-0 w-4 h-4 rounded-full border-2 bg-white border-korpe-600 print:hidden"></div>
                    <div className="p-5 rounded-xl border bg-white border-gray-200 print:border-2">
                      <div className="flex justify-between items-center mb-2">
                        <span className="text-xs font-bold uppercase tracking-wider text-korpe-600 print:text-black">
                          {week.week}. Hafta
                        </span>
                      </div>
                      <h3 className="text-lg font-bold text-gray-900 mb-3">{week.title}</h3>
                      <ul className="space-y-2">
                        {week.tasks.map((task, i) => (
                          <li key={i} className="flex items-center gap-2 text-sm text-gray-700">
                            <div className="w-1.5 h-1.5 rounded-full bg-gray-400 print:bg-black"></div>
                            {task}
                          </li>
                        ))}
                      </ul>
                    </div>
                  </div>
                )) : (
                  <div className="text-center py-8 text-gray-500">Plan verisi oluşturulamadı.</div>
                )}
              </div>
            </div>
          )}

        </div>
      </main>

      <div className="print:hidden">
         <ChatAssistant isOpen={isChatOpen} onClose={() => setIsChatOpen(false)} />
      </div>
    </div>
  );
};