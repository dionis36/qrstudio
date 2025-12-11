import { ReactNode } from 'react';

interface PhoneMockupProps {
    children: ReactNode;
    header?: ReactNode;
    className?: string; // Allow overriding/adding classes
}

export function PhoneMockup({ children, header, className = '' }: PhoneMockupProps) {
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

                {/* Status Bar Mock */}
                <div className="absolute top-0 w-full h-12 z-10 flex justify-between items-start px-7 pt-3 text-[12px] font-bold text-gray-900 mix-blend-difference pointer-events-none">
                    <span className="text-black/80 dark:text-white/80">9:41</span>
                    <div className="flex gap-1.5 items-center">
                        <div className="w-4 h-2.5 bg-black/80 dark:bg-white/80 rounded-[2px] opacity-80" />
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
        </div>
    );
}
