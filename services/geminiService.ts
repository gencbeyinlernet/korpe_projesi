import { GoogleGenAI, Type } from "@google/genai";

// Initialize Gemini API Client
const apiKey = process.env.API_KEY || ''; 

const ai = new GoogleGenAI({ apiKey });

export const SYSTEM_INSTRUCTION = `
Sen KÖRPE AI adında, lise öğrencileri için uzman bir kariyer danışmanısın.
Amacın: Öğrencilerin kişilik özelliklerini, ilgi alanlarını ve akademik başarılarını analiz ederek onlara en doğru meslek, üniversite bölümü ve kişisel gelişim tavsiyelerini vermek.
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
  studentName: string
) => {
  if (!apiKey) return null;

  const prompt = `
    Öğrenci Adı: ${studentName}
    Holland (RIASEC) Skorları:
    - Realistic (Gerçekçi): ${riasecScores['R']}
    - Investigative (Araştırıcı): ${riasecScores['I']}
    - Artistic (Sanatsal): ${riasecScores['A']}
    - Social (Sosyal): ${riasecScores['S']}
    - Enterprising (Girişimci): ${riasecScores['E']}
    - Conventional (Geleneksel): ${riasecScores['C']}

    Lütfen bu skorlara dayanarak bu öğrenci için detaylı bir kariyer analiz raporu oluştur.
    Aşağıdaki JSON formatına birebir uymalısın. Yaratıcı ve destekleyici ol.
    Hangi mesleklerin bu profile uygun olduğunu, hangi becerilerin gelişmesi gerektiğini detaylandır.
    Akademik eşleşmeleri (Matematik, Fizik vb.) bu profile göre mantıksal olarak kurgula (Örneğin Araştırmacı yüksekse Mat/Fen puanlarını yüksek varsay).
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
            personalityAnalysis: { type: Type.STRING, description: "Beş faktör ve genel kişilik analizi paragrafı" },
            interestAnalysis: { type: Type.STRING, description: "RIASEC sonuçlarının yorumlanması" },
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
