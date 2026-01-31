export class DataSimulator {
    // Simulates diurnal temperature cycle (peak at 14:00, low at 04:00)
    static getTemperature(hour: number, baseTemp: number = 20): number {
        const amplitude = 10; // Variation
        const offset = 14; // Peak time
        const radian = ((hour - offset) * Math.PI) / 12;
        // Cosine wave for daily cycle + tiny random noise
        return baseTemp + amplitude * Math.cos(radian) + (Math.random() - 0.5);
    }

    // Simulates soil moisture response (drying curve unless irrigated)
    static getSoilMoisture(hour: number, lastIrrigationHoursAgo: number): number {
        // Exponential decay from 100% capacity
        const dryingRate = 0.02; // % per hour
        const capacity = 80; // Field capacity
        const noise = Math.random() * 2;

        // Diurnal fluctuation: plants drink more during day (10:00-16:00)
        const activeUptake = (hour >= 10 && hour <= 16) ? 0.5 : 0.1;

        let moisture = Math.max(10, capacity * Math.exp(-(dryingRate) * lastIrrigationHoursAgo));
        return moisture - activeUptake + noise;
    }

    // Simulates light intensity (lux) based on sun position
    static getLightIntensity(hour: number): number {
        if (hour < 6 || hour > 20) return 0; // Night
        const peakLux = 100000;
        const center = 13; // 1pm
        const spread = 20; // Width of curve
        // Gaussian-like curve
        const lux = peakLux * Math.exp(-Math.pow(hour - center, 2) / spread);
        return Math.max(0, lux + (Math.random() * 5000 - 2500)); // Add cloud noise
    }

    // Simulates seasonal NDVI
    static getSeasonalNDVI(dayOfYear: number): number {
        // Logistic growth curve
        const maxNDVI = 0.85;
        const minNDVI = 0.2;
        const growthRate = 0.05;
        const peakDay = 180; // Peak summer

        const x = dayOfYear - peakDay;
        const ndvi = minNDVI + (maxNDVI - minNDVI) * Math.exp(-(x * x) / 5000);
        return ndvi + (Math.random() * 0.05 - 0.025);
    }
}
