import { motion } from 'framer-motion';
import { Bug, Droplets, Thermometer } from 'lucide-react';

interface PestRisk {
  type: string;
  risk: number;
  factors: string[];
}

interface PestRiskChartProps {
  risks: PestRisk[];
}

const getRiskColor = (risk: number) => {
  if (risk < 30) return 'bg-primary';
  if (risk < 60) return 'bg-accent';
  return 'bg-destructive';
};

const getRiskLabel = (risk: number) => {
  if (risk < 30) return 'Low';
  if (risk < 60) return 'Moderate';
  return 'High';
};

const PestRiskChart = ({ risks }: PestRiskChartProps) => {
  return (
    <motion.div
      className="glass-card p-6"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: 0.2 }}
    >
      <div className="mb-6 flex items-center justify-between">
        <h3 className="text-lg font-semibold text-foreground">
          AI Pest Risk Analysis
        </h3>
        <Bug className="h-5 w-5 text-muted-foreground" />
      </div>

      <div className="space-y-5">
        {risks.map((risk, index) => (
          <motion.div
            key={risk.type}
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.4, delay: 0.3 + index * 0.1 }}
          >
            <div className="mb-2 flex items-center justify-between">
              <span className="font-medium text-foreground">{risk.type}</span>
              <span
                className={`rounded-full px-2 py-0.5 text-xs font-medium ${
                  risk.risk < 30
                    ? 'bg-primary/20 text-primary'
                    : risk.risk < 60
                    ? 'bg-accent/20 text-accent'
                    : 'bg-destructive/20 text-destructive'
                }`}
              >
                {getRiskLabel(risk.risk)} ({risk.risk}%)
              </span>
            </div>

            <div className="relative h-2 overflow-hidden rounded-full bg-muted">
              <motion.div
                className={`h-full rounded-full ${getRiskColor(risk.risk)}`}
                initial={{ width: 0 }}
                animate={{ width: `${risk.risk}%` }}
                transition={{ duration: 1, delay: 0.5 + index * 0.1 }}
              />
            </div>

            <div className="mt-2 flex flex-wrap gap-2">
              {risk.factors.map((factor) => (
                <span
                  key={factor}
                  className="flex items-center gap-1 rounded-md bg-muted px-2 py-1 text-xs text-muted-foreground"
                >
                  {factor.includes('Humidity') && (
                    <Droplets className="h-3 w-3" />
                  )}
                  {factor.includes('Temp') && (
                    <Thermometer className="h-3 w-3" />
                  )}
                  {factor}
                </span>
              ))}
            </div>
          </motion.div>
        ))}
      </div>
    </motion.div>
  );
};

export default PestRiskChart;
