import React, { useEffect, useState } from 'react';
import HRRLLogo from './HRRLLogo';

export default function SplashScreen({ onComplete }) {
  const [stage, setStage] = useState(0);

  useEffect(() => {
    // Stage 1: Logo animates in
    const t1 = setTimeout(() => setStage(1), 300);
    // Stage 2: Subtitle fades in
    const t2 = setTimeout(() => setStage(2), 800);
    // Stage 3: Title fades in
    const t3 = setTimeout(() => setStage(3), 1100);
    // Stage 4: Progress bar starts
    const t4 = setTimeout(() => setStage(4), 1400);
    // Stage 5: Fade out entire screen
    const t5 = setTimeout(() => setStage(5), 2400);
    // Stage 6: Unmount
    const t6 = setTimeout(() => {
      sessionStorage.setItem('hrrl-splash-shown', 'true');
      onComplete();
    }, 2600);

    return () => {
      clearTimeout(t1); clearTimeout(t2); clearTimeout(t3);
      clearTimeout(t4); clearTimeout(t5); clearTimeout(t6);
    };
  }, [onComplete]);

  return (
    <div 
      className={`fixed inset-0 flex flex-col items-center justify-center z-50 transition-opacity duration-200 ease-in
        bg-gradient-to-b from-[#0F2A4A] to-[#1B3A6B] dark:from-[#0D1117] dark:to-[#161B22]
        ${stage >= 5 ? 'opacity-0' : 'opacity-100'}
      `}
    >
      <div 
        className="flex flex-col items-center transition-all duration-500 ease-out"
        style={{
          transform: stage >= 1 ? 'scale(1)' : 'scale(0.6)',
          opacity: stage >= 1 ? 1 : 0
        }}
      >
        <HRRLLogo size={96} />
      </div>

      <div 
        className="mt-6 text-center transition-opacity duration-300"
        style={{ opacity: stage >= 2 ? 1 : 0 }}
      >
        <p className="text-white/70 text-[13px] tracking-[0.12em]">
          HPCL Rajasthan Refinery Limited
        </p>
      </div>

      <div 
        className="mt-2 text-center transition-opacity duration-300"
        style={{ opacity: stage >= 3 ? 1 : 0 }}
      >
        <p className="text-accent text-[11px] tracking-[0.2em] uppercase font-medium">
          AI SAP Authorization Portal
        </p>
      </div>

      <div 
        className="mt-10 w-[220px] h-[2px] bg-white/10 rounded-full overflow-hidden transition-opacity duration-300"
        style={{ opacity: stage >= 4 ? 1 : 0 }}
      >
        <div 
          className="h-full bg-accent transition-all duration-1000 ease-linear"
          style={{ width: stage >= 4 ? '100%' : '0%' }}
        />
      </div>
    </div>
  );
}
