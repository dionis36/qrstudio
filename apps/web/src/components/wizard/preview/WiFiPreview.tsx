import { Wifi, Lock, Shield, Eye, EyeOff } from 'lucide-react';
import { useState } from 'react';

type WiFiPreviewProps = {
    data: any;
};

export function WiFiPreview({ data }: WiFiPreviewProps) {
    const [showPassword, setShowPassword] = useState(false);

    const wifi = data?.wifi_details || {};
    const network = data?.network_info || {};
    const styles = data?.styles || {};

    const primaryColor = styles.primary_color || '#2563EB';
    const secondaryColor = styles.secondary_color || '#EFF6FF';
    const gradientType = styles.gradient_type || 'none';
    const gradientAngle = styles.gradient_angle || 135;

    // Generate background style
    const getBackgroundStyle = () => {
        if (gradientType === 'linear') {
            return {
                background: `linear-gradient(${gradientAngle}deg, ${primaryColor}, ${secondaryColor})`
            };
        } else if (gradientType === 'radial') {
            return {
                background: `radial-gradient(circle, ${primaryColor}, ${secondaryColor})`
            };
        } else {
            return {
                backgroundColor: secondaryColor
            };
        }
    };

    // Security badge color
    const getSecurityBadge = () => {
        switch (wifi.security) {
            case 'WPA2':
            case 'WPA3':
                return { color: 'bg-green-100 text-green-700 border-green-200', label: wifi.security };
            case 'WEP':
                return { color: 'bg-yellow-100 text-yellow-700 border-yellow-200', label: 'WEP' };
            case 'nopass':
                return { color: 'bg-blue-100 text-blue-700 border-blue-200', label: 'Open' };
            default:
                return { color: 'bg-gray-100 text-gray-700 border-gray-200', label: 'Unknown' };
        }
    };

    const securityBadge = getSecurityBadge();
    const hasPassword = wifi.security !== 'nopass';

    return (
        <div className="absolute inset-0 w-full h-full flex flex-col" style={getBackgroundStyle()}>
            <div className="flex-1 flex flex-col items-center justify-center p-8 space-y-8">
                {/* Network Logo */}
                {network.logo && (
                    <div className="w-24 h-24 rounded-full bg-white shadow-lg flex items-center justify-center overflow-hidden">
                        <img src={network.logo} alt="Network Logo" className="w-full h-full object-cover" />
                    </div>
                )}

                {/* WiFi Icon */}
                {!network.logo && (
                    <div className="w-24 h-24 rounded-full shadow-lg flex items-center justify-center" style={{ backgroundColor: primaryColor }}>
                        <Wifi className="w-12 h-12 text-white" />
                    </div>
                )}

                {/* Network Title or SSID */}
                <div className="text-center">
                    <h2 className="text-2xl font-bold text-slate-900 mb-1">
                        {network.title || wifi.ssid || 'WiFi Network'}
                    </h2>
                    {network.title && wifi.ssid && (
                        <p className="text-sm text-slate-600 font-mono">{wifi.ssid}</p>
                    )}
                    {wifi.hidden && (
                        <p className="text-xs text-slate-500 mt-1 flex items-center justify-center gap-1">
                            <Eye className="w-3 h-3" />
                            Hidden Network
                        </p>
                    )}
                </div>

                {/* Description */}
                {network.description && (
                    <p className="text-sm text-slate-600 text-center max-w-xs">
                        {network.description}
                    </p>
                )}

                {/* Connection Card */}
                <div className="w-full max-w-sm bg-white rounded-2xl shadow-xl p-6 space-y-4">
                    {/* Security Badge */}
                    <div className="flex items-center justify-between">
                        <span className="text-sm font-semibold text-slate-700">Security</span>
                        <span className={`px-3 py-1 rounded-full text-xs font-bold border ${securityBadge.color}`}>
                            <Shield className="w-3 h-3 inline mr-1" />
                            {securityBadge.label}
                        </span>
                    </div>

                    {/* Password Field */}
                    {hasPassword && wifi.password && (
                        <div>
                            <label className="block text-xs font-semibold text-slate-600 mb-2">Password</label>
                            <div className="relative">
                                <input
                                    type={showPassword ? 'text' : 'password'}
                                    value={wifi.password}
                                    readOnly
                                    className="w-full px-4 py-2.5 pr-10 rounded-lg border border-slate-200 bg-slate-50 text-slate-900 font-mono text-sm"
                                />
                                <button
                                    type="button"
                                    onClick={() => setShowPassword(!showPassword)}
                                    className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600"
                                >
                                    {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                                </button>
                            </div>
                        </div>
                    )}

                    {/* Connect Button */}
                    <button
                        className="w-full py-3 rounded-xl text-white font-bold shadow-lg hover:shadow-xl transition-all flex items-center justify-center gap-2"
                        style={{ backgroundColor: primaryColor }}
                    >
                        <Wifi className="w-5 h-5" />
                        Connect to Network
                    </button>
                </div>
            </div>
        </div>
    );
}
