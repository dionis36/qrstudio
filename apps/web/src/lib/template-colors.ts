export const TEMPLATE_COLORS = {
    menu: {
        bg: 'bg-orange-100',
        text: 'text-orange-700',
        border: 'border-orange-200',
        badge: 'bg-orange-100 text-orange-700 border border-orange-200',
        icon: 'bg-orange-100 text-orange-600',
    },
    vcard: {
        bg: 'bg-blue-100',
        text: 'text-blue-700',
        border: 'border-blue-200',
        badge: 'bg-blue-100 text-blue-700 border border-blue-200',
        icon: 'bg-blue-100 text-blue-600',
    },
    url: {
        bg: 'bg-emerald-100',
        text: 'text-emerald-700',
        border: 'border-emerald-200',
        badge: 'bg-emerald-100 text-emerald-700 border border-emerald-200',
        icon: 'bg-emerald-100 text-emerald-600',
    },
    text: {
        bg: 'bg-purple-100',
        text: 'text-purple-700',
        border: 'border-purple-200',
        badge: 'bg-purple-100 text-purple-700 border border-purple-200',
        icon: 'bg-purple-100 text-purple-600',
    },
    wifi: {
        bg: 'bg-cyan-100',
        text: 'text-cyan-700',
        border: 'border-cyan-200',
        badge: 'bg-cyan-100 text-cyan-700 border border-cyan-200',
        icon: 'bg-cyan-100 text-cyan-600',
    },
    file: {
        bg: 'bg-slate-100',
        text: 'text-slate-700',
        border: 'border-slate-200',
        badge: 'bg-slate-100 text-slate-700 border border-slate-200',
        icon: 'bg-slate-100 text-slate-600',
    },
    event: {
        bg: 'bg-pink-100',
        text: 'text-pink-700',
        border: 'border-pink-200',
        badge: 'bg-pink-100 text-pink-700 border border-pink-200',
        icon: 'bg-pink-100 text-pink-600',
    },
    email: {
        bg: 'bg-amber-100',
        text: 'text-amber-700',
        border: 'border-amber-200',
        badge: 'bg-amber-100 text-amber-700 border border-amber-200',
        icon: 'bg-amber-100 text-amber-600',
    },
    message: {
        bg: 'bg-green-100',
        text: 'text-green-700',
        border: 'border-green-200',
        badge: 'bg-green-100 text-green-700 border border-green-200',
        icon: 'bg-green-100 text-green-600',
    },
    appstore: {
        bg: 'bg-indigo-100',
        text: 'text-indigo-700',
        border: 'border-indigo-200',
        badge: 'bg-indigo-100 text-indigo-700 border border-indigo-200',
        icon: 'bg-indigo-100 text-indigo-600',
    },
} as const;

export type TemplateType = keyof typeof TEMPLATE_COLORS;

export function getTemplateColors(type: string) {
    const normalizedType = type.toLowerCase();
    return TEMPLATE_COLORS[normalizedType as TemplateType] || TEMPLATE_COLORS.text;
}
