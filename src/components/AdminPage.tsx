import { useState, useRef } from 'react';
import { ArrowLeft } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';
import { useLanguage } from '@/contexts/LanguageContext';
import { useToast } from '@/hooks/useToast';
import { ToastContainer } from '@/components/ui/toast';
import LanguageToggle from '@/components/LanguageToggle';
import { translateDayName } from '@/lib/dayTranslations';
import { validateTimeRange } from '@/lib/validation';

interface AdminPageProps {
  onBack: () => void;
}

interface DaySchedule {
  start: string;
  end: string;
  off: boolean;
  tba: boolean;
}

interface DayEditorProps {
  day: string;
  defaultStart?: string;
  defaultEnd?: string;
  defaultOff?: boolean;
  defaultTba?: boolean;
  onOffChange?: (off: boolean) => void;
  onTbaChange?: (tba: boolean) => void;
  startRef?: React.RefObject<HTMLInputElement | null>;
  endRef?: React.RefObject<HTMLInputElement | null>;
}

const DayEditor = ({ 
  day, 
  defaultStart = '09:00', 
  defaultEnd = '17:00', 
  defaultOff = false,
  defaultTba = false,
  onOffChange,
  onTbaChange,
  startRef,
  endRef
}: DayEditorProps) => {
  const { t, language } = useLanguage();
  const [isOff, setIsOff] = useState(defaultOff);
  const [isTba, setIsTba] = useState(defaultTba);
  const translatedDayName = translateDayName(day, language);

  const handleOffChange = (checked: boolean) => {
    setIsOff(checked);
    if (checked) {
      setIsTba(false);
      onTbaChange?.(false);
    }
    onOffChange?.(checked);
  };

  const handleTbaChange = (checked: boolean) => {
    setIsTba(checked);
    if (checked) {
      setIsOff(false);
      onOffChange?.(false);
    }
    onTbaChange?.(checked);
  };

  return (
    <div className="space-y-3 py-3 border-b border-border/50 last:border-b-0">
      <div className="flex items-center justify-between">
        <span className="text-sm font-medium text-foreground">{translatedDayName}</span>
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-2">
            <Label htmlFor={`tba-${day}`} className="text-xs text-muted-foreground">
              {t.admin.tba}
            </Label>
            <Switch 
              id={`tba-${day}`} 
              checked={isTba}
              onCheckedChange={handleTbaChange}
              disabled={isOff}
            />
          </div>
          <div className="flex items-center gap-2">
            <Label htmlFor={`off-${day}`} className="text-xs text-muted-foreground">
              {t.admin.off}
            </Label>
            <Switch 
              id={`off-${day}`} 
              checked={isOff}
              onCheckedChange={handleOffChange}
              disabled={isTba}
            />
          </div>
        </div>
      </div>
      <div className="flex gap-3">
        <div className="flex-1">
          <Label htmlFor={`start-${day}`} className="text-xs text-muted-foreground mb-1 block">
            {t.admin.start}
          </Label>
          <Input
            ref={startRef}
            id={`start-${day}`}
            type="time"
            defaultValue={defaultStart}
            className="h-11 text-base"
            disabled={isOff || isTba}
          />
        </div>
        <div className="flex-1">
          <Label htmlFor={`end-${day}`} className="text-xs text-muted-foreground mb-1 block">
            {t.admin.end}
          </Label>
          <Input
            ref={endRef}
            id={`end-${day}`}
            type="time"
            defaultValue={defaultEnd}
            className="h-11 text-base"
            disabled={isOff || isTba}
          />
        </div>
      </div>
    </div>
  );
};

const AdminPage = ({ onBack }: AdminPageProps) => {
  const { t } = useLanguage();
  const { toasts, showToast, removeToast } = useToast();
  const [todaySchedule, setTodaySchedule] = useState<DaySchedule>({
    start: '09:00',
    end: '17:00',
    off: false,
    tba: false,
  });

  const [upcomingDays, setUpcomingDays] = useState([
    { day: 'Tomorrow', start: '10:00', end: '14:00', off: false, tba: false },
    { day: 'Wednesday', start: '09:00', end: '17:00', off: false, tba: false },
    { day: 'Thursday', start: '09:00', end: '17:00', off: true, tba: false },
  ]);

  const [notifications, setNotifications] = useState(true);

  const todayStartRef = useRef<HTMLInputElement>(null);
  const todayEndRef = useRef<HTMLInputElement>(null);
  
  const tomorrowStartRef = useRef<HTMLInputElement>(null);
  const tomorrowEndRef = useRef<HTMLInputElement>(null);
  const wednesdayStartRef = useRef<HTMLInputElement>(null);
  const wednesdayEndRef = useRef<HTMLInputElement>(null);
  const thursdayStartRef = useRef<HTMLInputElement>(null);
  const thursdayEndRef = useRef<HTMLInputElement>(null);

  const [dayStates, setDayStates] = useState<{ [key: string]: { off: boolean; tba: boolean } }>(() => {
    const states: { [key: string]: { off: boolean; tba: boolean } } = {};
    upcomingDays.forEach(day => {
      states[day.day] = { off: day.off, tba: day.tba };
    });
    return states;
  });

  const getDayRefs = (day: string) => {
    switch (day) {
      case 'Tomorrow':
        return { start: tomorrowStartRef, end: tomorrowEndRef };
      case 'Wednesday':
        return { start: wednesdayStartRef, end: wednesdayEndRef };
      case 'Thursday':
        return { start: thursdayStartRef, end: thursdayEndRef };
      default:
        return { start: { current: null }, end: { current: null } };
    }
  };

  const handleSaveAll = () => {
    const todayStart = todayStartRef.current?.value || '09:00';
    const todayEnd = todayEndRef.current?.value || '17:00';

    // Validate today's time range
    if (!todaySchedule.off && !todaySchedule.tba && !validateTimeRange(todayStart, todayEnd)) {
      showToast(t.admin.invalidTimeRange, 'error');
      return;
    }

    const todayData: DaySchedule = {
      start: todayStart,
      end: todayEnd,
      off: todaySchedule.off,
      tba: todaySchedule.tba,
    };

    // Validate all upcoming days
    const daysData = upcomingDays.map(dayInfo => {
      const refs = getDayRefs(dayInfo.day);
      const start = refs.start.current?.value || dayInfo.start;
      const end = refs.end.current?.value || dayInfo.end;
      
      return {
        day: dayInfo.day,
        start,
        end,
        off: dayStates[dayInfo.day]?.off || false,
        tba: dayStates[dayInfo.day]?.tba || false,
      };
    });

    // Validate each day's time range
    for (const day of daysData) {
      if (!day.off && !day.tba && !validateTimeRange(day.start, day.end)) {
        showToast(t.admin.invalidTimeRange, 'error');
        return;
      }
    }

    const scheduleData = {
      today: todayData,
      upcomingDays: daysData,
      notifications,
      lastUpdated: new Date().toISOString(),
    };

    try {
      localStorage.setItem('noisewindow-schedule', JSON.stringify(scheduleData));
      
      setTodaySchedule(todayData);
      setUpcomingDays(daysData);

      window.dispatchEvent(new Event('schedule-updated'));
      
      showToast(t.admin.updatedSuccessfully, 'success');
    } catch (error) {
      console.error('Error saving schedule:', error);
      showToast(t.admin.saveError, 'error');
    }
  };

  const handleDayOffChange = (day: string, off: boolean) => {
    setDayStates(prev => ({
      ...prev,
      [day]: { ...prev[day], off, tba: off ? false : (prev[day]?.tba || false) }
    }));
  };

  const handleDayTbaChange = (day: string, tba: boolean) => {
    setDayStates(prev => ({
      ...prev,
      [day]: { ...prev[day], tba, off: tba ? false : (prev[day]?.off || false) }
    }));
  };

  return (
    <div className="min-h-screen bg-background flex flex-col">
      <header className="sticky top-0 bg-background/95 backdrop-blur-sm border-b border-border/50 z-10">
        <div className="max-w-md mx-auto px-6 py-4 flex items-center gap-4">
          <button
            onClick={onBack}
            className="p-2 -ml-2 rounded-lg hover:bg-secondary transition-colors"
            aria-label="Go back"
          >
            <ArrowLeft className="w-5 h-5 text-foreground" />
          </button>
          <h1 className="text-lg font-semibold text-foreground">{t.admin.panel}</h1>
          <div className="ml-auto">
            <LanguageToggle className="rounded-full" />
          </div>
        </div>
      </header>

      <main className="flex-1 px-6 py-6 max-w-md mx-auto w-full space-y-6 pb-24">
        <div className="bg-secondary/30 rounded-xl p-4">
          <h3 className="text-sm font-semibold text-foreground mb-4">{t.admin.today}</h3>
          <div className="flex gap-3 mb-4">
            <div className="flex-1">
              <Label htmlFor="today-start" className="text-xs text-muted-foreground mb-1 block">
                {t.admin.start}
              </Label>
              <Input
                ref={todayStartRef}
                id="today-start"
                type="time"
                defaultValue={todaySchedule.start}
                className="h-11 text-base"
                disabled={todaySchedule.off || todaySchedule.tba}
              />
            </div>
            <div className="flex-1">
              <Label htmlFor="today-end" className="text-xs text-muted-foreground mb-1 block">
                {t.admin.end}
              </Label>
              <Input
                ref={todayEndRef}
                id="today-end"
                type="time"
                defaultValue={todaySchedule.end}
                className="h-11 text-base"
                disabled={todaySchedule.off || todaySchedule.tba}
              />
            </div>
          </div>
          <div className="flex items-center gap-4 justify-end">
            <div className="flex items-center gap-2">
              <Label htmlFor="today-tba" className="text-xs text-muted-foreground">
                {t.admin.tba}
              </Label>
              <Switch 
                id="today-tba" 
                checked={todaySchedule.tba}
                onCheckedChange={(checked) => setTodaySchedule({ ...todaySchedule, tba: checked, off: checked ? false : todaySchedule.off })}
                disabled={todaySchedule.off}
              />
            </div>
            <div className="flex items-center gap-2">
              <Label htmlFor="today-off" className="text-xs text-muted-foreground">
                {t.admin.off}
              </Label>
              <Switch 
                id="today-off" 
                checked={todaySchedule.off}
                onCheckedChange={(checked) => setTodaySchedule({ ...todaySchedule, off: checked, tba: checked ? false : todaySchedule.tba })}
                disabled={todaySchedule.tba}
              />
            </div>
          </div>
        </div>

        <div className="bg-secondary/30 rounded-xl p-4">
          <h3 className="text-sm font-semibold text-foreground mb-2">{t.admin.nextDays}</h3>
          <div className="divide-y-0">
            {upcomingDays.map((dayInfo) => {
              const refs = getDayRefs(dayInfo.day);
              return (
                <DayEditor
                  key={dayInfo.day}
                  day={dayInfo.day}
                  defaultStart={dayInfo.start}
                  defaultEnd={dayInfo.end}
                  defaultOff={dayStates[dayInfo.day]?.off ?? dayInfo.off}
                  defaultTba={dayStates[dayInfo.day]?.tba ?? dayInfo.tba}
                  onOffChange={(off) => handleDayOffChange(dayInfo.day, off)}
                  onTbaChange={(tba) => handleDayTbaChange(dayInfo.day, tba)}
                  startRef={refs.start}
                  endRef={refs.end}
                />
              );
            })}
          </div>
        </div>

        <div className="bg-secondary/30 rounded-xl p-4">
          <div className="flex items-center justify-between mb-2">
            <Label htmlFor="notifications" className="text-sm font-semibold text-foreground">
              {t.admin.notifications}
            </Label>
            <Switch 
              id="notifications" 
              checked={notifications}
              onCheckedChange={setNotifications}
            />
          </div>
          <p className="text-xs text-muted-foreground leading-relaxed">
            {t.admin.notificationsDescription}
          </p>
        </div>

        <Button 
          onClick={handleSaveAll}
          className="w-full h-11"
        >
          {t.admin.saveAll}
        </Button>
      </main>
      <ToastContainer toasts={toasts} onRemove={removeToast} />
    </div>
  );
};

export default AdminPage;
