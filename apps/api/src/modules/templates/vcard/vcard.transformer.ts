import { VCardPayload } from './vcard.schema';

/**
 * Generates a VCF (vCard 3.0) string from the payload.
 * Used for "Download Contact" button and Static vCard QR content.
 */
export function generateVCardString(data: VCardPayload): string {
    const parts: string[] = [
        'BEGIN:VCARD',
        'VERSION:3.0',
        `N:${data.last_name};${data.first_name};;;`,
        `FN:${data.first_name} ${data.last_name}`,
    ];

    if (data.company) parts.push(`ORG:${data.company}`);
    if (data.job_title) parts.push(`TITLE:${data.job_title}`);
    if (data.phone) parts.push(`TEL;TYPE=CELL:${data.phone}`);
    if (data.work_phone) parts.push(`TEL;TYPE=WORK:${data.work_phone}`);
    if (data.email) parts.push(`EMAIL;TYPE=HOME:${data.email}`);
    if (data.work_email) parts.push(`EMAIL;TYPE=WORK:${data.work_email}`);
    if (data.website) parts.push(`URL:${data.website}`);

    if (data.address) {
        const { street = '', city = '', state = '', zip = '', country = '' } = data.address;
        parts.push(`ADR;TYPE=WORK:;;${street};${city};${state};${zip};${country}`);
    }

    // Note: Socials are often custom X-SOCIAL fields or just URLs in vCard 3.0

    parts.push('END:VCARD');

    return parts.join('\n');
}
