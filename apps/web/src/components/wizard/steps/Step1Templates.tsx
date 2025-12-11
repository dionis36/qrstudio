import { Utensils, Contact, Link, Wifi, FileText, File } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { motion } from 'framer-motion';

const TEMPLATES = [
    { id: 'menu', label: 'Menu', desc: 'Full digital menu for restaurants', icon: Utensils, color: 'bg-orange-100 text-orange-600' },
    { id: 'vcard', label: 'vCard', desc: 'Digital business card & contacts', icon: Contact, color: 'bg-blue-100 text-blue-600' },
    { id: 'url', label: 'Website', desc: 'Link to any website URL', icon: Link, color: 'bg-emerald-100 text-emerald-600' },
    { id: 'wifi', label: 'Wi-Fi', desc: 'Connect to Wi-Fi network', icon: Wifi, color: 'bg-indigo-100 text-indigo-600' },
    { id: 'pdf', label: 'PDF', desc: 'Share PDF files easily', icon: File, color: 'bg-red-100 text-red-600' },
    { id: 'text', label: 'Text', desc: 'Display plain text message', icon: FileText, color: 'bg-slate-100 text-slate-600' },
];

export function Step1Templates() {
    const router = useRouter();

    const handleSelect = (id: string) => {
        router.push(`/create/${id}`);
    };

    return (
        <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
            <div>
                <h3 className="text-2xl font-bold text-slate-900">Choose your QR Code type</h3>
                <p className="text-slate-500 mt-1">Select a template to get started with your design.</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {TEMPLATES.map((t, idx) => (
                    <motion.button
                        key={t.id}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: idx * 0.05 }}
                        onClick={() => handleSelect(t.id)}
                        className="group relative p-6 rounded-2xl bg-white border border-gray-200 shadow-sm hover:shadow-xl hover:border-blue-500/30 transition-all text-left flex items-center gap-5 overflow-hidden"
                    >
                        <div className={`p-4 rounded-xl ${t.color} group-hover:scale-110 transition-transform duration-300 flex-shrink-0`}>
                            <t.icon className="w-7 h-7" />
                        </div>

                        <div className="flex-1 min-w-0">
                            <div className="font-bold text-lg text-slate-900 group-hover:text-blue-600 transition-colors">{t.label}</div>
                            <p className="text-sm text-slate-500 mt-1">{t.desc}</p>
                        </div>

                        {/* Hover Gradient Effect */}
                        <div className="absolute inset-0 bg-gradient-to-r from-blue-50/0 to-blue-50/30 opacity-0 group-hover:opacity-100 pointer-events-none transition-opacity" />
                    </motion.button>
                ))}
            </div>
        </div>
    );
}
