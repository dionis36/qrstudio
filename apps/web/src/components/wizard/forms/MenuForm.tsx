import { useForm, useFieldArray, Control, useWatch } from 'react-hook-form';
import { useWizardStore } from '../store';
import { useEffect } from 'react';
import { Plus, Trash2, GripVertical, ChevronDown, ChevronUp } from 'lucide-react';
import { z } from 'zod'; // We'll just use the types mostly

// We replicate the schema types locally for the form
// In a real app we'd share the DTOs from a shared package
type FormValues = {
    restaurant_info: {
        name: string;
        description: string;
        website?: string;
        phone?: string;
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
            }[];
        }[];
    };
    styles: {
        primary_color: string;
    };
};

export function MenuForm() {
    const { payload, updatePayload } = useWizardStore();

    const { register, control, watch, handleSubmit } = useForm<FormValues>({
        defaultValues: {
            restaurant_info: payload.restaurant_info || { name: '', description: '', website: '', phone: '' },
            content: payload.content || { categories: [{ id: 'c1', name: 'Popular', items: [{ id: 'i1', name: 'Signature Burger', description: 'Wagyu beef', price: 18 }] }] },
            styles: payload.styles || { primary_color: '#f97316' }
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

    return (
        <div className="space-y-8 pb-10">
            {/* Restaurant Info Section */}
            <div className="bg-slate-50 p-5 rounded-2xl border border-slate-200">
                <h4 className="text-sm font-bold uppercase tracking-wider text-slate-500 mb-4">Restaurant Details</h4>
                <div className="space-y-4">
                    <div>
                        <label className="block text-sm font-medium text-slate-700 mb-1">Restaurant Name</label>
                        <input {...register('restaurant_info.name')} className="w-full px-4 py-2 rounded-lg border border-slate-300 focus:ring-2 focus:ring-blue-500 outline-none" placeholder="e.g. The Burger Joint" />
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-slate-700 mb-1">Description</label>
                        <textarea {...register('restaurant_info.description')} rows={2} className="w-full px-4 py-2 rounded-lg border border-slate-300 focus:ring-2 focus:ring-blue-500 outline-none" placeholder="Short tagline..." />
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                        <div>
                            <label className="block text-sm font-medium text-slate-700 mb-1">Website</label>
                            <input {...register('restaurant_info.website')} className="w-full px-4 py-2 rounded-lg border border-slate-300 focus:ring-2 focus:ring-blue-500 outline-none" placeholder="https://..." />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-slate-700 mb-1">Phone</label>
                            <input {...register('restaurant_info.phone')} className="w-full px-4 py-2 rounded-lg border border-slate-300 focus:ring-2 focus:ring-blue-500 outline-none" placeholder="+1..." />
                        </div>
                    </div>
                </div>
            </div>

            {/* Menu Builder Section */}
            <div>
                <div className="flex items-center justify-between mb-4">
                    <h4 className="text-sm font-bold uppercase tracking-wider text-slate-500">Menu Categories</h4>
                    <button
                        type="button"
                        onClick={() => addCategory({ id: crypto.randomUUID(), name: 'New Category', items: [] })}
                        className="text-xs font-bold flex items-center gap-1 bg-slate-900 text-white px-3 py-1.5 rounded-full hover:bg-slate-700 transition-colors"
                    >
                        <Plus className="w-3 h-3" /> Add Category
                    </button>
                </div>

                <div className="space-y-6">
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
        <div className="bg-white border text-left border-gray-200 rounded-xl shadow-sm overflow-hidden">
            {/* Category Header */}
            <div className="bg-gray-50 p-3 flex items-center gap-3 border-b border-gray-100">
                <GripVertical className="w-4 h-4 text-gray-400 cursor-move" />
                <div className="flex-1">
                    <input
                        {...register(`content.categories.${index}.name`)}
                        className="bg-transparent font-bold text-gray-900 placeholder-gray-400 focus:outline-none w-full"
                        placeholder="Category Name (e.g. Starters)"
                    />
                </div>
                <button type="button" onClick={remove} className="text-gray-400 hover:text-red-500 p-1">
                    <Trash2 className="w-4 h-4" />
                </button>
            </div>

            {/* Items List */}
            <div className="p-3 bg-white space-y-3">
                {items.map((item, itemIndex) => (
                    <div key={item.id} className="flex gap-3 items-start p-2 rounded-lg border border-gray-100 hover:border-blue-100 group">
                        <div className="flex-1 space-y-2">
                            <div className="flex gap-2">
                                <input
                                    {...register(`content.categories.${index}.items.${itemIndex}.name`)}
                                    className="flex-1 text-sm font-semibold border-b border-transparent focus:border-blue-300 focus:outline-none px-1"
                                    placeholder="Item Name"
                                />
                                <div className="flex items-center text-sm text-gray-500">
                                    $
                                    <input
                                        type="number"
                                        step="0.01"
                                        {...register(`content.categories.${index}.items.${itemIndex}.price`, { valueAsNumber: true })}
                                        className="w-16 text-right font-mono border-b border-transparent focus:border-blue-300 focus:outline-none"
                                        placeholder="0.00"
                                    />
                                </div>
                            </div>
                            <textarea
                                {...register(`content.categories.${index}.items.${itemIndex}.description`)}
                                rows={1}
                                className="w-full text-xs text-gray-500 bg-transparent resize-none border-b border-transparent focus:border-blue-300 focus:outline-none px-1"
                                placeholder="Description ingredients..."
                            />
                        </div>
                        <button type="button" onClick={() => removeItem(itemIndex)} className="text-gray-300 hover:text-red-500 opacity-0 group-hover:opacity-100 transition-opacity">
                            <Trash2 className="w-3 h-3" />
                        </button>
                    </div>
                ))}

                <button
                    type="button"
                    onClick={() => addItem({ id: crypto.randomUUID(), name: '', description: '', price: 0 })}
                    className="w-full py-2 border border-dashed border-gray-300 rounded-lg text-xs font-semibold text-gray-500 hover:bg-gray-50 hover:text-blue-600 hover:border-blue-300 transition-colors flex items-center justify-center gap-1"
                >
                    <Plus className="w-3 h-3" /> Add Item
                </button>
            </div>
        </div>
    );
}
