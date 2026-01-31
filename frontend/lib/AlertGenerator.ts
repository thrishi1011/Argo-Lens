import { SensorData } from '../hooks/useSensorData';
import { PestRisk } from './agricultureAI';

export interface Alert {
    id: string;
    type: 'critical' | 'warning' | 'info' | 'success';
    title: string;
    message: string;
    timestamp: Date;
    field?: string;
    status: 'active' | 'resolved';
}

export const generateAgricultureAlerts = (
    sensorData: SensorData,
    pestRisks: PestRisk[]
): Alert[] => {
    const alerts: Alert[] = [];
    const id = () => Math.random().toString(36).substr(2, 9);
    const now = new Date();

    // 1. Water Stress Alert
    if (sensorData.soilMoisture < 35) {
        alerts.push({
            id: id(),
            type: 'critical',
            title: 'Severe Water Stress',
            message: `Soil moisture dropped to ${Math.round(sensorData.soilMoisture)}%. Immediate irrigation required to prevent permanent wilting.`,
            timestamp: now,
            field: 'North Field',
            status: 'active'
        });
    } else if (sensorData.soilMoisture < 50) {
        alerts.push({
            id: id(),
            type: 'warning',
            title: 'Low Moisture Warning',
            message: `Soil moisture is below optimal levels (${Math.round(sensorData.soilMoisture)}%). Schedule irrigation soon.`,
            timestamp: now,
            field: 'North Field',
            status: 'active'
        });
    }

    // 2. Heat Stress Alert
    if (sensorData.temperature > 35) {
        alerts.push({
            id: id(),
            type: 'warning',
            title: 'Heat Stress Risk',
            message: `Canopy temperature is high (${Math.round(sensorData.temperature)}°C). Monitor for midday wilting.`,
            timestamp: now,
            field: 'All Fields',
            status: 'active'
        });
    }

    // 3. Pest Alerts
    pestRisks.forEach(risk => {
        if (risk.riskLevel === 'Critical') {
            alerts.push({
                id: id(),
                type: 'critical',
                title: `Pest Outbreak: ${risk.pestType}`,
                message: `High probability of outbreak detected based on current humidity and temperature.`,
                timestamp: now,
                field: 'East Field',
                status: 'active'
            });
        }
    });

    return alerts;
};
