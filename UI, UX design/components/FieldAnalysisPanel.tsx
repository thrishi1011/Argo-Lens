import React, { useState, useEffect } from 'react';
import { X, Leaf, Thermometer, Droplets, Bug, Cloud, AlertCircle } from 'lucide-react';
import { soundManager } from '@/utils/soundEffects';

interface FieldAnalysisPanelProps {
    fieldId: string;
    isOpen: boolean;
    onClose: () => void;
}

const FieldAnalysisPanel: React.FC<FieldAnalysisPanelProps> = ({ fieldId, isOpen, onClose }) => {
    const [analysisData, setAnalysisData] = useState<any>(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        if (isOpen && fieldId) {
            fetchFieldAnalysis(fieldId);
            soundManager.play('panelOpen');
        }
    }, [isOpen, fieldId]);

    const fetchFieldAnalysis = async (id: string) => {
        setLoading(true);
        setError(null);

        try {
            // Using relative path, assuming proxy or same host, or update to absolute if needed
            // Ideally should be configurable. Using localhost:8000 for dev default if relative fails (implied fallback logic not here, just direct fetch)
            const response = await fetch(`http://localhost:8000/api/fields/${id}/detailed-analysis`);
            if (!response.ok) throw new Error('Failed to fetch analysis');

            const data = await response.json();
            setAnalysisData(data);

            // Play success sound
            soundManager.play('dataLoaded');

        } catch (err) {
            setError(err instanceof Error ? err.message : 'Unknown error');
            // Play error sound
            soundManager.play('error');
        } finally {
            setLoading(false);
        }
    };

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 z-[2000] overflow-hidden">
            {/* Backdrop */}
            <div
                className="absolute inset-0 bg-black bg-opacity-50 transition-opacity"
                onClick={onClose}
            />

            {/* Panel */}
            <div className="absolute inset-y-0 right-0 flex max-w-full pointer-events-none">
                <div className="pointer-events-auto relative w-screen max-w-2xl transform transition ease-in-out duration-500 sm:duration-700">
                    <div className="flex h-full flex-col bg-white dark:bg-gray-900 shadow-xl">

                        {/* Header */}
                        <div className="flex items-start justify-between p-6 border-b dark:border-gray-700">
                            <div>
                                <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
                                    {analysisData?.basic_info?.name || 'Field Analysis'}
                                </h2>
                                <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
                                    Comprehensive analysis and recommendations
                                </p>
                            </div>
                            <button
                                onClick={onClose}
                                className="rounded-full p-2 hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
                                aria-label="Close panel"
                            >
                                <X className="h-6 w-6 text-gray-500" />
                            </button>
                        </div>

                        {/* Loading State */}
                        {loading && (
                            <div className="flex-1 flex items-center justify-center">
                                <div className="text-center">
                                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-500 mx-auto"></div>
                                    <p className="mt-4 text-gray-600 dark:text-gray-400">Analyzing field data...</p>
                                </div>
                            </div>
                        )}

                        {/* Error State */}
                        {error && (
                            <div className="flex-1 flex items-center justify-center">
                                <div className="text-center text-red-600 dark:text-red-400">
                                    <AlertCircle className="h-12 w-12 mx-auto mb-4" />
                                    <p>Failed to load analysis: {error}</p>
                                    <button
                                        onClick={() => fetchFieldAnalysis(fieldId)}
                                        className="mt-4 px-4 py-2 bg-red-100 dark:bg-red-900 rounded-lg hover:bg-red-200 dark:hover:bg-red-800"
                                    >
                                        Retry
                                    </button>
                                </div>
                            </div>
                        )}

                        {/* Analysis Content */}
                        {analysisData && !loading && (
                            <div className="flex-1 overflow-y-auto p-6 text-gray-900 dark:text-gray-100">

                                {/* Health Score Card */}
                                <div className="mb-6 p-4 bg-gradient-to-r from-green-50 to-emerald-50 dark:from-green-900/20 dark:to-emerald-900/20 rounded-xl border border-green-100 dark:border-green-900">
                                    <div className="flex items-center justify-between">
                                        <div>
                                            <h3 className="text-lg font-semibold text-green-900 dark:text-green-100">Overall Health Score</h3>
                                            <p className="text-sm text-green-700 dark:text-green-300">Based on vegetation and sensor data</p>
                                        </div>
                                        <div className="text-right">
                                            <div className="text-4xl font-bold text-green-600 dark:text-green-400">
                                                {analysisData.vegetation_indices.health_score.toFixed(0)}
                                                <span className="text-lg text-gray-500 dark:text-gray-400">/100</span>
                                            </div>
                                            <div className={`text-sm mt-1 ${analysisData.vegetation_indices.ndvi_trend === 'improving' ? 'text-green-600 dark:text-green-400' : 'text-red-600 dark:text-red-400'}`}>
                                                {analysisData.vegetation_indices.ndvi_trend === 'improving' ? '↗ Improving' : '↘ Declining'}
                                            </div>
                                        </div>
                                    </div>
                                </div>

                                {/* Grid Layout */}
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">

                                    {/* Vegetation Indices */}
                                    <div className="space-y-4">
                                        <h3 className="text-lg font-semibold flex items-center gap-2">
                                            <Leaf className="h-5 w-5 text-green-600" />
                                            Vegetation Health
                                        </h3>
                                        <div className="space-y-3">
                                            <div className="flex justify-between items-center p-3 bg-gray-50 dark:bg-gray-800 rounded-lg">
                                                <span>NDVI</span>
                                                <span className="font-bold">{analysisData.vegetation_indices.current_ndvi.toFixed(3)}</span>
                                            </div>
                                            <div className="flex justify-between items-center p-3 bg-gray-50 dark:bg-gray-800 rounded-lg">
                                                <span>EVI</span>
                                                <span className="font-bold">{analysisData.vegetation_indices.current_evi.toFixed(3)}</span>
                                            </div>
                                        </div>
                                    </div>

                                    {/* Sensor Readings */}
                                    <div className="space-y-4">
                                        <h3 className="text-lg font-semibold flex items-center gap-2">
                                            <Thermometer className="h-5 w-5 text-blue-600" />
                                            Current Conditions
                                        </h3>
                                        <div className="grid grid-cols-2 gap-3">
                                            <div className="p-3 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
                                                <div className="text-sm text-gray-600 dark:text-gray-400">Soil Moisture</div>
                                                <div className="text-xl font-bold text-blue-900 dark:text-blue-100">{analysisData.sensor_readings.soil_moisture}%</div>
                                            </div>
                                            <div className="p-3 bg-purple-50 dark:bg-purple-900/20 rounded-lg">
                                                <div className="text-sm text-gray-600 dark:text-gray-400">Temperature</div>
                                                <div className="text-xl font-bold text-purple-900 dark:text-purple-100">{analysisData.sensor_readings.temperature}°C</div>
                                            </div>
                                            <div className="p-3 bg-amber-50 dark:bg-amber-900/20 rounded-lg">
                                                <div className="text-sm text-gray-600 dark:text-gray-400">Soil pH</div>
                                                <div className="text-xl font-bold text-amber-900 dark:text-amber-100">{analysisData.sensor_readings.soil_ph}</div>
                                            </div>
                                            <div className="p-3 bg-cyan-50 dark:bg-cyan-900/20 rounded-lg">
                                                <div className="text-sm text-gray-600 dark:text-gray-400">Humidity</div>
                                                <div className="text-xl font-bold text-cyan-900 dark:text-cyan-100">{analysisData.sensor_readings.humidity}%</div>
                                            </div>
                                        </div>
                                    </div>

                                    {/* Pest Risk */}
                                    <div className="space-y-4">
                                        <h3 className="text-lg font-semibold flex items-center gap-2">
                                            <Bug className="h-5 w-5 text-red-600" />
                                            Pest Risk Analysis
                                        </h3>
                                        <div className={`p-4 rounded-lg ${analysisData.pest_risk_analysis.risk_level === 'high' ? 'bg-red-100 dark:bg-red-900/30' :
                                                analysisData.pest_risk_analysis.risk_level === 'medium' ? 'bg-yellow-100 dark:bg-yellow-900/30' :
                                                    'bg-green-100 dark:bg-green-900/30'
                                            }`}>
                                            <div className="flex justify-between items-center">
                                                <span className="font-semibold">Risk Level</span>
                                                <span className={`px-3 py-1 rounded-full text-sm font-bold ${analysisData.pest_risk_analysis.risk_level === 'high' ? 'bg-red-500 text-white' :
                                                        analysisData.pest_risk_analysis.risk_level === 'medium' ? 'bg-yellow-500 text-black' :
                                                            'bg-green-500 text-white'
                                                    }`}>
                                                    {analysisData.pest_risk_analysis.risk_level.toUpperCase()}
                                                </span>
                                            </div>
                                            <p className="mt-2 text-sm text-gray-800 dark:text-gray-200">
                                                Top threats: {analysisData.pest_risk_analysis.top_threats.join(', ')}
                                            </p>
                                        </div>
                                    </div>

                                    {/* Weather */}
                                    <div className="space-y-4">
                                        <h3 className="text-lg font-semibold flex items-center gap-2">
                                            <Cloud className="h-5 w-5 text-cyan-600" />
                                            Weather
                                        </h3>
                                        <div className="p-4 bg-cyan-50 dark:bg-cyan-900/20 rounded-lg">
                                            <div className="flex justify-between items-center">
                                                <div>
                                                    <div className="text-2xl font-bold text-cyan-900 dark:text-cyan-100">{analysisData.weather_data.current_temp}°C</div>
                                                    <div className="text-sm text-cyan-700 dark:text-cyan-300">{analysisData.weather_data.current_conditions}</div>
                                                </div>
                                                <div className="text-right">
                                                    <div className="text-sm">Rain: {analysisData.weather_data.rainfall_probability}%</div>
                                                    <div className="text-sm">Humidity: {analysisData.weather_data.current_humidity}%</div>
                                                </div>
                                            </div>
                                        </div>
                                    </div>

                                </div>

                                {/* Recommendations Section */}
                                <div className="mt-8">
                                    <h3 className="text-lg font-semibold mb-4">AI Recommendations</h3>
                                    <div className="space-y-3">
                                        {analysisData.recommendations.map((rec: any, index: number) => (
                                            <div key={index} className={`p-4 rounded-lg border-l-4 ${rec.priority === 'high' ? 'border-l-red-500 bg-red-50 dark:bg-red-900/20' :
                                                    rec.priority === 'medium' ? 'border-l-yellow-500 bg-yellow-50 dark:bg-yellow-900/20' :
                                                        'border-l-green-500 bg-green-50 dark:bg-green-900/20'
                                                }`}>
                                                <div className="flex justify-between items-start">
                                                    <div>
                                                        <h4 className="font-semibold text-gray-900 dark:text-gray-100">{rec.title}</h4>
                                                        <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">{rec.description}</p>
                                                        <div className="flex flex-wrap items-center gap-4 mt-3 text-sm text-gray-700 dark:text-gray-300">
                                                            <span className="flex items-center gap-1">
                                                                <Droplets className="h-4 w-4" />
                                                                Action: {rec.action}
                                                            </span>
                                                            <span>Timing: {rec.timing}</span>
                                                            <span>Cost: ${rec.estimated_cost}</span>
                                                        </div>
                                                    </div>
                                                    <button className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors shadow-sm ml-4">
                                                        Apply
                                                    </button>
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                </div>

                                {/* Active Alerts */}
                                {analysisData.active_alerts.length > 0 && (
                                    <div className="mt-8">
                                        <h3 className="text-lg font-semibold mb-4">Active Alerts</h3>
                                        <div className="space-y-2">
                                            {analysisData.active_alerts.map((alert: any) => (
                                                <div key={alert.id} className="p-3 bg-red-50 dark:bg-red-900/20 rounded-lg flex items-center justify-between border border-red-100 dark:border-red-900">
                                                    <div>
                                                        <span className="font-medium text-red-900 dark:text-red-100">{alert.title}</span>
                                                        <p className="text-sm text-gray-600 dark:text-gray-400">{alert.description}</p>
                                                    </div>
                                                    <button className="px-3 py-1 bg-red-100 dark:bg-red-800 rounded text-sm text-red-700 dark:text-red-200 hover:bg-red-200 dark:hover:bg-red-700">
                                                        Resolve
                                                    </button>
                                                </div>
                                            ))}
                                        </div>
                                    </div>
                                )}

                            </div>
                        )}

                        {/* Footer */}
                        <div className="border-t dark:border-gray-700 p-4 flex justify-between items-center bg-gray-50 dark:bg-gray-800">
                            <button
                                onClick={onClose}
                                className="px-4 py-2 border dark:border-gray-600 rounded-lg hover:bg-white dark:hover:bg-gray-700 transition-colors text-gray-700 dark:text-gray-300"
                            >
                                Close
                            </button>
                            <div className="text-sm text-gray-500 dark:text-gray-400">
                                Last updated: {analysisData ? new Date(analysisData.timestamp).toLocaleTimeString() : '--:--'}
                            </div>
                        </div>

                    </div>
                </div>
            </div>
        </div>
    );
};

export default FieldAnalysisPanel;
