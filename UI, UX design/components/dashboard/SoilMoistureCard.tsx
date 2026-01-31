import { motion } from 'framer-motion';
import { Droplets } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

interface SoilMoistureCardProps {
    moisture: number; // 0-100%
    status?: string;
}

const SoilMoistureCard = ({ moisture, status = 'Optimal' }: SoilMoistureCardProps) => {
    return (
        <Card className="glass-card hover:shadow-lg transition-shadow">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Avg Soil Moisture</CardTitle>
                <Droplets className="h-4 w-4 text-blue-500" />
            </CardHeader>
            <CardContent>
                <div className="flex items-center gap-4">
                    <div className="relative h-16 w-16 flex items-center justify-center">
                        {/* Circular Progress Background */}
                        <svg className="h-full w-full -rotate-90" viewBox="0 0 36 36">
                            <path
                                className="text-secondary/20"
                                d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                                fill="none"
                                stroke="currentColor"
                                strokeWidth="4"
                            />
                            <motion.path
                                className="text-blue-500 drop-shadow-sm"
                                d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                                fill="none"
                                stroke="currentColor"
                                strokeWidth="4"
                                strokeDasharray={`${moisture}, 100`}
                                initial={{ pathLength: 0 }}
                                animate={{ pathLength: 1 }}
                                transition={{ duration: 1.5, ease: "easeOut" }}
                            />
                        </svg>
                        <div className="absolute inset-0 flex items-center justify-center">
                            <span className="text-lg font-bold">{Math.round(moisture)}%</span>
                        </div>
                    </div>
                    <div>
                        <p className="text-2xl font-bold">{Math.round(moisture)}%</p>
                        <p className="text-xs text-muted-foreground">{status}</p>
                    </div>
                </div>
            </CardContent>
        </Card>
    );
};

export default SoilMoistureCard;
