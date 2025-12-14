'use client';

import { useEffect } from 'react';
import { X } from 'lucide-react';
import { PhoneMockup } from './PhoneMockup';

interface EnhancedPreviewModalProps {
    isOpen: boolean;
    onClose: () => void;
    children: React.ReactNode;
}

export function EnhancedPreviewModal({ isOpen, onClose, children }: EnhancedPreviewModalProps) {
    // Handle escape key
    useEffect(() => {
        const handleEscape = (e: KeyboardEvent) => {
            if (e.key === 'Escape' && isOpen) {
                onClose();
            }
        };

        if (isOpen) {
            document.addEventListener('keydown', handleEscape);
            // Prevent body scroll when modal is open
            document.body.style.overflow = 'hidden';
        }

        return () => {
            document.removeEventListener('keydown', handleEscape);
            document.body.style.overflow = 'unset';
        };
    }, [isOpen, onClose]);

    if (!isOpen) return null;

    return (
        <div
            className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm animate-fadeIn"
            onClick={onClose}
        >
            <div
                className="relative w-full max-w-md"
                onClick={(e) => e.stopPropagation()}
            >
                {/* Close button */}
                <button
                    onClick={onClose}
                    className="absolute -top-12 right-0 p-2 text-white hover:bg-white/10 rounded-full transition-colors"
                    aria-label="Close preview"
                >
                    <X className="w-6 h-6" />
                </button>

                {/* Phone mockup - full screen on mobile, scaled on desktop */}
                <div className="transform scale-100 md:scale-90 origin-center">
                    <PhoneMockup className="shadow-2xl">
                        {children}
                    </PhoneMockup>
                </div>
            </div>
        </div>
    );
}
