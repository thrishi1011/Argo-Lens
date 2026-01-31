import { useState, useEffect } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
    Activity,
    Droplets,
    Sun,
    Wind,
    Sprout,
    AlertTriangle,
    FileText,
    TrendingUp,
    Calendar,
    Thermometer,
    Zap,
    Scale,
    Loader2
} from "lucide-react";
import LineChart from "@/components/charts/LineChart";
import { AnalysisBackend, FieldAnalysisResult } from "@/lib/AnalysisBackend";
import { useSensorData } from "@/hooks/useSensorData";
import { useToast } from "@/hooks/use-toast";

interface DetailedAnalysisProps {
    isOpen: boolean;
    onClose: () => void;
    fieldName: string;
    fieldId: string;
    cropType: string;
    healthScore: number;
    ndvi: number;
    area: number;
    nitrogen: number;
    phosphorus: number;
    potassium: number;
    growthStage: string;
    plantingDate: Date;
}

export const FieldAnalysisModal = ({
    isOpen,
    onClose,
    fieldName,
    area,
    cropType,
    healthScore,
    ndvi,
    nitrogen,
    phosphorus,
    potassium,
    growthStage,
    plantingDate
}: DetailedAnalysisProps) => {
    const { sensorData } = useSensorData();
    const { toast } = useToast();
    const [loading, setLoading] = useState(true);
    const [analysis, setAnalysis] = useState<FieldAnalysisResult | null>(null);

    useEffect(() => {
        if (isOpen) {
            setLoading(true);
            const fetchData = async () => {
                const fieldData = {
                    name: fieldName,
                    cropType,
                    growthStage,
                    plantingDate,
                    health: { healthScore, nitrogen, phosphorus, potassium }
                };
                const result = await AnalysisBackend.getFieldAnalysis(fieldData, sensorData);
                setAnalysis(result);
                setLoading(false);
            };
            fetchData();
        }
    }, [isOpen, fieldName, sensorData]);

    // Mock historical data for charts
    const historyData = Array.from({ length: 14 }, (_, i) => ({
        date: `Day -${14 - i}`,
        value: ndvi + (Math.random() * 0.1 - 0.05)
    }));

    return (
        <Dialog open={isOpen} onOpenChange={onClose}>
            <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto glass-card border-primary/20 z-[1500]">
                {loading ? (
                    <div className="flex flex-col items-center justify-center py-20 space-y-4">
                        <Loader2 className="h-12 w-12 text-primary animate-spin" />
                        <p className="text-lg font-bold animate-pulse">Running AI Diagnostics...</p>
                        <p className="text-sm text-muted-foreground italic">Processing satellite and sensor data for {fieldName}</p>
                    </div>
                ) : (
                    <>
                        <DialogHeader>
                            <div className="flex items-center justify-between">
                                <div className="flex items-center gap-3">
                                    <div className="p-2 bg-primary/10 rounded-lg">
                                        <Sprout className="h-6 w-6 text-primary" />
                                    </div>
                                    <div>
                                        <DialogTitle className="text-2xl font-bold">{fieldName} Detailed Analysis</DialogTitle>
                                        <DialogDescription className="flex items-center gap-2 mt-1">
                                            <Badge variant="outline" className="border-primary/30 text-primary font-bold">{cropType}</Badge>
                                            <span className="text-xs font-medium">• {area} Acres • Planted {plantingDate.toLocaleDateString()}</span>
                                        </DialogDescription>
                                    </div>
                                </div>
                                <div className="text-right">
                                    <div className="text-3xl font-extrabold text-primary">{healthScore}%</div>
                                    <div className="text-[10px] uppercase tracking-wider text-muted-foreground font-semibold">Health Score</div>
                                </div>
                            </div>
                        </DialogHeader>

                        <Tabs defaultValue="overview" className="mt-6">
                            <TabsList className="grid w-full grid-cols-4 bg-muted/30 p-1">
                                <TabsTrigger value="overview" className="data-[state=active]:bg-background font-bold">Crop Status</TabsTrigger>
                                <TabsTrigger value="soil" className="data-[state=active]:bg-background font-bold">Soil Nutrition</TabsTrigger>
                                <TabsTrigger value="projections" className="data-[state=active]:bg-background font-bold">Projections</TabsTrigger>
                                <TabsTrigger value="ai" className="data-[state=active]:bg-background font-bold">AI Intel</TabsTrigger>
                            </TabsList>

                            {/* OVERVIEW TAB */}
                            <TabsContent value="overview" className="space-y-6 mt-4">
                                <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                                    <div className="p-4 rounded-xl bg-card border border-border/50 shadow-sm transition-all hover:border-primary/50">
                                        <span className="text-[10px] uppercase text-muted-foreground font-bold">NDVI</span>
                                        <div className="text-2xl font-bold mt-1 text-primary">{ndvi.toFixed(3)}</div>
                                        <div className="h-1 w-full bg-muted mt-2 rounded-full overflow-hidden">
                                            <div className="h-full bg-primary" style={{ width: `${ndvi * 100}%` }} />
                                        </div>
                                    </div>
                                    <div className="p-4 rounded-xl bg-card border border-border/50 shadow-sm transition-all hover:border-primary/50">
                                        <span className="text-[10px] uppercase text-muted-foreground font-bold">Stage</span>
                                        <div className="text-xl font-bold mt-1">{growthStage}</div>
                                        <p className="text-[10px] text-muted-foreground mt-1 font-medium italic">Cycle progress: 65%</p>
                                    </div>
                                    <div className="p-4 rounded-xl bg-card border border-border/50 shadow-sm transition-all hover:border-primary/50">
                                        <span className="text-[10px] uppercase text-muted-foreground font-bold">Growth</span>
                                        <div className="text-2xl font-bold mt-1 text-green-500">+2.4%</div>
                                        <p className="text-[10px] text-muted-foreground mt-1">Weekly increase</p>
                                    </div>
                                    <div className="p-4 rounded-xl bg-card border border-border/50 shadow-sm transition-all hover:border-primary/50">
                                        <span className="text-[10px] uppercase text-muted-foreground font-bold">Pest Risk</span>
                                        <div className={`text-xl font-bold mt-1 ${(analysis?.pestRisks?.length || 0) > 0 ? 'text-orange-500' : 'text-green-500'}`}>
                                            {(analysis?.pestRisks?.length || 0) > 0 ? analysis?.pestRisks[0].riskLevel : 'Minimal'}
                                        </div>
                                        <p className="text-[10px] text-muted-foreground mt-1">Based on climate</p>
                                    </div>
                                </div>

                                <div className="p-4 rounded-xl bg-card/50 border border-border/50">
                                    <h3 className="text-sm font-semibold mb-4 flex items-center gap-2">
                                        <TrendingUp className="h-4 w-4 text-primary" /> Vegetation Index Trend
                                    </h3>
                                    <LineChart data={historyData} height={200} />
                                </div>
                            </TabsContent>

                            {/* SOIL TAB */}
                            <TabsContent value="soil" className="space-y-6 mt-4">
                                <div className="grid grid-cols-3 gap-4">
                                    <div className="p-4 rounded-xl bg-card border border-border/50 shadow-md relative overflow-hidden group">
                                        <div className="absolute top-0 right-0 p-2 opacity-10 group-hover:opacity-20 transition-opacity"><Zap className="h-8 w-8 text-orange-500" /></div>
                                        <span className="text-xs font-bold text-orange-500">Nitrogen (N)</span>
                                        <div className="text-3xl font-black mt-1">{nitrogen} <span className="text-xs font-normal text-muted-foreground">ppm</span></div>
                                        <p className="text-[10px] text-muted-foreground mt-2">Optimal range: 120-200</p>
                                    </div>
                                    <div className="p-4 rounded-xl bg-card border border-border/50 shadow-md relative overflow-hidden group">
                                        <div className="absolute top-0 right-0 p-2 opacity-10 group-hover:opacity-20 transition-opacity"><Zap className="h-8 w-8 text-blue-500" /></div>
                                        <span className="text-xs font-bold text-blue-500">Phosphorus (P)</span>
                                        <div className="text-3xl font-black mt-1">{phosphorus} <span className="text-xs font-normal text-muted-foreground">ppm</span></div>
                                        <p className="text-[10px] text-muted-foreground mt-2">Optimal range: 30-60</p>
                                    </div>
                                    <div className="p-4 rounded-xl bg-card border border-border/50 shadow-md relative overflow-hidden group">
                                        <div className="absolute top-0 right-0 p-2 opacity-10 group-hover:opacity-20 transition-opacity"><Zap className="h-8 w-8 text-purple-500" /></div>
                                        <span className="text-xs font-bold text-purple-500">Potassium (K)</span>
                                        <div className="text-3xl font-black mt-1">{potassium} <span className="text-xs font-normal text-muted-foreground">ppm</span></div>
                                        <p className="text-[10px] text-muted-foreground mt-2">Optimal range: 150-250</p>
                                    </div>
                                </div>

                                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                                    <div className="p-3 rounded-lg bg-blue-500/5 border border-blue-500/20">
                                        <div className="flex items-center gap-2 text-blue-600 text-xs font-bold mb-1">
                                            <Droplets className="h-3 w-3" /> MOISTURE
                                        </div>
                                        <div className="text-xl font-bold">{Math.round(sensorData.soilMoisture)}%</div>
                                    </div>
                                    <div className="p-3 rounded-lg bg-orange-500/5 border border-orange-500/20">
                                        <div className="flex items-center gap-2 text-orange-600 text-xs font-bold mb-1">
                                            <Thermometer className="h-3 w-3" /> TEMPERATURE
                                        </div>
                                        <div className="text-xl font-bold">{Math.round(sensorData.temperature)}°C</div>
                                    </div>
                                    <div className="p-3 rounded-lg bg-emerald-500/5 border border-emerald-500/20">
                                        <div className="flex items-center gap-2 text-emerald-600 text-xs font-bold mb-1">
                                            <Activity className="h-3 w-3" /> PH LEVEL
                                        </div>
                                        <div className="text-xl font-bold">{sensorData.phLevel.toFixed(1)}</div>
                                    </div>
                                    <div className="p-3 rounded-lg bg-cyan-500/5 border border-cyan-500/20">
                                        <div className="flex items-center gap-2 text-cyan-600 text-xs font-bold mb-1">
                                            <Wind className="h-3 w-3" /> HUMIDITY
                                        </div>
                                        <div className="text-xl font-bold">{Math.round(sensorData.humidity)}%</div>
                                    </div>
                                </div>
                            </TabsContent>

                            {/* PROJECTIONS TAB */}
                            <TabsContent value="projections" className="space-y-6 mt-4">
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                    <div className="p-5 rounded-xl bg-card border border-border/50 shadow-sm">
                                        <div className="flex items-center justify-between mb-4">
                                            <h4 className="text-sm font-bold flex items-center gap-2">
                                                <Scale className="h-4 w-4 text-primary" /> Yield Prediction
                                            </h4>
                                            <Badge variant="outline" className="text-[10px] border-emerald-500/20 text-emerald-500">
                                                AI CONFIDENCE: {analysis?.yieldEstimate.confidence}%
                                            </Badge>
                                        </div>
                                        <div className="flex items-baseline gap-2">
                                            <span className="text-4xl font-black text-primary">{analysis?.yieldEstimate.estimate}</span>
                                            <span className="text-sm text-muted-foreground font-bold">t/ha</span>
                                        </div>
                                        <div className="mt-4 space-y-2">
                                            <p className="text-xs font-bold text-muted-foreground uppercase tracking-widest">Contributing Factors</p>
                                            <ul className="space-y-1">
                                                {analysis?.yieldEstimate.factors.map((f, i) => (
                                                    <li key={i} className="text-xs flex items-center gap-2 text-foreground/80">
                                                        <div className="h-1 w-1 bg-primary rounded-full" /> {f}
                                                    </li>
                                                ))}
                                            </ul>
                                        </div>
                                    </div>

                                    <div className="p-5 rounded-xl bg-card border border-border/50 shadow-sm">
                                        <div className="flex items-center justify-between mb-4">
                                            <h4 className="text-sm font-bold flex items-center gap-2">
                                                <Droplets className="h-4 w-4 text-blue-500" /> Water Balance
                                            </h4>
                                            <Badge className={`text-[10px] ${analysis?.waterBalance.status === 'Deficit' ? 'bg-red-500' :
                                                analysis?.waterBalance.status === 'Surplus' ? 'bg-blue-500' : 'bg-emerald-500'
                                                }`}>
                                                {analysis?.waterBalance.status.toUpperCase()}
                                            </Badge>
                                        </div>
                                        <div className="flex items-baseline gap-2">
                                            <span className={`text-4xl font-black ${analysis?.waterBalance.balance < 0 ? 'text-red-500' : 'text-blue-500'}`}>
                                                {analysis?.waterBalance.balance > 0 ? '+' : ''}{analysis?.waterBalance.balance}
                                            </span>
                                            <span className="text-sm text-muted-foreground font-bold">mm/day</span>
                                        </div>
                                        <div className="mt-4 p-3 rounded-lg bg-muted/30 border border-border/50">
                                            <p className="text-xs font-bold text-muted-foreground uppercase tracking-widest mb-1">Recommendation</p>
                                            <p className="text-xs font-medium">{analysis?.waterBalance.recommendations}</p>
                                        </div>
                                    </div>
                                </div>
                            </TabsContent>

                            {/* AI TAB */}
                            <TabsContent value="ai" className="space-y-4 mt-4">
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                    <div className="space-y-4">
                                        <h4 className="text-xs font-bold uppercase tracking-widest text-muted-foreground px-1 font-black">Actionable Insights</h4>
                                        {(analysis?.recommendations?.length || 0) > 0 ? analysis?.recommendations?.map((rec: any) => (
                                            <div key={rec.id} className={`p-4 rounded-xl border-l-4 shadow-sm bg-card transition-all hover:translate-x-1 ${rec.priority === 'Critical' ? 'border-l-red-500' :
                                                rec.priority === 'High' ? 'border-l-orange-500' : 'border-l-blue-500'
                                                }`}>
                                                <div className="flex justify-between items-start mb-1">
                                                    <h5 className="font-bold text-sm">{rec.title}</h5>
                                                    <Badge variant={rec.priority === 'Critical' ? 'destructive' : 'secondary'} className="text-[8px] h-4">
                                                        {rec.priority}
                                                    </Badge>
                                                </div>
                                                <p className="text-xs text-muted-foreground mb-2">{rec.description}</p>
                                                <div className="text-[10px] font-bold text-primary bg-primary/5 p-2 rounded flex items-center gap-2">
                                                    <Activity className="h-3 w-3" /> {rec.actionItem}
                                                </div>
                                            </div>
                                        )) : (
                                            <div className="p-8 text-center bg-muted/20 rounded-xl border border-dashed border-border">
                                                <p className="text-sm text-muted-foreground font-medium">No urgent actions required. Conditions are optimal.</p>
                                            </div>
                                        )}
                                    </div>

                                    <div className="space-y-4">
                                        <h4 className="text-xs font-bold uppercase tracking-widest text-muted-foreground px-1 font-black">Pest Prediction</h4>
                                        {(analysis?.pestRisks?.length || 0) > 0 ? analysis?.pestRisks?.map((risk: any, idx: number) => (
                                            <div key={idx} className="p-4 rounded-xl bg-card border border-border shadow-sm transition-all hover:bg-muted/10">
                                                <div className="flex items-center gap-3 mb-2">
                                                    <div className="p-2 bg-red-100 text-red-600 rounded-lg"><AlertTriangle className="h-4 w-4" /></div>
                                                    <div>
                                                        <h5 className="font-bold text-sm">{risk.pestType}</h5>
                                                        <div className="flex items-center gap-2 mt-0.5">
                                                            <div className="w-24 h-1.5 bg-muted rounded-full overflow-hidden">
                                                                <div className="h-full bg-red-500" style={{ width: `${risk.probability}%` }} />
                                                            </div>
                                                            <span className="text-[10px] font-bold">{risk.probability}% Risk</span>
                                                        </div>
                                                    </div>
                                                </div>
                                                <div className="mt-2 flex flex-wrap gap-1">
                                                    {risk.factors.map((f: string, i: number) => <Badge key={i} variant="outline" className="text-[8px] py-0">{f}</Badge>)}
                                                </div>
                                            </div>
                                        )) : (
                                            <div className="p-8 text-center bg-muted/20 rounded-xl border border-dashed border-border">
                                                <p className="text-sm text-muted-foreground font-medium">No significant pest risks detected for current conditions.</p>
                                            </div>
                                        )}

                                        <div className="p-4 rounded-xl bg-primary/5 border border-primary/20 relative overflow-hidden">
                                            <div className="absolute -right-4 -bottom-4 opacity-5"><FileText className="h-24 w-24" /></div>
                                            <h5 className="font-bold text-sm flex items-center gap-2 text-primary mb-2">
                                                <Activity className="h-3 w-3" /> AI Summary
                                            </h5>
                                            <p className="text-xs text-muted-foreground leading-relaxed relative z-10 font-medium">
                                                {analysis?.detailedSummary}
                                            </p>
                                        </div>
                                    </div>
                                </div>
                            </TabsContent>
                        </Tabs>

                        <div className="flex justify-end gap-3 mt-8 pt-4 border-t border-border/50">
                            <Button variant="ghost" className="text-xs font-black tracking-widest" onClick={onClose}>DISMISS</Button>
                            <Button
                                className="bg-primary text-primary-foreground font-black tracking-widest shadow-lg shadow-primary/20 hover:scale-[1.02] transition-transform"
                                onClick={() => {
                                    toast({
                                        title: "Generating Comprehensive Report",
                                        description: `Preparing high-resolution spectral maps and AI diagnostics for ${fieldName}. Your report will be ready shortly.`,
                                    });
                                }}
                            >
                                GENERATE FULL PDF REPORT
                            </Button>
                        </div>
                    </>
                )}
            </DialogContent>
        </Dialog>
    );
};
