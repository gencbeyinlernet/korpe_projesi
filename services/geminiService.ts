import { GoogleGenAI, Type } from "@google/genai";
import { SupplementalData } from "../types";

// Initialize Gemini API Client
// Netlify veya yerel ortamda process.env hatası almamak için güvenli erişim ve fallback eklendi.
// GÜNCELLENMİŞ API ANAHTARI
const apiKey = 'AIzaSyDryJ5wDMLX5b6Z3Myy0MgXLUCeUQykff0';

const ai = new GoogleGenAI({ apiKey });

export const SYSTEM_INSTRUCTION = `
Sen KÖRPE AI adında, lise öğrencileri için uzman bir kariyer danışmanısın.
Amacın: Öğrencilerin kişilik özelliklerini (Holland), zeka türlerini (Çoklu Zeka), detaylı akademik başarılarını ve kişisel hedeflerini analiz ederek onlara en doğru meslek, üniversite bölümü ve kişisel gelişim tavsiyelerini vermek.
Tonun: Destekleyici, motive edici, bilimsel ve veri odaklı.
`;

export const getGeminiResponse = async (history: { role: string; parts: { text: string }[] }[], newMessage: string) => {
  if (!apiKey) {
    return "API Anahtarı bulunamadı.";
  }

  try {
    const chat = ai.chats.create({
      model: 'gemini-2.5-flash',
      config: {
        systemInstruction: SYSTEM_INSTRUCTION,
        temperature: 0.7,
      },
      history: history,
    });

    const result = await chat.sendMessage({ message: newMessage });
    return result.text;
  } catch (error) {
    console.error("Gemini API Error:", error);
    return "Üzgünüm, şu anda bağlantıda bir sorun yaşıyorum.";
  }
};

// Kişiselleştirilmiş Rapor Üretimi
export const generateCareerReport = async (
  riasecScores: { [key: string]: number },
  miScores: { [key: string]: number },
  studentName: string,
  supplementalData?: SupplementalData
) => {
  if (!apiKey) return null;

  let extraContext = "";
  if (supplementalData) {
    extraContext = `
    3. DETAYLI ÖĞRENCİ PROFİLİ VE AKADEMİK VERİLER:
    
    A. Akademik Başarı (Ders Bazlı Performans 0-100):
    - Matematik: ${supplementalData.subjectGrades.math}
    - Fen Bilimleri: ${supplementalData.subjectGrades.science}
    - Türkçe / Edebiyat: ${supplementalData.subjectGrades.turkish}
    - Sosyal Bilimler: ${supplementalData.subjectGrades.social}
    - Yabancı Dil: ${supplementalData.subjectGrades.language}
    - Genel Ort (OBP): ${supplementalData.gpa || "Belirtilmedi"}
    - Alanı: ${supplementalData.focusArea || "Genel"}

    B. Kişisel İlgi ve Hedefler:
    - Hobiler & İlgi Alanları: ${supplementalData.hobbies}
    - Gelecek Hedefleri: ${supplementalData.futureGoals}

    C. Teknik ve Yetkinlik Becerileri (1-10 Üzerinden):
    - Kodlama / Bilişim: ${supplementalData.technicalSkills.coding}
    - Problem Çözme: ${supplementalData.technicalSkills.problemSolving}
    - Takım Çalışması: ${supplementalData.technicalSkills.teamwork}
    - Sunum / İletişim: ${supplementalData.technicalSkills.presentation}
    `;
  }

  const prompt = `
    Öğrenci Adı: ${studentName}
    
    1. HOLLAND (RIASEC) MESLEKİ İLGİ SKORLARI:
    - Realistic (Gerçekçi): ${riasecScores['R']}
    - Investigative (Araştırıcı): ${riasecScores['I']}
    - Artistic (Sanatsal): ${riasecScores['A']}
    - Social (Sosyal): ${riasecScores['S']}
    - Enterprising (Girişimci): ${riasecScores['E']}
    - Conventional (Geleneksel): ${riasecScores['C']}

    2. ÇOKLU ZEKA (MULTIPLE INTELLIGENCE) SKORLARI (Ortalama Puanlar 1.00 - 5.00 Arası):
    - Sözel/Dilsel: ${miScores['Linguistic']}
    - Mantıksal/Matematiksel: ${miScores['Logical']}
    - Görsel/Uzamsal: ${miScores['Spatial']}
    - Bedensel/Kinestetik: ${miScores['Kinesthetic']}
    - Müziksel/Ritmik: ${miScores['Musical']}
    - Sosyal/Kişilerarası: ${miScores['Interpersonal']}
    - İçsel/Öze Dönük: ${miScores['Intrapersonal']}
    - Doğacı: ${miScores['Naturalist']}

    ${extraContext}

    YÖNERGE:
    Bu verileri harmanlayarak (sentezleyerek) detaylı bir kariyer analiz raporu oluştur.
    
    ÖLÇEK DEĞERLENDİRME KURALI (Çoklu Zeka için):
    Çoklu Zeka puanları 1.00 ile 5.00 arasındadır. Değerlendirme yaparken şu aralıkları kesinlikle dikkate al:
    - 1.00 ile 2.33 arası: Düşük Seviye (Zayıf)
    - 2.33 ile 3.66 arası: Orta Seviye
    - 3.66 ile 5.00 arası: Yüksek Seviye (Gelişmiş)
    Analizinde, öğrencinin yüksek çıkan zeka türlerini (3.66 üzeri) mutlaka vurgula ve meslek önerilerini buna dayandır.

    KRİTİK ANALİZ NOKTALARI:
    1. Tutarlılık Kontrolü: Öğrencinin "Gelecek Hedefleri" ile "Akademik Başarısı" ve "Test Sonuçları" örtüşüyor mu? Örtüşmüyorsa (Örn: Tıp istiyor ama Fen notu düşük), raporunda bunu nazikçe belirt ve alternatif yollar veya yoğun çalışma planı öner.
    2. Beceri Odaklılık: Eğer "Kodlama" becerisi yüksekse ve "Logical" zekası yüksekse (3.66 üzeri), not ortalaması düşük olsa bile yazılım/bilişim alanlarını güçlü bir şekilde öner.
    3. Hobiler: Hobilerini mesleğe dönüştürme potansiyelini değerlendir.

    ÇIKTI FORMATI (JSON):
    Aşağıdaki JSON şemasına birebir uymalısın.
  `;

  try {
    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: prompt,
      config: {
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            personalityAnalysis: { type: Type.STRING, description: "Holland, Çoklu Zeka (Değerlendirme aralıklarına göre yorumlanmış) ve Kişisel Hedeflerin sentezi." },
            interestAnalysis: { type: Type.STRING, description: "Hobiler ve akademik ilginin kariyer hedefleriyle uyumu." },
            careers: {
              type: Type.ARRAY,
              items: {
                type: Type.OBJECT,
                properties: {
                  title: { type: Type.STRING },
                  matchPercentage: { type: Type.NUMBER },
                  description: { type: Type.STRING },
                  requiredSkills: { type: Type.ARRAY, items: { type: Type.STRING } }
                }
              }
            },
            skills: {
              type: Type.ARRAY,
              items: {
                type: Type.OBJECT,
                properties: {
                  skill: { type: Type.STRING },
                  type: { type: Type.STRING, enum: ["core", "developmental"] },
                  score: { type: Type.NUMBER }
                }
              }
            },
            academicMatches: {
              type: Type.ARRAY,
              items: {
                type: Type.OBJECT,
                properties: {
                  course: { type: Type.STRING },
                  score: { type: Type.NUMBER },
                  relevance: { type: Type.STRING, enum: ["Yüksek", "Orta", "Düşük"] },
                  impactAnalysis: { type: Type.STRING }
                }
              }
            },
            universities: {
              type: Type.ARRAY,
              items: {
                type: Type.OBJECT,
                properties: {
                  university: { type: Type.STRING },
                  department: { type: Type.STRING },
                  matchScore: { type: Type.NUMBER },
                  city: { type: Type.STRING },
                  type: { type: Type.STRING, enum: ["Devlet", "Vakıf"] }
                }
              }
            },
            weeklyPlan: {
              type: Type.ARRAY,
              items: {
                type: Type.OBJECT,
                properties: {
                  week: { type: Type.NUMBER },
                  title: { type: Type.STRING },
                  tasks: { type: Type.ARRAY, items: { type: Type.STRING } },
                  status: { type: Type.STRING, enum: ["completed", "current", "locked"] }
                }
              }
            }
          }
        }
      }
    });

    return JSON.parse(response.text || '{}');
  } catch (error) {
    console.error("Report Generation Error:", error);
    return null;
  }
};