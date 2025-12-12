import { FastifyInstance } from 'fastify';
import { qrService } from '../services/qr.service';
import { analyticsService } from '../services/analytics.service';

export async function redirectRoutes(fastify: FastifyInstance) {
    // Main redirect route - handles shortcode resolution
    fastify.get<{ Params: { shortcode: string } }>(
        '/:shortcode',
        async (request, reply) => {
            try {
                const { shortcode } = request.params;

                // 1. Lookup QR code by shortcode
                const qrCode = await qrService.getQrCodeByShortcode(shortcode);

                if (!qrCode) {
                    return reply.code(404).send({
                        success: false,
                        error: 'QR code not found',
                    });
                }

                // 2. Log analytics (scan event)
                const referrerHeader = request.headers.referer || request.headers.referrer;
                const referrerString = Array.isArray(referrerHeader) ? referrerHeader[0] : referrerHeader;

                const scanData = {
                    qrcodeId: qrCode.id,
                    shortcode: shortcode,
                    ip: request.ip,
                    userAgent: request.headers['user-agent'] || '',
                    referrer: referrerString || '',
                };

                // Log scan asynchronously (don't wait for it)
                analyticsService.logScan(scanData).catch(err => {
                    fastify.log.error('Failed to log scan:', err);
                });

                // 3. Check QR code type and redirect settings
                if (qrCode.type === 'url') {
                    const payload = qrCode.payload as any;
                    const urlDetails = payload?.url_details;
                    const redirectSettings = payload?.redirect_settings;

                    // Check if instant redirect is enabled (show_preview = false)
                    if (redirectSettings?.show_preview === false && urlDetails?.destination_url) {
                        // INSTANT REDIRECT - HTTP 302
                        return reply.redirect(302, urlDetails.destination_url);
                    }
                }

                // 4. For all other cases, redirect to the landing page
                // This will be handled by the Next.js frontend
                return reply.redirect(302, `${process.env.FRONTEND_URL}/r/${shortcode}`);

            } catch (error: any) {
                fastify.log.error('Redirect error:', error);
                return reply.code(500).send({
                    success: false,
                    error: 'Internal server error',
                });
            }
        }
    );
}
