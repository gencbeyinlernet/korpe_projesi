
import React, { useState } from 'react';
import { Brain, Loader2, Save, UserPlus, ArrowRight, Gauge, BookOpen, GraduationCap, SkipForward, CheckCircle2, Lightbulb, Target, Code, MessageCircle, Users } from 'lucide-react';
import { User, CareerReport, SupplementalData } from '../types';
import { generateCareerReport } from '../services/geminiService';

interface AssessmentFlowProps {
  onComplete: (report: CareerReport) => void;
  onRegisterAndSave?: (userData: Omit<User, 'id'>, report: CareerReport) => void;
  isGuest: boolean;
}

// ------------------- STEP 1: HOLLAND QUESTIONS (90) -------------------
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

const HOLLAND_KEY = {
  R: [9, 13, 19, 25, 26, 38, 40, 52, 53, 54, 59, 61, 70, 82, 84].map(i => i-1),
  I: [1, 3, 4, 8, 11, 17, 22, 34, 39, 41, 47, 48, 68, 71, 80].map(i => i-1),
  A: [6, 10, 14, 31, 32, 42, 44, 45, 50, 62, 72, 74, 77, 78, 81].map(i => i-1),
  S: [2, 21, 29, 37, 49, 55, 58, 60, 64, 65, 66, 73, 87, 88, 90].map(i => i-1),
  E: [7, 15, 16, 18, 20, 28, 33, 35, 51, 56, 63, 67, 75, 83, 85].map(i => i-1),
  C: [5, 12, 23, 24, 27, 30, 36, 43, 46, 57, 69, 76, 79, 86, 89].map(i => i-1),
};

// ------------------- STEP 2: MULTIPLE INTELLIGENCE QUESTIONS (40) -------------------
// 5 Questions per type.
const MI_QUESTIONS = [
  // Linguistic
  "Kitap okumaktan, hikaye anlatmaktan ve kelime oyunlarından hoşlanırım.",
  "Duyduğum şeyleri (isimler, yerler, tarihler) kolayca hatırlarım.",
  "Konuşurken veya yazarken kelimeleri etkili kullanırım.",
  "Yabancı dilleri öğrenmeye yeteneğim vardır.",
  "Tekerlemeleri, esprileri ve kelime şakalarını severim.",
  // Logical
  "Matematiksel problemleri zihinden çözmeyi severim.",
  "Olaylar arasında neden-sonuç ilişkisi kurmaktan hoşlanırım.",
  "Satranç, dama gibi strateji oyunlarını severim.",
  "Bilimsel konulara ve deneylere meraklıyımdır.",
  "İşlerimi belli bir mantık sırasına göre planlarım.",
  // Spatial
  "Harita, grafik ve şemaları kolayca anlarım.",
  "Hayal gücüm kuvvetlidir, gözümde şekilleri canlandırabilirim.",
  "Yapboz (puzzle) yapmayı ve parçaları birleştirmeyi severim.",
  "Yönümü kolayca bulurum.",
  "Resim yapmaktan veya çizimle uğraşmaktan hoşlanırım.",
  // Kinesthetic
  "Yerimde durmakta zorlanırım, hareket etmeyi severim.",
  "El becerisi gerektiren işlerde (tamir, dikiş, maket) iyiyimdir.",
  "Spor yapmaktan ve dans etmekten hoşlanırım.",
  "Bir şeyi en iyi dokunarak veya yaparak öğrenirim.",
  "Vücut dilini ve mimikleri iyi kullanırım.",
  // Musical
  "Şarkıların melodilerini ve sözlerini kolayca hatırlarım.",
  "Müzik dinlemeden çalışmakta zorlanırım.",
  "Bir enstrüman çalarım veya çalmayı çok isterim.",
  "Ritim tutmayı severim.",
  "Seslere karşı duyarlıyımdır (yanlış notayı, tonu fark ederim).",
  // Interpersonal
  "Arkadaşlarımla vakit geçirmeyi yalnız kalmaya tercih ederim.",
  "İnsanların sorunlarını dinlemeyi ve çözüm bulmayı severim.",
  "Grup çalışmalarında liderlik yapabilirim.",
  "Başkalarının duygularını ve ruh halini kolayca anlarım.",
  "Yeni insanlarla tanışmaktan hoşlanırım.",
  // Intrapersonal
  "Yalnız çalışmayı ve kendi başıma kalmayı severim.",
  "Güçlü ve zayıf yönlerimin farkındayımdır.",
  "Kendi hedeflerimi belirler ve onlara ulaşmak için çalışırım.",
  "Günlük tutmak veya düşüncelerimi yazmak hoşuma gider.",
  "Bağımsız hareket etmekten çekinmem.",
  // Naturalist
  "Doğada vakit geçirmeyi, kamp yapmayı severim.",
  "Hayvanlarla ilgilenmekten ve onları beslemekten hoşlanırım.",
  "Bitki yetiştirmek veya bahçe işleriyle uğraşmak beni rahatlatır.",
  "Çevre sorunlarına ve doğanın korunmasına duyarlıyımdır.",
  "Farklı bitki ve hayvan türlerini incelemeyi severim."
];

// Mapping indices to MI Types (5 questions each sequential block)
const MI_KEY = {
  Linguistic: [0, 1, 2, 3, 4],
  Logical: [5, 6, 7, 8, 9],
  Spatial: [10, 11, 12, 13, 14],
  Kinesthetic: [15, 16, 17, 18, 19],
  Musical: [20, 21, 22, 23, 24],
  Interpersonal: [25, 26, 27, 28, 29],
  Intrapersonal: [30, 31, 32, 33, 34],
  Naturalist: [35, 36, 37, 38, 39]
};

type AssessmentStage = 'holland' | 'mi' | 'academic' | 'transition_to_mi' | 'transition_to_academic';

export const AssessmentFlow: React.FC<AssessmentFlowProps> = ({ onComplete, onRegisterAndSave, isGuest }) => {
  const [stage, setStage] = useState<AssessmentStage>('holland');
  
  // Holland State
  const [hollandStep, setHollandStep] = useState(0);
  const [hollandAnswers, setHollandAnswers] = useState<Record<number, string>>({}); // 'like' | 'neutral' | 'dislike'

  // MI State (Value 1-5)
  const [miStep, setMiStep] = useState(0);
  const [miAnswers, setMiAnswers] = useState<Record<number, number>>({}); // 1 to 5

  // Academic State (Expanded)
  const [supplementalData, setSupplementalData] = useState<SupplementalData>({
    gpa: undefined,
    focusArea: '',
    subjectGrades: { math: 0, science: 0, turkish: 0, social: 0, language: 0 },
    hobbies: '',
    futureGoals: '',
    technicalSkills: { coding: 1, problemSolving: 1, teamwork: 1, presentation: 1 }
  });

  // Flow State
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [generatedReport, setGeneratedReport] = useState<CareerReport | null>(null);
  const [showRegisterPrompt, setShowRegisterPrompt] = useState(false);
  const [showRegisterForm, setShowRegisterForm] = useState(false);
  const [regData, setRegData] = useState({
    name: '', username: '', password: '', teacherUsername: '', parentName: '', parentContact: ''
  });

  // ------------- HANDLERS FOR HOLLAND -------------
  const handleHollandAnswer = (choice: 'like' | 'neutral' | 'dislike') => {
    setHollandAnswers(prev => ({ ...prev, [hollandStep]: choice }));
    if (hollandStep < HOLLAND_QUESTIONS.length - 1) {
      setHollandStep(prev => prev + 1);
    } else {
      setStage('transition_to_mi');
      window.scrollTo(0,0);
    }
  };

  const calculateHollandScores = () => {
    const scores: { [key: string]: number } = { R:0, I:0, A:0, S:0, E:0, C:0 };
    Object.keys(hollandAnswers).forEach((key) => {
      const qIndex = parseInt(key);
      const answer = hollandAnswers[qIndex];
      if (answer === 'like') {
        if (HOLLAND_KEY.R.includes(qIndex)) scores.R++;
        if (HOLLAND_KEY.I.includes(qIndex)) scores.I++;
        if (HOLLAND_KEY.A.includes(qIndex)) scores.A++;
        if (HOLLAND_KEY.S.includes(qIndex)) scores.S++;
        if (HOLLAND_KEY.E.includes(qIndex)) scores.E++;
        if (HOLLAND_KEY.C.includes(qIndex)) scores.C++;
      }
    });
    return scores;
  };

  // ------------- HANDLERS FOR MI -------------
  // choice is now 1 to 5
  const handleMiAnswer = (score: number) => {
    setMiAnswers(prev => ({ ...prev, [miStep]: score }));
    if (miStep < MI_QUESTIONS.length - 1) {
      setMiStep(prev => prev + 1);
    } else {
      setStage('transition_to_academic');
      window.scrollTo(0,0);
    }
  };

  const calculateMiScores = () => {
    const rawScores: { [key: string]: number } = { 
      Linguistic: 0, Logical: 0, Spatial: 0, Kinesthetic: 0, 
      Musical: 0, Interpersonal: 0, Intrapersonal: 0, Naturalist: 0 
    };
    
    // Sum scores
    Object.keys(miAnswers).forEach((key) => {
      const qIndex = parseInt(key);
      const score = miAnswers[qIndex] || 0; // 1 to 5
      
      if (MI_KEY.Linguistic.includes(qIndex)) rawScores.Linguistic += score;
      if (MI_KEY.Logical.includes(qIndex)) rawScores.Logical += score;
      if (MI_KEY.Spatial.includes(qIndex)) rawScores.Spatial += score;
      if (MI_KEY.Kinesthetic.includes(qIndex)) rawScores.Kinesthetic += score;
      if (MI_KEY.Musical.includes(qIndex)) rawScores.Musical += score;
      if (MI_KEY.Interpersonal.includes(qIndex)) rawScores.Interpersonal += score;
      if (MI_KEY.Intrapersonal.includes(qIndex)) rawScores.Intrapersonal += score;
      if (MI_KEY.Naturalist.includes(qIndex)) rawScores.Naturalist += score;
    });

    // Calculate Averages (Score / 5 questions)
    // Result range: 1.00 to 5.00
    const avgScores: { [key: string]: number } = {};
    Object.keys(rawScores).forEach(key => {
        avgScores[key] = parseFloat((rawScores[key] / 5).toFixed(2));
    });

    return avgScores;
  };

  // ------------- FINAL SUBMIT -------------
  const finishAssessment = async (finalSupplementalData?: SupplementalData) => {
    setIsAnalyzing(true);
    setStage('academic'); // keep UI stable or hide
    
    const hollandScores = calculateHollandScores();
    const miScores = calculateMiScores();

    // AI ile rapor üret
    const report = await generateCareerReport(hollandScores, miScores, regData.name || "Öğrenci", finalSupplementalData);
    
    // Fallback Report
    const finalReport: CareerReport = report || {
      generatedAt: new Date(),
      personalityAnalysis: "Analiz sırasında hata oluştu.",
      interestAnalysis: "Yeterli veri alınamadı.",
      careers: [],
      skills: [],
      academicMatches: [],
      universities: [],
      weeklyPlan: [],
      riasecScores: hollandScores,
      miScores: miScores
    };
    
    finalReport.riasecScores = hollandScores;
    finalReport.miScores = miScores;

    setGeneratedReport(finalReport);
    setIsAnalyzing(false);

    if (isGuest) {
      setShowRegisterPrompt(true);
    } else {
      onComplete(finalReport);
    }
  };

  // ---------------- RENDERING ----------------

  // Loading Screen
  if (isAnalyzing) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-gray-50 p-4 text-center animate-fade-in">
        <Loader2 className="w-16 h-16 text-korpe-600 animate-spin mb-6" />
        <h2 className="text-2xl font-bold text-gray-800">Yapay Zeka Analizi Başlıyor...</h2>
        <p className="text-gray-500 mt-2 max-w-md mx-auto">
          Holland ilgi alanların, Çoklu Zeka profilin, akademik verilerin ve hedeflerin Gemini AI tarafından işleniyor. Sana özel kariyer yol haritası hazırlanıyor.
        </p>
      </div>
    );
  }

  // Register Prompts & Form
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
  const handleGuestContinue = () => { if (generatedReport) onComplete(generatedReport); };
  
  if (showRegisterPrompt && !showRegisterForm) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
        <div className="bg-white rounded-2xl p-8 max-w-lg w-full shadow-2xl text-center">
           <div className="w-16 h-16 bg-korpe-100 rounded-full flex items-center justify-center mx-auto mb-4 text-korpe-600"><Save size={32} /></div>
           <h2 className="text-2xl font-bold text-gray-900 mb-2">Raporun Hazır!</h2>
           <p className="text-gray-600 mb-8 text-lg">"Sisteme kayıt olarak raporun öğretmen tarafından görüntülenmesini ister misin?"</p>
           <div className="flex flex-col gap-3">
             <button onClick={() => setShowRegisterForm(true)} className="w-full py-3.5 bg-korpe-600 hover:bg-korpe-700 text-white rounded-xl font-bold transition flex items-center justify-center gap-2"><UserPlus size={20} /> Evet, Kayıt Ol ve Paylaş</button>
             <button onClick={handleGuestContinue} className="w-full py-3.5 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-xl font-medium transition">Hayır, Misafir Olarak Raporu Gör</button>
           </div>
        </div>
      </div>
    );
  }
  if (showRegisterForm) {
     return (
       <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
         <div className="bg-white rounded-2xl p-8 max-w-lg w-full shadow-2xl">
            <h3 className="text-xl font-bold text-gray-900 mb-1">Kayıt Bilgilerini Tamamla</h3>
            <p className="text-sm text-gray-500 mb-6">Öğretmeninin seni takip edebilmesi için aşağıdaki bilgileri doldur.</p>
            <form onSubmit={handleRegisterSubmit} className="space-y-4">
              <input type="text" placeholder="Adın Soyadın" required className="w-full px-4 py-2 rounded-lg border border-gray-300 outline-none focus:border-korpe-500" value={regData.name} onChange={e => setRegData({...regData, name: e.target.value})}/>
              <div className="grid grid-cols-2 gap-3">
                <input type="text" placeholder="Kullanıcı Adı" required className="w-full px-4 py-2 rounded-lg border border-gray-300 outline-none focus:border-korpe-500" value={regData.username} onChange={e => setRegData({...regData, username: e.target.value})}/>
                <input type="password" placeholder="Şifre" required className="w-full px-4 py-2 rounded-lg border border-gray-300 outline-none focus:border-korpe-500" value={regData.password} onChange={e => setRegData({...regData, password: e.target.value})}/>
              </div>
              <div className="p-4 bg-blue-50 rounded-xl border border-blue-100 space-y-3">
                 <div className="flex items-center gap-2 text-blue-800 text-sm font-semibold"><UserPlus size={16} /> Öğretmen & Veli Bağlantısı</div>
                 <input type="text" placeholder="Danışman Öğretmen Kullanıcı Adı (Örn: rizebist)" className="w-full px-4 py-2 rounded-lg border border-blue-200 outline-none focus:border-blue-500 text-sm" value={regData.teacherUsername} onChange={e => setRegData({...regData, teacherUsername: e.target.value})}/>
                 <input type="text" placeholder="Veli Adı" className="w-full px-4 py-2 rounded-lg border border-blue-200 outline-none focus:border-blue-500 text-sm" value={regData.parentName} onChange={e => setRegData({...regData, parentName: e.target.value})}/>
                 <input type="text" placeholder="Veli İletişim (Tel)" className="w-full px-4 py-2 rounded-lg border border-blue-200 outline-none focus:border-blue-500 text-sm" value={regData.parentContact} onChange={e => setRegData({...regData, parentContact: e.target.value})}/>
              </div>
              <button type="submit" className="w-full py-3 bg-korpe-600 hover:bg-korpe-700 text-white rounded-xl font-bold transition">Kaydı Tamamla ve Raporu Aç</button>
            </form>
         </div>
       </div>
     );
  }

  // ------------- TRANSITION SCREENS -------------
  if (stage === 'transition_to_mi') {
     return (
       <div className="min-h-screen bg-gradient-to-br from-indigo-50 to-white flex items-center justify-center p-4">
          <div className="text-center max-w-lg">
             <div className="w-24 h-24 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6 text-green-600 animate-bounce">
               <CheckCircle2 size={48} />
             </div>
             <h2 className="text-3xl font-bold text-gray-900 mb-4">Harika! İlk Aşama Tamam.</h2>
             <p className="text-lg text-gray-600 mb-8">
               Mesleki ilgi alanlarını kaydettik. Şimdi sıra zihinsel potansiyelini keşfetmekte. 
               <br/><br/>
               <strong>2. Aşama: Çoklu Zeka Profili Envanteri</strong> (40 Soru)
             </p>
             <button onClick={() => setStage('mi')} className="bg-korpe-600 hover:bg-korpe-700 text-white px-8 py-4 rounded-xl font-bold text-lg shadow-lg flex items-center gap-3 mx-auto transition hover:scale-105">
               Teste Devam Et <ArrowRight size={24} />
             </button>
          </div>
       </div>
     )
  }

  if (stage === 'transition_to_academic') {
     return (
       <div className="min-h-screen bg-gradient-to-br from-indigo-50 to-white flex items-center justify-center p-4">
          <div className="text-center max-w-lg">
             <div className="w-24 h-24 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-6 text-blue-600 animate-bounce">
               <Lightbulb size={48} />
             </div>
             <h2 className="text-3xl font-bold text-gray-900 mb-4">Testler Tamamlandı!</h2>
             <p className="text-lg text-gray-600 mb-8">
               İlgi ve yetenek verilerin hazır. Son olarak, daha isabetli bir analiz için 
               akademik başarı, hobi ve hedef bilgilerini ekleyebilirsin.
               <br/><br/>
               <strong>3. Aşama: Profil ve Akademik Veriler</strong> (İsteğe Bağlı)
             </p>
             <button onClick={() => setStage('academic')} className="bg-korpe-600 hover:bg-korpe-700 text-white px-8 py-4 rounded-xl font-bold text-lg shadow-lg flex items-center gap-3 mx-auto transition hover:scale-105">
               Son Adıma Geç <ArrowRight size={24} />
             </button>
          </div>
       </div>
     )
  }

  // ------------- ACADEMIC & PROFILE FORM (Final Step) -------------
  if (stage === 'academic') {
    const renderRangeInput = (label: string, value: number, onChange: (val: number) => void, icon: React.ReactNode) => (
      <div className="bg-white p-4 rounded-xl border border-gray-200">
        <div className="flex items-center gap-2 mb-2 text-gray-800 font-medium">
          {icon}
          {label}
        </div>
        <div className="flex items-center gap-4">
          <input 
            type="range" min="1" max="10" step="1" 
            value={value} 
            onChange={(e) => onChange(parseInt(e.target.value))} 
            className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-korpe-600"
          />
          <span className="w-8 text-center font-bold text-korpe-600 bg-korpe-50 rounded px-1">{value}</span>
        </div>
        <div className="flex justify-between text-[10px] text-gray-400 mt-1">
          <span>Başlangıç</span>
          <span>İleri Düzey</span>
        </div>
      </div>
    );

    const renderSubjectInput = (label: string, value: number, field: keyof typeof supplementalData.subjectGrades) => (
       <div className="flex flex-col gap-1">
          <label className="text-xs text-gray-500 font-medium">{label}</label>
          <input 
            type="number" min="0" max="100" placeholder="0-100"
            value={value || ''}
            onChange={(e) => setSupplementalData({
                ...supplementalData, 
                subjectGrades: { ...supplementalData.subjectGrades, [field]: parseFloat(e.target.value) }
            })}
            className="px-3 py-2 border border-gray-200 rounded-lg focus:border-korpe-500 outline-none text-sm text-center font-bold text-gray-800"
          />
       </div>
    );

    return (
      <div className="min-h-screen bg-gray-50 py-8 px-4 flex justify-center">
        <div className="bg-white rounded-2xl p-6 md:p-8 max-w-4xl w-full shadow-2xl animate-fade-in relative">
          <button onClick={() => finishAssessment(undefined)} className="absolute top-6 right-6 text-gray-400 hover:text-gray-600 flex items-center gap-1 text-sm font-medium">Bu adımı atla <SkipForward size={16} /></button>
          
          <div className="mb-8">
            <h2 className="text-2xl font-bold text-gray-900 flex items-center gap-2">
              <BookOpen className="text-korpe-600" /> Profilini Tamamla
            </h2>
            <p className="text-gray-500 text-sm mt-1">Daha detaylı analiz için aşağıdaki alanları doldur. Boş bırakabilirsin.</p>
          </div>

          <div className="grid md:grid-cols-2 gap-8">
            {/* SOL KOLON: AKADEMİK */}
            <div className="space-y-6">
               <div className="bg-blue-50 p-5 rounded-2xl border border-blue-100">
                  <h3 className="font-bold text-blue-900 flex items-center gap-2 mb-4 border-b border-blue-200 pb-2">
                     <GraduationCap size={18} /> Akademik Durum
                  </h3>
                  
                  <div className="grid grid-cols-2 gap-4 mb-4">
                    <div>
                        <label className="text-xs font-bold text-blue-800 mb-1 block">Genel Ort (OBP)</label>
                        <input type="number" min="0" max="100" placeholder="Örn: 85" 
                           value={supplementalData.gpa || ''} 
                           onChange={(e) => setSupplementalData({...supplementalData, gpa: parseFloat(e.target.value)})} 
                           className="w-full px-3 py-2 rounded-lg border border-blue-200 focus:border-blue-500 outline-none"
                        />
                    </div>
                    <div>
                        <label className="text-xs font-bold text-blue-800 mb-1 block">Alan / Bölüm</label>
                        <select value={supplementalData.focusArea || ''} onChange={(e) => setSupplementalData({...supplementalData, focusArea: e.target.value})} className="w-full px-3 py-2 rounded-lg border border-blue-200 focus:border-blue-500 outline-none bg-white">
                             <option value="">Seçiniz</option>
                             <option value="Sayısal">Sayısal</option>
                             <option value="Sözel">Sözel</option>
                             <option value="Eşit Ağırlık">Eşit Ağırlık</option>
                             <option value="Dil">Dil</option>
                        </select>
                    </div>
                  </div>

                  <div className="bg-white/60 p-4 rounded-xl">
                    <label className="text-xs font-bold text-blue-800 mb-2 block">Ders Bazlı Notların (0-100)</label>
                    <div className="grid grid-cols-3 gap-3">
                       {renderSubjectInput("Matematik", supplementalData.subjectGrades.math, 'math')}
                       {renderSubjectInput("Fen Bilimleri", supplementalData.subjectGrades.science, 'science')}
                       {renderSubjectInput("Türkçe", supplementalData.subjectGrades.turkish, 'turkish')}
                       {renderSubjectInput("Sosyal Bil.", supplementalData.subjectGrades.social, 'social')}
                       {renderSubjectInput("Yabancı Dil", supplementalData.subjectGrades.language, 'language')}
                    </div>
                  </div>
               </div>

               <div>
                 <h3 className="font-bold text-gray-800 flex items-center gap-2 mb-4">
                   <Target size={18} className="text-korpe-600"/> Hedefler ve İlgi
                 </h3>
                 <div className="space-y-3">
                    <div>
                       <label className="text-xs font-medium text-gray-600">İlgi Alanları & Hobiler</label>
                       <textarea 
                         placeholder="Örn: Gitar çalmak, satranç, doğa yürüyüşü..."
                         rows={2}
                         value={supplementalData.hobbies}
                         onChange={(e) => setSupplementalData({...supplementalData, hobbies: e.target.value})}
                         className="w-full px-3 py-2 rounded-lg border border-gray-300 focus:border-korpe-500 outline-none text-sm resize-none"
                       />
                    </div>
                    <div>
                       <label className="text-xs font-medium text-gray-600">Gelecek Hedefleri</label>
                       <textarea 
                         placeholder="Örn: Mühendis olmak istiyorum, yurtdışında çalışmak istiyorum..."
                         rows={2}
                         value={supplementalData.futureGoals}
                         onChange={(e) => setSupplementalData({...supplementalData, futureGoals: e.target.value})}
                         className="w-full px-3 py-2 rounded-lg border border-gray-300 focus:border-korpe-500 outline-none text-sm resize-none"
                       />
                    </div>
                 </div>
               </div>
            </div>

            {/* SAĞ KOLON: TEKNİK BECERİLER */}
            <div className="space-y-6">
                <h3 className="font-bold text-gray-800 flex items-center gap-2 border-b pb-2">
                   <Gauge size={18} className="text-korpe-600"/> Yetkinlik Analizi (1-10)
                </h3>
                <div className="space-y-4">
                   {renderRangeInput("Kodlama & Bilişim", supplementalData.technicalSkills.coding, (v) => setSupplementalData({...supplementalData, technicalSkills: {...supplementalData.technicalSkills, coding: v}}), <Code size={16} className="text-purple-600"/>)}
                   
                   {renderRangeInput("Problem Çözme", supplementalData.technicalSkills.problemSolving, (v) => setSupplementalData({...supplementalData, technicalSkills: {...supplementalData.technicalSkills, problemSolving: v}}), <Lightbulb size={16} className="text-yellow-600"/>)}
                   
                   {renderRangeInput("Takım Çalışması", supplementalData.technicalSkills.teamwork, (v) => setSupplementalData({...supplementalData, technicalSkills: {...supplementalData.technicalSkills, teamwork: v}}), <Users size={16} className="text-blue-600"/>)}
                   
                   {renderRangeInput("İletişim & Sunum", supplementalData.technicalSkills.presentation, (v) => setSupplementalData({...supplementalData, technicalSkills: {...supplementalData.technicalSkills, presentation: v}}), <MessageCircle size={16} className="text-green-600"/>)}
                </div>

                <div className="bg-yellow-50 p-4 rounded-xl border border-yellow-100 text-xs text-yellow-800">
                   <p className="font-bold mb-1">💡 İpucu:</p>
                   Bu becerilerde kendini dürüstçe değerlendirmen, yapay zekanın sana uygun staj, kulüp veya proje önerileri sunmasını sağlar.
                </div>
            </div>

          </div>

          <div className="mt-8 pt-6 border-t border-gray-100">
             <button onClick={() => finishAssessment(supplementalData)} className="w-full bg-korpe-600 hover:bg-korpe-700 text-white py-4 rounded-xl font-bold shadow-xl shadow-korpe-200 transition transform hover:scale-[1.01] flex items-center justify-center gap-2">
               <Brain size={20} /> Analizi Başlat ve Raporumu Oluştur
             </button>
          </div>
        </div>
      </div>
    );
  }

  // ------------- QUESTION LIST RENDERER -------------
  const isHolland = stage === 'holland';
  const questions = isHolland ? HOLLAND_QUESTIONS : MI_QUESTIONS;
  const currentStepIndex = isHolland ? hollandStep : miStep;
  // miAnswers is Record<number, number>, hollandAnswers is Record<number, string>
  // We handle type access safely inside render
  
  const QUESTIONS_PER_PAGE = 10;
  const currentPage = Math.floor(currentStepIndex / QUESTIONS_PER_PAGE);
  const startIdx = currentPage * QUESTIONS_PER_PAGE;
  const endIdx = Math.min(startIdx + QUESTIONS_PER_PAGE, questions.length);
  const currentQuestionsSlice = questions.slice(startIdx, endIdx);
  const totalSteps = HOLLAND_QUESTIONS.length + MI_QUESTIONS.length;
  const currentProgressIdx = currentStepIndex + (isHolland ? 0 : HOLLAND_QUESTIONS.length);
  const progress = (currentProgressIdx / totalSteps) * 100;

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      <header className="bg-white border-b border-gray-200 px-6 py-4 flex justify-between items-center shadow-sm">
        <div className="flex items-center gap-2">
           <div className={`p-1.5 rounded-lg ${isHolland ? 'bg-korpe-100 text-korpe-600' : 'bg-green-100 text-green-600'}`}>
             <Brain size={20} />
           </div>
           <div>
             <span className="font-bold text-gray-800 block text-sm md:text-base">
                {isHolland ? "1. Aşama: Mesleki İlgi Envanteri" : "2. Aşama: Çoklu Zeka Envanteri"}
             </span>
           </div>
        </div>
        <div className="text-sm font-medium text-gray-600 bg-gray-100 px-3 py-1 rounded-full whitespace-nowrap">
           Toplam İlerleme: %{Math.round(progress)}
        </div>
      </header>
      <div className="w-full bg-gray-200 h-1.5">
        <div className={`h-1.5 transition-all duration-300 ease-out ${isHolland ? 'bg-korpe-600' : 'bg-green-600'}`} style={{ width: `${progress}%` }}></div>
      </div>
      <div className="flex-1 overflow-y-auto p-4 md:p-8">
        <div className="max-w-3xl mx-auto space-y-6">
           <div className={`p-4 rounded-xl border text-sm mb-6 ${isHolland ? 'bg-blue-50 border-blue-100 text-blue-800' : 'bg-green-50 border-green-100 text-green-800'}`}>
             <strong className="block mb-1">Yönerge:</strong> 
             {isHolland 
               ? "Aşağıdaki aktiviteleri okuyun ve her biri için size en uygun olan (Hoşlanırım, Farketmez, Hoşlanmam) seçeneği işaretleyin." 
               : "Aşağıdaki ifadeler için size en uygun puanı verin. (1: Hiç Katılmıyorum ... 5: Tamamen Katılıyorum)"}
           </div>

           {currentQuestionsSlice.map((q, idx) => {
             const realIndex = startIdx + idx;
             
             if (isHolland) {
               const ans = hollandAnswers[realIndex];
               const isAnswered = ans !== undefined;
               
               return (
                 <div key={realIndex} className={`bg-white p-6 rounded-xl border shadow-sm transition ${isAnswered ? 'border-korpe-200 bg-korpe-50/10' : 'border-gray-200'}`}>
                    <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                      <div className="flex-1">
                        <span className="text-xs font-bold text-gray-400 mb-1 block">SORU {realIndex + 1}</span>
                        <h3 className="text-gray-900 font-medium text-lg">{q}</h3>
                      </div>
                      <div className="flex gap-2 shrink-0">
                        <button onClick={() => handleHollandAnswer('dislike')} className={`px-4 py-2 rounded-lg text-sm font-medium border transition ${ans === 'dislike' ? 'bg-red-100 border-red-300 text-red-700' : 'bg-white border-gray-200 text-gray-600 hover:bg-gray-50'}`}>Hoşlanmam</button>
                        <button onClick={() => handleHollandAnswer('neutral')} className={`px-4 py-2 rounded-lg text-sm font-medium border transition ${ans === 'neutral' ? 'bg-yellow-100 border-yellow-300 text-yellow-700' : 'bg-white border-gray-200 text-gray-600 hover:bg-gray-50'}`}>Farketmez</button>
                        <button onClick={() => handleHollandAnswer('like')} className={`px-4 py-2 rounded-lg text-sm font-medium border transition ${ans === 'like' ? 'bg-green-100 border-green-300 text-green-700' : 'bg-white border-gray-200 text-gray-600 hover:bg-gray-50'}`}>Hoşlanırım</button>
                      </div>
                    </div>
                 </div>
               );
             } else {
               // MI - 5 Point Scale
               const ans = miAnswers[realIndex];
               const isAnswered = ans !== undefined;
               
               return (
                  <div key={realIndex} className={`bg-white p-6 rounded-xl border shadow-sm transition ${isAnswered ? 'border-green-200 bg-green-50/10' : 'border-gray-200'}`}>
                    <div className="flex flex-col gap-4">
                      <div>
                        <span className="text-xs font-bold text-gray-400 mb-1 block">SORU {realIndex + 1}</span>
                        <h3 className="text-gray-900 font-medium text-lg">{q}</h3>
                      </div>
                      <div className="flex justify-between items-center gap-2">
                         <span className="text-xs text-gray-400 hidden sm:inline">Hiç Katılmıyorum (1)</span>
                         <div className="flex gap-2 flex-1 justify-center">
                            {[1, 2, 3, 4, 5].map((val) => (
                               <button 
                                 key={val}
                                 onClick={() => handleMiAnswer(val)}
                                 className={`w-10 h-10 rounded-full font-bold text-sm border transition flex items-center justify-center 
                                   ${ans === val 
                                      ? 'bg-green-600 border-green-600 text-white shadow-lg scale-110' 
                                      : 'bg-white border-gray-200 text-gray-600 hover:border-green-400 hover:bg-green-50'}`}
                               >
                                 {val}
                               </button>
                            ))}
                         </div>
                         <span className="text-xs text-gray-400 hidden sm:inline">Tamamen Katılıyorum (5)</span>
                      </div>
                    </div>
                  </div>
               );
             }
           })}
           
           <div className="flex justify-end pt-4">
              <button 
                onClick={() => {
                    const currentAnsObj = isHolland ? hollandAnswers : miAnswers;
                    const allAnswered = currentQuestionsSlice.every((_, i) => currentAnsObj[startIdx + i] !== undefined);
                    
                    if (allAnswered) {
                        if (endIdx >= questions.length) {
                             if (isHolland) {
                                setStage('transition_to_mi');
                                window.scrollTo(0,0);
                             } else {
                                setStage('transition_to_academic');
                                window.scrollTo(0,0);
                             }
                        } else {
                            if (isHolland) setHollandStep(endIdx);
                            else setMiStep(endIdx);
                            window.scrollTo(0,0);
                        }
                    } else {
                        alert("Lütfen sayfadaki tüm soruları cevaplayınız.");
                    }
                }}
                className={`text-white px-8 py-3 rounded-xl font-bold shadow-lg transition flex items-center gap-2 ${isHolland ? 'bg-korpe-600 hover:bg-korpe-700' : 'bg-green-600 hover:bg-green-700'}`}
              >
                {endIdx >= questions.length ? 'Testi Bitir' : 'Sonraki Sayfa'} <ArrowRight size={20} />
              </button>
           </div>
        </div>
      </div>
    </div>
  );
};