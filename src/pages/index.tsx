import { useState, useEffect } from 'react';
import Head from 'next/head';
import CharacterPlaceholder from '@/components/CharacterPlaceholder';
import StatusBadge from '@/components/StatusBadge';
import SchedulePreview from '@/components/SchedulePreview';
import PinPrompt from '@/components/PinPrompt';
import AdminPage from '@/components/AdminPage';
import LanguageToggle from '@/components/LanguageToggle';
import NamePrompt from '@/components/NamePrompt';
import { Settings } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useLanguage } from '@/contexts/LanguageContext';
import { safeParseJSON, timeToMinutes, formatCountdown } from '@/lib/validation';
import { TranslationType } from '@/lib/translations';

const getGreeting = (t: TranslationType, name?: string) => {
  const hour = new Date().getHours();
  let greeting: string;
  if (hour < 12) {
    greeting = t.greeting.morning;
  } else if (hour < 18) {
    greeting = t.greeting.afternoon;
  } else {
    greeting = t.greeting.evening;
  }
  
  return name ? `${greeting}, ${name}` : greeting;
};

// Check if current time is within sleeping hours (00:00 to 08:00)
const isSleepingHours = (): boolean => {
  const now = new Date();
  const currentMinutes = now.getHours() * 60 + now.getMinutes();
  const sleepStart = 0; // 00:00
  const sleepEnd = 8 * 60; // 08:00
  return currentMinutes >= sleepStart && currentMinutes < sleepEnd;
};

// Calculate current status based on time and schedule
const calculateStatus = (t: TranslationType): {
  status: 'available' | 'busy' | 'off' | 'sleeping';
  label: string;
} => {
  // First check if it's sleeping hours (00:00 to 08:00)
  if (isSleepingHours()) {
    return { status: 'sleeping', label: t.status.sleeping };
  }

  // Load schedule from localStorage
  if (typeof window === 'undefined') {
    return { status: 'available', label: t.status.working };
  }
  
  try {
    const saved = localStorage.getItem('noisewindow-schedule');
    const scheduleData = safeParseJSON<{
      today?: { start: string; end: string; off?: boolean; tba?: boolean };
      upcomingDays?: Array<{ day: string; start: string; end: string; off?: boolean; tba?: boolean }>;
    }>(saved, null);
    
    if (scheduleData?.today) {
      const todayData = scheduleData.today;
      
      // If today is marked as off
      if (todayData.off) {
        return { status: 'off', label: t.status.off };
      }
      
      // If today is TBA
      if (todayData.tba) {
        return { status: 'available', label: t.status.tba };
      }
      
      // Check if we're within working hours
      if (todayData.start && todayData.end) {
        const now = new Date();
        const currentMinutes = now.getHours() * 60 + now.getMinutes();
        const startMinutes = timeToMinutes(todayData.start);
        const endMinutes = timeToMinutes(todayData.end);
        const eightAM = 8 * 60; // 08:00
        
        if (currentMinutes >= startMinutes && currentMinutes < endMinutes) {
          return { status: 'available', label: t.status.working };
        } else if (currentMinutes < startMinutes && currentMinutes >= eightAM) {
          // After 8am and before work starts - show countdown
          const minutesUntilStart = startMinutes - currentMinutes;
          const countdown = formatCountdown(minutesUntilStart, t.status);
          return { 
            status: 'off', 
            label: `${t.status.workStartingIn} ${countdown}` 
          };
        } else {
          return { status: 'off', label: t.status.off };
        }
      }
    }
  } catch (error) {
    console.error('Error calculating status:', error);
  }

  // Default fallback
  return { status: 'available', label: t.status.working };
};

const Index = () => {
  const [showPinPrompt, setShowPinPrompt] = useState(false);
  const [showAdminPage, setShowAdminPage] = useState(false);
  const [showNamePrompt, setShowNamePrompt] = useState(() => {
    if (typeof window !== 'undefined') {
      const savedName = localStorage.getItem('noisewindow-user-name');
      return !savedName;
    }
    return false;
  });
  const [userName, setUserName] = useState<string | null>(() => {
    if (typeof window !== 'undefined') {
      return localStorage.getItem('noisewindow-user-name');
    }
    return null;
  });
  const [currentStatus, setCurrentStatus] = useState<'available' | 'busy' | 'off' | 'sleeping'>('available');
  const [statusLabel, setStatusLabel] = useState('Working');
  const [greeting, setGreeting] = useState(() => {
    // Default for SSR - will be updated after hydration
    return 'Good Morning';
  });
  const { t } = useLanguage();

  // Update greeting after hydration to avoid mismatch
  useEffect(() => {
    const updateGreeting = () => {
      setGreeting(getGreeting(t, userName || undefined));
    };
    updateGreeting();
  }, [t, userName]);

  // Calculate status on mount and when schedule updates
  useEffect(() => {
    const updateStatus = () => {
      const { status, label } = calculateStatus(t);
      setCurrentStatus(status);
      setStatusLabel(label);
    };

    // Initial calculation
    updateStatus();

    // Update every 30 seconds to keep countdown accurate
    const interval = setInterval(updateStatus, 30000);

    // Listen for schedule updates
    const handleScheduleUpdate = () => updateStatus();
    window.addEventListener('schedule-updated', handleScheduleUpdate);
    window.addEventListener('storage', handleScheduleUpdate);

    return () => {
      clearInterval(interval);
      window.removeEventListener('schedule-updated', handleScheduleUpdate);
      window.removeEventListener('storage', handleScheduleUpdate);
    };
  }, [t]);

  const handleAdminClick = () => {
    setShowPinPrompt(true);
  };

  const handlePinSuccess = () => {
    setShowPinPrompt(false);
    setShowAdminPage(true);
  };

  const handleAdminBack = () => {
    setShowAdminPage(false);
  };

  const handleNameSuccess = (name: string) => {
    setUserName(name);
    setShowNamePrompt(false);
  };

  if (showAdminPage) {
    return <AdminPage onBack={handleAdminBack} />;
  }

  return (
    <>
      <Head>
        <title>NoiseWindow - Your Availability Status</title>
        <meta name="description" content="Show your current availability status with beautiful animations. Perfect for housemates and shared spaces." />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <div className="min-h-screen bg-background flex flex-col">
        <main className="flex-1 flex flex-col items-center justify-center px-6 py-8 max-w-md mx-auto w-full">
          <div className="w-full text-center mb-6">
            <h1 className="text-3xl font-light text-foreground tracking-wide leading-relaxed" style={{ fontFamily: '"Inter", system-ui, -apple-system, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif', letterSpacing: '0.02em' }}>
              {greeting}
            </h1>
          </div>
          
          <div className="flex-1 flex items-center justify-center w-full min-h-[50vh]">
            <CharacterPlaceholder status={currentStatus} />
          </div>

          <div className="w-full text-center space-y-6 pb-4">
            <div className="flex justify-center">
              <StatusBadge status={currentStatus} label={statusLabel} />
            </div>

            <div className="w-12 h-px bg-border mx-auto" />

            <SchedulePreview />
          </div>

          <div className="absolute top-4 right-4 flex items-center gap-2">
            <LanguageToggle className="rounded-full" />
            <Button
              variant="ghost"
              size="icon"
              onClick={handleAdminClick}
              className="rounded-full"
              aria-label="Admin settings"
            >
              <Settings className="h-5 w-5" />
            </Button>
          </div>
        </main>

        <PinPrompt
          open={showPinPrompt}
          onOpenChange={setShowPinPrompt}
          onSuccess={handlePinSuccess}
        />
        
        <NamePrompt
          open={showNamePrompt}
          onSuccess={handleNameSuccess}
        />
      </div>
    </>
  );
};

export default Index;
 