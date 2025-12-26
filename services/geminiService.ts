
import { GoogleGenAI, Type } from "@google/genai";
import { SupplementalData } from "../types";

// Always use process.env.API_KEY for initialization as per guidelines
const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

export const SYSTEM_INSTRUCTION = `
Sen KÖRPE AI adında, lise öğrencileri için uzman bir kariyer danışmanısın.
Amacın: Öğrencilerin kişilik özelliklerini (Holland), zeka türlerini (Çoklu Zeka), detaylı akademik başarılarını ve kişisel hedeflerini analiz ederek onlara en doğru meslek, üniversite bölümü ve kişisel gelişim tavsiyelerini vermek.
Tonun: Destekleyici, motive edici, bilimsel ve veri odaklı.
`;

/**
 * Generates a comprehensive career report using Gemini 3 Pro for complex reasoning.
 */
export const generateCareerReport = async (
  riasecScores: { [key: string]: number },
  miScores: { [key: string]: number },
  studentName: string,
  supplementalData?: SupplementalData
) => {
  // Use the pre-initialized `ai` instance directly
  
  let extraContext = "";
  if (supplementalData) {
    const performanceTrend = supplementalData.previousGpa && supplementalData.gpa 
      ? (supplementalData.gpa > supplementalData.previousGpa ? "Yükselen Performans" : "Düşen Performans")
      : "Kararlı Performans";

    extraContext = `
    3. DETAYLI ÖĞRENCİ PROFİLİ VE AKADEMİK VERİLER:
    A. Akademik Başarı & Dönemsel Performans:
    - Güncel Not Ortalaması (OBP): ${supplementalData.gpa || "Belirtilmedi"}
    - Önceki Dönem Ortalaması: ${supplementalData.previousGpa || "Belirtilmedi"}
    - Performans Eğilimi: ${performanceTrend}
    - Ders Bazlı Notlar (0-100): Mat: ${supplementalData.subjectGrades.math}, Fen: ${supplementalData.subjectGrades.science}, Tr: ${supplementalData.subjectGrades.turkish}, Sos: ${supplementalData.subjectGrades.social}, Dil: ${supplementalData.subjectGrades.language}
    
    B. Kişisel İlgi ve Hedefler:
    - Hobiler & İlgi Alanları: ${supplementalData.hobbies}
    - Gelecek Hedefleri: ${supplementalData.futureGoals}

    C. Teknik ve Yetkinlik Becerileri (1-10 Üzerinden):
    - Kodlama: ${supplementalData.technicalSkills.coding}, Problem Çözme: ${supplementalData.technicalSkills.problemSolving}, Takım: ${supplementalData.technicalSkills.teamwork}, Sunum: ${supplementalData.technicalSkills.presentation}
    `;
  }

  const prompt = `
    Öğrenci Adı: ${studentName}
    
    1. HOLLAND (RIASEC) SKORLARI: R:${riasecScores.R}, I:${riasecScores.I}, A:${riasecScores.A}, S:${riasecScores.S}, E:${riasecScores.E}, C:${riasecScores.C}

    2. ÇOKLU ZEKA (MI) ARİTMETİK ORTALAMALARI (1.00-5.00):
    - Dilsel: ${miScores.Linguistic}, Mantıksal: ${miScores.Logical}, Görsel: ${miScores.Spatial}, Kinestetik: ${miScores.Kinesthetic}, Müziksel: ${miScores.Musical}, Sosyal: ${miScores.Interpersonal}, İçsel: ${miScores.Intrapersonal}, Doğacı: ${miScores.Naturalist}

    ${extraContext}

    DEĞERLENDİRME KRİTERLERİ (KESİN UYULACAK):
    Çoklu Zeka aritmetik ortalaması için:
    - 1.00 - 2.33: DÜŞÜK seviye (Bu zeka türü henüz gelişmemiş).
    - 2.33 - 3.66: ORTA seviye.
    - 3.66 - 5.00: YÜKSEK seviye (Baskın yetenek).

    Raporunda öğrencinin dönemsel performans eğilimini, hobilerini ve hedeflerini Holland/Zeka sonuçlarıyla sentezle. Çelişki varsa (Örn: Hedef Tıp ama Mantıksal Zeka/Fen notu düşük) gelişim önerileri ver.
  `;

  try {
    const response = await ai.models.generateContent({
      model: 'gemini-3-pro-preview',
      contents: prompt,
      config: {
        systemInstruction: SYSTEM_INSTRUCTION,
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            personalityAnalysis: { type: Type.STRING },
            interestAnalysis: { type: Type.STRING },
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

    // Extract text output from GenerateContentResponse property directly
    return JSON.parse(response.text || '{}');
  } catch (error) {
    console.error("Report Generation Error:", error);
    return null;
  }
};

/**
 * Handles chat assistant queries using Gemini 3 Flash for efficiency.
 */
export const getGeminiResponse = async (history: any[], prompt: string) => {
  try {
    const response = await ai.models.generateContent({
      model: 'gemini-3-flash-preview',
      contents: [...history, { role: 'user', parts: [{ text: prompt }] }],
      config: {
        systemInstruction: SYSTEM_INSTRUCTION,
      }
    });
    return response.text;
  } catch (error) {
    console.error("Chat Error:", error);
    return "Üzgünüm, şu an yardımcı olamıyorum.";
  }
};
