'use client';

import Link from 'next/link';
import { QrCode, Sparkles } from 'lucide-react';
import { usePathname } from 'next/navigation';

export function Navbar() {
    const pathname = usePathname();

    return (
        <nav className="fixed top-0 w-full z-50 px-6 py-4 pointer-events-none">
            <div className="max-w-7xl mx-auto flex items-center justify-between pointer-events-auto">
                {/* Logo */}
                <Link href="/" className="flex items-center gap-2 group">
                    <div className="bg-slate-900 text-white p-2 rounded-xl group-hover:scale-110 transition-transform">
                        <QrCode className="w-5 h-5" />
                    </div>
                    <span className="font-bold text-xl tracking-tight text-slate-900">
                        QR <span className="text-blue-600">Studio</span>
                    </span>
                </Link>

                {/* Navigation */}
                <div className="hidden md:flex items-center gap-1 bg-white/80 backdrop-blur-md px-2 py-1.5 rounded-full border border-gray-200 shadow-sm">
                    {[
                        { href: '/create', label: 'Creator' },
                        { href: '/templates', label: 'Templates' },
                        { href: '/my-qrs', label: 'My QRs' },
                    ].map((link) => (
                        <Link
                            key={link.href}
                            href={link.href}
                            className={`px-4 py-2 rounded-full text-sm font-medium transition-all ${pathname === link.href
                                    ? 'bg-slate-900 text-white shadow-md'
                                    : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
                                }`}
                        >
                            {link.label}
                        </Link>
                    ))}
                </div>

                {/* CTA */}
                <div className="flex items-center gap-4">
                    <button className="text-sm font-semibold text-slate-600 hover:text-slate-900">
                        Sign In
                    </button>
                    <button className="flex items-center gap-2 bg-gradient-to-r from-blue-600 to-violet-600 text-white px-5 py-2.5 rounded-full font-medium hover:shadow-lg hover:shadow-blue-500/25 transition-all text-sm">
                        <Sparkles className="w-4 h-4" />
                        <span>Upgrade Pro</span>
                    </button>
                </div>
            </div>
        </nav>
    );
}
