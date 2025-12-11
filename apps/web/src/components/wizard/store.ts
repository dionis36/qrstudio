import { create } from 'zustand';

interface WizardState {
    step: number;
    type: string | null;
    payload: Record<string, any>;
    design: Record<string, any>;
    editMode: boolean;
    editId: string | null;
    shortcode: string | null;
    qrName: string;

    setStep: (step: number) => void;
    setType: (type: string) => void;
    updatePayload: (data: Record<string, any>) => void;
    updateDesign: (data: Record<string, any>) => void;
    setEditMode: (editId: string | null) => void;
    loadQrData: (qrCode: any) => void;
    reset: () => void;
}

export const useWizardStore = create<WizardState>((set) => ({
    step: 1,
    type: null,
    editMode: false,
    editId: null,
    shortcode: null,
    qrName: '',
    payload: {
        // Default structure for Menu to prevent preview crushes
        restaurant_info: { name: '', description: '' },
        content: {
            categories: [
                {
                    id: 'cat_1',
                    name: 'Starters',
                    items: [
                        { id: 'item_1', name: 'Garlic Bread', description: 'Toasted french baguette with garlic butter', price: 6000, currency: 'TSH', available: true }
                    ]
                }
            ],
            language: 'en'
        },
        styles: { primary_color: '#f97316', secondary_color: '#fff7ed' }
    },
    design: {
        dots: { color: '#000000', style: 'square' },
        background: { color: '#ffffff' },
        cornersSquare: { color: '#000000', style: 'square' },
        cornersDot: { color: '#000000', style: 'square' },
        image: null,
        imageOptions: { hideBackgroundDots: true, imageSize: 0.4, margin: 10 },
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
    updateDesign: (data) => set((state) => ({
        design: { ...state.design, ...data }
    })),
    setEditMode: (editId) => set({ editMode: !!editId, editId }),
    loadQrData: (qrCode) => set({
        type: qrCode.type,
        payload: qrCode.payload,
        design: qrCode.design,
        editMode: true,
        editId: qrCode.id,
        shortcode: qrCode.shortcode,
        qrName: qrCode.name,
    }),
    reset: () => set({
        step: 1,
        type: null,
        editMode: false,
        editId: null,
        shortcode: null,
        qrName: '',
        payload: {
            restaurant_info: { name: '', description: '' },
            content: {
                categories: [
                    {
                        id: 'cat_1',
                        name: 'Starters',
                        items: [
                            { id: 'item_1', name: 'Garlic Bread', description: 'Toasted french baguette with garlic butter', price: 6000, currency: 'TSH', available: true }
                        ]
                    }
                ],
                language: 'en'
            },
            styles: { primary_color: '#f97316', secondary_color: '#fff7ed' }
        },
        design: {
            dots: { color: '#000000', style: 'square' },
            background: { color: '#ffffff' },
            cornersSquare: { color: '#000000', style: 'square' },
            cornersDot: { color: '#000000', style: 'square' },
            image: null,
            imageOptions: { hideBackgroundDots: true, imageSize: 0.4, margin: 10 },
            margin: 1
        }
    }),
}));
