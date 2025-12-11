import { z } from 'zod';

import { MenuPayloadSchema } from '../templates/menu/menu.schema';
import { VCardPayloadSchema } from '../templates/vcard/vcard.schema';

const BaseQrSchema = z.object({
    is_dynamic: z.boolean().default(false),
    design: z.object({
        size: z.number().min(100).max(4000).default(1000),
        margin: z.number().min(0).max(100).default(0),
        dots: z.object({
            style: z.enum(['dots', 'rounded', 'classy', 'classy-rounded', 'square', 'extra-rounded']).default('square'),
            color: z.string().default('#000000'),
        }).optional(),
        background: z.object({
            color: z.string().default('#ffffff'),
        }).optional(),
        corners: z.object({
            style: z.enum(['dot', 'square', 'extra-rounded']).optional(),
            color: z.string().optional(),
        }).optional(),
        logo: z.object({
            asset_id: z.string().uuid().optional(),
            scale: z.number().min(0.1).max(0.5).default(0.2),
            margin: z.number().default(10),
        }).optional(),
    }).optional().default({}),
    project_id: z.string().uuid().optional(),
});

export const CreateQrSchema = z.discriminatedUnion('type', [
    BaseQrSchema.extend({
        type: z.literal('menu'),
        payload: MenuPayloadSchema,
    }),
    BaseQrSchema.extend({
        type: z.literal('vcard'),
        payload: VCardPayloadSchema,
    }),
    BaseQrSchema.extend({
        type: z.literal('url'),
        payload: z.object({ url: z.string().url() }),
    }),
    BaseQrSchema.extend({
        type: z.literal('text'),
        payload: z.object({ text: z.string() }),
    }),
    BaseQrSchema.extend({
        type: z.literal('pdf'),
        payload: z.record(z.any()),
    }),
    BaseQrSchema.extend({
        type: z.literal('wifi'),
        payload: z.record(z.any()),
    }),
]);

export type CreateQrDto = z.infer<typeof CreateQrSchema>;
