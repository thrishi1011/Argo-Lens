import { motion } from 'framer-motion';
import { Leaf, TrendingUp, TrendingDown } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

interface CropHealthCardProps {
    score: number; // 0-100
    trend?: number; // percentage change
}

const CropHealthCard = ({ score, trend }: CropHealthCardProps) => {
    const getColor = (s: number) => {
        if (s >= 80) return 'text-green-500';
        if (s >= 60) return 'text-lime-500';
        if (s >= 40) return 'text-yellow-500';
        return 'text-red-500';
    };

    const getLabel = (s: number) => {
        if (s >= 80) return 'Excellent';
        if (s >= 60) return 'Good';
        if (s >= 40) return 'Fair';
        return 'Critical';
    };

    const colorClass = getColor(score);

    return (
        <Card className="glass-card hover:shadow-lg transition-shadow">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Crop Health Score</CardTitle>
                <Leaf className={`h-4 w-4 ${colorClass}`} />
            </CardHeader>
            <CardContent>
                <div className="flex items-center justify-between">
                    <div className="text-2xl font-bold flex items-end gap-2">
                        <span className={colorClass}>{score}</span>
                        <span className="text-sm font-normal text-muted-foreground pb-1">/ 100</span>
                    </div>
                    {trend !== undefined && (
                        <div className={`flex items-center text-xs ${trend >= 0 ? 'text-green-500' : 'text-red-500'}`}>
                            {trend >= 0 ? <TrendingUp className="h-3 w-3 mr-1" /> : <TrendingDown className="h-3 w-3 mr-1" />}
                            {Math.abs(trend)}%
                        </div>
                    )}
                </div>
                <div className="mt-3">
                    <div className="h-2 w-full bg-secondary/30 rounded-full overflow-hidden">
                        <motion.div
                            className={`h-full ${score >= 80 ? 'bg-green-500' : score >= 60 ? 'bg-lime-500' : score >= 40 ? 'bg-yellow-500' : 'bg-red-500'}`}
                            initial={{ width: 0 }}
                            animate={{ width: `${score}%` }}
                            transition={{ duration: 1, ease: "easeOut" }}
                        />
                    </div>
                    <p className="text-xs text-muted-foreground mt-2">
                        Status: <span className={`font-medium ${colorClass}`}>{getLabel(score)}</span>
                    </p>
                </div>
            </CardContent>
        </Card>
    );
};

export default CropHealthCard;
