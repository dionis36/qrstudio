import { HexColorPicker } from 'react-colorful';
import { useWizardStore } from '../store';
import { useState } from 'react';
import { Paintbrush, LayoutGrid, CheckCircle2 } from 'lucide-react';

export function DesignControls() {
    const { design, updateDesign } = useWizardStore();
    const [activeTab, setActiveTab] = useState<'dots' | 'colors' | 'frame'>('colors');

    return (
        <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
            <div>
                <h3 className="text-lg font-bold text-slate-900">Customize Design</h3>
                <p className="text-xs text-slate-500">Make it match your brand identity</p>
            </div>

            {/* Tabs */}
            <div className="flex p-1.5 bg-slate-100 rounded-xl">
                {[
                    { id: 'colors', label: 'Colors', icon: Paintbrush },
                    { id: 'dots', label: 'Patterns', icon: LayoutGrid },
                    { id: 'frame', label: 'Frames', icon: CheckCircle2 },
                ].map((tab) => (
                    <button
                        key={tab.id}
                        onClick={() => setActiveTab(tab.id as any)}
                        className={`flex-1 flex items-center justify-center gap-2 py-2.5 text-sm font-semibold rounded-lg transition-all ${activeTab === tab.id
                                ? 'bg-white text-blue-600 shadow-sm'
                                : 'text-slate-500 hover:text-slate-700'
                            }`}
                    >
                        <tab.icon className="w-4 h-4" />
                        {tab.label}
                    </button>
                ))}
            </div>

            <div className="bg-white rounded-2xl border border-slate-100 shadow-sm p-1">
                {activeTab === 'colors' && (
                    <div className="p-4 space-y-6">
                        <div>
                            <label className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-3 block">QR Foreground Color</label>
                            <div className="flex flex-col gap-3">
                                <HexColorPicker
                                    color={design.dots?.color ?? '#000000'}
                                    onChange={(c) => updateDesign({ dots: { ...design.dots, color: c } })}
                                    style={{ width: '100%', height: '120px', borderRadius: '12px' }}
                                />
                                <div className="flex items-center gap-3 p-2 bg-slate-50 rounded-lg border border-slate-200">
                                    <div className="w-8 h-8 rounded-full border shadow-sm shrink-0" style={{ backgroundColor: design.dots?.color ?? '#000000' }} />
                                    <input
                                        type="text"
                                        value={design.dots?.color ?? '#000000'}
                                        onChange={(e) => updateDesign({ dots: { ...design.dots, color: e.target.value } })}
                                        className="bg-transparent text-sm font-mono text-slate-700 w-full focus:outline-none"
                                    />
                                </div>
                            </div>
                        </div>
                    </div>
                )}

                {activeTab === 'dots' && (
                    <div className="p-4 grid grid-cols-2 gap-3">
                        {['square', 'dots', 'rounded', 'extra-rounded', 'classy', 'classy-rounded'].map((style) => (
                            <button
                                key={style}
                                onClick={() => updateDesign({ dots: { ...design.dots, style } })}
                                className={`p-4 border-2 rounded-xl transition-all flex flex-col items-center gap-3 relative overflow-hidden ${design.dots?.style === style
                                        ? 'border-blue-600 bg-blue-50/50'
                                        : 'border-slate-100 hover:border-blue-300 hover:bg-slate-50'
                                    }`}
                            >
                                {/* Visual representation of the dot style */}
                                <div className={`w-8 h-8 bg-slate-800 ${style === 'dots' ? 'rounded-full' :
                                        style === 'rounded' ? 'rounded-md' :
                                            style === 'extra-rounded' ? 'rounded-lg' :
                                                style === 'classy' ? 'rounded-tr-lg rounded-bl-lg' :
                                                    'rounded-none'
                                    }`} />
                                <span className="text-xs font-medium capitalize text-slate-700">{style.replace('-', ' ')}</span>

                                {design.dots?.style === style && (
                                    <div className="absolute top-2 right-2 text-blue-600">
                                        <CheckCircle2 className="w-4 h-4" />
                                    </div>
                                )}
                            </button>
                        ))}
                    </div>
                )}

                {activeTab === 'frame' && (
                    <div className="p-8 text-center text-slate-400">
                        <LayoutGrid className="w-12 h-12 mx-auto mb-3 opacity-20" />
                        <p className="text-sm">Premium Frames Library<br />Coming Soon</p>
                    </div>
                )}
            </div>
        </div>
    );
}
