// API client for QR Studio backend

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001/api';

export interface QrCodeResponse {
    id: string;
    short_code: string;
    preview_url: string;
    raw_svg: string;
}

export interface CreateQrCodeRequest {
    type: 'menu' | 'vcard' | 'url' | 'text' | 'pdf' | 'wifi';
    payload: Record<string, any>;
    design?: {
        size?: number;
        margin?: number;
        dots?: {
            style?: 'dots' | 'rounded' | 'classy' | 'classy-rounded' | 'square' | 'extra-rounded';
            color?: string;
        };
        background?: {
            color?: string;
        };
        corners?: {
            style?: 'dot' | 'square' | 'extra-rounded';
            color?: string;
        };
        logo?: {
            asset_id?: string;
            scale?: number;
            margin?: number;
        };
    };
    is_dynamic?: boolean;
    project_id?: string;
}

export class ApiError extends Error {
    constructor(
        message: string,
        public status?: number,
        public data?: any
    ) {
        super(message);
        this.name = 'ApiError';
    }
}

/**
 * Create a QR code
 */
export async function createQrCode(request: CreateQrCodeRequest): Promise<QrCodeResponse> {
    try {
        const response = await fetch(`${API_BASE_URL}/qrcodes`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(request),
        });

        if (!response.ok) {
            const errorData = await response.json().catch(() => ({}));
            throw new ApiError(
                errorData.message || `HTTP error! status: ${response.status}`,
                response.status,
                errorData
            );
        }

        const data = await response.json();
        return data;
    } catch (error) {
        if (error instanceof ApiError) {
            throw error;
        }
        throw new ApiError(
            error instanceof Error ? error.message : 'Failed to create QR code',
            undefined,
            error
        );
    }
}

/**
 * Download QR code as SVG
 */
export function downloadQrCode(svg: string, filename: string = 'qrcode.svg') {
    const blob = new Blob([svg], { type: 'image/svg+xml' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = filename;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
}
