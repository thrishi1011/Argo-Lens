import { motion } from 'framer-motion';
import { AlertTriangle, CheckCircle, Info, XCircle } from 'lucide-react';

type AlertSeverity = 'info' | 'warning' | 'critical' | 'success';

interface AlertCardProps {
  title: string;
  message: string;
  severity: AlertSeverity;
  timestamp: string;
  delay?: number;
}

const severityConfig = {
  info: {
    icon: Info,
    bg: 'bg-secondary/10',
    border: 'border-secondary/30',
    text: 'text-secondary',
  },
  warning: {
    icon: AlertTriangle,
    bg: 'bg-accent/10',
    border: 'border-accent/30',
    text: 'text-accent',
  },
  critical: {
    icon: XCircle,
    bg: 'bg-destructive/10',
    border: 'border-destructive/30',
    text: 'text-destructive',
  },
  success: {
    icon: CheckCircle,
    bg: 'bg-primary/10',
    border: 'border-primary/30',
    text: 'text-primary',
  },
};


const AlertCard = ({
  title,
  message,
  severity,
  timestamp,
  delay = 0,
}: AlertCardProps) => {
  const config = severityConfig[severity];
  const Icon = config.icon;

  return (
    <motion.div
      className={`rounded-xl border p-4 cursor-pointer ${config.bg} ${config.border}`}
      initial={{ opacity: 0, x: -20 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ duration: 0.4, delay }}
      whileHover={{ y: -5 }}
    >
      <div className="flex gap-3">
        <div className={`mt-0.5 ${config.text}`}>
          <Icon className="h-5 w-5" />
        </div>
        <div className="flex-1">
          <h4 className="font-semibold text-foreground">{title}</h4>
          <p className="mt-1 text-sm text-muted-foreground">{message}</p>
          <p className="mt-2 text-xs text-muted-foreground/70">{timestamp}</p>
        </div>
      </div>
    </motion.div>
  );
};

export default AlertCard;
