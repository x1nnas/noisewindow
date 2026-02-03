import * as React from 'react';
import { X, CheckCircle2, AlertCircle } from 'lucide-react';
import { cn } from '@/lib/utils';

export type ToastType = 'success' | 'error';

interface ToastProps {
  message: string;
  type: ToastType;
  onClose: () => void;
  duration?: number;
}

export const Toast: React.FC<ToastProps> = ({ message, type, onClose, duration = 3000 }) => {
  React.useEffect(() => {
    const timer = setTimeout(() => {
      onClose();
    }, duration);

    return () => clearTimeout(timer);
  }, [duration, onClose]);

  const icon = type === 'success' ? CheckCircle2 : AlertCircle;
  const Icon = icon;

  return (
    <div
      className={cn(
        'flex items-center gap-3 px-4 py-3 rounded-lg shadow-lg border backdrop-blur-sm animate-in slide-in-from-top-5 fade-in-0 duration-300',
        type === 'success'
          ? 'bg-background border-primary/20 text-foreground'
          : 'bg-background border-destructive/20 text-foreground'
      )}
    >
      <Icon
        className={cn(
          'w-5 h-5 shrink-0',
          type === 'success' ? 'text-primary' : 'text-destructive'
        )}
      />
      <p className="text-sm font-medium">{message}</p>
      <button
        onClick={onClose}
        className="ml-2 p-1 rounded-sm hover:bg-secondary transition-colors"
        aria-label="Close"
      >
        <X className="w-4 h-4 text-muted-foreground" />
      </button>
    </div>
  );
};

interface ToastContainerProps {
  toasts: Array<{ id: string; message: string; type: ToastType }>;
  onRemove: (id: string) => void;
}

export const ToastContainer: React.FC<ToastContainerProps> = ({ toasts, onRemove }) => {
  // Show only the most recent toast
  const latestToast = toasts[toasts.length - 1];
  
  if (!latestToast) return null;

  return (
    <div className="fixed top-4 left-1/2 -translate-x-1/2 z-50">
      <Toast
        message={latestToast.message}
        type={latestToast.type}
        onClose={() => onRemove(latestToast.id)}
      />
    </div>
  );
};
