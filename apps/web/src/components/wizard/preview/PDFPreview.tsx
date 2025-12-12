import { FileText, ExternalLink } from 'lucide-react';
import { useState, useEffect, useCallback } from 'react';

type PDFPreviewProps = {
    data: any;
};

export function PDFPreview({ data }: PDFPreviewProps) {
    const [thumbnailUrl, setThumbnailUrl] = useState<string>('');
    const [isGenerating, setIsGenerating] = useState(false);

    const pdfFile = data?.pdf_file || {};
    const docInfo = data?.document_info || {};
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

    // Generate PDF thumbnail
    const generateThumbnail = useCallback(async () => {
        if (!pdfFile.file_data) return;

        try {
            setIsGenerating(true);

            // Dynamically import pdfjs-dist only on client-side
            const pdfjsLib = await import('pdfjs-dist');

            // Set up worker
            pdfjsLib.GlobalWorkerOptions.workerSrc = `//cdnjs.cloudflare.com/ajax/libs/pdf.js/${pdfjsLib.version}/pdf.worker.min.js`;

            // Convert base64 to Uint8Array
            const binaryString = atob(pdfFile.file_data);
            const bytes = new Uint8Array(binaryString.length);
            for (let i = 0; i < binaryString.length; i++) {
                bytes[i] = binaryString.charCodeAt(i);
            }

            // Load PDF
            const loadingTask = pdfjsLib.getDocument({ data: bytes });
            const pdf = await loadingTask.promise;

            // Get first page
            const page = await pdf.getPage(1);

            // Set scale for thumbnail
            const viewport = page.getViewport({ scale: 1.0 });

            // Create canvas
            const canvas = document.createElement('canvas');
            const context = canvas.getContext('2d');
            if (!context) return;

            canvas.height = viewport.height;
            canvas.width = viewport.width;

            // Render PDF page to canvas
            await page.render({
                canvasContext: context,
                viewport: viewport,
                canvas: canvas
            }).promise;

            // Convert canvas to data URL
            const dataUrl = canvas.toDataURL('image/png');
            setThumbnailUrl(dataUrl);
        } catch (error) {
            console.error('Failed to generate PDF thumbnail:', error);
            setThumbnailUrl(''); // Fallback to icon
        } finally {
            setIsGenerating(false);
        }
    }, [pdfFile.file_data]);

    useEffect(() => {
        if (pdfFile.file_data && !pdfFile.fullscreen_mode) {
            generateThumbnail();
        } else {
            setThumbnailUrl('');
        }
    }, [pdfFile.file_data, pdfFile.fullscreen_mode, generateThumbnail]);

    // Fullscreen mode view
    if (pdfFile.fullscreen_mode && pdfFile.file_data) {
        return (
            <div className="absolute inset-0 w-full h-full flex flex-col font-sans" style={getBackgroundStyle()}>
                <div className="flex-1 flex flex-col items-center justify-center p-6 space-y-4">
                    <div className="w-16 h-16 rounded-full shadow-lg flex items-center justify-center" style={{ backgroundColor: primaryColor }}>
                        <ExternalLink className="w-8 h-8 text-white" />
                    </div>

                    <div className="text-center">
                        <h2 className="text-lg font-bold text-slate-900 mb-1 leading-tight">
                            {docInfo.title || pdfFile.file_name || 'PDF Document'}
                        </h2>
                        <p className="text-xs text-slate-600">
                            Direct PDF Link
                        </p>
                    </div>

                    <div className="w-full max-w-[280px] bg-white rounded-xl shadow-lg p-4 text-center">
                        <p className="text-xs text-slate-600">
                            PDF will open directly in fullscreen mode
                        </p>
                    </div>
                </div>
            </div>
        );
    }

    // Preview page view (default)
    return (
        <div className="absolute inset-0 w-full h-full flex flex-col font-sans bg-white" style={getBackgroundStyle()}>
            <div className="flex-1 flex flex-col items-center justify-center p-4 space-y-4">
                {/* PDF Thumbnail or Icon */}
                {thumbnailUrl ? (
                    <div className="w-full max-w-[160px] bg-white rounded-lg shadow-lg overflow-hidden border border-slate-200">
                        <img src={thumbnailUrl} alt="PDF Preview" className="w-full h-auto" />
                    </div>
                ) : isGenerating ? (
                    <div className="w-16 h-16 rounded-full bg-white shadow-lg flex items-center justify-center">
                        <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-blue-600"></div>
                    </div>
                ) : (
                    <div className="w-16 h-16 rounded-full shadow-lg flex items-center justify-center" style={{ backgroundColor: primaryColor }}>
                        <FileText className="w-8 h-8 text-white" />
                    </div>
                )}

                {/* Document Title */}
                <div className="text-center px-4 max-w-[280px]">
                    <h2 className="text-lg font-bold text-slate-900 mb-0.5 leading-tight line-clamp-2">
                        {docInfo.title || pdfFile.file_name || 'PDF Document'}
                    </h2>
                    {docInfo.topic && (
                        <p className="text-xs text-slate-600 mt-1">{docInfo.topic}</p>
                    )}
                </div>

                {/* Description */}
                {docInfo.description && (
                    <p className="text-xs text-slate-600 text-center max-w-[280px] px-4 line-clamp-3 leading-relaxed">
                        {docInfo.description}
                    </p>
                )}

                {/* Action Buttons */}
                {pdfFile.file_data && (
                    <div className="w-full max-w-[280px] px-4 space-y-2">
                        <button
                            className="w-full py-2.5 rounded-xl text-white font-bold text-sm shadow-lg hover:shadow-xl transition-all flex items-center justify-center gap-2"
                            style={{ backgroundColor: primaryColor }}
                        >
                            <FileText className="w-4 h-4" />
                            Read PDF
                        </button>
                        <button
                            className="w-full py-2.5 rounded-xl bg-slate-100 text-slate-700 font-bold text-sm shadow-sm hover:shadow-md transition-all flex items-center justify-center gap-2 hover:bg-slate-200"
                        >
                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
                            </svg>
                            Download PDF
                        </button>
                    </div>
                )}

                {/* Author */}
                {docInfo.author && (
                    <p className="text-[10px] text-slate-500 mt-2">
                        By {docInfo.author}
                    </p>
                )}
            </div>
        </div>
    );
}
