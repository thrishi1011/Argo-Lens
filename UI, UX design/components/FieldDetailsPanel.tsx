import React, { useState } from 'react';
import FieldAnalysisPanel from './FieldAnalysisPanel';
import { soundManager } from '@/utils/soundEffects';

interface FieldDetailsPanelProps {
    field: {
        id: string;
        name: string;
        area: number;
        crop: string;
        ndvi: number;
        evi: number;
        savi: number;
    };
    onClose: () => void;
}

const FieldDetailsPanel: React.FC<FieldDetailsPanelProps> = ({ field, onClose }) => {
    const [showAnalysis, setShowAnalysis] = useState(false);

    const handleViewAnalysis = () => {
        // Play click sound
        soundManager.play('click');

        // Show analysis panel
        setShowAnalysis(true);
    };

    return (
        <>
            <div className="absolute bottom-4 left-4 right-4 lg:left-auto lg:right-4 lg:w-96 bg-white/90 dark:bg-gray-800/90 backdrop-blur-md rounded-xl shadow-2xl p-6 z-[1000] border border-gray-200 dark:border-gray-700">
                <div className="flex justify-between items-start mb-4">
                    <div>
                        <h3 className="text-xl font-bold text-gray-900 dark:text-gray-100">{field.name}</h3>
                        <p className="text-gray-600 dark:text-gray-400">{field.area} acres • {field.crop}</p>
                    </div>
                    <button
                        onClick={onClose}
                        className="text-gray-500 hover:text-gray-700 dark:hover:text-gray-300 p-1"
                        aria-label="Close"
                    >
                        ✕
                    </button>
                </div>

                <div className="space-y-4">
                    <div className="grid grid-cols-3 gap-4">
                        <div className="text-center p-3 bg-green-50 dark:bg-green-900/20 rounded-lg">
                            <div className="text-sm text-gray-600 dark:text-gray-400">NDVI</div>
                            <div className="text-2xl font-bold text-green-600 dark:text-green-400">
                                {field.ndvi.toFixed(2)}
                            </div>
                        </div>
                        <div className="text-center p-3 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
                            <div className="text-sm text-gray-600 dark:text-gray-400">EVI</div>
                            <div className="text-2xl font-bold text-blue-600 dark:text-blue-400">
                                {field.evi.toFixed(2)}
                            </div>
                        </div>
                        <div className="text-center p-3 bg-purple-50 dark:bg-purple-900/20 rounded-lg">
                            <div className="text-sm text-gray-600 dark:text-gray-400">SAVI</div>
                            <div className="text-2xl font-bold text-purple-600 dark:text-purple-400">
                                {field.savi.toFixed(2)}
                            </div>
                        </div>
                    </div>

                    <button
                        onClick={handleViewAnalysis}
                        className="w-full py-3 bg-gradient-to-r from-green-500 to-emerald-600 text-white font-semibold rounded-lg hover:from-green-600 hover:to-emerald-700 transition-all transform hover:scale-[1.02] active:scale-[0.98] shadow-lg hover:shadow-xl"
                    >
                        View Detailed Analysis
                    </button>
                </div>
            </div>

            {/* Analysis Panel */}
            <FieldAnalysisPanel
                fieldId={field.id}
                isOpen={showAnalysis}
                onClose={() => setShowAnalysis(false)}
            />
        </>
    );
};

export default FieldDetailsPanel;
