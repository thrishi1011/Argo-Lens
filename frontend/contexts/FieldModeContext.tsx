import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';

interface FieldModeContextType {
    isFieldMode: boolean;
    toggleFieldMode: () => void;
}

const FieldModeContext = createContext<FieldModeContextType | undefined>(undefined);

export const FieldModeProvider = ({ children }: { children: ReactNode }) => {
    const [isFieldMode, setIsFieldMode] = useState(false);

    useEffect(() => {
        if (isFieldMode) {
            document.body.classList.add('field-mode');
            document.documentElement.style.setProperty('--contrast-boost', '1.5');
        } else {
            document.body.classList.remove('field-mode');
            document.documentElement.style.removeProperty('--contrast-boost');
        }
    }, [isFieldMode]);

    const toggleFieldMode = () => setIsFieldMode(prev => !prev);

    return (
        <FieldModeContext.Provider value={{ isFieldMode, toggleFieldMode }}>
            {children}
        </FieldModeContext.Provider>
    );
};

export const useFieldMode = () => {
    const context = useContext(FieldModeContext);
    if (context === undefined) {
        throw new Error('useFieldMode must be used within a FieldModeProvider');
    }
    return context;
};
