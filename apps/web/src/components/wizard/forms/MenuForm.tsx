import { useForm, useFieldArray, Control } from 'react-hook-form';
import { useWizardStore } from '../store';
import { useEffect, useState } from 'react';
import { Plus, Trash2, GripVertical, ChevronDown, Palette, Info, UtensilsCrossed, Image, CheckCircle2, XCircle } from 'lucide-react';
import { ImageUpload } from '@/components/common/ImageUpload';

// We replicate the schema types locally for the form
// In a real app we'd share the DTOs from a shared package
type FormValues = {
    restaurant_info: {
        name: string;
        description: string;
        website?: string;
        phone?: string;
        logo?: string;
        cover_image?: string;
    };
    content: {
        categories: {
            id: string;
            name: string;
            items: {
                id: string;
                name: string;
                description: string;
                price: number;
                currency: 'USD' | 'TSH';
                available: boolean;
            }[];
        }[];
    };
    styles: {
        primary_color: string;
        secondary_color?: string;
    };
    welcome_screen?: {
        logo?: string;
        animation?: 'spinner' | 'fade' | 'pulse';
        background_color?: string;
    };
};

// Accordion Section Component
function AccordionSection({
    title,
    subtitle,
    icon: Icon,
    color,
    isOpen,
    onToggle,
    children
}: {
    title: string;
    subtitle: string;
    icon: any;
    color: string;
    isOpen: boolean;
    onToggle: () => void;
    children: React.ReactNode;
}) {
    return (
        <div className="bg-white border border-slate-200 rounded-2xl overflow-hidden shadow-sm hover:shadow-md transition-shadow">
            {/* Header */}
            <button
                type="button"
                onClick={onToggle}
                className="w-full px-6 py-5 flex items-center justify-between hover:bg-slate-50 transition-colors"
            >
                <div className="flex items-center gap-4">
                    <div className={`p-4 rounded-xl ${color} flex items-center justify-center flex-shrink-0`}>
                        <Icon className="w-7 h-7" />
                    </div>
                    <div className="text-left">
                        <h3 className="text-base font-bold text-slate-900">{title}</h3>
                        <p className="text-sm text-slate-500">{subtitle}</p>
                    </div>
                </div>
                <ChevronDown
                    className={`w-5 h-5 text-slate-400 transition-transform duration-300 ${isOpen ? 'rotate-180' : ''}`}
                />
            </button>

            {/* Content */}
            <div
                className={`overflow-hidden transition-all duration-300 ease-in-out ${isOpen ? 'max-h-[2000px] opacity-100' : 'max-h-0 opacity-0'
                    }`}
            >
                <div className="px-6 pb-6 pt-2 border-t border-slate-100">
                    {children}
                </div>
            </div>
        </div>
    );
}

export function MenuForm() {
    const { payload, updatePayload } = useWizardStore();
    const [openSections, setOpenSections] = useState({
        design: true,  // First section auto-opened
        restaurant: false,
        menu: false,
        welcome: false
    });

    const { register, control, watch, setValue } = useForm<FormValues>({
        defaultValues: {
            restaurant_info: payload.restaurant_info || { name: '', description: '', website: '', phone: '', logo: '', cover_image: '' },
            content: payload.content || { categories: [{ id: 'c1', name: 'Popular', items: [{ id: 'i1', name: 'Signature Burger', description: 'Wagyu beef', price: 18, currency: 'USD', available: true }] }] },
            styles: payload.styles || { primary_color: '#f97316' },
            welcome_screen: payload.welcome_screen || { logo: '', animation: 'spinner', background_color: '#ffffff' }
        },
        mode: 'onChange'
    });

    // Watch for changes and update global store
    useEffect(() => {
        const subscription = watch((value) => {
            updatePayload(value as any);
        });
        return () => subscription.unsubscribe();
    }, [watch, updatePayload]);

    const { fields: categories, append: addCategory, remove: removeCategory } = useFieldArray({
        control,
        name: "content.categories"
    });

    const toggleSection = (section: keyof typeof openSections) => {
        setOpenSections(prev => ({ ...prev, [section]: !prev[section] }));
    };

    return (
        <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
            {/* Heading Section - matches create page */}
            <div>
                <h3 className="text-2xl font-bold text-slate-900">Add content to the Menu QR code</h3>
                <p className="text-slate-500 mt-1">Customize your menu with colors, restaurant details, and menu items.</p>
            </div>

            {/* Accordion Sections */}
            <div className="space-y-4">
                {/* Design and Customize Section */}
                <AccordionSection
                    title="Design and customize"
                    subtitle="Choose your color scheme"
                    icon={Palette}
                    color="bg-purple-100 text-purple-600"
                    isOpen={openSections.design}
                    onToggle={() => toggleSection('design')}
                >
                    <div className="space-y-6 mt-4">
                        {/* Color Palette Presets */}
                        <div className="flex gap-2 overflow-x-auto pb-2">
                            {[
                                { primary: '#2563EB', secondary: '#F8FAFC', name: 'Modern Blue' },
                                { primary: '#1F2937', secondary: '#F3F4F6', name: 'Elegant Black' },
                                { primary: '#059669', secondary: '#ECFDF5', name: 'Fresh Green' },
                                { primary: '#DC2626', secondary: '#FEF2F2', name: 'Bold Red' },
                                { primary: '#7C3AED', secondary: '#FAF5FF', name: 'Royal Purple' },
                                { primary: '#EA580C', secondary: '#FFF7ED', name: 'Warm Orange' },
                                { primary: '#0891B2', secondary: '#F0FDFA', name: 'Ocean Teal' },
                                { primary: '#BE123C', secondary: '#FFF1F2', name: 'Wine Red' },
                            ].map((palette, idx) => (
                                <button
                                    key={idx}
                                    type="button"
                                    onClick={() => {
                                        setValue('styles.primary_color', palette.primary);
                                        setValue('styles.secondary_color', palette.secondary);
                                    }}
                                    className="h-10 w-16 flex-shrink-0 rounded-lg border-2 border-slate-200 hover:border-blue-400 transition-all hover:scale-105 shadow-sm overflow-hidden"
                                    style={{ background: `linear-gradient(to right, ${palette.primary} 50%, ${palette.secondary} 50%)` }}
                                    title={palette.name}
                                />
                            ))}
                        </div>

                        {/* Custom Colors */}
                        <div className="grid grid-cols-2 gap-4">
                            <div>
                                <label className="block text-sm font-semibold text-slate-700 mb-2">Primary color</label>
                                <div className="flex items-center gap-3">
                                    <input
                                        {...register('styles.primary_color')}
                                        type="color"
                                        className="w-12 h-12 rounded-lg border-2 border-slate-200 cursor-pointer"
                                    />
                                    <input
                                        {...register('styles.primary_color')}
                                        type="text"
                                        className="flex-1 px-4 py-2.5 rounded-lg border border-slate-300 focus:ring-2 focus:ring-blue-500 outline-none font-mono text-sm"
                                        placeholder="#232321"
                                    />
                                </div>
                            </div>
                            <div>
                                <label className="block text-sm font-semibold text-slate-700 mb-2">Secondary color</label>
                                <div className="flex items-center gap-3">
                                    <input
                                        {...register('styles.secondary_color')}
                                        type="color"
                                        className="w-12 h-12 rounded-lg border-2 border-slate-200 cursor-pointer"
                                    />
                                    <input
                                        {...register('styles.secondary_color')}
                                        type="text"
                                        defaultValue="#ECEDF1"
                                        className="flex-1 px-4 py-2.5 rounded-lg border border-slate-300 focus:ring-2 focus:ring-blue-500 outline-none font-mono text-sm"
                                        placeholder="#ECEDF1"
                                    />
                                </div>
                            </div>
                        </div>
                    </div>
                </AccordionSection>

                {/* Restaurant Information Section */}
                <AccordionSection
                    title="Restaurant information"
                    subtitle="Provide details about your restaurant"
                    icon={Info}
                    color="bg-blue-100 text-blue-600"
                    isOpen={openSections.restaurant}
                    onToggle={() => toggleSection('restaurant')}
                >
                    <div className="space-y-4 mt-4">
                        <div>
                            <label className="block text-sm font-semibold text-slate-700 mb-2">Restaurant Name</label>
                            <input
                                {...register('restaurant_info.name')}
                                className="w-full px-4 py-2.5 rounded-lg border border-slate-300 focus:ring-2 focus:ring-blue-500 outline-none"
                                placeholder="e.g. The Burger Joint"
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-semibold text-slate-700 mb-2">Description</label>
                            <textarea
                                {...register('restaurant_info.description')}
                                rows={3}
                                className="w-full px-4 py-2.5 rounded-lg border border-slate-300 focus:ring-2 focus:ring-blue-500 outline-none resize-none"
                                placeholder="Short tagline or description..."
                            />
                        </div>

                        {/* Image Uploads */}
                        <div className="grid grid-cols-2 gap-4">
                            <ImageUpload
                                label="Restaurant Logo"
                                value={watch('restaurant_info.logo')}
                                onChange={(base64) => setValue('restaurant_info.logo', base64 || '')}
                                maxSizeMB={2}
                                aspectRatio="1/1"
                            />
                            <ImageUpload
                                label="Cover Image"
                                value={watch('restaurant_info.cover_image')}
                                onChange={(base64) => setValue('restaurant_info.cover_image', base64 || '')}
                                maxSizeMB={3}
                                aspectRatio="16/9"
                            />
                        </div>

                        <div className="grid grid-cols-2 gap-4">
                            <div>
                                <label className="block text-sm font-semibold text-slate-700 mb-2">Website</label>
                                <input
                                    {...register('restaurant_info.website')}
                                    className="w-full px-4 py-2.5 rounded-lg border border-slate-300 focus:ring-2 focus:ring-blue-500 outline-none"
                                    placeholder="https://..."
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-semibold text-slate-700 mb-2">Phone</label>
                                <input
                                    {...register('restaurant_info.phone')}
                                    className="w-full px-4 py-2.5 rounded-lg border border-slate-300 focus:ring-2 focus:ring-blue-500 outline-none"
                                    placeholder="+1 (555) 000-0000"
                                />
                            </div>
                        </div>
                    </div>
                </AccordionSection>

                {/* Menu Section */}
                <AccordionSection
                    title="Menu"
                    subtitle="Input your menu"
                    icon={UtensilsCrossed}
                    color="bg-orange-100 text-orange-600"
                    isOpen={openSections.menu}
                    onToggle={() => toggleSection('menu')}
                >
                    <div className="mt-4">
                        <div className="flex items-center justify-between mb-4">
                            <h4 className="text-sm font-bold text-slate-700">Menu Categories</h4>
                            <button
                                type="button"
                                onClick={() => addCategory({ id: crypto.randomUUID(), name: 'New Category', items: [] })}
                                className="text-xs font-bold flex items-center gap-1.5 bg-slate-900 text-white px-4 py-2 rounded-lg hover:bg-slate-700 transition-colors shadow-sm"
                            >
                                <Plus className="w-3.5 h-3.5" /> Add Category
                            </button>
                        </div>

                        <div className="space-y-4">
                            {categories.map((category, index) => (
                                <CategoryItem
                                    key={category.id}
                                    control={control}
                                    index={index}
                                    register={register}
                                    remove={() => removeCategory(index)}
                                />
                            ))}
                        </div>
                    </div>
                </AccordionSection>

                {/* Welcome Screen Section */}
                <AccordionSection
                    title="Welcome screen"
                    subtitle="Display a custom logo while your page is loading"
                    icon={Image}
                    color="bg-emerald-100 text-emerald-600"
                    isOpen={openSections.welcome}
                    onToggle={() => toggleSection('welcome')}
                >
                    <div className="space-y-4 mt-4">
                        <ImageUpload
                            label="Welcome Screen Logo"
                            value={watch('welcome_screen.logo')}
                            onChange={(base64) => setValue('welcome_screen.logo', base64 || '')}
                            maxSizeMB={1}
                            aspectRatio="1/1"
                        />

                        <div>
                            <label className="block text-sm font-semibold text-slate-700 mb-2">Loading Animation</label>
                            <select
                                {...register('welcome_screen.animation')}
                                className="w-full px-4 py-2.5 rounded-lg border border-slate-300 focus:ring-2 focus:ring-blue-500 outline-none"
                            >
                                <option value="spinner">Spinner</option>
                                <option value="fade">Fade</option>
                                <option value="pulse">Pulse</option>
                            </select>
                        </div>

                        <div>
                            <label className="block text-sm font-semibold text-slate-700 mb-2">Background Color</label>
                            <div className="flex items-center gap-3">
                                <input
                                    {...register('welcome_screen.background_color')}
                                    type="color"
                                    className="w-12 h-12 rounded-lg border-2 border-slate-200 cursor-pointer"
                                />
                                <input
                                    {...register('welcome_screen.background_color')}
                                    type="text"
                                    className="flex-1 px-4 py-2.5 rounded-lg border border-slate-300 focus:ring-2 focus:ring-blue-500 outline-none font-mono text-sm"
                                    placeholder="#ffffff"
                                />
                            </div>
                        </div>
                    </div>
                </AccordionSection>
            </div>
        </div>
    );
}

// Sub-component for individual categories to manage their own items
function CategoryItem({ control, index, register, remove }: { control: Control<FormValues>, index: number, register: any, remove: () => void }) {
    const { fields: items, append: addItem, remove: removeItem } = useFieldArray({
        control,
        name: `content.categories.${index}.items`
    });

    return (
        <div className="bg-slate-50 border border-slate-200 rounded-xl overflow-hidden">
            {/* Category Header */}
            <div className="bg-white p-3 flex items-center gap-3 border-b border-slate-200">
                <GripVertical className="w-4 h-4 text-slate-400 cursor-move" />
                <div className="flex-1">
                    <input
                        {...register(`content.categories.${index}.name`)}
                        className="bg-transparent font-bold text-slate-900 placeholder-slate-400 focus:outline-none w-full"
                        placeholder="Category Name (e.g. Starters)"
                    />
                </div>
                <button type="button" onClick={remove} className="text-slate-400 hover:text-red-500 p-1 transition-colors">
                    <Trash2 className="w-4 h-4" />
                </button>
            </div>

            {/* Items List */}
            <div className="p-3 space-y-2">
                {items.map((item, itemIndex) => (
                    <div key={item.id} className="flex gap-3 items-start p-3 rounded-lg bg-white border border-slate-200 hover:border-blue-300 group transition-colors">
                        <div className="flex-1 space-y-3">
                            {/* Item Name and Price Row */}
                            <div className="flex gap-2 items-start">
                                <input
                                    {...register(`content.categories.${index}.items.${itemIndex}.name`)}
                                    className="flex-1 text-sm font-semibold border-b border-transparent focus:border-blue-400 focus:outline-none px-1 py-1"
                                    placeholder="Item Name"
                                />
                                <div className="flex items-center gap-1">
                                    <select
                                        {...register(`content.categories.${index}.items.${itemIndex}.currency`)}
                                        className="text-xs font-semibold text-slate-600 bg-transparent border-b border-transparent focus:border-blue-400 focus:outline-none py-1 pr-1"
                                    >
                                        <option value="USD">$</option>
                                        <option value="TSH">TSh</option>
                                    </select>
                                    <input
                                        type="number"
                                        step="0.01"
                                        {...register(`content.categories.${index}.items.${itemIndex}.price`, { valueAsNumber: true })}
                                        className="w-20 text-right font-mono text-sm border-b border-transparent focus:border-blue-400 focus:outline-none py-1"
                                        placeholder="0.00"
                                    />
                                </div>
                            </div>

                            {/* Description */}
                            <textarea
                                {...register(`content.categories.${index}.items.${itemIndex}.description`)}
                                rows={1}
                                className="w-full text-xs text-slate-500 bg-transparent resize-none border-b border-transparent focus:border-blue-400 focus:outline-none px-1 py-1"
                                placeholder="Description, ingredients..."
                            />

                            {/* Availability Toggle */}
                            <label className="flex items-center gap-2 cursor-pointer">
                                <input
                                    type="checkbox"
                                    {...register(`content.categories.${index}.items.${itemIndex}.available`)}
                                    className="sr-only peer"
                                />
                                <div className="relative w-9 h-5 bg-slate-200 peer-focus:outline-none peer-focus:ring-2 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-slate-300 after:border after:rounded-full after:h-4 after:w-4 after:transition-all peer-checked:bg-green-500"></div>
                                <span className="text-xs font-medium text-slate-600 flex items-center gap-1">
                                    <CheckCircle2 className="w-3 h-3 text-green-600" />
                                    Available
                                </span>
                            </label>
                        </div>
                        <button type="button" onClick={() => removeItem(itemIndex)} className="text-slate-300 hover:text-red-500 opacity-0 group-hover:opacity-100 transition-opacity">
                            <Trash2 className="w-3.5 h-3.5" />
                        </button>
                    </div>
                ))}

                <button
                    type="button"
                    onClick={() => addItem({ id: crypto.randomUUID(), name: '', description: '', price: 0, currency: 'USD', available: true })}
                    className="w-full py-2.5 border-2 border-dashed border-slate-300 rounded-lg text-xs font-semibold text-slate-500 hover:bg-white hover:text-blue-600 hover:border-blue-400 transition-colors flex items-center justify-center gap-1.5"
                >
                    <Plus className="w-3.5 h-3.5" /> Add Item
                </button>
            </div>
        </div>
    );
}
