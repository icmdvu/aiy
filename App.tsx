
import React, { useState, useEffect, useRef } from 'react';
import { PageState } from './types';
import { TEXT_DATA, AUDIO_URL, STICKERS, POLAROID_IMAGES } from './constants';
import FloatingHearts from './components/FloatingHearts';

const App: React.FC = () => {
  const [currentPage, setCurrentPage] = useState<PageState>(PageState.HOME);
  const [displayedText, setDisplayedText] = useState({ part1: '', part2: '', part3: '' });
  const [showImages, setShowImages] = useState(false);
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const messageEndRef = useRef<HTMLDivElement>(null);

  const startApp = () => {
    setCurrentPage(PageState.ENVELOPE);
    // Pre-load audio so it's ready
    if (audioRef.current) {
      audioRef.current.load();
    }
  };

  const openEnvelope = () => {
    setCurrentPage(PageState.MESSAGE);
    if (audioRef.current) {
      audioRef.current.play().catch(e => console.log("Audio play blocked", e));
    }
    animateTypewriter();
  };

  const animateTypewriter = async () => {
    const type = async (text: string, key: 'part1' | 'part2' | 'part3') => {
      const cleanText = text.replace(/<br>/g, '\n');
      // Speed decreased significantly (100ms per character for readability)
      for (let i = 0; i <= cleanText.length; i++) {
        setDisplayedText(prev => ({ ...prev, [key]: cleanText.slice(0, i).replace(/\n/g, '<br>') }));
        await new Promise(resolve => setTimeout(resolve, 100));
        messageEndRef.current?.scrollIntoView({ behavior: 'smooth' });
      }
    };

    await type(TEXT_DATA.DOA, 'part1');
    await new Promise(resolve => setTimeout(resolve, 1000));
    await type(TEXT_DATA.PESAN_AKHIR, 'part2');
    await new Promise(resolve => setTimeout(resolve, 1000));
    await type(TEXT_DATA.LUCU, 'part3');
    
    // Show images after text is done
    setShowImages(true);
    setTimeout(() => {
        messageEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    }, 200);
  };

  return (
    <div className="min-h-screen relative flex items-center justify-center bg-[#fff0f3] overflow-hidden p-4">
      {/* Audio Element */}
      <audio ref={audioRef} src={AUDIO_URL} loop />

      <FloatingHearts />

      {/* Main Container */}
      <main className="z-10 w-full max-w-xl mx-auto flex flex-col items-center">
        
        {currentPage === PageState.HOME && (
          <div className="flex flex-col items-center animate-in fade-in zoom-in duration-1000">
            <div className="w-48 h-48 mb-8 relative">
              <div className="absolute inset-0 bg-pink-200 rounded-full animate-ping opacity-25"></div>
              <img src={STICKERS.LOVE} alt="Love" className="relative w-full h-full rounded-full shadow-2xl border-4 border-white object-cover" />
            </div>
            <h1 className="text-4xl font-bold text-pink-600 text-center mb-2 drop-shadow-sm">Halo Cantik ❤️</h1>
            <p className="text-pink-400 mb-8 font-medium">Ada pesan kecil buat kamu...</p>
            <button 
              onClick={startApp}
              className="px-10 py-4 bg-gradient-to-r from-pink-400 to-rose-400 hover:from-pink-500 hover:to-rose-500 text-white font-bold rounded-full shadow-xl transform hover:scale-105 transition-all duration-300 active:scale-95"
            >
              Klik Disini ✨
            </button>
          </div>
        )}

        {currentPage === PageState.ENVELOPE && (
          <div className="flex flex-col items-center animate-in slide-in-from-top-10 duration-700">
            <div 
              onClick={openEnvelope}
              className="group relative w-72 h-52 cursor-pointer perspective-1000"
            >
              {/* Envelope Body */}
              <div className="absolute inset-0 bg-rose-400 rounded-b-xl shadow-2xl z-20"></div>
              {/* Envelope Flap */}
              <div className="absolute top-0 w-full h-1/2 bg-rose-300 rounded-t-xl origin-top transition-all duration-700 z-30 group-hover:[transform:rotateX(160deg)] group-hover:bg-rose-200"></div>
              {/* Paper inside - Clicking the text or paper also opens it */}
              <div className="absolute inset-x-4 top-4 bottom-4 bg-white rounded-lg z-10 transform translate-y-0 group-hover:-translate-y-16 transition-all duration-700 flex flex-col items-center justify-center p-4 shadow-inner">
                 <p className="text-rose-500 font-bold text-center text-lg pointer-events-none">Surat Untukmu</p>
                 <span className="text-2xl mt-2 pointer-events-none">💌</span>
              </div>
              {/* Decoration */}
              <div className="absolute bottom-4 right-4 z-40 text-white opacity-50 text-xs italic">Tap to open</div>
            </div>
            <h2 className="mt-20 text-xl font-bold text-rose-600 animate-bounce">Buka Suratnya! 🧸</h2>
          </div>
        )}

        {currentPage === PageState.MESSAGE && (
          <div className="w-full bg-white/60 backdrop-blur-md border border-white/80 rounded-[2.5rem] shadow-2xl overflow-hidden max-h-[90vh] flex flex-col animate-in zoom-in fade-in duration-1000">
            <div className="p-8 overflow-y-auto custom-scrollbar flex-1 space-y-6">
              {/* Header Sticker */}
              <div className="flex justify-center">
                 <img src={STICKERS.UP} alt="Header" className="w-28 h-28 rounded-full border-4 border-white shadow-lg bg-pink-100 p-2" />
              </div>
              
              {/* Text Message - All unified to pink colors */}
              <div className="space-y-6 text-pink-600 leading-relaxed text-base md:text-lg text-justify font-bold">
                <div dangerouslySetInnerHTML={{ __html: displayedText.part1 }} className="border-l-4 border-pink-300 pl-4" />
                <div dangerouslySetInnerHTML={{ __html: displayedText.part2 }} className="bg-pink-50/50 p-4 rounded-2xl" />
                <div dangerouslySetInnerHTML={{ __html: displayedText.part3 }} />
              </div>

              {/* Polaroid Gallery */}
              {showImages && (
                <div className="grid grid-cols-2 gap-6 pt-10 pb-10 animate-in fade-in slide-in-from-bottom-10 duration-1000 delay-500">
                  {POLAROID_IMAGES.map((src, idx) => {
                    const rotations = ["rotate-2", "-rotate-3", "rotate-3", "-rotate-2"];
                    return (
                      <div 
                        key={idx}
                        className={`bg-white p-3 pb-10 shadow-xl border border-gray-100 transform ${rotations[idx % rotations.length]} hover:rotate-0 transition-transform duration-500 hover:scale-110 z-10 hover:z-20`}
                      >
                        <img 
                          src={src} 
                          alt={`Memory ${idx}`} 
                          className="w-full h-40 md:h-52 object-cover grayscale-[20%] hover:grayscale-0 transition-all shadow-inner" 
                        />
                      </div>
                    );
                  })}
                </div>
              )}
              
              <div ref={messageEndRef} />
            </div>
          </div>
        )}

      </main>

      <style>{`
        .perspective-1000 { perspective: 1000px; }
        .backface-hidden { backface-visibility: hidden; }
        .preserve-3d { transform-style: preserve-3d; }
        .custom-scrollbar::-webkit-scrollbar {
          width: 6px;
        }
        .custom-scrollbar::-webkit-scrollbar-track {
          background: rgba(255, 255, 255, 0.1);
        }
        .custom-scrollbar::-webkit-scrollbar-thumb {
          background: rgba(244, 114, 182, 0.4);
          border-radius: 10px;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb:hover {
          background: rgba(244, 114, 182, 0.6);
        }
      `}</style>
    </div>
  );
};

export default App;
