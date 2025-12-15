import { Utensils, Contact, Link, Wifi, FileText, File, Calendar, Mail, MessageSquare, Smartphone, Share2 } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { motion } from 'framer-motion';

const TEMPLATES = [
    { id: 'menu', label: 'Menu', desc: 'Full digital menu for restaurants', icon: Utensils, color: 'bg-orange-100 text-orange-600', hoverColor: 'group-hover:text-orange-600', available: true },
    { id: 'vcard', label: 'vCard', desc: 'Digital business card & contacts', icon: Contact, color: 'bg-blue-100 text-blue-600', hoverColor: 'group-hover:text-blue-600', available: true },
    { id: 'url', label: 'Website', desc: 'Link to any website URL', icon: Link, color: 'bg-emerald-100 text-emerald-600', hoverColor: 'group-hover:text-emerald-600', available: true },
    { id: 'wifi', label: 'Wi-Fi', desc: 'Connect to Wi-Fi network', icon: Wifi, color: 'bg-cyan-100 text-cyan-600', hoverColor: 'group-hover:text-cyan-600', available: true },
    { id: 'file', label: 'File', desc: 'Share any file type easily', icon: File, color: 'bg-slate-100 text-slate-600', hoverColor: 'group-hover:text-slate-600', available: true },
    { id: 'text', label: 'Text', desc: 'Display plain text message', icon: FileText, color: 'bg-purple-100 text-purple-600', hoverColor: 'group-hover:text-purple-600', available: true },
    { id: 'event', label: 'Event', desc: 'Add event to calendar instantly', icon: Calendar, color: 'bg-pink-100 text-pink-600', hoverColor: 'group-hover:text-pink-600', available: true },
    { id: 'email', label: 'Email', desc: 'Send pre-filled email message', icon: Mail, color: 'bg-amber-100 text-amber-600', hoverColor: 'group-hover:text-amber-600', available: true },
    { id: 'message', label: 'Message', desc: 'Send via SMS, WhatsApp, or Telegram', icon: MessageSquare, color: 'bg-green-100 text-green-600', hoverColor: 'group-hover:text-green-600', available: true },
    { id: 'appstore', label: 'App Store', desc: 'Link to Google Play, iOS, or Amazon', icon: Smartphone, color: 'bg-indigo-100 text-indigo-600', hoverColor: 'group-hover:text-indigo-600', available: true },
    { id: 'socialmedia', label: 'Social Media', desc: 'Create a link-in-bio page', icon: Share2, color: 'bg-rose-100 text-rose-600', hoverColor: 'group-hover:text-rose-600', available: true },
];

export function Step1Templates({ onTemplateHover }: { onTemplateHover?: (templateId: string | null) => void }) {
    const router = useRouter();

    const handleSelect = (id: string, available: boolean) => {
        if (available) {
            router.push(`/create/${id}`);
        }
    };

    const handleMouseEnter = (id: string) => {
        onTemplateHover?.(id);
    };

    const handleMouseLeave = () => {
        onTemplateHover?.(null);
    };

    return (
        <div className="space-y-6 sm:space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
            <div>
                <h3 className="text-xl sm:text-2xl font-bold text-slate-900">Choose your QR Code type</h3>
                <p className="text-sm sm:text-base text-slate-500 mt-1">Select a template to get started with your design.</p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
                {TEMPLATES.map((t, idx) => (
                    <motion.button
                        key={t.id}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: idx * 0.05 }}
                        onClick={() => handleSelect(t.id, t.available)}
                        onMouseEnter={() => handleMouseEnter(t.id)}
                        onMouseLeave={handleMouseLeave}
                        disabled={!t.available}
                        className={`group relative p-4 sm:p-6 rounded-2xl bg-white border border-gray-200 shadow-sm transition-all text-left flex items-center gap-3 sm:gap-5 overflow-hidden min-h-[80px] sm:min-h-[100px] ${t.available
                            ? 'hover:shadow-lg hover:border-gray-300 cursor-pointer active:scale-[0.98]'
                            : 'opacity-60 cursor-not-allowed'
                            }`}
                    >
                        <div className={`p-3 sm:p-4 rounded-xl ${t.color} ${t.available ? 'group-hover:scale-110' : ''} transition-transform duration-300 flex-shrink-0`}>
                            <t.icon className="w-6 h-6 sm:w-7 sm:h-7" />
                        </div>

                        <div className="flex-1 min-w-0">
                            <div className="flex items-center gap-2 flex-wrap">
                                <div className={`font-bold text-base sm:text-lg text-slate-900 ${t.available ? t.hoverColor : ''} transition-colors`}>
                                    {t.label}
                                </div>
                                {!t.available && (
                                    <span className="px-2 py-0.5 text-xs font-semibold rounded-full bg-gradient-to-r from-amber-100 to-orange-100 text-amber-700 border border-amber-200">
                                        Coming Soon
                                    </span>
                                )}
                            </div>
                            <p className="text-xs sm:text-sm text-slate-500 mt-0.5 sm:mt-1 line-clamp-1">{t.desc}</p>
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
