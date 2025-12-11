import { Phone, Mail, Globe, MapPin, Share2, UserPlus } from 'lucide-react';

interface VCardData {
    firstName?: string;
    lastName?: string;
    jobTitle?: string;
    company?: string;
    email?: string;
    phone?: string;
    website?: string;
}

export function VCardPreview({ data }: { data: VCardData }) {
    const { firstName, lastName, jobTitle, company, email, phone, website } = data;
    const fullName = [firstName, lastName].filter(Boolean).join(' ') || 'John Doe';

    return (
        <div className="flex flex-col min-h-full font-sans bg-gray-50">

            {/* Standard vCard Header - Centered Layout */}
            <div className="relative pt-10 px-6 pb-6 bg-white shadow-sm flex flex-col items-center text-center">
                {/* Cover BG */}
                <div className="absolute top-0 left-0 w-full h-24 bg-gradient-to-r from-blue-600 to-indigo-600" />

                {/* Avatar */}
                <div className="w-24 h-24 rounded-full border-4 border-white shadow-md bg-gray-200 z-10 overflow-hidden relative">
                    <img src={`https://ui-avatars.com/api/?name=${fullName}&background=random`} alt="Profile" className="w-full h-full object-cover" />
                </div>

                <div className="mt-3">
                    <h2 className="text-xl font-bold text-gray-900">{fullName}</h2>
                    <p className="text-sm text-blue-600 font-medium">{jobTitle || 'Product Designer'}</p>
                    <p className="text-xs text-gray-500 mt-0.5">{company || 'Creative Studio Inc.'}</p>
                </div>

                {/* Call to Actions */}
                <div className="flex gap-3 mt-6 w-full">
                    <button className="flex-1 bg-gray-900 text-white py-2.5 rounded-xl text-xs font-bold shadow-lg shadow-gray-200 flex items-center justify-center gap-2">
                        <UserPlus className="w-3.5 h-3.5" /> Save Contact
                    </button>
                </div>
            </div>

            {/* Info Lists */}
            <div className="p-4 space-y-3">

                {/* Bio Section */}
                <div className="bg-white p-4 rounded-xl shadow-sm">
                    <h3 className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-2">About</h3>
                    <p className="text-xs text-gray-600 leading-relaxed">
                        Passionate professional with over 5 years of experience in the industry. Specialized in digital transformation and user experience.
                    </p>
                </div>

                {/* Contact Section */}
                <div className="bg-white rounded-xl shadow-sm overflow-hidden">
                    {[
                        { icon: Phone, label: 'Mobile', value: phone || '+1 (555) 123-4567', action: 'tel:' },
                        { icon: Mail, label: 'Email', value: email || 'hello@example.com', action: 'mailto:' },
                        { icon: Globe, label: 'Website', value: website || 'www.example.com', action: 'https://' },
                        { icon: MapPin, label: 'Office', value: 'San Francisco, CA', action: '' },
                    ].map((item, i) => (
                        <div key={i} className="flex items-center gap-4 p-3.5 border-b border-gray-50 last:border-0 hover:bg-gray-50 transition-colors cursor-pointer">
                            <div className="w-8 h-8 rounded-full bg-blue-50 text-blue-600 flex items-center justify-center shrink-0">
                                <item.icon className="w-4 h-4" />
                            </div>
                            <div className="min-w-0 flex-1">
                                <p className="text-[10px] text-gray-400 font-semibold uppercase">{item.label}</p>
                                <p className="text-sm text-gray-900 font-medium truncate">{item.value}</p>
                            </div>
                        </div>
                    ))}
                </div>

                {/* Socials */}
                <div className="grid grid-cols-4 gap-2 pt-2">
                    {['twitter', 'linkedin', 'instagram', 'github'].map(social => (
                        <button key={social} className="aspect-square bg-white rounded-xl shadow-sm flex items-center justify-center text-gray-400 hover:text-blue-600 hover:shadow-md transition-all">
                            <span className="sr-only">{social}</span>
                            {/* Using generic share icon for demo */}
                            <Share2 className="w-4 h-4" />
                        </button>
                    ))}
                </div>

            </div>

            <div className="mt-8 mb-4 text-center">
                <span className="text-[10px] text-gray-400 font-medium bg-gray-100 px-3 py-1 rounded-full">
                    Generated via QR Studio
                </span>
            </div>

        </div>
    );
}
