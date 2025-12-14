'use client';

import Link from 'next/link';
import { QrCode, Sparkles, Menu, X } from 'lucide-react';
import { usePathname } from 'next/navigation';
import { useState, useEffect } from 'react';

export function Navbar() {
    const pathname = usePathname();
    const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

    // Close mobile menu when route changes
    useEffect(() => {
        setMobileMenuOpen(false);
    }, [pathname]);

    // Prevent body scroll when mobile menu is open
    useEffect(() => {
        if (mobileMenuOpen) {
            document.body.style.overflow = 'hidden';
        } else {
            document.body.style.overflow = 'unset';
        }
        return () => {
            document.body.style.overflow = 'unset';
        };
    }, [mobileMenuOpen]);

    const navLinks = [
        { href: '/create', label: 'Creator' },
        { href: '/dashboard', label: 'Dashboard' },
        { href: '/qrcodes', label: 'My QR Codes' },
    ];

    return (
        <>
            <nav className="fixed top-0 w-full z-50 bg-white/80 backdrop-blur-md border-b border-slate-200 shadow-sm">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="flex items-center justify-between h-16 lg:h-14">
                        {/* Logo */}
                        <Link href="/" className="flex items-center gap-2 group flex-shrink-0">
                            <div className="bg-slate-900 text-white p-2 rounded-xl group-hover:scale-110 transition-transform">
                                <QrCode className="w-5 h-5" />
                            </div>
                            <span className="font-bold text-lg sm:text-xl lg:text-2xl tracking-tight text-slate-900">
                                QR <span className="text-blue-600">Studio</span>
                            </span>
                        </Link>

                        {/* Desktop Navigation */}
                        <div className="hidden lg:flex items-center gap-1 bg-slate-50 px-2 py-1.5 rounded-full border border-slate-200">
                            {navLinks.map((link) => (
                                <Link
                                    key={link.href}
                                    href={link.href}
                                    className={`px-4 py-2 rounded-full text-sm font-medium transition-all ${pathname === link.href || pathname.startsWith(link.href + '/')
                                        ? 'bg-slate-900 text-white shadow-md'
                                        : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
                                        }`}
                                >
                                    {link.label}
                                </Link>
                            ))}
                        </div>

                        {/* Desktop CTA */}
                        <div className="hidden lg:flex items-center gap-4">
                            <button className="text-sm font-semibold text-slate-600 hover:text-slate-900 transition-colors">
                                Sign In
                            </button>
                            <button className="flex items-center gap-2 bg-gradient-to-r from-blue-600 to-violet-600 text-white px-5 py-2.5 rounded-full font-medium hover:shadow-lg hover:shadow-blue-500/25 transition-all text-sm">
                                <Sparkles className="w-4 h-4" />
                                <span>Upgrade Pro</span>
                            </button>
                        </div>

                        {/* Mobile Menu Button */}
                        <button
                            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                            className="lg:hidden p-2 rounded-lg text-slate-600 hover:bg-slate-100 transition-colors"
                            aria-label="Toggle menu"
                        >
                            {mobileMenuOpen ? (
                                <X className="w-6 h-6" />
                            ) : (
                                <Menu className="w-6 h-6" />
                            )}
                        </button>
                    </div>
                </div>
            </nav>

            {/* Mobile Menu Drawer */}
            {mobileMenuOpen && (
                <>
                    {/* Backdrop */}
                    <div
                        className="fixed inset-0 bg-black/50 backdrop-blur-sm z-40 lg:hidden animate-fadeIn"
                        onClick={() => setMobileMenuOpen(false)}
                    />

                    {/* Drawer */}
                    <div className="fixed top-0 right-0 bottom-0 w-full sm:w-80 bg-white z-50 lg:hidden shadow-2xl animate-slideInRight">
                        <div className="flex flex-col h-full">
                            {/* Drawer Header */}
                            <div className="flex items-center justify-between px-6 py-5 border-b border-slate-200">
                                <div className="flex items-center gap-2">
                                    <div className="bg-slate-900 text-white p-2 rounded-xl">
                                        <QrCode className="w-5 h-5" />
                                    </div>
                                    <span className="font-bold text-xl tracking-tight text-slate-900">
                                        QR <span className="text-blue-600">Studio</span>
                                    </span>
                                </div>
                                <button
                                    onClick={() => setMobileMenuOpen(false)}
                                    className="p-2 rounded-lg text-slate-600 hover:bg-slate-100 transition-colors"
                                    aria-label="Close menu"
                                >
                                    <X className="w-6 h-6" />
                                </button>
                            </div>

                            {/* Navigation Links */}
                            <div className="flex-1 overflow-y-auto px-4 py-6">
                                <nav className="space-y-2">
                                    {navLinks.map((link) => (
                                        <Link
                                            key={link.href}
                                            href={link.href}
                                            className={`flex items-center px-4 py-3 rounded-xl text-base font-medium transition-all ${pathname === link.href || pathname.startsWith(link.href + '/')
                                                ? 'bg-blue-50 text-blue-600'
                                                : 'text-slate-700 hover:bg-slate-50'
                                                }`}
                                        >
                                            {link.label}
                                        </Link>
                                    ))}
                                </nav>
                            </div>

                            {/* Drawer Footer - CTA Buttons */}
                            <div className="px-6 py-6 border-t border-slate-200 space-y-3">
                                <button className="w-full px-4 py-3 text-base font-semibold text-slate-700 bg-slate-100 rounded-xl hover:bg-slate-200 transition-colors">
                                    Sign In
                                </button>
                                <button className="w-full flex items-center justify-center gap-2 bg-gradient-to-r from-blue-600 to-violet-600 text-white px-4 py-3 rounded-xl font-semibold hover:shadow-lg hover:shadow-blue-500/25 transition-all">
                                    <Sparkles className="w-5 h-5" />
                                    <span>Upgrade Pro</span>
                                </button>
                            </div>
                        </div>
                    </div>
                </>
            )}
        </>
    );
}
