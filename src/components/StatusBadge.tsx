interface StatusBadgeProps {
  status: 'available' | 'busy' | 'off' | 'sleeping';
  label: string;
}

const StatusBadge: React.FC<StatusBadgeProps> = ({ status, label }) => {
  const statusStyles = {
    available: 'bg-status-available',
    busy: 'bg-status-busy',
    off: 'bg-status-off',
    sleeping: 'bg-status-busy',
  };

  return (
    <div className="flex items-center gap-2">
      <span 
        className={`w-2.5 h-2.5 rounded-full ${statusStyles[status]} animate-pulse-soft`}
        aria-hidden="true"
      />
      <span className="text-lg font-medium text-foreground">
        {label}
      </span>
    </div>
  );
};

export default StatusBadge;
  