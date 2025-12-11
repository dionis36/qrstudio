import QRCode from 'qrcode';
import { CreateQrDto } from './qr.schema';

export class QrService {
    async generateQr(data: string, options: CreateQrDto['design']) {
        // Basic SVG Generation using node-qrcode
        // Advanced SVG manipulation (design.dots, etc) would happen here
        // by manipulating the SVG string or using a custom renderer.

        // For MVP Sprint 1: Standard QR generation
        const qrSvg = await QRCode.toString(data, {
            type: 'svg',
            errorCorrectionLevel: 'H',
            width: options?.size ?? 1000,
            margin: options?.margin ?? 1,
            color: {
                dark: options?.dots?.color ?? '#000000',
                light: options?.background?.color ?? '#ffffff',
            },
        });

        return qrSvg;
    }

    async create(dto: CreateQrDto) {
        // In real flow:
        // 1. Generate Short Code (if dynamic)
        // 2. Save to DB
        // 3. Generate SVG
        // 4. Save SVG to Storage
        // 5. Return Result

        // Stub for now:
        const mockId = crypto.randomUUID();
        const mockShortCode = Math.random().toString(36).substring(7);

        const contentToEncode = dto.is_dynamic
            ? `http://localhost:3001/d/${mockShortCode}`
            : JSON.stringify(dto.payload); // Simple payload dump for static

        const qrImage = await this.generateQr(contentToEncode, dto.design);

        return {
            id: mockId,
            short_code: mockShortCode,
            preview_url: `data:image/svg+xml;base64,${Buffer.from(qrImage).toString('base64')}`,
            raw_svg: qrImage
        };
    }
}
