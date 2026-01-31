import { motion } from 'framer-motion';

interface CropHealthGaugeProps {
  ndvi: number;
  evi: number;
  healthScore: number;
}

const CropHealthGauge = ({ ndvi, evi, healthScore }: CropHealthGaugeProps) => {
  const circumference = 2 * Math.PI * 80;
  const strokeDashoffset = circumference - (healthScore / 100) * circumference;

  const getHealthColor = (score: number) => {
    if (score >= 80) return 'stroke-primary';
    if (score >= 60) return 'stroke-secondary';
    if (score >= 40) return 'stroke-accent';
    return 'stroke-destructive';
  };

  const getHealthLabel = (score: number) => {
    if (score >= 80) return 'Excellent';
    if (score >= 60) return 'Good';
    if (score >= 40) return 'Fair';
    return 'Poor';
  };

  return (
    <motion.div
      className="glass-card p-6"
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.6 }}
    >
      <h3 className="mb-6 text-lg font-semibold text-foreground">
        Crop Health Overview
      </h3>

      <div className="flex flex-col items-center">
        {/* Circular gauge */}
        <div className="relative">
          <svg className="h-48 w-48 -rotate-90 transform">
            {/* Background circle */}
            <circle
              cx="96"
              cy="96"
              r="80"
              fill="none"
              stroke="hsl(var(--muted))"
              strokeWidth="12"
            />
            {/* Progress circle */}
            <motion.circle
              cx="96"
              cy="96"
              r="80"
              fill="none"
              className={getHealthColor(healthScore)}
              strokeWidth="12"
              strokeLinecap="round"
              strokeDasharray={circumference}
              initial={{ strokeDashoffset: circumference }}
              animate={{ strokeDashoffset }}
              transition={{ duration: 1.5, ease: 'easeOut' }}
            />
          </svg>

          {/* Center content */}
          <div className="absolute inset-0 flex flex-col items-center justify-center">
            <motion.span
              className="text-4xl font-bold text-foreground"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.5 }}
            >
              {healthScore}%
            </motion.span>
            <span className="text-sm text-muted-foreground">
              {getHealthLabel(healthScore)}
            </span>
          </div>
        </div>

        {/* Metrics */}
        <div className="mt-6 grid w-full grid-cols-2 gap-4">
          <div className="rounded-lg bg-muted/50 p-3 text-center">
            <p className="text-xs text-muted-foreground">NDVI</p>
            <p className="text-lg font-semibold text-primary">
              {ndvi.toFixed(2)}
            </p>
          </div>
          <div className="rounded-lg bg-muted/50 p-3 text-center">
            <p className="text-xs text-muted-foreground">EVI</p>
            <p className="text-lg font-semibold text-secondary">
              {evi.toFixed(2)}
            </p>
          </div>
        </div>
      </div>
    </motion.div>
  );
};

export default CropHealthGauge;
