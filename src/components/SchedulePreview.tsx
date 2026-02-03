import { useEffect, useState } from 'react';
import { useLanguage } from '@/contexts/LanguageContext';
import { translateDayName } from '@/lib/dayTranslations';
import { safeParseJSON } from '@/lib/validation';

interface DaySchedule {
  day: string;
  status: 'available' | 'busy' | 'off' | 'tba';
  timeRange?: string;
}

const SchedulePreview: React.FC = () => {
  const { t, language } = useLanguage();
  const [today, setToday] = useState<DaySchedule>({
    day: t.schedule.today,
    status: 'available',
    timeRange: '9:00 - 17:00',
  });

  const [nextDays, setNextDays] = useState<DaySchedule[]>([
    { day: 'Tomorrow', status: 'busy', timeRange: '10:00 - 14:00' },
    { day: 'Wednesday', status: 'available', timeRange: '9:00 - 17:00' },
    { day: 'Thursday', status: 'off' },
  ]);

  useEffect(() => {
    const loadSchedule = () => {
      try {
        const saved = localStorage.getItem('noisewindow-schedule');
        const scheduleData = safeParseJSON<{
          today?: { start: string; end: string; off?: boolean; tba?: boolean };
          upcomingDays?: Array<{ day: string; start: string; end: string; off?: boolean; tba?: boolean }>;
        }>(saved, null);
        
        if (scheduleData) {
          if (scheduleData.today) {
            const todayData = scheduleData.today;
            let status: 'available' | 'busy' | 'off' | 'tba' = 'available';
            if (todayData.off) status = 'off';
            else if (todayData.tba) status = 'tba';
            
            setToday({
              day: t.schedule.today,
              status,
              timeRange: todayData.off || todayData.tba 
                ? undefined 
                : `${todayData.start} - ${todayData.end}`,
            });
          }

          if (scheduleData.upcomingDays) {
            const days = scheduleData.upcomingDays.map((dayData) => {
              let status: 'available' | 'busy' | 'off' | 'tba' = 'available';
              if (dayData.off) status = 'off';
              else if (dayData.tba) status = 'tba';
              
              return {
                day: translateDayName(dayData.day, language),
                status,
                timeRange: dayData.off || dayData.tba 
                  ? undefined 
                  : `${dayData.start} - ${dayData.end}`,
              };
            });
            setNextDays(days);
          }
        }
      } catch (error) {
        console.error('Error loading schedule:', error);
      }
    };

    loadSchedule();
    
    const handleScheduleUpdate = () => loadSchedule();
    
    window.addEventListener('storage', handleScheduleUpdate);
    window.addEventListener('schedule-updated', handleScheduleUpdate);
    
    return () => {
      window.removeEventListener('storage', handleScheduleUpdate);
      window.removeEventListener('schedule-updated', handleScheduleUpdate);
    };
  }, [t, language]);

  const statusColors = {
    available: 'bg-status-available',
    busy: 'bg-status-busy',
    off: 'bg-status-off',
    tba: 'bg-status-busy',
  };

  const getStatusLabel = (status: string, isUpcoming: boolean = false) => {
    if (status === 'tba') return t.status.tba;
    if (status === 'off') {
      // Use "De Folga" for upcoming days, regular "off" for today
      return isUpcoming ? t.status.offUpcoming : t.status.off;
    }
    return null;
  };

  return (
    <div className="w-full space-y-4">
      <div className="bg-secondary/50 rounded-xl p-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <span className={`w-2 h-2 rounded-full ${statusColors[today.status]}`} />
            <span className="font-medium text-foreground">{today.day}</span>
          </div>
          {today.timeRange ? (
            <span className="text-sm text-muted-foreground">{today.timeRange}</span>
          ) : (
            <span className="text-sm text-muted-foreground italic">
              {getStatusLabel(today.status, false)}
            </span>
          )}
        </div>
      </div>

      <div>
        <h3 className="text-xs font-medium text-muted-foreground uppercase tracking-wider mb-3 px-1">
          {t.schedule.nextDays}
        </h3>
        <div className="space-y-2">
          {nextDays.map((day, index) => (
            <div 
              key={index}
              className="flex items-center justify-between py-2 px-1"
            >
              <div className="flex items-center gap-3">
                <span className={`w-1.5 h-1.5 rounded-full ${statusColors[day.status]}`} />
                <span className="text-sm text-foreground/80">{day.day}</span>
              </div>
              {day.timeRange ? (
                <span className="text-xs text-muted-foreground">{day.timeRange}</span>
              ) : (
                <span className="text-xs text-muted-foreground italic">
                  {getStatusLabel(day.status, true)}
                </span>
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default SchedulePreview;
