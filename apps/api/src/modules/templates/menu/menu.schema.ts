import { z } from 'zod';

export const MenuItemSchema = z.object({
    id: z.string().uuid().optional(), // generated if missing
    name: z.string().min(1, "Item name is required"),
    description: z.string().optional(),
    price: z.number().min(0).optional(),
    currency: z.string().length(3).default('USD'),
    image_asset_id: z.string().uuid().optional(),
    allergens: z.array(z.string()).optional(), // e.g., 'gluten', 'dairy'
    tags: z.array(z.string()).optional(), // e.g., 'spicy', 'vegan'
    available: z.boolean().default(true),
});

export const MenuCategorySchema = z.object({
    id: z.string().uuid().optional(),
    name: z.string().min(1, "Category name is required"), // e.g., 'Starters'
    description: z.string().optional(),
    items: z.array(MenuItemSchema).min(1, "Category must have at least one item"),
});

export const MenuPayloadSchema = z.object({
    restaurant_info: z.object({
        name: z.string().min(1, "Restaurant name is required"),
        description: z.string().optional(),
        logo_asset_id: z.string().uuid().optional(),
        cover_image_asset_id: z.string().uuid().optional(),
        website: z.string().url().optional(),
        phone: z.string().optional(),
        location: z.object({
            address: z.string().optional(),
            google_maps_url: z.string().url().optional(),
        }).optional(),
    }),
    content: z.object({
        categories: z.array(MenuCategorySchema),
        language: z.string().length(2).default('en'),
    }),
    styles: z.object({
        primary_color: z.string().optional(),
        font_family: z.string().optional(),
    }).optional(),
    seo: z.object({
        slug: z.string().min(3).regex(/^[a-z0-9-]+$/, "Slug must be kebab-case"), // Unique check handled by service
    }).optional(),
});

export type MenuPayload = z.infer<typeof MenuPayloadSchema>;
