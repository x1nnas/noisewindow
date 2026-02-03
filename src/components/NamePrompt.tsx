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
import { User } from 'lucide-react';
import { useLanguage } from '@/contexts/LanguageContext';

interface NamePromptProps {
  open: boolean;
  onSuccess: (name: string) => void;
}

const NamePrompt = ({ open, onSuccess }: NamePromptProps) => {
  const [name, setName] = useState('');
  const { t } = useLanguage();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const trimmedName = name.trim();
    if (trimmedName.length > 0) {
      localStorage.setItem('noisewindow-user-name', trimmedName);
      onSuccess(trimmedName);
    }
  };

  return (
    <Dialog open={open} onOpenChange={() => {}}>
      <DialogContent className="max-w-[320px] w-[calc(100%-2rem)] mx-auto p-6 duration-300 ease-out [&>button]:hidden">
        <DialogHeader className="text-center">
          <div className="mx-auto w-12 h-12 rounded-full bg-secondary flex items-center justify-center mb-2">
            <User className="w-5 h-5 text-muted-foreground" />
          </div>
          <DialogTitle className="text-center">{t.welcome.title}</DialogTitle>
          <DialogDescription className="text-center">
            {t.welcome.description}
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4 mt-4">
          <div>
            <Input
              type="text"
              placeholder={t.welcome.placeholder}
              value={name}
              onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
                setName(e.target.value);
              }}
              className="h-12 text-center text-base"
              autoFocus
              maxLength={50}
            />
          </div>
          <Button 
            type="submit" 
            className="w-full h-11"
            disabled={name.trim().length === 0}
          >
            {t.welcome.continue}
          </Button>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default NamePrompt;
