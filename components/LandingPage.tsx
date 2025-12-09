import React from 'react';
import { ArrowRight, Brain, Target, Compass, BarChart3, Users, CheckCircle2 } from 'lucide-react';
import { PageView } from '../types';

interface LandingProps {
  onNavigate: (page: PageView) => void;
}

export const LandingPage: React.FC<LandingProps> = ({ onNavigate }) => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 to-white">
      {/* Navbar */}
      <nav className="container mx-auto px-6 py-6 flex justify-between items-center">
        <div className="flex items-center gap-2">
          <div className="bg-korpe-600 p-2 rounded-lg text-white">
            <Brain className="w-6 h-6" />
          </div>
          <span className="text-2xl font-bold text-gray-800 tracking-tight">KÖRPE AI</span>
        </div>
        <div className="hidden md:flex gap-8 text-gray-600 font-medium">
          <a href="#nasil-calisir" className="hover:text-korpe-600 transition">Nasıl Çalışır?</a>
          <a href="#ozellikler" className="hover:text-korpe-600 transition">Özellikler</a>
          <a href="#etki" className="hover:text-korpe-600 transition">Etki Analizi</a>
        </div>
        <button 
          onClick={() => onNavigate(PageView.LOGIN)}
          className="bg-korpe-600 hover:bg-korpe-700 text-white px-6 py-2.5 rounded-full font-medium transition shadow-lg shadow-korpe-200 flex items-center gap-2"
        >
          Sisteme Giriş <ArrowRight size={18} />
        </button>
      </nav>

      {/* Hero Section */}
      <section className="container mx-auto px-6 pt-12 pb-24 text-center lg:text-left lg:flex items-center gap-12">
        <div className="lg:w-1/2 space-y-8">
          <div className="inline-block px-4 py-1.5 bg-purple-100 text-korpe-700 rounded-full text-sm font-semibold mb-2 shadow-sm border border-purple-200">
            ✨ Rize Bist MTAL - TÜBİTAK 2204A Yazılım Projesidir
          </div>
          <h1 className="text-4xl lg:text-5xl font-bold text-gray-900 leading-tight">
            KÖRPE <span className="text-2xl font-normal text-gray-600 block mt-2">(Kariyerinde Öğrenciye Rehberlik Eden Planlama Eğitimi)</span>
          </h1>
          <h2 className="text-xl font-semibold text-transparent bg-clip-text bg-gradient-to-r from-korpe-600 to-purple-500">
            Yapay Zekâ Destekli Çok Boyutlu Kişisel Kariyer Yönlendirme Sistemi
          </h2>
          <p className="text-lg text-gray-600 leading-relaxed max-w-2xl">
            Klasik rehberlik testlerinin ötesine geçin. Kişilik, ilgi alanları ve akademik başarı verilerini yapay zeka ile analiz ederek öğrenciye en uygun kariyer yolculuğunu tasarlıyoruz.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center lg:justify-start">
            <button 
              onClick={() => onNavigate(PageView.LOGIN)}
              className="px-8 py-4 bg-korpe-600 text-white rounded-xl font-bold text-lg shadow-xl shadow-korpe-200 hover:scale-105 transition duration-300"
            >
              Analize Başla
            </button>
            <button className="px-8 py-4 bg-white text-gray-700 border border-gray-200 rounded-xl font-bold text-lg hover:bg-gray-50 transition duration-300">
              Örnek Raporu İncele
            </button>
          </div>
        </div>
        
        <div className="lg:w-1/2 mt-16 lg:mt-0 relative">
          {/* Collage Container */}
          <div className="relative z-10 bg-white p-4 rounded-3xl shadow-2xl border border-gray-100 rotate-1 hover:rotate-0 transition duration-500 ease-out">
             <div className="grid grid-cols-2 gap-4 items-center">
                
                {/* Image 1: Using App (Phone Focus) - Left Top */}
                <div className="relative group transform translate-y-[-20px]">
                   <img 
                     src="https://images.unsplash.com/photo-1522202176988-66273c2fd55f?auto=format&fit=crop&q=80&w=600" 
                     alt="KÖRPE AI Kullanan Öğrenci" 
                     className="rounded-2xl object-cover h-64 w-full shadow-md transform transition group-hover:scale-[1.02]"
                   />
                   {/* Mock App UI Overlay */}
                   <div className="absolute bottom-4 left-3 right-3 bg-white/95 backdrop-blur-md p-3 rounded-xl border border-gray-100 shadow-lg flex items-center gap-3 animate-fade-in-up">
                      <div className="bg-korpe-100 p-2 rounded-lg shrink-0">
                        <Brain className="w-5 h-5 text-korpe-600" />
                      </div>
                      <div>
                        <p className="text-[10px] text-gray-500 font-bold uppercase tracking-wider">KÖRPE AI</p>
                        <p className="text-xs font-bold text-gray-800">Analiz Tamamlandı ✅</p>
                      </div>
                   </div>
                </div>

                {/* Image 2: Graduation/Success (Staggered Down) - Right Bottom */}
                <div className="relative group transform translate-y-[20px]">
                   <img 
                     src="https://images.unsplash.com/photo-1627556592933-ffe99c1cd9eb?auto=format&fit=crop&q=80&w=600" 
                     alt="Mezuniyet Başarısı" 
                     className="rounded-2xl object-cover h-64 w-full shadow-md transform transition group-hover:scale-[1.02]"
                   />
                   {/* Success Badge */}
                   <div className="absolute top-4 right-3 bg-korpe-600 text-white px-3 py-1.5 rounded-full text-xs font-bold shadow-lg flex items-center gap-1">
                      <Target size={12} /> Hedef Başarıldı
                   </div>
                </div>
             </div>

            {/* Float Stats Badge Center */}
            <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 bg-white/95 backdrop-blur-md p-4 rounded-xl shadow-2xl border border-white/50 flex items-center gap-4 min-w-[200px] z-20">
              <div className="bg-green-100 p-3 rounded-full text-green-600">
                <Target size={24} />
              </div>
              <div>
                <p className="text-xs text-gray-500 uppercase font-bold tracking-wider">Kariyer Hedefi</p>
                <p className="text-xl font-black text-gray-900">%92 Uyum</p>
              </div>
            </div>
          </div>
          
          {/* Decorative blobs */}
          <div className="absolute top-0 right-0 -mr-20 -mt-20 w-72 h-72 bg-purple-200 rounded-full mix-blend-multiply filter blur-3xl opacity-30 animate-blob"></div>
          <div className="absolute bottom-0 left-0 -ml-20 -mb-20 w-72 h-72 bg-blue-200 rounded-full mix-blend-multiply filter blur-3xl opacity-30 animate-blob animation-delay-2000"></div>
        </div>
      </section>

      {/* Stats Section - From PDF Page 16 */}
      <section className="bg-white py-20 border-t border-gray-100">
        <div className="container mx-auto px-6">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold text-gray-900">Rakamlarla Dönüşüm: KÖRPE AI'nın Etkisi</h2>
            <p className="text-gray-500 mt-4">Pilot uygulamadan elde edilen gerçek veriler</p>
          </div>
          
          <div className="grid md:grid-cols-3 gap-8">
            <div className="p-8 bg-gray-50 rounded-2xl text-center hover:bg-korpe-50 transition border border-gray-100">
              <div className="text-5xl font-bold text-korpe-600 mb-2">%62</div>
              <div className="text-lg font-semibold text-gray-800 mb-2">Artış</div>
              <p className="text-gray-600 text-sm">Deney grubundaki öğrencilerin meslek hedefi netliğinde artış.</p>
            </div>
            
            <div className="p-8 bg-gray-50 rounded-2xl text-center hover:bg-korpe-50 transition border border-gray-100">
              <div className="text-5xl font-bold text-korpe-600 mb-2">%40 → %12</div>
              <div className="text-lg font-semibold text-gray-800 mb-2">Kararsızlık Düşüşü</div>
              <p className="text-gray-600 text-sm">'Hangi alan bana uygun?' sorusuna verilen kararsız cevap oranındaki düşüş.</p>
            </div>
            
            <div className="p-8 bg-gray-50 rounded-2xl text-center hover:bg-korpe-50 transition border border-gray-100">
              <div className="text-5xl font-bold text-korpe-600 mb-2">%85</div>
              <div className="text-lg font-semibold text-gray-800 mb-2">Memnuniyet</div>
              <p className="text-gray-600 text-sm">Öğrenciler, sunulan meslek önerilerinin kendi ilgi ve kişilikleriyle uyumlu olduğunu belirtti.</p>
            </div>
          </div>
        </div>
      </section>

      {/* How it Works - From PDF Page 1 */}
      <section id="nasil-calisir" className="py-20 container mx-auto px-6">
        <h2 className="text-3xl font-bold text-center text-gray-900 mb-16">Sistem Nasıl Çalışıyor?</h2>
        <div className="flex flex-col md:flex-row justify-between items-center gap-12 relative">
          
          {/* Step 1 */}
          <div className="flex-1 text-center relative z-10">
            <div className="w-20 h-20 mx-auto bg-white border-4 border-korpe-100 rounded-full flex items-center justify-center text-korpe-600 mb-6 shadow-lg">
              <Compass size={32} />
            </div>
            <h3 className="text-xl font-bold text-gray-800 mb-2">1. Veri Toplama</h3>
            <p className="text-gray-600">Kişilik, İlgi ve Başarı envanterlerini doldur.</p>
          </div>

          {/* Connector Line */}
          <div className="hidden md:block absolute top-10 left-0 w-full h-1 bg-gray-100 z-0 transform translate-y-1/2"></div>

          {/* Step 2 */}
          <div className="flex-1 text-center relative z-10">
             <div className="w-20 h-20 mx-auto bg-white border-4 border-korpe-100 rounded-full flex items-center justify-center text-korpe-600 mb-6 shadow-lg">
              <Brain size={32} />
            </div>
            <h3 className="text-xl font-bold text-gray-800 mb-2">2. Yapay Zeka Analizi</h3>
            <p className="text-gray-600">Gemini Modeli verilerini çok boyutlu olarak işler.</p>
          </div>

          {/* Step 3 */}
          <div className="flex-1 text-center relative z-10">
             <div className="w-20 h-20 mx-auto bg-white border-4 border-korpe-100 rounded-full flex items-center justify-center text-korpe-600 mb-6 shadow-lg">
              <BarChart3 size={32} />
            </div>
            <h3 className="text-xl font-bold text-gray-800 mb-2">3. Rapor Üretimi</h3>
            <p className="text-gray-600">Sana özel yol haritası ve gelişim planını al.</p>
          </div>
        </div>
      </section>

      {/* Features Grid */}
      <section className="bg-korpe-900 text-white py-20">
        <div className="container mx-auto px-6">
          <div className="flex flex-col md:flex-row gap-12">
            <div className="md:w-1/3">
              <h2 className="text-3xl font-bold mb-6">KÖRPE AI'yi Benzersiz Kılan Nedir?</h2>
              <p className="text-korpe-200 leading-relaxed">
                Klasik testlerin yüzeyselliğini aşarak, öğrencinin güçlü yönlerini, potansiyelini ve gelişim alanlarını bütüncül şekilde değerlendiren veri odaklı yerli bir yaklaşım.
              </p>
            </div>
            <div className="md:w-2/3 grid sm:grid-cols-2 gap-8">
              <div className="bg-white/10 p-6 rounded-2xl backdrop-blur-sm border border-white/10 hover:bg-white/20 transition">
                <CheckCircle2 className="text-korpe-300 mb-4" size={28} />
                <h4 className="font-bold text-lg mb-2">İlk Yerli ve Bütüncül Model</h4>
                <p className="text-sm text-korpe-200">Kişilik, ilgi ve akademik verileri tek çatıda birleştirir.</p>
              </div>
              <div className="bg-white/10 p-6 rounded-2xl backdrop-blur-sm border border-white/10 hover:bg-white/20 transition">
                <CheckCircle2 className="text-korpe-300 mb-4" size={28} />
                <h4 className="font-bold text-lg mb-2">6 Haftalık Gelişim Planı</h4>
                <p className="text-sm text-korpe-200">Sadece "ne olacağını" değil, "nasıl gelişeceğini" de söyler.</p>
              </div>
              <div className="bg-white/10 p-6 rounded-2xl backdrop-blur-sm border border-white/10 hover:bg-white/20 transition">
                <CheckCircle2 className="text-korpe-300 mb-4" size={28} />
                <h4 className="font-bold text-lg mb-2">Derinlemesine Analiz</h4>
                <p className="text-sm text-korpe-200">Big Five ve RIASEC kuramlarına dayalı bilimsel temel.</p>
              </div>
              <div className="bg-white/10 p-6 rounded-2xl backdrop-blur-sm border border-white/10 hover:bg-white/20 transition">
                <CheckCircle2 className="text-korpe-300 mb-4" size={28} />
                <h4 className="font-bold text-lg mb-2">Dinamik Raporlama</h4>
                <p className="text-sm text-korpe-200">Her öğrenciye özgü, kopyala-yapıştır olmayan içerik.</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-50 py-12 border-t border-gray-200">
        <div className="container mx-auto px-6 flex flex-col md:flex-row justify-between items-center gap-8">
          
          {/* Left Side: Brand */}
          <div className="flex flex-col items-center md:items-start gap-3">
            <div className="flex items-center gap-2">
              <div className="bg-korpe-600 p-1.5 rounded text-white">
                <Brain size={20} />
              </div>
              <span className="font-bold text-gray-800 text-lg">KÖRPE AI</span>
            </div>
            <p className="text-gray-500 text-sm text-center md:text-left max-w-xs">
              Öğrencilerin kariyer yolculuğuna ışık tutan yapay zeka destekli rehberlik sistemi.
            </p>
            <div className="text-gray-400 text-xs mt-2">
              © 2025 Tüm hakları saklıdır.
            </div>
          </div>

          {/* Right Side: School Info & Logo */}
          <div className="flex flex-col items-center md:items-end text-center md:text-right">
             <div className="mb-4">
                <h4 className="font-bold text-gray-900">Rize Borsa İstanbul Mesleki ve Teknik Anadolu Lisesi</h4>
                <p className="text-korpe-600 font-medium text-sm">TÜBİTAK 2204-A Lise Öğrencileri Araştırma Projeleri Yarışması</p>
                <p className="text-gray-500 text-xs mt-1">Yazılım Projesidir</p>
             </div>
             <img 
               src="https://rizebistmtal.meb.k12.tr/meb_iys_dosyalar/53/01/964344/dosyalar/2022_12/30104712_logo.png"
               alt="Rize Bist MTAL Logo" 
               className="h-24 w-auto object-contain mix-blend-multiply opacity-90 hover:opacity-100 transition"
               onError={(e) => {
                 // Fallback if the specific school logo URL fails or changes
                 e.currentTarget.src = "https://upload.wikimedia.org/wikipedia/commons/9/95/MEB_Logo.png";
               }}
             />
          </div>

        </div>
      </footer>
    </div>
  );
};