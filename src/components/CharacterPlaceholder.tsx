import dynamic from 'next/dynamic';
import { useMemo } from 'react';

// Dynamically import DotLottieReact to handle binary .lottie files
const DotLottieReact = dynamic(
  () => import('@lottiefiles/dotlottie-react').then((mod) => mod.DotLottieReact),
  { 
    ssr: false,
    loading: () => (
      <div className="w-2/3 aspect-square rounded-full bg-secondary flex items-center justify-center">
        <div className="flex flex-col items-center gap-3">
          <div className="flex gap-6">
            <div className="w-3 h-3 rounded-full bg-foreground/60" />
            <div className="w-3 h-3 rounded-full bg-foreground/60" />
          </div>
          <div className="w-8 h-4 border-b-[3px] border-foreground/40 rounded-b-full" />
        </div>
      </div>
    )
  }
);

interface CharacterPlaceholderProps {
  status?: 'available' | 'busy' | 'off' | 'sleeping';
}

const CharacterPlaceholder: React.FC<CharacterPlaceholderProps> = ({ status = 'available' }) => {
  // Map status to animation file
  const animationPath = useMemo(() => {
    const animationMap: Record<'available' | 'busy' | 'off' | 'sleeping', string> = {
      available: '/animations/working.lottie',
      busy: '/animations/sleeping.lottie',
      off: '/animations/off.lottie',
      sleeping: '/animations/sleeping.lottie',
    };
    return animationMap[status];
  }, [status]);

  return (
    <div className="relative flex items-center justify-center w-full aspect-square max-w-[400px] mx-auto">
      {/* Outer glow ring - very subtle white */}
      <div className="absolute inset-0 rounded-full bg-white/10 animate-breathe" />
      
      {/* Middle ring - subtle white with slight tint */}
      <div className="absolute inset-2 rounded-full bg-white/15 animate-breathe" style={{ animationDelay: '0.5s' }} />
      
      {/* Inner container for character - larger and whiter */}
      <div className="relative w-full aspect-square rounded-full bg-gradient-to-br from-white/25 to-white/10 shadow-soft flex items-center justify-center animate-float">
        {/* DotLottie animation for binary .lottie files */}
        <div className="w-full h-full flex items-center justify-center p-4">
          <DotLottieReact
            src={animationPath}
            loop
            autoplay
            style={{ width: '100%', height: '100%' }}
          />
        </div>
      </div>
    </div>
  );
};

export default CharacterPlaceholder;
