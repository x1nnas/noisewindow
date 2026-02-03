import { useState } from 'react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Lock } from 'lucide-react';
import { useLanguage } from '@/contexts/LanguageContext';
import { useToast } from '@/hooks/useToast';
import { ToastContainer } from '@/components/ui/toast';

interface PinPromptProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSuccess: () => void;
}

const PinPrompt = ({ open, onOpenChange, onSuccess }: PinPromptProps) => {
  const [pin, setPin] = useState('');
  const [error, setError] = useState(false);
  const { t } = useLanguage();
  const { toasts, showToast, removeToast } = useToast();

  const ADMIN_PIN = process.env.NEXT_PUBLIC_ADMIN_PIN || '4334';

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (pin === ADMIN_PIN) {
      setPin('');
      setError(false);
      showToast(t.admin.correctPin, 'success');
      setTimeout(() => {
        onSuccess();
      }, 500);
    } else {
      setError(true);
      setPin('');
      showToast(t.admin.wrongPin, 'error');
    }
  };

  const handleClose = (isOpen: boolean) => {
    if (!isOpen) {
      setPin('');
      setError(false);
    }
    onOpenChange(isOpen);
  };

  return (
    <Dialog open={open} onOpenChange={handleClose}>
      <DialogContent className="max-w-[280px] w-[calc(100%-2rem)] mx-auto p-5 duration-300 ease-out">
        <DialogHeader className="text-center">
          <div className="mx-auto w-12 h-12 rounded-full bg-secondary flex items-center justify-center mb-2">
            <Lock className="w-5 h-5 text-muted-foreground" />
          </div>
          <DialogTitle className="text-center">{t.admin.access}</DialogTitle>
          <DialogDescription className="text-center">
            {t.admin.enterPin}
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4 mt-4">
          <div>
            <Input
              type="password"
              inputMode="numeric"
              pattern="[0-9]*"
              maxLength={4}
              placeholder={t.admin.enterPinPlaceholder}
              value={pin}
              onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
                const value = e.target.value.replace(/\D/g, '').slice(0, 4);
                setPin(value);
                setError(false);
              }}
              className={`h-12 text-center text-lg tracking-widest ${error ? 'border-destructive focus-visible:ring-destructive' : ''}`}
              autoFocus
            />
            {error && (
              <p className="text-xs text-destructive mt-2 text-center animate-in fade-in-0 duration-200">
                {t.admin.wrongPin}
              </p>
            )}
          </div>
          <Button type="submit" className="w-full h-11">
            {t.admin.unlock}
          </Button>
        </form>
      </DialogContent>
      <ToastContainer toasts={toasts} onRemove={removeToast} />
    </Dialog>
  );
};

export default PinPrompt;
