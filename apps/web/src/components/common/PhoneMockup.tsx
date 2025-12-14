import { ReactNode, useState, useEffect } from 'react';
import { usePreviewContext } from '../wizard/preview/PreviewContext';
import { Eye } from 'lucide-react';

interface PhoneMockupProps {
    children: ReactNode;
    header?: ReactNode;
    className?: string;
    showViewButton?: boolean;
    onViewClick?: () => void;
}

export function PhoneMockup({ children, header, className = '', showViewButton = false, onViewClick }: PhoneMockupProps) {
    const { heroBackgroundColor } = usePreviewContext();

    // Live time state
    const [currentTime, setCurrentTime] = useState('');

    // Update time every minute
    useEffect(() => {
        const updateTime = () => {
            const now = new Date();
            const hours = now.getHours();
            const minutes = now.getMinutes();
            const formattedTime = `${hours}:${minutes.toString().padStart(2, '0')}`;
            setCurrentTime(formattedTime);
        };

        // Set initial time
        updateTime();

        // Update every minute
        const interval = setInterval(updateTime, 60000);

        return () => clearInterval(interval);
    }, []);

    // Helper to determine if color is dark or light
    const isColorDark = (hexColor: string): boolean => {
        // Handle invalid or missing colors
        if (!hexColor || hexColor === 'transparent') return false;

        // Remove # if present
        let hex = hexColor.replace('#', '');

        // Handle 3-character hex codes (e.g., #000 -> #000000)
        if (hex.length === 3) {
            hex = hex.split('').map(char => char + char).join('');
        }

        // Validate hex length
        if (hex.length !== 6) return false;

        // Convert to RGB
        const r = parseInt(hex.substring(0, 2), 16);
        const g = parseInt(hex.substring(2, 4), 16);
        const b = parseInt(hex.substring(4, 6), 16);

        // Check for invalid RGB values
        if (isNaN(r) || isNaN(g) || isNaN(b)) return false;

        // Calculate luminance (perceived brightness)
        const luminance = (0.299 * r + 0.587 * g + 0.114 * b) / 255;

        // Return true if dark (luminance < 0.5)
        return luminance < 0.5;
    };

    // Determine status bar color based on actual hero background from context
    const isDark = isColorDark(heroBackgroundColor);
    const statusBarColor = isDark ? 'text-white' : 'text-black';
    const batteryBgColor = isDark ? 'bg-white/80' : 'bg-black/80';

    return (
        <div className={`relative mx-auto border-gray-900 bg-gray-900 border-[8px] rounded-[3rem] h-[650px] w-[320px] shadow-2xl ring-1 ring-white/20 select-none ${className}`}>

            {/* Side Buttons - refined positioning */}
            <div className="h-8 w-1 bg-gray-800 absolute -left-[9px] top-24 rounded-l-md opacity-80" /> {/* Mute */}
            <div className="h-16 w-1 bg-gray-800 absolute -left-[9px] top-36 rounded-l-md opacity-80" /> {/* Vol Up */}
            <div className="h-16 w-1 bg-gray-800 absolute -left-[9px] top-56 rounded-l-md opacity-80" /> {/* Vol Down */}
            <div className="h-24 w-1 bg-gray-800 absolute -right-[9px] top-40 rounded-r-md opacity-80" /> {/* Power */}

            {/* Screen Content */}
            <div className="rounded-[2.5rem] overflow-hidden w-full h-full bg-white relative mask-image-rounded">

                {/* Dynamic Island / Punch Hole */}
                <div className="absolute top-0 w-full z-20 flex justify-center pt-2 pointer-events-none">
                    <div className="bg-black w-[100px] h-[28px] rounded-full flex items-center justify-center gap-2 px-3 shadow-sm">
                        <div className="w-1.5 h-1.5 bg-gray-800/80 rounded-full blur-[0.5px]"></div> {/* Cam lens */}
                    </div>
                </div>

                {/* Adaptive Status Bar with Live Time */}
                <div className={`absolute top-0 w-full h-12 z-10 flex justify-between items-start px-7 pt-3 text-[12px] font-bold ${statusBarColor} pointer-events-none`}>
                    <span className="opacity-90">{currentTime || '9:41'}</span>
                    <div className="flex gap-1.5 items-center">
                        {/* Signal bars */}
                        <div className="flex gap-[1.5px] items-end">
                            <div className={`w-[3px] h-[4px] ${batteryBgColor} rounded-[0.5px]`}></div>
                            <div className={`w-[3px] h-[6px] ${batteryBgColor} rounded-[0.5px]`}></div>
                            <div className={`w-[3px] h-[8px] ${batteryBgColor} rounded-[0.5px]`}></div>
                            <div className={`w-[3px] h-[10px] ${batteryBgColor} rounded-[0.5px]`}></div>
                        </div>
                        {/* Battery */}
                        <div className={`w-5 h-2.5 ${batteryBgColor} rounded-[2px] opacity-80 relative`}>
                            <div className={`absolute -right-[1.5px] top-[3px] w-[1.5px] h-[4.5px] ${batteryBgColor} rounded-r-[1px]`}></div>
                        </div>
                    </div>
                </div>

                {/* Dynamic Header (if provided) */}
                {header && (
                    <div className="absolute top-10 left-0 w-full z-10">
                        {header}
                    </div>
                )}

                {/* Scrollable Content Area */}
                <div className="w-full h-full overflow-y-auto no-scrollbar pb-8 bg-white">
                    {children}
                </div>

                {/* Home Indicator */}
                <div className="absolute bottom-1.5 left-1/2 -translate-x-1/2 w-32 h-1 bg-black/20 rounded-full z-20 pointer-events-none" />
            </div>

            {/* Glossy Reflection Overlay */}
            <div className="absolute inset-0 rounded-[3rem] pointer-events-none shadow-inner ring-1 ring-white/10" />

            {/* Floating View Button (Mobile/Tablet Only) */}
            {showViewButton && onViewClick && (
                <button
                    onClick={onViewClick}
                    className="lg:hidden absolute -bottom-16 left-1/2 -translate-x-1/2 px-6 py-3 bg-gradient-to-r from-blue-600 to-indigo-600 text-white rounded-full shadow-lg hover:shadow-xl transition-all flex items-center gap-2 font-medium"
                >
                    <Eye className="w-5 h-5" />
                    View Preview
                </button>
            )}
        </div>
    );
}
