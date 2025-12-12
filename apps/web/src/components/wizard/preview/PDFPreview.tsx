import { FileText, ExternalLink, File, FileImage, FileArchive, FileCode, Music, Video } from 'lucide-react';
import { useState, useEffect, useCallback } from 'react';

type PDFPreviewProps = {
    data: any;
};

// Helper function to get file icon based on type
function getFileIcon(extension: string, category: string, primaryColor: string) {
    const iconClass = "w-8 h-8";
    const iconStyle = { color: primaryColor };

    // Documents
    if (extension === 'PDF') return <FileText className={iconClass} style={iconStyle} />;
    if (['DOC', 'DOCX'].includes(extension)) return <FileText className={iconClass} style={iconStyle} />;
    if (['XLS', 'XLSX'].includes(extension)) return <FileText className={iconClass} style={iconStyle} />;
    if (['PPT', 'PPTX'].includes(extension)) return <FileText className={iconClass} style={iconStyle} />;

    // Images
    if (category === 'image') return <FileImage className={iconClass} style={iconStyle} />;

    // Archives
    if (category === 'archive') return <FileArchive className={iconClass} style={iconStyle} />;

    // Text
    if (category === 'text') return <FileCode className={iconClass} style={iconStyle} />;

    // Media
    if (extension === 'MP3') return <Music className={iconClass} style={iconStyle} />;
    if (extension === 'MP4') return <Video className={iconClass} style={iconStyle} />;

    // Default
    return <File className={iconClass} style={iconStyle} />;
}

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

    // File metadata
    const fileExtension = pdfFile.file_extension || 'FILE';
    const fileCategory = pdfFile.file_category || 'document';
    const fileType = pdfFile.file_type || '';
    const fileSize = pdfFile.file_size || 0;

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

    // Format file size
    const formatFileSize = (bytes: number) => {
        if (bytes === 0) return '0 B';
        const k = 1024;
        const sizes = ['B', 'KB', 'MB'];
        const i = Math.floor(Math.log(bytes) / Math.log(k));
        return Math.round(bytes / Math.pow(k, i) * 10) / 10 + ' ' + sizes[i];
    };

    // Generate PDF thumbnail
    const generateThumbnail = useCallback(async () => {
        if (!pdfFile.file_data || fileExtension !== 'PDF') return;

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
                    <div className="w-20 h-20 rounded-full shadow-lg flex items-center justify-center" style={{ backgroundColor: secondaryColor }}>
                        <ExternalLink className="w-10 h-10" style={{ color: primaryColor }} />
                    </div>

                    <div className="text-center">
                        <h2 className="text-lg font-bold text-slate-900 mb-1 leading-tight">
                            {docInfo.title || pdfFile.file_name || 'File'}
                        </h2>
                        <p className="text-xs text-slate-600">
                            Direct File Link
                        </p>
                    </div>

                    <div className="w-full max-w-[280px] bg-white rounded-xl shadow-lg p-4 text-center">
                        <p className="text-xs text-slate-600">
                            File will open directly in fullscreen mode
                        </p>
                    </div>
                </div>
            </div>
        );
    }

    // Preview page view (default)
    return (
        <div className="absolute inset-0 w-full h-full flex flex-col font-sans bg-white" style={getBackgroundStyle()}>
            <div className="flex-1 flex flex-col items-center justify-center p-4 space-y-3">
                {/* File Preview: Image, PDF Thumbnail, or Icon */}
                {fileCategory === 'image' && pdfFile.file_data ? (
                    <div className="w-full max-w-[160px] bg-white rounded-lg shadow-lg overflow-hidden border border-slate-200">
                        <img
                            src={`data:${fileType};base64,${pdfFile.file_data}`}
                            alt="File Preview"
                            className="w-full h-auto"
                        />
                    </div>
                ) : thumbnailUrl ? (
                    <div className="w-full max-w-[160px] bg-white rounded-lg shadow-lg overflow-hidden border border-slate-200">
                        <img src={thumbnailUrl} alt="PDF Preview" className="w-full h-auto" />
                    </div>
                ) : isGenerating ? (
                    <div className="w-20 h-20 rounded-full shadow-lg flex items-center justify-center" style={{ backgroundColor: secondaryColor }}>
                        <div className="animate-spin rounded-full h-10 w-10 border-b-2" style={{ borderColor: primaryColor }}></div>
                    </div>
                ) : pdfFile.file_data ? (
                    <div className="w-20 h-20 rounded-full shadow-lg flex items-center justify-center" style={{ backgroundColor: secondaryColor }}>
                        {getFileIcon(fileExtension, fileCategory, primaryColor)}
                    </div>
                ) : (
                    // Placeholder when no file uploaded
                    <div className="w-20 h-20 rounded-full shadow-lg flex items-center justify-center" style={{ backgroundColor: secondaryColor }}>
                        <FileText className="w-10 h-10" style={{ color: primaryColor }} />
                    </div>
                )}

                {/* File Type Badge */}
                {pdfFile.file_data && (
                    <div className="flex items-center gap-2 text-xs">
                        <span className="px-2 py-0.5 bg-slate-100 text-slate-700 rounded font-mono font-bold">
                            {fileExtension}
                        </span>
                        <span className="text-slate-400">•</span>
                        <span className="text-slate-600">{formatFileSize(fileSize)}</span>
                    </div>
                )}

                {/* Document Title */}
                <div className="text-center px-4 max-w-[280px]">
                    <h2 className="text-lg font-bold text-slate-900 mb-0.5 leading-tight line-clamp-2">
                        {docInfo.title || pdfFile.file_name || 'Your File Title'}
                    </h2>
                    {docInfo.topic ? (
                        <p className="text-xs text-slate-600 mt-1">{docInfo.topic}</p>
                    ) : !pdfFile.file_data && (
                        <p className="text-xs text-slate-500 mt-1">Category or topic</p>
                    )}
                </div>

                {/* Description */}
                {docInfo.description ? (
                    <p className="text-xs text-slate-600 text-center max-w-[280px] px-4 line-clamp-3 leading-relaxed">
                        {docInfo.description}
                    </p>
                ) : !pdfFile.file_data && (
                    <p className="text-xs text-slate-400 text-center max-w-[280px] px-4 line-clamp-3 leading-relaxed italic">
                        Add a brief description to help users understand what this file contains
                    </p>
                )}

                {/* Action Buttons */}
                <div className="w-full max-w-[280px] px-4 space-y-2">
                    <button
                        className="w-full py-2.5 rounded-xl text-white font-bold text-sm shadow-lg hover:shadow-xl transition-all flex items-center justify-center gap-2"
                        style={{ backgroundColor: primaryColor }}
                    >
                        <FileText className="w-4 h-4" />
                        {pdfFile.file_data ? (fileExtension === 'PDF' ? 'Read PDF' : 'View File') : 'View File'}
                    </button>
                    <button
                        className="w-full py-2.5 rounded-xl bg-slate-100 text-slate-700 font-bold text-sm shadow-sm hover:shadow-md transition-all flex items-center justify-center gap-2 hover:bg-slate-200"
                    >
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
                        </svg>
                        {pdfFile.file_data ? `Download ${fileExtension}` : 'Download'}
                    </button>
                </div>

                {/* Author */}
                {docInfo.author ? (
                    <p className="text-[10px] text-slate-500 mt-2">
                        By {docInfo.author}
                    </p>
                ) : !pdfFile.file_data && (
                    <p className="text-[10px] text-slate-400 mt-2 italic">
                        Optional author name
                    </p>
                )}
            </div>
        </div>
    );
}
