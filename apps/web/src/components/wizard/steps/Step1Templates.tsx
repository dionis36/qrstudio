import { Utensils, Contact, Link, Wifi, FileText, File, Calendar, Mail, MessageSquare, Smartphone, Share2 } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { motion } from 'framer-motion';

const TEMPLATES = [
    { id: 'menu', label: 'Menu', desc: 'Full digital menu for restaurants', icon: Utensils, color: 'bg-orange-100 text-orange-600', available: true },
    { id: 'vcard', label: 'vCard', desc: 'Digital business card & contacts', icon: Contact, color: 'bg-blue-100 text-blue-600', available: true },
    { id: 'url', label: 'Website', desc: 'Link to any website URL', icon: Link, color: 'bg-emerald-100 text-emerald-600', available: true },
    { id: 'wifi', label: 'Wi-Fi', desc: 'Connect to Wi-Fi network', icon: Wifi, color: 'bg-cyan-100 text-cyan-600', available: true },
    { id: 'file', label: 'File', desc: 'Share any file type easily', icon: File, color: 'bg-slate-100 text-slate-600', available: true },
    { id: 'text', label: 'Text', desc: 'Display plain text message', icon: FileText, color: 'bg-purple-100 text-purple-600', available: true },
    { id: 'event', label: 'Event', desc: 'Add event to calendar instantly', icon: Calendar, color: 'bg-pink-100 text-pink-600', available: true },
    { id: 'email', label: 'Email', desc: 'Send pre-filled email message', icon: Mail, color: 'bg-amber-100 text-amber-600', available: true },
    { id: 'sms', label: 'SMS', desc: 'Send instant text message', icon: MessageSquare, color: 'bg-green-100 text-green-600', available: false },
    { id: 'app', label: 'App Store', desc: 'Direct link to app download', icon: Smartphone, color: 'bg-indigo-100 text-indigo-600', available: false },
    { id: 'social', label: 'Social Media', desc: 'Link to social media profile', icon: Share2, color: 'bg-rose-100 text-rose-600', available: false },
];

export function Step1Templates() {
    const router = useRouter();

    const handleSelect = (id: string, available: boolean) => {
        if (available) {
            router.push(`/create/${id}`);
        }
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
                        onClick={() => handleSelect(t.id, t.available)}
                        disabled={!t.available}
                        className={`group relative p-6 rounded-2xl bg-white border border-gray-200 shadow-sm transition-all text-left flex items-center gap-5 overflow-hidden ${t.available
                            ? 'hover:shadow-xl hover:border-blue-500/30 cursor-pointer'
                            : 'opacity-60 cursor-not-allowed'
                            }`}
                    >
                        <div className={`p-4 rounded-xl ${t.color} ${t.available ? 'group-hover:scale-110' : ''} transition-transform duration-300 flex-shrink-0`}>
                            <t.icon className="w-7 h-7" />
                        </div>

                        <div className="flex-1 min-w-0">
                            <div className="flex items-center gap-2">
                                <div className={`font-bold text-lg text-slate-900 ${t.available ? 'group-hover:text-blue-600' : ''} transition-colors`}>
                                    {t.label}
                                </div>
                                {!t.available && (
                                    <span className="px-2 py-0.5 text-xs font-semibold rounded-full bg-gradient-to-r from-amber-100 to-orange-100 text-amber-700 border border-amber-200">
                                        Coming Soon
                                    </span>
                                )}
                            </div>
                            <p className="text-sm text-slate-500 mt-1">{t.desc}</p>
                        </div>

                        {/* Hover Gradient Effect - only for available templates */}
                        {t.available && (
                            <div className="absolute inset-0 bg-gradient-to-r from-blue-50/0 to-blue-50/30 opacity-0 group-hover:opacity-100 pointer-events-none transition-opacity" />
                        )}
                    </motion.button>
                ))}
            </div>
        </div>
    );
}
