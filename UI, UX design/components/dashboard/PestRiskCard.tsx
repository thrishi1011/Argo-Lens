import { Bug, AlertTriangle, ShieldCheck } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

interface PestRiskCardProps {
    riskLevel: 'Low' | 'Medium' | 'High' | 'Critical';
    pestType?: string;
}

const PestRiskCard = ({ riskLevel, pestType = 'None' }: PestRiskCardProps) => {
    const getConfig = (level: string) => {
        switch (level) {
            case 'Critical': return { color: 'text-red-600', bg: 'bg-red-100 dark:bg-red-900/30', label: 'Critical Risk', icon: AlertTriangle };
            case 'High': return { color: 'text-orange-500', bg: 'bg-orange-100 dark:bg-orange-900/30', label: 'High Risk', icon: AlertTriangle };
            case 'Medium': return { color: 'text-yellow-500', bg: 'bg-yellow-100 dark:bg-yellow-900/30', label: 'Medium Risk', icon: Bug };
            default: return { color: 'text-green-500', bg: 'bg-green-100 dark:bg-green-900/30', label: 'Low Risk', icon: ShieldCheck };
        }
    };

    const config = getConfig(riskLevel);
    const Icon = config.icon;

    return (
        <Card className={`glass-card hover:shadow-lg transition-shadow border-l-4 ${riskLevel === 'Critical' ? 'border-l-red-600' :
                riskLevel === 'High' ? 'border-l-orange-500' :
                    riskLevel === 'Medium' ? 'border-l-yellow-500' : 'border-l-green-500'
            }`}>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Pest & Disease Risk</CardTitle>
                <Icon className={`h-4 w-4 ${config.color}`} />
            </CardHeader>
            <CardContent>
                <div className="flex items-center gap-3">
                    <div className={`p-2 rounded-full ${config.bg}`}>
                        <Bug className={`h-6 w-6 ${config.color}`} />
                    </div>
                    <div>
                        <div className={`text-lg font-bold ${config.color}`}>{riskLevel}</div>
                        {riskLevel !== 'Low' && (
                            <p className="text-xs text-muted-foreground">Potential: {pestType}</p>
                        )}
                        {riskLevel === 'Low' && (
                            <p className="text-xs text-muted-foreground">No active threats detected</p>
                        )}
                    </div>
                </div>
            </CardContent>
        </Card>
    );
};

export default PestRiskCard;
