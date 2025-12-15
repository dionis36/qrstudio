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

    event: {
        event_details: {
            title: 'Tech Meetup Dar es Salaam',
            start_date: '2024-12-20',
            end_date: '2024-12-20',
            start_time: '18:00',
            end_time: '21:00',
            timezone: 'Africa/Nairobi',
            location: 'TechHub Tanzania, Masaki Peninsula',
            all_day: false,
        },
        description: 'Join us for an evening of networking with local tech entrepreneurs and developers. Learn about the latest innovations in East African tech.',
        organizer: {
            name: 'TechHub Tanzania',
            email: 'events@techhubtanzania.co.tz',
        },
        event_url: 'https://techhubtanzania.co.tz/events',
        reminders: {
            enabled: true,
        },
        styles: {
            primary_color: '#7C3AED',
            secondary_color: '#FAF5FF',
        },
    },

    email: {
        email_details: {
            recipient: 'info@safaribookings.co.tz',
            subject: 'Safari Inquiry - Serengeti Tour',
            body: 'Hello,\n\nI am interested in booking a 5-day safari tour to Serengeti National Park. Could you please send me more information about available packages and pricing?\n\nAsante sana!',
        },
        additional_recipients: {
            cc: '',
            bcc: '',
        },
        styles: {
            primary_color: '#F59E0B',
            secondary_color: '#FEF3C7',
        },
    },

    message: {
        platform: 'whatsapp',
        phone_number: '+255 754 123 456',
        username: '',
        message: 'Habari! I would like to confirm my safari booking for tomorrow at 6 AM. Asante sana!',
        message_only: false,
        styles: {
            primary_color: '#10B981',
            secondary_color: '#D1FAE5',
        },
    },

    appstore: {
        app_name: 'TechHub TZ',
        developer: 'TechHub Tanzania',
        description: 'Connect with East Africa\'s tech community. Discover events, network with developers, and stay updated on the latest tech innovations in Tanzania.',
        app_logo: 'https://images.unsplash.com/photo-1611162617474-5b21e879e113?w=200&h=200&fit=crop',
        platforms: [
            { platform: 'google_play', url: 'https://play.google.com/store' },
            { platform: 'ios', url: 'https://apps.apple.com' },
        ],
        styles: {
            primary_color: '#2563EB',
            secondary_color: '#EFF6FF',
        },
    },

    socialmedia: {
        display_name: 'Amani Mwangi',
        bio: 'Software Developer | Tech Enthusiast | Building the future of East African tech 🇹🇿',
        profile_photo: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=200&h=200&fit=crop',
        title: 'Connect With Me',
        tagline: 'Follow my journey in tech and innovation across Tanzania',
        gallery_images: [],
        social_links: [
            { platform: 'linkedin', url: 'https://linkedin.com/in/amanimwangi' },
            { platform: 'twitter', url: 'https://twitter.com/amanimwangi' },
            { platform: 'github', url: 'https://github.com/amanimwangi' },
            { platform: 'instagram', url: 'https://instagram.com/amanimwangi' },
        ],
        styles: {
            primary_color: '#A855F7',
            secondary_color: '#FDF4FF',
        },
    },
};

export type TemplateType = keyof typeof HOVER_PREVIEW_DATA;
