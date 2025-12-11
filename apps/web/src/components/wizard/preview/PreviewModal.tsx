'use client';

import { useState } from 'react';
import { X } from 'lucide-react';
import { PhoneMockup } from '../../common/PhoneMockup';

interface PreviewModalProps {
    isOpen: boolean;
    onClose: () => void;
    children: React.ReactNode;
}

export function PreviewModal({ isOpen, onClose, children }: PreviewModalProps) {
    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
            <div className="relative w-full max-w-md">
                {/* Close button */}
                <button
                    onClick={onClose}
                    className="absolute -top-12 right-0 p-2 text-white hover:bg-white/10 rounded-full transition-colors"
                >
                    <X className="w-6 h-6" />
                </button>

                {/* Phone mockup */}
                <div className="transform scale-90 origin-center">
                    <PhoneMockup className="shadow-2xl">
                        {children}
                    </PhoneMockup>
                </div>
            </div>
        </div>
    );
}
