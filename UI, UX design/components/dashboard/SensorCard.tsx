import { motion } from 'framer-motion';
import { LucideIcon } from 'lucide-react';

interface SensorCardProps {
  title: string;
  value: number;
  unit: string;
  min: number;
  max: number;
  optimal: { min: number; max: number };
  icon: LucideIcon;
  delay?: number;
}


const SensorCard = ({
  title,
  value,
  unit,
  min,
  max,
  optimal,
  icon: Icon,
  delay = 0,
}: SensorCardProps) => {
  const percentage = ((value - min) / (max - min)) * 100;
  const isOptimal = value >= optimal.min && value <= optimal.max;
  const optimalStart = ((optimal.min - min) / (max - min)) * 100;
  const optimalWidth = ((optimal.max - optimal.min) / (max - min)) * 100;

  return (
    <motion.div
      className="glass-card p-5 cursor-pointer"
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.4, delay }}
      whileHover={{ y: -5 }}
    >
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-3">
          <div className="rounded-lg bg-muted p-2">
            <Icon className="h-4 w-4 text-muted-foreground" />
          </div>
          <span className="text-sm font-medium text-muted-foreground">
            {title}
          </span>
        </div>
        <div
          className={`rounded-full px-2 py-0.5 text-xs font-medium ${isOptimal
            ? 'bg-primary/20 text-primary'
            : 'bg-accent/20 text-accent'
            }`}
        >
          {isOptimal ? 'Optimal' : 'Warning'}
        </div>
      </div>

      <div className="mb-4">
        <span className="text-2xl font-bold text-foreground">{value}</span>
        <span className="ml-1 text-sm text-muted-foreground">{unit}</span>
      </div>

      {/* Progress bar */}
      <div className="relative h-2 rounded-full bg-muted overflow-hidden">
        {/* Optimal range indicator */}
        <div
          className="absolute h-full bg-primary/30"
          style={{
            left: `${optimalStart}%`,
            width: `${optimalWidth}%`,
          }}
        />
        {/* Current value */}
        <motion.div
          className={`absolute h-full rounded-full ${isOptimal ? 'bg-primary' : 'bg-accent'
            }`}
          initial={{ width: 0 }}
          animate={{ width: `${percentage}%` }}
          transition={{ duration: 1, delay: delay + 0.3 }}
        />
      </div>

      <div className="mt-2 flex justify-between text-xs text-muted-foreground">
        <span>{min}{unit}</span>
        <span>{max}{unit}</span>
      </div>
    </motion.div>
  );
};

export default SensorCard;
