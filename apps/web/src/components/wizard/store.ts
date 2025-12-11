import { create } from 'zustand';

interface WizardState {
    step: number;
    type: string | null;
    payload: Record<string, any>;
    design: Record<string, any>;

    setStep: (step: number) => void;
    setType: (type: string) => void;
    updatePayload: (data: Record<string, any>) => void;
    updateDesign: (data: Record<string, any>) => void;
}

export const useWizardStore = create<WizardState>((set) => ({
    step: 1,
    type: null,
    payload: {
        // Default structure for Menu to prevent preview crushes
        restaurant_info: { name: '', description: '' },
        content: {
            categories: [
                {
                    id: 'cat_1',
                    name: 'Starters',
                    items: [
                        { id: 'item_1', name: 'Garlic Bread', description: 'Toasted french baguette with garlic butter', price: 6 }
                    ]
                }
            ],
            language: 'en'
        },
        styles: { primary_color: '#f97316' }
    },
    design: {
        dots: { color: '#000000', style: 'dots' },
        background: { color: '#ffffff' },
        margin: 1
    },

    setStep: (step) => set({ step }),
    setType: (type) => set({ type }),
    updatePayload: (data) => set((state) => {
        // specialized deep merge for nested objects could go here, 
        // but for now simple spread fits most 1-level updates.
        // For deep updates (like modifying specific item in specific category), 
        // components should pass the full new object or use a cleaner action.
        // Simple merge:
        return { payload: { ...state.payload, ...data } };
    }),
    updateDesign: (data) => set((state) => ({ design: { ...state.design, ...data } })),
}));
