// Sample data for template hover previews on the create page
// This provides users with a visual preview of each template before selection

export const HOVER_PREVIEW_DATA = {
    menu: {
        restaurant_info: {
            name: "Mama's Kitchen",
            description: 'Authentic Tanzanian cuisine & local favorites',
            phone: '+255 754 123 456',
            website: 'https://mamaskitchen.co.tz',
            logo: 'https://images.unsplash.com/photo-1555939594-58d7cb561ad1?w=200&h=200&fit=crop',
            cover_image: 'https://images.unsplash.com/photo-1504674900247-0877df9cc836?w=800&h=600&fit=crop',
        },
        content: {
            categories: [
                {
                    id: 'starters',
                    name: 'Starters',
                    items: [
                        {
                            id: 'sambusa',
                            name: 'Sambusa',
                            description: 'Crispy pastry filled with spiced meat and vegetables',
                            price: 3000,
                            currency: 'TSH' as const,
                            available: true,
                        },
                        {
                            id: 'chips-mayai',
                            name: 'Chips Mayai',
                            description: 'Tanzanian omelette with french fries',
                            price: 5000,
                            currency: 'TSH' as const,
                            available: true,
                        },
                    ],
                },
                {
                    id: 'mains',
                    name: 'Main Dishes',
                    items: [
                        {
                            id: 'ugali-nyama',
                            name: 'Ugali na Nyama Choma',
                            description: 'Grilled meat served with ugali and vegetables',
                            price: 15000,
                            currency: 'TSH' as const,
                            available: true,
                        },
                        {
                            id: 'pilau',
                            name: 'Pilau ya Kuku',
                            description: 'Spiced chicken rice with aromatic flavors',
                            price: 12000,
                            currency: 'TSH' as const,
                            available: true,
                        },
                        {
                            id: 'wali-maharage',
                            name: 'Wali wa Maharage',
                            description: 'Rice with red beans in coconut sauce',
                            price: 8000,
                            currency: 'TSH' as const,
                            available: true,
                        },
                    ],
                },
            ],
        },
        styles: {
            primary_color: '#DC2626',
            secondary_color: '#FEF2F2',
            gradient_type: 'none' as const,
            gradient_angle: 135,
        },
    },

    vcard: {
        personal_info: {
            first_name: 'Amani',
            last_name: 'Mwangi',
            avatar_image: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=200&h=200&fit=crop',
        },
        contact_details: {
            phone: '+255 713 456 789',
            email: 'amani.mwangi@techtz.co.tz',
            website: 'https://amanimwangi.co.tz',
        },
        company_details: {
            company_name: 'TechHub Tanzania',
            job_title: 'Software Developer',
        },
        address: {
            street: 'Masaki Peninsula',
            city: 'Dar es Salaam',
            state: 'Dar es Salaam',
            country: 'Tanzania',
        },
        social_networks: [
            { network: 'linkedin', url: 'https://linkedin.com/in/amanimwangi' },
            { network: 'twitter', url: 'https://twitter.com/amanimwangi' },
            { network: 'github', url: 'https://github.com/amanimwangi' },
            { network: 'whatsapp', url: 'https://wa.me/255713456789' },
        ],
        summary: 'Passionate software developer building innovative tech solutions for East Africa. Specialized in web and mobile app development with 5+ years of experience.',
        styles: {
            primary_color: '#16A34A',
            secondary_color: '#F0FDF4',
        },
    },

    url: {
        url_details: {
            destination_url: 'https://safaribookings.co.tz',
            title: 'Safari Bookings Tanzania',
            description: 'Book your dream safari adventure',
        },
        redirect_settings: {
            delay: 3,
            show_preview: true,
            custom_message: '',
        },
        styles: {
            primary_color: '#EA580C',
            secondary_color: '#FFF7ED',
            gradient_type: 'linear' as const,
            gradient_angle: 135,
        },
    },

    wifi: {
        wifi_details: {
            ssid: 'Cafe Mocha WiFi',
            password: 'mocha2024',
            security: 'WPA2' as const,
            hidden: false,
        },
        network_info: {
            title: 'Cafe Mocha',
            description: 'Premium coffee shop with high-speed internet in Masaki, Dar es Salaam',
            logo: 'https://images.unsplash.com/photo-1511920170033-f8396924c348?w=200&h=200&fit=crop',
        },
        styles: {
            primary_color: '#0891B2',
            secondary_color: '#ECFEFF',
        },
    },

    file: {
        pdf_file: {
            file_name: 'Mama_Kitchen_Menu.pdf',
            file_extension: 'PDF',
            file_category: 'document',
            file_type: 'application/pdf',
            file_size: 245000,
        },
        document_info: {
            title: "Mama's Kitchen Menu",
            topic: 'Restaurant Menu',
            description: 'Full menu with Tanzanian dishes and daily specials',
            author: "Mama's Kitchen",
        },
        styles: {
            primary_color: '#DC2626',
            secondary_color: '#FEF2F2',
        },
    },

    text: {
        text_content: {
            title: 'Karibu Tanzania!',
            message: 'Karibu sana! Welcome to Tanzania, the land of Kilimanjaro, Serengeti, and Zanzibar.\n\nExperience our rich culture, stunning wildlife, and warm hospitality.\n\nTuonane hivi karibuni! (See you soon!)',
        },
        styles: {
            primary_color: '#16A34A',
            secondary_color: '#F0FDF4',
        },
    },
};

export type TemplateType = keyof typeof HOVER_PREVIEW_DATA;
