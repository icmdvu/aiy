
import React, { useEffect, useState } from 'react';

const FloatingHearts: React.FC = () => {
  const [hearts, setHearts] = useState<{ id: number; left: string; size: string; delay: string; duration: string }[]>([]);

  useEffect(() => {
    const interval = setInterval(() => {
      const newHeart = {
        id: Date.now(),
        left: `${Math.random() * 100}%`,
        size: `${Math.random() * (30 - 15) + 15}px`,
        delay: `${Math.random() * 2}s`,
        duration: `${Math.random() * (10 - 5) + 5}s`
      };
      setHearts(prev => [...prev.slice(-20), newHeart]);
    }, 800);

    return () => clearInterval(interval);
  }, []);

  return (
    <div className="fixed inset-0 pointer-events-none z-0 overflow-hidden">
      {hearts.map(heart => (
        <div
          key={heart.id}
          className="absolute bottom-0 text-red-400 opacity-60 animate-float"
          style={{
            left: heart.left,
            fontSize: heart.size,
            animationDuration: heart.duration,
            animationDelay: heart.delay,
          }}
        >
          ❤️
        </div>
      ))}
      <style>{`
        @keyframes float-up {
          0% { transform: translateY(10vh) scale(0); opacity: 0; }
          20% { opacity: 0.6; }
          100% { transform: translateY(-110vh) scale(1.5); opacity: 0; }
        }
        .animate-float {
          animation: float-up linear forwards;
        }
      `}</style>
    </div>
  );
};

export default FloatingHearts;
