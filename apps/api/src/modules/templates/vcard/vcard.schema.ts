import { z } from 'zod';

export const VCardSocialSchema = z.object({
    platform: z.enum(['linkedin', 'twitter', 'facebook', 'instagram', 'youtube', 'github', 'website', 'other']),
    url: z.string().url(),
    label: z.string().optional(),
});

export const VCardPayloadSchema = z.object({
    // Basic Info
    first_name: z.string().min(1),
    last_name: z.string().min(1),
    prefix: z.string().optional(), // Mr., Dr.
    company: z.string().optional(),
    job_title: z.string().optional(),

    // Contact Info (Arrays allowed for multiple)
    email: z.string().email().optional(),
    work_email: z.string().email().optional(),
    phone: z.string().optional(), // Mobile
    work_phone: z.string().optional(),

    // Web
    website: z.string().url().optional(),
    socials: z.array(VCardSocialSchema).optional(),

    // Address
    address: z.object({
        street: z.string().optional(),
        city: z.string().optional(),
        state: z.string().optional(),
        zip: z.string().optional(),
        country: z.string().optional(),
    }).optional(),

    // Visuals
    avatar_asset_id: z.string().uuid().optional(),
    cover_asset_id: z.string().uuid().optional(),
    primary_color: z.string().optional(),

    // Meta
    summary: z.string().optional(),
});

export type VCardPayload = z.infer<typeof VCardPayloadSchema>;
