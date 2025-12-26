
import React, { useState } from 'react';
import { Brain, Loader2, Save, UserPlus, ArrowRight, Gauge, BookOpen, GraduationCap, SkipForward, CheckCircle2, Lightbulb, Target, Code, MessageCircle, Users, TrendingUp } from 'lucide-react';
import { User, CareerReport, SupplementalData, AssessmentStage } from '../types';
import { generateCareerReport } from '../services/geminiService';

interface AssessmentFlowProps {
  onComplete: (report: CareerReport) => void;
  onRegisterAndSave?: (userData: Omit<User, 'id'>, report: CareerReport) => void;
  isGuest: boolean;
}

const HOLLAND_QUESTIONS = [
  "Kuşların nasıl göç ettiğini öğrenmek", "İnsanlara yeni bir hobi öğretmek", "Hava durumu tahmini için kişisel gözlemleri kullanmak",
  "Bitki hastalıklarını incelemek", "Bankaya yatırılan paranın faizini hesaplamak", "Resimler tasarlamak ve çizmek",
  "Bir iş yaptırmak için parayla adam tutmak", "Bir bilim müzesini incelemek", "Gözlük için mercekleri parlatmak",
  "Modern yazarların yazı stillerini araştırmak", "Mikroskop gibi laboratuar aletlerini kullanmak", "Bir dükkanda envanter tutmak",
  "Bir kuş yemliği tasarlamak", "Bir oyun için takım oluşturma", "Yeni bir satış kampanyası düzenlemek",
  "Bir toplantıyı yönetmek", "Vitaminlerin hayvanlar üzerindeki etkisini araştırmak", "Küçük bir işletmeyi idare etmek",
  "Bir makinenin nasıl kullanılacağı konusunda talimatlar yazmak", "Diğer insanlar için iş planlamak", "Küçük grup tartışmalarına katılmak",
  "Yeni bir cerrahi işlem hakkında yazılar okumak", "Mali bir hesaptaki hataları bulmak", "Bir rapor taslağındaki hataları bulmak incelemek",
  "Planlar ve grafikler yapmak", "Fırtınadan sonra zarar görmüş bir ağacı onarmak", "Kusurları bulmak için mamulleri incelemek",
  "Telefonla iş idare etmek", "Acil durumlarda insanlara tardım etmek", "Bir kuruluşun parayla ilgili bütün işlerini idare etmek",
  "Müzik eseri bestelemek veya düzenlemek", "Filmler için konu müziği bestelemek", "Yeni kurallar veya politikalar geliştirmek",
  "Biyoloji çalışmak", "Bir politik kurum için kampanyaya katılmak", "Maddeleri ayırmak, biriktirmek ve saklamak",
  "Bir toplum geliştirme projesinde çalışmak", "Bir daktilonun nasıl tamir edileceğini öğrenmek", "Dünyanın merkezi, güneş ve yıldızlar hakkında kitaplar okumak",
  "Tam doğru zaman tutmak için bir saati ayarlamak", "Beynin nasıl çalıştığını öğrenmek", "Yaratıcı fotoğraflar çekmek",
  "Masraflara ait hesap kayıtları tutmak", "Bir bandoda çalmak", "Bir orkestrada caz müziği çalmak",
  "Bir grup veya klüp için bütçe hazırlamak", "Depremin nedenlerini araştırmak", "Ünlü bir bilim adamının dersine katılmak",
  "Bir proje üzerinde başkaları ile beraber çalışmak", "Bir sinema filmi senaryosu yazmak", "Şirket hakkındaki şikayetleri konusunda işçilerle röportaj yapmak",
  "Mobilya yapmak", "Değerli taşları kesmeyi ve parlatmayı öğrenmek", "Yaralı bir insana ilkyardım yapmak",
  "Yerel bir radyo istasyonunda çalınması için müzik parçaları seçmek", "İl genel meclisinde çalışmak", "Mali raporları hazırlamak ve yorumlamak",
  "Tehlikedeki bir insana yardım etmeye çalışmak", "Elektronik alet çalıştırmak", "Çocuklara nasıl oyun oynanacağını veya spor yapılacağını göstermek",
  "Bir ustayı televizyon tamir ederken seyretmek", "Bir magazin hikayesini anlatan çizimler yapmak", "Ziyaretçilere yol göstermek",
  "Diğer insanların bir problemin çözülebileceğine nasıl inandıklarını öğrenmek", "Bir sergiye gezi düzenlemek", "Uyuşturucu kullanan insanlara danışmanlık yapmak",
  "İş gazeteleri veya dergileri okumak", "Yıldızların oluşumunu öğrenmek", "Taksit ödemelerini tahsil etmek",
  "Bir slayt veya film projektörünü çalıştırmak", "Kelebekleri gözlemlemek ve sınıflandırmak", "Metal bir heykel tasarlamak",
  "İnsanlara kanuni doğruları açıklamak", "Kısa hikayeler yazmak", "İnsanların mali kararlar vermelerine yardımcı olmak",
  "Gelir vergisi kazancını düzenlemek", "Sertifika, plaket veya taktir belgesi kazanmak", "Tiyatro oyunu, müzikaller gibi sanatsal etkinliklerin eleştirilerini yazmak",
  "Aylık bütçe planı yapmak", "Bir havuz veya gölde yabani hayatı araştırmak", "Bir tiyatro oyununda rol almak",
  "Bir resim çerçevesi yapmak", "İş gezilerine çıkmak", "Orman yangınları için gözetleme yapmak",
  "Yeni alışveriş merkezinin tanıtımını yapmak", "Bir muhasebecilik sistemi kurmak", "Arkadaşlar arasındaki bir tartışmayı yatıştırmak",
  "Birine önemli bir karar vermesinde yardım etmek", "Taşıma için nakil maliyetlerini hesaplamak", "Fıkralar ve hikayeler anlatarak insanları eğlendirmek"
];

const HOLLAND_KEY = {
  R: [9, 13, 19, 25, 26, 38, 40, 52, 53, 54, 59, 61, 70, 82, 84].map(i => i-1),
  I: [1, 3, 4, 8, 11, 17, 22, 34, 39, 41, 47, 48, 68, 71, 80].map(i => i-1),
  A: [6, 10, 14, 31, 32, 42, 44, 45, 50, 62, 72, 74, 77, 78, 81].map(i => i-1),
  S: [2, 21, 29, 37, 49, 55, 58, 60, 64, 65, 66, 73, 87, 88, 90].map(i => i-1),
  E: [7, 15, 16, 18, 20, 28, 33, 35, 51, 56, 63, 67, 75, 83, 85].map(i => i-1),
  C: [5, 12, 23, 24, 27, 30, 36, 43, 46, 57, 69, 76, 79, 86, 89].map(i => i-1),
};

const MI_QUESTIONS = [
  "Kitap okumaktan, hikaye anlatmaktan ve kelime oyunlarından hoşlanırım.", "Duyduğum şeyleri kolayca hatırlarım.", "Kelimeleri etkili kullanırım.", "Yabancı dil yeteneğim vardır.", "Kelime şakalarını severim.",
  "Matematiksel problemleri zihinden çözerim.", "Neden-sonuç ilişkisi kurarım.", "Strateji oyunlarını severim.", "Bilimsel deneylere meraklıyımdır.", "İşlerimi mantık sırasına göre planlarım.",
  "Harita ve şemaları kolayca anlarım.", "Hayal gücüm kuvvetlidir.", "Yapboz yapmayı severim.", "Yönümü kolayca bulurum.", "Çizim yapmaktan hoşlanırım.",
  "Hareketi severim.", "El becerisi gerektiren işlerde iyiyimdir.", "Spor yapmaktan hoşlanırım.", "Yaparak öğrenirim.", "Vücut dilini iyi kullanırım.",
  "Melodileri kolayca hatırlarım.", "Müzik dinlemeden çalışamam.", "Enstrüman çalmak isterim.", "Ritim tutmayı severim.", "Seslere duyarlıyımdır.",
  "Arkadaşlarımla vakit geçirmeyi severim.", "Sorunları dinler ve çözüm bulurum.", "Liderlik yapabilirim.", "Duyguları kolayca anlarım.", "Yeni insanlarla tanışmayı severim.",
  "Yalnız çalışmayı severim.", "Güçlü ve zayıf yönlerimi bilirim.", "Hedeflerime ulaşmak için çalışırım.", "Düşüncelerimi yazmayı severim.", "Bağımsız hareket ederim.",
  "Doğada vakit geçirmeyi severim.", "Hayvanlarla ilgilenirim.", "Bitki yetiştirmeyi severim.", "Çevre sorunlarına duyarlıyımdır.", "Canlı türlerini incelemeyi severim."
];

const MI_KEY = {
  Linguistic: [0, 1, 2, 3, 4], Logical: [5, 6, 7, 8, 9], Spatial: [10, 11, 12, 13, 14], Kinesthetic: [15, 16, 17, 18, 19],
  Musical: [20, 21, 22, 23, 24], Interpersonal: [25, 26, 27, 28, 29], Intrapersonal: [30, 31, 32, 33, 34], Naturalist: [35, 36, 37, 38, 39]
};

export const AssessmentFlow: React.FC<AssessmentFlowProps> = ({ onComplete, onRegisterAndSave, isGuest }) => {
  const [stage, setStage] = useState<AssessmentStage>('holland');
  const [hollandStep, setHollandStep] = useState(0);
  const [hollandAnswers, setHollandAnswers] = useState<Record<number, string>>({});
  const [miStep, setMiStep] = useState(0);
  const [miAnswers, setMiAnswers] = useState<Record<number, number>>({});
  const [supplementalData, setSupplementalData] = useState<SupplementalData>({
    gpa: undefined, previousGpa: undefined, focusArea: '',
    subjectGrades: { math: 0, science: 0, turkish: 0, social: 0, language: 0 },
    hobbies: '', futureGoals: '',
    technicalSkills: { coding: 1, problemSolving: 1, teamwork: 1, presentation: 1 }
  });
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [regData, setRegData] = useState({ name: '', username: '', password: '', teacherUsername: '', parentName: '', parentContact: '' });

  const handleHollandAnswer = (choice: 'like' | 'neutral' | 'dislike') => {
    setHollandAnswers(prev => ({ ...prev, [hollandStep]: choice }));
    if (hollandStep < HOLLAND_QUESTIONS.length - 1) setHollandStep(prev => prev + 1);
    else { setStage('transition_to_mi'); window.scrollTo(0,0); }
  };

  const handleMiAnswer = (score: number) => {
    setMiAnswers(prev => ({ ...prev, [miStep]: score }));
    if (miStep < MI_QUESTIONS.length - 1) setMiStep(prev => prev + 1);
    else { setStage('transition_to_academic'); window.scrollTo(0,0); }
  };

  const finishAssessment = async (finalSupplementalData?: SupplementalData) => {
    setIsAnalyzing(true);
    const hollandScores: Record<string, number> = { R:0, I:0, A:0, S:0, E:0, C:0 };
    Object.keys(hollandAnswers).forEach(k => {
      const idx = parseInt(k);
      if (hollandAnswers[idx] === 'like') {
        Object.entries(HOLLAND_KEY).forEach(([key, indices]) => { if (indices.includes(idx)) hollandScores[key]++; });
      }
    });

    const miRaw: Record<string, number> = { Linguistic:0, Logical:0, Spatial:0, Kinesthetic:0, Musical:0, Interpersonal:0, Intrapersonal:0, Naturalist:0 };
    Object.keys(miAnswers).forEach(k => {
      const idx = parseInt(k);
      const score = miAnswers[idx];
      Object.entries(MI_KEY).forEach(([key, indices]) => { if (indices.includes(idx)) miRaw[key] += score; });
    });
    
    const miAverages: Record<string, number> = {};
    Object.keys(miRaw).forEach(k => miAverages[k] = parseFloat((miRaw[k] / 5).toFixed(2)));

    const report = await generateCareerReport(hollandScores, miAverages, regData.name || "Öğrenci", finalSupplementalData);
    if (isGuest) { /* handle reg flow */ }
    onComplete(report || { generatedAt: new Date(), personalityAnalysis: "Analiz hatası", interestAnalysis: "Veri eksik", careers: [], skills: [], academicMatches: [], universities: [], weeklyPlan: [] });
    setIsAnalyzing(false);
  };

  if (isAnalyzing) return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gray-50 text-center animate-fade-in">
      <Loader2 className="w-16 h-16 text-korpe-600 animate-spin mb-6" />
      <h2 className="text-2xl font-bold">Raporunuz Hazırlanıyor...</h2>
      <p className="text-gray-500 mt-2">Gemini AI zeka ve ilgi alanlarınızı analiz ediyor.</p>
    </div>
  );

  if (stage === 'transition_to_mi' || stage === 'transition_to_academic') return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
      <div className="text-center max-w-lg">
        <div className={`w-24 h-24 rounded-full flex items-center justify-center mx-auto mb-6 animate-bounce ${stage === 'transition_to_mi' ? 'bg-green-100 text-green-600' : 'bg-blue-100 text-blue-600'}`}>
          {stage === 'transition_to_mi' ? <CheckCircle2 size={48} /> : <Lightbulb size={48} />}
        </div>
        <h2 className="text-3xl font-bold mb-4">{stage === 'transition_to_mi' ? 'Harika! Birinci Adım Bitti.' : 'Testler Tamamlandı!'}</h2>
        <p className="text-lg text-gray-600 mb-8">{stage === 'transition_to_mi' ? 'Sıradaki Adım: Çoklu Zeka Profili Envanteri' : 'Son Adım: Profilinizi Güçlendirecek Akademik Veriler (İsteğe Bağlı)'}</p>
        <button onClick={() => setStage(stage === 'transition_to_mi' ? 'mi' : 'academic')} className="bg-korpe-600 text-white px-8 py-4 rounded-xl font-bold flex items-center gap-2 mx-auto transition hover:scale-105">Devam Et <ArrowRight /></button>
      </div>
    </div>
  );

  if (stage === 'academic') {
    return (
      <div className="min-h-screen bg-gray-50 py-8 px-4 flex justify-center">
        <div className="bg-white rounded-2xl p-6 md:p-8 max-w-4xl w-full shadow-2xl animate-fade-in relative">
          <button onClick={() => finishAssessment(undefined)} className="absolute top-6 right-6 text-gray-400 hover:text-gray-600 flex items-center gap-1 text-sm font-medium">Bu adımı atla <SkipForward size={16} /></button>
          <div className="mb-8">
            <h2 className="text-2xl font-bold flex items-center gap-2"><BookOpen className="text-korpe-600" /> Profil ve Dönemsel Performans</h2>
            <p className="text-gray-500 text-sm">Zeka profilinle akademik başarın arasındaki bağı yapay zeka ile kur.</p>
          </div>
          <div className="grid md:grid-cols-2 gap-8">
            <div className="space-y-6">
               <div className="bg-blue-50 p-5 rounded-2xl border border-blue-100">
                  <h3 className="font-bold text-blue-900 flex items-center gap-2 mb-4"><GraduationCap size={18} /> Dönemsel Akademik Başarı</h3>
                  <div className="grid grid-cols-2 gap-4 mb-4">
                    <div><label className="text-xs font-bold text-blue-800 mb-1 block">Bu Dönem OBP</label><input type="number" placeholder="Örn: 85" value={supplementalData.gpa || ''} onChange={e => setSupplementalData({...supplementalData, gpa: parseFloat(e.target.value)})} className="w-full px-3 py-2 rounded-lg border border-blue-200 outline-none" /></div>
                    <div><label className="text-xs font-bold text-blue-800 mb-1 block">Geçen Dönem OBP</label><input type="number" placeholder="Örn: 82" value={supplementalData.previousGpa || ''} onChange={e => setSupplementalData({...supplementalData, previousGpa: parseFloat(e.target.value)})} className="w-full px-3 py-2 rounded-lg border border-blue-200 outline-none" /></div>
                  </div>
                  <div className="bg-white/60 p-4 rounded-xl">
                    <label className="text-xs font-bold text-blue-800 mb-2 block">Ders Bazlı Performans Grafiği (0-100)</label>
                    <div className="grid grid-cols-3 gap-3">
                      {(['math', 'science', 'turkish', 'social', 'language'] as const).map(f => (
                        <div key={f} className="flex flex-col gap-1">
                          <label className="text-[10px] text-gray-500 font-bold uppercase">{f === 'math' ? 'Mat' : f === 'science' ? 'Fen' : f === 'turkish' ? 'Tr' : f === 'social' ? 'Sos' : 'Dil'}</label>
                          <input type="number" value={supplementalData.subjectGrades[f] || ''} onChange={e => setSupplementalData({...supplementalData, subjectGrades: {...supplementalData.subjectGrades, [f]: parseFloat(e.target.value)}})} className="px-2 py-1 border border-gray-200 rounded text-center font-bold text-xs" />
                        </div>
                      ))}
                    </div>
                  </div>
               </div>
               <div>
                 <h3 className="font-bold text-gray-800 flex items-center gap-2 mb-4"><Target size={18} className="text-korpe-600"/> Gelecek Hedefleri & Hobiler</h3>
                 <div className="space-y-3">
                    <textarea placeholder="Hobilerin nelerdir? Neler yapmaktan zevk alırsın?" rows={2} value={supplementalData.hobbies} onChange={e => setSupplementalData({...supplementalData, hobbies: e.target.value})} className="w-full px-3 py-2 rounded-lg border border-gray-300 outline-none text-sm" />
                    <textarea placeholder="Gelecekte nerede olmak istiyorsun? Hedeflerin neler?" rows={2} value={supplementalData.futureGoals} onChange={e => setSupplementalData({...supplementalData, futureGoals: e.target.value})} className="w-full px-3 py-2 rounded-lg border border-gray-300 outline-none text-sm" />
                 </div>
               </div>
            </div>
            <div className="space-y-6">
                <h3 className="font-bold text-gray-800 flex items-center gap-2 border-b pb-2"><Gauge size={18} className="text-korpe-600"/> Teknik Beceri Grafiği (1-10)</h3>
                <div className="space-y-4">
                   {(['coding', 'problemSolving', 'teamwork', 'presentation'] as const).map(skill => (
                     <div key={skill} className="bg-white p-4 rounded-xl border border-gray-200">
                        <div className="flex justify-between text-xs font-bold mb-1 uppercase text-gray-500"><span>{skill === 'coding' ? 'Kodlama' : skill === 'problemSolving' ? 'Problem Çözme' : skill === 'teamwork' ? 'Takım Çalışması' : 'Sunum'}</span><span>{supplementalData.technicalSkills[skill]}</span></div>
                        <input type="range" min="1" max="10" value={supplementalData.technicalSkills[skill]} onChange={e => setSupplementalData({...supplementalData, technicalSkills: {...supplementalData.technicalSkills, [skill]: parseInt(e.target.value)}})} className="w-full h-2 accent-korpe-600" />
                     </div>
                   ))}
                </div>
                <div className="bg-yellow-50 p-4 rounded-xl text-xs text-yellow-800 flex items-start gap-2"><TrendingUp size={16} /> <p>Bu bilgiler zeka testinden çıkan potansiyelini somut akademik verilerle doğrulamamıza yardımcı olur.</p></div>
            </div>
          </div>
          <button onClick={() => finishAssessment(supplementalData)} className="w-full bg-korpe-600 text-white py-4 rounded-xl font-bold mt-8 shadow-xl flex items-center justify-center gap-2 transition hover:bg-korpe-700"><Brain size={20} /> Analizi Tamamla ve Raporumu Gör</button>
        </div>
      </div>
    );
  }

  const isHolland = stage === 'holland';
  const questions = isHolland ? HOLLAND_QUESTIONS : MI_QUESTIONS;
  const currentStepIndex = isHolland ? hollandStep : miStep;
  const progress = ((currentStepIndex + (isHolland ? 0 : HOLLAND_QUESTIONS.length)) / (HOLLAND_QUESTIONS.length + MI_QUESTIONS.length)) * 100;

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      <header className="bg-white border-b px-6 py-4 flex justify-between items-center shadow-sm">
        <div className="flex items-center gap-2"><div className={`p-1.5 rounded-lg ${isHolland ? 'bg-korpe-100 text-korpe-600' : 'bg-green-100 text-green-600'}`}><Brain size={20} /></div><span className="font-bold text-gray-800">{isHolland ? "1. Aşama: Mesleki İlgi" : "2. Aşama: Çoklu Zeka"}</span></div>
        <div className="text-sm font-bold text-korpe-600 bg-korpe-50 px-3 py-1 rounded-full">% {Math.round(progress)}</div>
      </header>
      <div className="w-full bg-gray-200 h-1"><div className={`h-1 transition-all ${isHolland ? 'bg-korpe-600' : 'bg-green-600'}`} style={{ width: `${progress}%` }}></div></div>
      <div className="flex-1 overflow-y-auto p-4 md:p-8">
        <div className="max-w-3xl mx-auto space-y-6">
           <div className={`p-4 rounded-xl border text-sm ${isHolland ? 'bg-blue-50 border-blue-100 text-blue-800' : 'bg-green-50 border-green-100 text-green-800'}`}>
             <strong>Yönerge:</strong> {isHolland ? "İlgini çeken durumları işaretle." : "Bu ifadelerin seni ne kadar tanımladığını (1:Hiç ... 5:Tamamen) puanla."}
           </div>
           {questions.slice(Math.floor(currentStepIndex/10)*10, Math.min(Math.floor(currentStepIndex/10)*10+10, questions.length)).map((q, idx) => {
             const realIdx = Math.floor(currentStepIndex/10)*10 + idx;
             const ans = isHolland ? hollandAnswers[realIdx] : miAnswers[realIdx];
             return (
               <div key={realIdx} className={`bg-white p-6 rounded-xl border transition ${ans !== undefined ? 'border-korpe-200 bg-korpe-50/10' : 'border-gray-200'}`}>
                 <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                    <div className="flex-1"><span className="text-[10px] font-bold text-gray-400 block mb-1">SORU {realIdx+1}</span><h3 className="font-medium text-gray-900">{q}</h3></div>
                    <div className="flex gap-1 shrink-0">
                      {isHolland ? (
                        (['dislike', 'neutral', 'like'] as const).map(v => (
                          <button key={v} onClick={() => handleHollandAnswer(v)} className={`px-3 py-2 rounded-lg text-xs font-bold border transition ${ans === v ? 'bg-korpe-600 text-white' : 'bg-white text-gray-600 hover:bg-gray-50'}`}>{v === 'like' ? 'Hoşlanırım' : v === 'neutral' ? 'Farketmez' : 'Hoşlanmam'}</button>
                        ))
                      ) : (
                        [1,2,3,4,5].map(v => (
                          <button key={v} onClick={() => handleMiAnswer(v)} className={`w-9 h-9 rounded-full font-bold text-xs border transition ${ans === v ? 'bg-green-600 text-white shadow-md' : 'bg-white text-gray-400 hover:border-green-300'}`}>{v}</button>
                        ))
                      )}
                    </div>
                 </div>
               </div>
             );
           })}
        </div>
      </div>
    </div>
  );
};
