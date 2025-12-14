import { createContext, useContext, useState, ReactNode } from 'react';

interface PreviewContextType {
    heroBackgroundColor: string;
    setHeroBackgroundColor: (color: string) => void;
}

const PreviewContext = createContext<PreviewContextType | undefined>(undefined);

export function PreviewProvider({ children }: { children: ReactNode }) {
    const [heroBackgroundColor, setHeroBackgroundColor] = useState('#FFFFFF');

    return (
        <PreviewContext.Provider value={{ heroBackgroundColor, setHeroBackgroundColor }}>
            {children}
        </PreviewContext.Provider>
    );
}

export function usePreviewContext() {
    const context = useContext(PreviewContext);
    // Return safe defaults if used outside provider
    if (!context) {
        return {
            heroBackgroundColor: '#FFFFFF',
            setHeroBackgroundColor: () => { }
        };
    }
    return context;
}
