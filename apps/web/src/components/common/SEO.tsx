'use client';

import { Helmet } from 'react-helmet-async';

interface SEOProps {
    title: string;
    description: string;
    ogImage?: string;
    ogType?: string;
}

export function SEO({ title, description, ogImage, ogType = 'website' }: SEOProps) {
    const fullTitle = `${title} | QR Studio`;

    return (
        <Helmet>
            <title>{fullTitle}</title>
            <meta name="description" content={description} />

            {/* Open Graph */}
            <meta property="og:title" content={fullTitle} />
            <meta property="og:description" content={description} />
            <meta property="og:type" content={ogType} />
            {ogImage && <meta property="og:image" content={ogImage} />}

            {/* Twitter */}
            <meta name="twitter:card" content="summary_large_image" />
            <meta name="twitter:title" content={fullTitle} />
            <meta name="twitter:description" content={description} />
            {ogImage && <meta name="twitter:image" content={ogImage} />}
        </Helmet>
    );
}
