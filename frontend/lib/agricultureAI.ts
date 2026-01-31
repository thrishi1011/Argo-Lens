export interface WeatherData {
    temperature: number;      // Celsius
    humidity: number;         // Percentage
    precipitation: number;    // mm
    windSpeed: number;        // km/h
    windDirection: string;    // Cardinal direction
    cloudCover: number;       // Percentage
}

export interface SoilData {
    moisture: number;         // Percentage
    ph: number;               // 0-14
    temperature: number;      // Celsius
    nitrogen: number;         // ppm
    phosphorus: number;       // ppm
    potassium: number;        // ppm
}

export interface CropData {
    type: string;             // e.g., 'Wheat', 'Corn', 'Rice'
    growthStage: 'Germination' | 'Vegetative' | 'Flowering' | 'Fruiting' | 'Maturation';
    plantingDate: Date;
}

export interface SatelliteData {
    nir: number;              // Near-Infrared band (0-1)
    red: number;              // Red band (0-1)
    blue: number;             // Blue band (0-1)
}

export interface PestRisk {
    riskLevel: 'Low' | 'Medium' | 'High' | 'Critical';
    probability: number;      // 0-100%
    pestType: string;         // e.g., 'Aphids', 'Fungal Disease'
    factors: string[];        // Contributing factors
}

export interface Recommendation {
    id: string;
    type: 'Irrigation' | 'Fertilizer' | 'PestControl' | 'Harvest' | 'General';
    priority: 'Low' | 'Medium' | 'High' | 'Critical';
    title: string;
    description: string;
    actionItem?: string;
}

export class AgricultureAI {
    /**
     * Calculate Normalized Difference Vegetation Index (NDVI)
     * Formula: (NIR - Red) / (NIR + Red)
     * Range: -1 to 1
     */
    static calculateNDVI(nir: number, red: number): number {
        if (nir + red === 0) return 0;
        return (nir - red) / (nir + red);
    }

    /**
     * Calculate Enhanced Vegetation Index (EVI)
     * Formula: 2.5 * (NIR - Red) / (NIR + 6 * Red - 7.5 * Blue + 1)
     * Optimized for high biomass regions
     */
    static calculateEVI(nir: number, red: number, blue: number): number {
        const denominator = nir + 6 * red - 7.5 * blue + 1;
        if (denominator === 0) return 0;
        return 2.5 * ((nir - red) / denominator);
    }

    /**
     * Evaluate basic crop health score based on NDVI and EVI
     * Range: 0-100
     */
    static evaluateCropHealth(ndvi: number, evi: number): number {
        // Basic weighted scoring algorithm
        // NDVI contributes 70%, EVI contributes 30%
        // Normalize NDVI (typ. 0.2-0.8 for healthy vegetation) to 0-100
        // Normalize EVI (typ. 0.2-0.7 for healthy vegetation) to 0-100

        const normalizedNDVI = Math.max(0, Math.min(1, (ndvi - 0.1) / 0.7)) * 100;
        const normalizedEVI = Math.max(0, Math.min(1, (evi - 0.1) / 0.6)) * 100;

        return Math.round((normalizedNDVI * 0.7) + (normalizedEVI * 0.3));
    }

    /**
     * Predict pest and disease risks based on environmental conditions
     * Implements Expert System rules for agricultural pests
     */
    static predictPestRisk(
        weather: WeatherData,
        soil: SoilData,
        crop: CropData
    ): PestRisk[] {
        const risks: PestRisk[] = [];

        // Rule 1: Fungal Diseases (High humidity + Moderate Temp)
        if (weather.humidity > 80 && weather.temperature >= 20 && weather.temperature <= 30) {
            risks.push({
                riskLevel: 'High',
                probability: 85,
                pestType: 'Fungal Disease (e.g., Blight, Rust)',
                factors: ['High Humidity (>80%)', 'Optimal Fungal Temp (20-30°C)'],
            });
        }

        // Rule 2: Aphids (Warm + Dry conditions)
        if (weather.temperature > 25 && weather.humidity < 50) {
            risks.push({
                riskLevel: 'Medium',
                probability: 60,
                pestType: 'Aphids',
                factors: ['Warm Temp', 'Low Humidity'],
            });
        }

        // Rule 3: Locusts (Post-rain vegetation bloom + wind direction)
        // Simplified rule for demo purposes
        if (weather.windSpeed > 15 && crop.growthStage === 'Vegetative') {
            risks.push({
                riskLevel: 'Low',
                probability: 30,
                pestType: 'Locust Swarm',
                factors: ['High Wind Speed', 'Vegetative Stage'],
            });
        }

        // Rule 4: Root Rot (High Soil Moisture)
        if (soil.moisture > 85) {
            risks.push({
                riskLevel: 'Critical',
                probability: 90,
                pestType: 'Root Rot / Bacterial Wilt',
                factors: ['Excessive Soil Moisture (>85%)'],
            });
        }

        // Default if no specific risks found but conditions are extreme
        if (risks.length === 0 && (weather.temperature > 35 || weather.temperature < 5)) {
            risks.push({
                riskLevel: 'Medium',
                probability: 45,
                pestType: 'Abiotic Stress',
                factors: ['Extreme Temperatures'],
            });
        }

        return risks.sort((a, b) => b.probability - a.probability);
    }

    /**
     * Generate actionable recommendations based on all data
     */
    static generateRecommendations(
        weather: WeatherData,
        soil: SoilData,
        crop: CropData,
        pestRisks: PestRisk[]
    ): Recommendation[] {
        const recommendations: Recommendation[] = [];
        const id = () => Math.random().toString(36).substr(2, 9);

        // 1. Irrigation Recommendations
        if (soil.moisture < 30) {
            recommendations.push({
                id: id(),
                type: 'Irrigation',
                priority: 'High',
                title: 'Critical Water Deficit',
                description: `Soil moisture is at ${soil.moisture}%. Crops are experiencing water stress.`,
                actionItem: `Initiate irrigation to restore moisture to 60%.`,
            });
        } else if (soil.moisture > 80 && weather.precipitation > 5) {
            recommendations.push({
                id: id(),
                type: 'Irrigation',
                priority: 'High',
                title: 'Waterlogging Risk',
                description: `Soil moisture is high (${soil.moisture}%) and rain is forecast.`,
                actionItem: 'Pause scheduled irrigation and check drainage.',
            });
        }

        // 2. Fertilizer Recommendations (NPK)
        if (soil.nitrogen < 100 && crop.growthStage === 'Vegetative') {
            recommendations.push({
                id: id(),
                type: 'Fertilizer',
                priority: 'Medium',
                title: 'Nitrogen Deficiency',
                description: 'Nitrogen levels are low during critical vegetative growth.',
                actionItem: 'Apply nitrogen-rich fertilizer.',
            });
        }

        // 3. Pest Recommendations
        pestRisks.forEach(risk => {
            if (risk.riskLevel === 'Critical' || risk.riskLevel === 'High') {
                recommendations.push({
                    id: id(),
                    type: 'PestControl',
                    priority: 'Critical',
                    title: `Treat for ${risk.pestType}`,
                    description: `High probability (${risk.probability}%) of ${risk.pestType} detected.`,
                    actionItem: `Inspect fields and implement control measures for ${risk.pestType}.`,
                });
            }
        });

        // 4. Harvest Recommendations
        if (crop.growthStage === 'Maturation' && weather.humidity < 40 && weather.precipitation === 0) {
            recommendations.push({
                id: id(),
                type: 'Harvest',
                priority: 'Medium',
                title: 'Optimal Harvest Conditions',
                description: 'Dry weather pattern detected suitable for harvest.',
                actionItem: 'Prepare harvesting equipment.',
            });
        }

        return recommendations;
    }

    /**
     * Estimate potential yield based on current health and environmental factors
     * Returns yield in metric tons per hectare
     */
    static estimateYield(
        crop: CropData,
        healthScore: number,
        soil: SoilData
    ): { estimate: number; confidence: number; factors: string[] } {
        let baseYield = 0;
        switch (crop.type.toLowerCase()) {
            case 'wheat': baseYield = 4.5; break;
            case 'corn': baseYield = 10.5; break;
            case 'rice': baseYield = 6.2; break;
            case 'soybeans': baseYield = 3.8; break;
            default: baseYield = 5.0;
        }

        // Adjust based on health score (0-100)
        const healthMultiplier = 0.5 + (healthScore / 100) * 0.7; // 0.5 to 1.2

        // Adjust based on soil moisture
        const moistureMultiplier = soil.moisture < 40 ? 0.8 : (soil.moisture > 90 ? 0.7 : 1.0);

        const estimate = baseYield * healthMultiplier * moistureMultiplier;
        const confidence = 75 + (healthScore / 10); // 75-85% confidence

        const factors = [];
        if (healthScore > 80) factors.push("High vegetative vigor");
        if (soil.moisture < 40) factors.push("Water stress limiting growth");
        if (soil.nitrogen < 120) factors.push("Nitrogen levels sub-optimal");

        return {
            estimate: Math.round(estimate * 10) / 10,
            confidence: Math.round(confidence),
            factors
        };
    }

    /**
     * Analyze water balance (Intake vs Evapotranspiration)
     */
    static analyzeWaterBalance(
        weather: WeatherData,
        soil: SoilData
    ): { balance: number; status: 'Surplus' | 'Balanced' | 'Deficit'; recommendations: string } {
        // Simple ET calculation (highly simplified Penman-Monteith)
        const et = (weather.temperature * 0.1) + (weather.windSpeed * 0.05) - (weather.humidity * 0.02);
        const intake = weather.precipitation;

        const balance = intake - et;

        let status: 'Surplus' | 'Balanced' | 'Deficit' = 'Balanced';
        let rec = "Maintain current regimen.";

        if (balance < -0.5) {
            status = 'Deficit';
            rec = "Increase irrigation frequency.";
        } else if (balance > 1.0) {
            status = 'Surplus';
            rec = "Reduce irrigation; monitor drainage.";
        }

        return {
            balance: Math.round(balance * 100) / 100,
            status,
            recommendations: rec
        };
    }
}
