import { motion } from 'framer-motion';
import { LucideIcon, TrendingUp, TrendingDown, Minus } from 'lucide-react';
import MiniSparkline from '@/components/charts/MiniSparkline';

interface MetricCardProps {
  title: string;
  value: string | number;
  change?: string;
  trend?: 'up' | 'down' | 'neutral';
  icon: LucideIcon;
  description?: string;
  sparklineData?: number[];
  delay?: number;
}

const MetricCard = ({
  title,
  value,
  change,
  trend = 'neutral',
  icon: Icon,
  description,
  sparklineData,
  delay = 0,
}: MetricCardProps) => {
  const getTrendIcon = () => {
    switch (trend) {
      case 'up':
        return <TrendingUp className="h-3 w-3" />;
      case 'down':
        return <TrendingDown className="h-3 w-3" />;
      default:
        return <Minus className="h-3 w-3" />;
    }
  };

  const getTrendColor = () => {
    switch (trend) {
      case 'up':
        return 'text-primary bg-primary/10';
      case 'down':
        return 'text-destructive bg-destructive/10';
      default:
        return 'text-muted-foreground bg-muted';
    }
  };

  return (
    <motion.div
      className="glass-card p-5"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, delay }}
    >
      <div className="flex items-start justify-between">
        <div className="flex-1">
          <div className="flex items-center gap-2 mb-2">
            <div className="rounded-lg bg-muted p-2">
              <Icon className="h-4 w-4 text-muted-foreground" />
            </div>
            <span className="text-sm font-medium text-muted-foreground">
              {title}
            </span>
          </div>

          <div className="flex items-baseline gap-2">
            <span className="text-2xl font-bold text-foreground">{value}</span>
            {change && (
              <span
                className={`inline-flex items-center gap-1 rounded-full px-2 py-0.5 text-xs font-medium ${getTrendColor()}`}
              >
                {getTrendIcon()}
                {change}
              </span>
            )}
          </div>

          {description && (
            <p className="mt-1 text-xs text-muted-foreground">{description}</p>
          )}
        </div>

        {sparklineData && sparklineData.length > 0 && (
          <div className="ml-4">
            <MiniSparkline
              data={sparklineData}
              color={
                trend === 'up'
                  ? 'hsl(var(--primary))'
                  : trend === 'down'
                  ? 'hsl(var(--destructive))'
                  : 'hsl(var(--muted-foreground))'
              }
            />
          </div>
        )}
      </div>
    </motion.div>
  );
};

export default MetricCard;
