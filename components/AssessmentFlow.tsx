
import React, { useState } from 'react';
import { Brain, Loader2, Smile, Frown, AlertCircle, Save, UserPlus, ArrowRight } from 'lucide-react';
import { User, CareerReport } from '../types';
import { generateCareerReport } from '../services/geminiService';

interface AssessmentFlowProps {
  onComplete: (report: CareerReport) => void;
  onRegisterAndSave?: (userData: Omit<User, 'id'>, report: CareerReport) => void;
  isGuest: boolean;
}

// 90 Soruluk Tam Holland Envanteri
const HOLLAND_QUESTIONS = [
  "Kuşların nasıl göç ettiğini öğrenmek",
  "İnsanlara yeni bir hobi öğretmek",
  "Hava durumu tahmini için kişisel gözlemleri kullanmak",
  "Bitki hastalıklarını incelemek",
  "Bankaya yatırılan paranın faizini hesaplamak",
  "Resimler tasarlamak ve çizmek",
  "Bir iş yaptırmak için parayla adam tutmak",
  "Bir bilim müzesini incelemek",
  "Gözlük için mercekleri parlatmak",
  "Modern yazarların yazı stillerini araştırmak",
  "Mikroskop gibi laboratuar aletlerini kullanmak",
  "Bir dükkanda envanter tutmak",
  "Bir kuş yemliği tasarlamak",
  "Bir oyun için takım oluşturma",
  "Yeni bir satış kampanyası düzenlemek",
  "Bir toplantıyı yönetmek",
  "Vitaminlerin hayvanlar üzerindeki etkisini araştırmak",
  "Küçük bir işletmeyi idare etmek",
  "Bir makinenin nasıl kullanılacağı konusunda talimatlar yazmak",
  "Diğer insanlar için iş planlamak",
  "Küçük grup tartışmalarına katılmak",
  "Yeni bir cerrahi işlem hakkında yazılar okumak",
  "Mali bir hesaptaki hataları bulmak",
  "Bir rapor taslağındaki hataları bulmak incelemek",
  "Planlar ve grafikler yapmak",
  "Fırtınadan sonra zarar görmüş bir ağacı onarmak",
  "Kusurları bulmak için mamulleri incelemek",
  "Telefonla iş idare etmek",
  "Acil durumlarda insanlara tardım etmek",
  "Bir kuruluşun parayla ilgili bütün işlerini idare etmek",
  "Müzik eseri bestelemek veya düzenlemek",
  "Filmler için konu müziği bestelemek",
  "Yeni kurallar veya politikalar geliştirmek",
  "Biyoloji çalışmak",
  "Bir politik kurum için kampanyaya katılmak",
  "Maddeleri ayırmak, biriktirmek ve saklamak",
  "Bir toplum geliştirme projesinde çalışmak",
  "Bir daktilonun nasıl tamir edileceğini öğrenmek",
  "Dünyanın merkezi, güneş ve yıldızlar hakkında kitaplar okumak",
  "Tam doğru zaman tutmak için bir saati ayarlamak",
  "Beynin nasıl çalıştığını öğrenmek",
  "Yaratıcı fotoğraflar çekmek",
  "Masraflara ait hesap kayıtları tutmak",
  "Bir bandoda çalmak",
  "Bir orkestrada caz müziği çalmak",
  "Bir grup veya klüp için bütçe hazırlamak",
  "Depremin nedenlerini araştırmak",
  "Ünlü bir bilim adamının dersine katılmak",
  "Bir proje üzerinde başkaları ile beraber çalışmak",
  "Bir sinema filmi senaryosu yazmak",
  "Şirket hakkındaki şikayetleri konusunda işçilerle röportaj yapmak",
  "Mobilya yapmak",
  "Değerli taşları kesmeyi ve parlatmayı öğrenmek",
  "Yaralı bir insana ilkyardım yapmak",
  "Yerel bir radyo istasyonunda çalınması için müzik parçaları seçmek",
  "İl genel meclisinde çalışmak",
  "Mali raporları hazırlamak ve yorumlamak",
  "Tehlikedeki bir insana yardım etmeye çalışmak",
  "Elektronik alet çalıştırmak",
  "Çocuklara nasıl oyun oynanacağını veya spor yapılacağını göstermek",
  "Bir ustayı televizyon tamir ederken seyretmek",
  "Bir magazin hikayesini anlatan çizimler yapmak",
  "Ziyaretçilere yol göstermek",
  "Diğer insanların bir problemin çözülebileceğine nasıl inandıklarını öğrenmek",
  "Bir sergiye gezi düzenlemek",
  "Uyuşturucu kullanan insanlara danışmanlık yapmak",
  "İş gazeteleri veya dergileri okumak",
  "Yıldızların oluşumunu öğrenmek",
  "Taksit ödemelerini tahsil etmek",
  "Bir slayt veya film projektörünü çalıştırmak",
  "Kelebekleri gözlemlemek ve sınıflandırmak",
  "Metal bir heykel tasarlamak",
  "İnsanlara kanuni doğruları açıklamak",
  "Kısa hikayeler yazmak",
  "İnsanların mali kararlar vermelerine yardımcı olmak",
  "Gelir vergisi kazancını düzenlemek",
  "Sertifika, plaket veya taktir belgesi kazanmak",
  "Tiyatro oyunu, müzikaller gibi sanatsal etkinliklerin eleştirilerini yazmak",
  "Aylık bütçe planı yapmak",
  "Bir havuz veya gölde yabani hayatı araştırmak",
  "Bir tiyatro oyununda rol almak",
  "Bir resim çerçevesi yapmak",
  "İş gezilerine çıkmak",
  "Orman yangınları için gözetleme yapmak",
  "Yeni alışveriş merkezinin tanıtımını yapmak",
  "Bir muhasebecilik sistemi kurmak",
  "Arkadaşlar arasındaki bir tartışmayı yatıştırmak",
  "Birine önemli bir karar vermesinde yardım etmek",
  "Taşıma için nakil maliyetlerini hesaplamak",
  "Fıkralar ve hikayeler anlatarak insanları eğlendirmek"
];

// PDF'teki Anahtar (1-tabanlı index'i 0-tabanlıya çeviriyoruz)
const SCORING_KEY = {
  R: [9, 13, 19, 25, 26, 38, 40, 52, 53, 54, 59, 61, 70, 82, 84].map(i => i-1),
  I: [1, 3, 4, 8, 11, 17, 22, 34, 39, 41, 47, 48, 68, 71, 80].map(i => i-1),
  A: [6, 10, 14, 31, 32, 42, 44, 45, 50, 62, 72, 74, 77, 78, 81].map(i => i-1),
  S: [2, 21, 29, 37, 49, 55, 58, 60, 64, 65, 66, 73, 87, 88, 90].map(i => i-1),
  E: [7, 15, 16, 18, 20, 28, 33, 35, 51, 56, 63, 67, 75, 83, 85].map(i => i-1),
  C: [5, 12, 23, 24, 27, 30, 36, 43, 46, 57, 69, 76, 79, 86, 89].map(i => i-1),
};

export const AssessmentFlow: React.FC<AssessmentFlowProps> = ({ onComplete, onRegisterAndSave, isGuest }) => {
  const [currentStep, setCurrentStep] = useState(0);
  const [answers, setAnswers] = useState<Record<number, string>>({}); // 'like' | 'neutral' | 'dislike'
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [generatedReport, setGeneratedReport] = useState<CareerReport | null>(null);
  
  // Registration Prompts
  const [showRegisterPrompt, setShowRegisterPrompt] = useState(false);
  const [showRegisterForm, setShowRegisterForm] = useState(false);

  // Registration Form State
  const [regData, setRegData] = useState({
    name: '',
    username: '',
    password: '',
    teacherUsername: '',
    parentName: '',
    parentContact: ''
  });

  const totalQuestions = HOLLAND_QUESTIONS.length;
  const progress = ((currentStep) / totalQuestions) * 100;

  const handleAnswer = (choice: 'like' | 'neutral' | 'dislike') => {
    setAnswers(prev => ({ ...prev, [currentStep]: choice }));

    if (currentStep < totalQuestions - 1) {
      setCurrentStep(prev => prev + 1);
    } else {
      finishAssessment();
    }
  };

  const calculateScores = () => {
    const scores: { [key: string]: number } = { R:0, I:0, A:0, S:0, E:0, C:0 };
    
    // Basit Puanlama: Like=1, Neutral=0, Dislike=0 (PDF'teki Hoşlanırım sayısı)
    Object.keys(answers).forEach((key) => {
      const qIndex = parseInt(key);
      const answer = answers[qIndex];
      if (answer === 'like') {
        if (SCORING_KEY.R.includes(qIndex)) scores.R++;
        if (SCORING_KEY.I.includes(qIndex)) scores.I++;
        if (SCORING_KEY.A.includes(qIndex)) scores.A++;
        if (SCORING_KEY.S.includes(qIndex)) scores.S++;
        if (SCORING_KEY.E.includes(qIndex)) scores.E++;
        if (SCORING_KEY.C.includes(qIndex)) scores.C++;
      }
    });
    return scores;
  };

  const finishAssessment = async () => {
    setIsAnalyzing(true);
    
    const scores = calculateScores();
    // AI ile rapor üret
    const report = await generateCareerReport(scores, regData.name || "Öğrenci");
    
    // AI Hatası durumunda fallback (boş bir yapı)
    const finalReport: CareerReport = report || {
      generatedAt: new Date(),
      personalityAnalysis: "Analiz sırasında hata oluştu.",
      interestAnalysis: "Yeterli veri alınamadı.",
      careers: [],
      skills: [],
      academicMatches: [],
      universities: [],
      weeklyPlan: [],
      riasecScores: scores
    };
    
    finalReport.riasecScores = scores; // Skorları rapora ekle
    setGeneratedReport(finalReport);
    setIsAnalyzing(false);

    if (isGuest) {
      setShowRegisterPrompt(true);
    } else {
      onComplete(finalReport);
    }
  };

  const handleRegisterSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (onRegisterAndSave && generatedReport) {
      onRegisterAndSave({
        ...regData,
        role: 'student',
        isAssessmentComplete: true
      }, generatedReport);
    }
  };

  const handleGuestContinue = () => {
    if (generatedReport) {
      onComplete(generatedReport);
    }
  };

  // Loading Screen
  if (isAnalyzing) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-gray-50 p-4 text-center">
        <Loader2 className="w-16 h-16 text-korpe-600 animate-spin mb-6" />
        <h2 className="text-2xl font-bold text-gray-800">Kişilik Profilin Analiz Ediliyor...</h2>
        <p className="text-gray-500 mt-2 max-w-md mx-auto">
          Gemini AI, 90 soruya verdiğin yanıtları RIASEC kuramına göre işliyor ve sana en uygun meslekleri belirliyor.
        </p>
      </div>
    );
  }

  // "Sisteme Kayıt Olmak İster misin?" Prompt
  if (showRegisterPrompt && !showRegisterForm) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
        <div className="bg-white rounded-2xl p-8 max-w-lg w-full shadow-2xl animate-fade-in text-center">
           <div className="w-16 h-16 bg-korpe-100 rounded-full flex items-center justify-center mx-auto mb-4 text-korpe-600">
             <Save size={32} />
           </div>
           <h2 className="text-2xl font-bold text-gray-900 mb-2">Raporun Hazır!</h2>
           <p className="text-gray-600 mb-8 text-lg">
             "Sisteme kayıt olarak raporun öğretmen tarafından görüntülenmesini ister misin?"
           </p>
           
           <div className="flex flex-col gap-3">
             <button 
               onClick={() => setShowRegisterForm(true)}
               className="w-full py-3.5 bg-korpe-600 hover:bg-korpe-700 text-white rounded-xl font-bold transition flex items-center justify-center gap-2"
             >
               <UserPlus size={20} /> Evet, Kayıt Ol ve Paylaş
             </button>
             <button 
               onClick={handleGuestContinue}
               className="w-full py-3.5 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-xl font-medium transition"
             >
               Hayır, Misafir Olarak Raporu Gör
             </button>
           </div>
           <p className="text-xs text-gray-400 mt-4">Misafir girişlerinde raporlar oturum kapanınca silinir.</p>
        </div>
      </div>
    );
  }

  // Registration Form
  if (showRegisterForm) {
     return (
       <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
         <div className="bg-white rounded-2xl p-8 max-w-lg w-full shadow-2xl animate-fade-in">
            <h3 className="text-xl font-bold text-gray-900 mb-1">Kayıt Bilgilerini Tamamla</h3>
            <p className="text-sm text-gray-500 mb-6">Öğretmeninin seni takip edebilmesi için aşağıdaki bilgileri doldur.</p>
            
            <form onSubmit={handleRegisterSubmit} className="space-y-4">
              <input
                type="text"
                placeholder="Adın Soyadın"
                required
                className="w-full px-4 py-2 rounded-lg border border-gray-300 outline-none focus:border-korpe-500"
                value={regData.name}
                onChange={e => setRegData({...regData, name: e.target.value})}
              />
              <div className="grid grid-cols-2 gap-3">
                <input
                  type="text"
                  placeholder="Kullanıcı Adı"
                  required
                  className="w-full px-4 py-2 rounded-lg border border-gray-300 outline-none focus:border-korpe-500"
                  value={regData.username}
                  onChange={e => setRegData({...regData, username: e.target.value})}
                />
                <input
                  type="password"
                  placeholder="Şifre"
                  required
                  className="w-full px-4 py-2 rounded-lg border border-gray-300 outline-none focus:border-korpe-500"
                  value={regData.password}
                  onChange={e => setRegData({...regData, password: e.target.value})}
                />
              </div>
              
              <div className="p-4 bg-blue-50 rounded-xl border border-blue-100 space-y-3">
                 <div className="flex items-center gap-2 text-blue-800 text-sm font-semibold">
                    <UserPlus size={16} /> Öğretmen & Veli Bağlantısı
                 </div>
                 <input
                  type="text"
                  placeholder="Danışman Öğretmen Kullanıcı Adı (Örn: rizebist)"
                  className="w-full px-4 py-2 rounded-lg border border-blue-200 outline-none focus:border-blue-500 text-sm"
                  value={regData.teacherUsername}
                  onChange={e => setRegData({...regData, teacherUsername: e.target.value})}
                />
                 <input
                  type="text"
                  placeholder="Veli Adı"
                  className="w-full px-4 py-2 rounded-lg border border-blue-200 outline-none focus:border-blue-500 text-sm"
                  value={regData.parentName}
                  onChange={e => setRegData({...regData, parentName: e.target.value})}
                />
                <input
                  type="text"
                  placeholder="Veli İletişim (Tel)"
                  className="w-full px-4 py-2 rounded-lg border border-blue-200 outline-none focus:border-blue-500 text-sm"
                  value={regData.parentContact}
                  onChange={e => setRegData({...regData, parentContact: e.target.value})}
                />
              </div>

              <button 
                type="submit"
                className="w-full py-3 bg-korpe-600 hover:bg-korpe-700 text-white rounded-xl font-bold transition"
              >
                Kaydı Tamamla ve Raporu Aç
              </button>
            </form>
         </div>
       </div>
     );
  }

  // Active Question View
  // Sayfalama (10'lu gruplar)
  const QUESTIONS_PER_PAGE = 10;
  const currentPage = Math.floor(currentStep / QUESTIONS_PER_PAGE);
  const startIdx = currentPage * QUESTIONS_PER_PAGE;
  const endIdx = Math.min(startIdx + QUESTIONS_PER_PAGE, totalQuestions);
  const currentQuestions = HOLLAND_QUESTIONS.slice(startIdx, endIdx);

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      {/* Header */}
      <header className="bg-white border-b border-gray-200 px-6 py-4 flex justify-between items-center shadow-sm">
        <div className="flex items-center gap-2">
           <div className="bg-korpe-100 p-1.5 rounded-lg text-korpe-600">
             <Brain size={20} />
           </div>
           <span className="font-bold text-gray-800">Holland Mesleki Tercih Envanteri</span>
        </div>
        <div className="text-sm font-medium text-gray-600 bg-gray-100 px-3 py-1 rounded-full">
           İlerleme: %{Math.round(progress)}
        </div>
      </header>

      {/* Progress Bar */}
      <div className="w-full bg-gray-200 h-1.5">
        <div 
          className="bg-korpe-600 h-1.5 transition-all duration-300 ease-out" 
          style={{ width: `${progress}%` }}
        ></div>
      </div>

      {/* Main Content (Scrollable List) */}
      <div className="flex-1 overflow-y-auto p-4 md:p-8">
        <div className="max-w-3xl mx-auto space-y-6">
           <div className="bg-blue-50 p-4 rounded-xl border border-blue-100 text-blue-800 text-sm mb-6">
             <strong className="block mb-1">Yönerge:</strong> Aşağıdaki aktiviteleri okuyun ve her biri için size en uygun olan (Hoşlanırım, Farketmez, Hoşlanmam) seçeneği işaretleyin.
           </div>

           {currentQuestions.map((q, idx) => {
             const realIndex = startIdx + idx;
             const isAnswered = answers[realIndex] !== undefined;

             return (
               <div key={realIndex} className={`bg-white p-6 rounded-xl border shadow-sm transition ${isAnswered ? 'border-korpe-200 bg-korpe-50/10' : 'border-gray-200'}`}>
                  <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                    <div className="flex-1">
                      <span className="text-xs font-bold text-gray-400 mb-1 block">SORU {realIndex + 1}</span>
                      <h3 className="text-gray-900 font-medium text-lg">{q}</h3>
                    </div>
                    
                    <div className="flex gap-2 shrink-0">
                      <button 
                        onClick={() => handleAnswer('dislike')}
                        className={`px-4 py-2 rounded-lg text-sm font-medium border transition ${
                            answers[realIndex] === 'dislike' 
                            ? 'bg-red-100 border-red-300 text-red-700' 
                            : 'bg-white border-gray-200 text-gray-600 hover:bg-gray-50'
                        }`}
                      >
                         Hoşlanmam
                      </button>
                      <button 
                        onClick={() => handleAnswer('neutral')}
                        className={`px-4 py-2 rounded-lg text-sm font-medium border transition ${
                            answers[realIndex] === 'neutral' 
                            ? 'bg-yellow-100 border-yellow-300 text-yellow-700' 
                            : 'bg-white border-gray-200 text-gray-600 hover:bg-gray-50'
                        }`}
                      >
                         Farketmez
                      </button>
                      <button 
                        onClick={() => handleAnswer('like')}
                        className={`px-4 py-2 rounded-lg text-sm font-medium border transition ${
                            answers[realIndex] === 'like' 
                            ? 'bg-green-100 border-green-300 text-green-700' 
                            : 'bg-white border-gray-200 text-gray-600 hover:bg-gray-50'
                        }`}
                      >
                         Hoşlanırım
                      </button>
                    </div>
                  </div>
               </div>
             );
           })}
           
           {/* Pagination / Next Button */}
           <div className="flex justify-end pt-4">
              <button 
                onClick={() => {
                    // Check if all on current page are answered
                    const allAnswered = currentQuestions.every((_, i) => answers[startIdx + i] !== undefined);
                    if (allAnswered) {
                        if (endIdx >= totalQuestions) {
                            finishAssessment();
                        } else {
                            setCurrentStep(endIdx); // Move to next page start
                            window.scrollTo(0,0);
                        }
                    } else {
                        alert("Lütfen sayfadaki tüm soruları cevaplayınız.");
                    }
                }}
                className="bg-korpe-600 hover:bg-korpe-700 text-white px-8 py-3 rounded-xl font-bold shadow-lg transition flex items-center gap-2"
              >
                {endIdx >= totalQuestions ? 'Testi Tamamla ve Analiz Et' : 'Sonraki Sayfa'} <ArrowRight size={20} />
              </button>
           </div>
        </div>
      </div>
    </div>
  );
};
