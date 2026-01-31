import { useState } from 'react';
import { motion } from 'framer-motion';
import {
  Brain,
  Loader2,
  Bug,
  TrendingUp,
  Sparkles,
  AlertTriangle,
  CheckCircle,
  ChevronDown,
  ChevronUp,
  Droplets,
  Zap,
  Sprout,
} from 'lucide-react';
import Header from '@/components/layout/Header';
import ThreeBackground from '@/components/ThreeBackground';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { usePredictions } from '@/hooks/usePredictions';
import { useFields } from '@/hooks/useFields';
import { Badge } from '@/components/ui/badge';

const PredictionsScreen = () => {
  const [selectedField, setSelectedField] = useState<string>('');
  const [expandedPrediction, setExpandedPrediction] = useState<string | null>(null);

  const { predictions, isLoading, isGenerating, generatePestRisk, generateYieldPrediction, generateRecommendations } = usePredictions();
  const { fields } = useFields();

  const handlePestRisk = () => {
    if (selectedField) {
      generatePestRisk.mutate(selectedField);
    }
  };

  const handleYieldPrediction = () => {
    if (selectedField) {
      generateYieldPrediction.mutate(selectedField);
    }
  };

  const handleRecommendations = () => {
    if (selectedField) {
      generateRecommendations.mutate(selectedField);
    }
  };

  const getRiskColor = (level: string) => {
    switch (level) {
      case 'critical': return 'bg-destructive text-destructive-foreground';
      case 'high': return 'bg-accent text-accent-foreground';
      case 'medium': return 'bg-secondary text-secondary-foreground';
      default: return 'bg-primary text-primary-foreground';
    }
  };

  return (
    <div className="min-h-screen bg-background relative">
      <ThreeBackground />
      <Header title="AI Predictions" />

      <div className="p-4 md:p-6 space-y-6">
        {/* Prediction Generator */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
        >
          <Card className="glass-card">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Brain className="h-5 w-5 text-primary" />
                AI Prediction Engine
              </CardTitle>
              <CardDescription>
                Generate intelligent predictions powered by machine learning
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <label className="text-sm font-medium text-foreground">Select Field</label>
                <Select value={selectedField} onValueChange={setSelectedField}>
                  <SelectTrigger>
                    <SelectValue placeholder="Choose a field to analyze" />
                  </SelectTrigger>
                  <SelectContent>
                    {fields.map((field) => (
                      <SelectItem key={field.id} value={field.id}>
                        {field.name} - {field.crop_type} ({field.area} acres)
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="grid gap-3 sm:grid-cols-3">
                <Button
                  variant="outline"
                  className="h-auto py-4 flex-col"
                  onClick={handlePestRisk}
                  disabled={!selectedField || isGenerating}
                >
                  {isGenerating ? (
                    <Loader2 className="h-6 w-6 mb-2 animate-spin" />
                  ) : (
                    <Bug className="h-6 w-6 mb-2 text-destructive" />
                  )}
                  <span className="font-medium">Pest Risk Analysis</span>
                  <span className="text-xs text-muted-foreground">Detect potential threats</span>
                </Button>

                <Button
                  variant="outline"
                  className="h-auto py-4 flex-col"
                  onClick={handleYieldPrediction}
                  disabled={!selectedField || isGenerating}
                >
                  {isGenerating ? (
                    <Loader2 className="h-6 w-6 mb-2 animate-spin" />
                  ) : (
                    <TrendingUp className="h-6 w-6 mb-2 text-primary" />
                  )}
                  <span className="font-medium">Yield Prediction</span>
                  <span className="text-xs text-muted-foreground">Forecast harvest output</span>
                </Button>

                <Button
                  variant="outline"
                  className="h-auto py-4 flex-col"
                  onClick={handleRecommendations}
                  disabled={!selectedField || isGenerating}
                >
                  {isGenerating ? (
                    <Loader2 className="h-6 w-6 mb-2 animate-spin" />
                  ) : (
                    <Sparkles className="h-6 w-6 mb-2 text-accent" />
                  )}
                  <span className="font-medium">AI Recommendations</span>
                  <span className="text-xs text-muted-foreground">Get actionable insights</span>
                </Button>
              </div>
            </CardContent>
          </Card>
        </motion.div>

        {/* Latest Pest Risk Result */}
        {generatePestRisk.data && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
          >
            <Card className="glass-card">
              <CardHeader>
                <div className="flex items-center justify-between">
                  <CardTitle className="flex items-center gap-2">
                    <Bug className="h-5 w-5" />
                    Pest Risk Analysis Result
                  </CardTitle>
                  <Badge className={getRiskColor(generatePestRisk.data.riskLevel)}>
                    {generatePestRisk.data.riskLevel.toUpperCase()}
                  </Badge>
                </div>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center gap-4">
                  <div className="text-center">
                    <p className="text-4xl font-bold text-foreground">{generatePestRisk.data.riskScore}%</p>
                    <p className="text-sm text-muted-foreground">Risk Score</p>
                  </div>
                  <div className="flex-1 h-4 rounded-full bg-muted overflow-hidden">
                    <div
                      className={`h-full transition-all ${generatePestRisk.data.riskScore > 70 ? 'bg-destructive' :
                        generatePestRisk.data.riskScore > 40 ? 'bg-accent' : 'bg-primary'
                        }`}
                      style={{ width: `${generatePestRisk.data.riskScore}%` }}
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <h4 className="font-medium text-foreground">Detected Threats</h4>
                  {generatePestRisk.data.pests.map((pest, i) => (
                    <div key={i} className="flex items-center justify-between p-3 rounded-lg bg-muted/50">
                      <div>
                        <p className="font-medium text-foreground">{pest.name}</p>
                        <p className="text-sm text-muted-foreground">{pest.factors.join(', ')}</p>
                      </div>
                      <span className="text-lg font-bold text-foreground">{pest.probability}%</span>
                    </div>
                  ))}
                </div>

                <div className="space-y-2">
                  <h4 className="font-medium text-foreground">Recommendations</h4>
                  <ul className="space-y-1">
                    {generatePestRisk.data.recommendations.map((rec, i) => (
                      <li key={i} className="flex items-start gap-2 text-muted-foreground">
                        <CheckCircle className="h-4 w-4 mt-1 text-primary flex-shrink-0" />
                        {rec}
                      </li>
                    ))}
                  </ul>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        )}

        {/* Latest Yield Prediction Result */}
        {generateYieldPrediction.data && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
          >
            <Card className="glass-card">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <TrendingUp className="h-5 w-5 text-primary" />
                  Yield Prediction Result
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="text-center py-4">
                  <p className="text-5xl font-bold text-primary">
                    {generateYieldPrediction.data.predictedYield.toFixed(2)}
                  </p>
                  <p className="text-lg text-muted-foreground">{generateYieldPrediction.data.unit}</p>
                  <p className="text-sm text-muted-foreground mt-2">
                    Confidence: {generateYieldPrediction.data.confidence}%
                  </p>
                </div>

                <div className="space-y-2">
                  <h4 className="font-medium text-foreground">Contributing Factors</h4>
                  {generateYieldPrediction.data.factors.map((factor, i) => (
                    <div key={i} className="flex items-center justify-between p-3 rounded-lg bg-muted/50">
                      <span className="text-foreground">{factor.name}</span>
                      <div className="flex items-center gap-2">
                        <span className="text-sm text-muted-foreground">{factor.value}</span>
                        <Badge variant={
                          factor.impact === 'positive' ? 'default' :
                            factor.impact === 'negative' ? 'destructive' : 'secondary'
                        }>
                          {factor.impact}
                        </Badge>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </motion.div>
        )}

        {/* Latest AI Recommendations Result */}
        {generateRecommendations.data && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
          >
            <Card className="glass-card border-accent/50 bg-accent/5">
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-accent">
                  <Sparkles className="h-5 w-5" />
                  AI Agent Recommendations
                </CardTitle>
                <CardDescription>
                  Strategic insights for optimal field management
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid gap-4 md:grid-cols-3">
                  {generateRecommendations.data.map((rec: any) => (
                    <div
                      key={rec.id}
                      className={`p-4 rounded-xl border transition-all hover:scale-[1.02] ${rec.priority === 'critical' ? 'bg-destructive/10 border-destructive/20 text-destructive-foreground' :
                          rec.priority === 'high' ? 'bg-accent/10 border-accent/20 text-accent-foreground' :
                            'bg-primary/10 border-primary/20 text-primary-foreground'
                        }`}
                    >
                      <div className="flex items-center gap-2 mb-2">
                        {rec.type === 'irrigation' && <Droplets className="h-4 w-4" />}
                        {rec.type === 'nutrient' && <Zap className="h-4 w-4" />}
                        {rec.type === 'harvest' && <Sprout className="h-4 w-4" />}
                        <span className="text-xs font-bold uppercase tracking-wider">{rec.priority} PRIORITY</span>
                      </div>
                      <h4 className="font-bold mb-1 text-foreground">{rec.title}</h4>
                      <p className="text-sm text-muted-foreground leading-relaxed">
                        {rec.description}
                      </p>
                    </div>
                  ))}
                </div>

                <div className="rounded-lg bg-muted/50 p-4 border border-dashed border-border mt-4">
                  <p className="text-xs text-muted-foreground flex items-center gap-2 italic">
                    <Sparkles className="h-3 w-3" />
                    Our AI Agent continuously monitors multispectral satellite data and local sensor arrays to provide these real-time agricultural optimizations.
                  </p>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        )}

        {/* Prediction History */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
        >
          <Card className="glass-card">
            <CardHeader>
              <CardTitle>Prediction History</CardTitle>
            </CardHeader>
            <CardContent>
              {isLoading ? (
                <div className="flex items-center justify-center py-8">
                  <Loader2 className="h-8 w-8 animate-spin text-primary" />
                </div>
              ) : predictions.length === 0 ? (
                <div className="text-center py-8">
                  <Brain className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
                  <p className="text-muted-foreground">No predictions yet. Select a field and run an analysis.</p>
                </div>
              ) : (
                <div className="space-y-3">
                  {predictions.slice(0, 10).map((prediction: any) => (
                    <div
                      key={prediction.id}
                      className="border border-border rounded-lg overflow-hidden"
                    >
                      <button
                        className="w-full flex items-center justify-between p-4 hover:bg-muted/50 transition-colors"
                        onClick={() => setExpandedPrediction(
                          expandedPrediction === prediction.id ? null : prediction.id
                        )}
                      >
                        <div className="flex items-center gap-3">
                          {prediction.model_type === 'pest_risk' && <Bug className="h-5 w-5 text-destructive" />}
                          {prediction.model_type === 'yield_prediction' && <TrendingUp className="h-5 w-5 text-primary" />}
                          {prediction.model_type === 'recommendations' && <Sparkles className="h-5 w-5 text-accent" />}
                          <div className="text-left">
                            <p className="font-medium text-foreground capitalize">
                              {prediction.model_type.replace('_', ' ')}
                            </p>
                            <p className="text-sm text-muted-foreground">
                              {prediction.fields?.name || 'Unknown Field'} • {new Date(prediction.created_at).toLocaleString()}
                            </p>
                          </div>
                        </div>
                        <div className="flex items-center gap-2">
                          {prediction.confidence && (
                            <Badge variant="outline">{prediction.confidence}% confidence</Badge>
                          )}
                          {expandedPrediction === prediction.id ? (
                            <ChevronUp className="h-4 w-4" />
                          ) : (
                            <ChevronDown className="h-4 w-4" />
                          )}
                        </div>
                      </button>

                      {expandedPrediction === prediction.id && (
                        <div className="px-4 pb-4 border-t border-border bg-muted/30">
                          <pre className="text-xs text-muted-foreground overflow-x-auto mt-3">
                            {JSON.stringify(prediction.prediction, null, 2)}
                          </pre>
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        </motion.div>
      </div>
    </div>
  );
};

export default PredictionsScreen;
