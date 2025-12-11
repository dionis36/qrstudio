/**
 * API Client for QR Studio Backend
 * Handles all communication with the API
 */

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001/api';

// For development: Mock user ID (in production, this comes from parent auth service)
const DEV_USER_ID = 'cltest123456789';

interface ApiResponse<T> {
    success: boolean;
    data?: T;
    error?: string;
}

interface PaginatedResponse<T> {
    success: boolean;
    data: T[];
    pagination: {
        page: number;
        limit: number;
        total: number;
        totalPages: number;
    };
}

// Helper to add auth headers
function getHeaders(): HeadersInit {
    return {
        'Content-Type': 'application/json',
        'x-user-id': DEV_USER_ID, // In production, this will come from parent service
    };
}

// QR Code API
export const qrApi = {
    /**
     * Create a new QR code
     */
    async create(data: {
        type: string;
        name: string;
        payload: any;
        design: any;
    }) {
        const response = await fetch(`${API_BASE_URL}/qrcodes`, {
            method: 'POST',
            headers: getHeaders(),
            body: JSON.stringify(data),
        });
        return response.json() as Promise<ApiResponse<any>>;
    },

    /**
     * Get all QR codes for the user
     */
    async list(params?: {
        page?: number;
        limit?: number;
        type?: string;
        search?: string;
        isActive?: boolean;
    }) {
        const searchParams = new URLSearchParams();
        if (params?.page) searchParams.set('page', params.page.toString());
        if (params?.limit) searchParams.set('limit', params.limit.toString());
        if (params?.type) searchParams.set('type', params.type);
        if (params?.search) searchParams.set('search', params.search);
        if (params?.isActive !== undefined) searchParams.set('isActive', params.isActive.toString());

        const response = await fetch(`${API_BASE_URL}/qrcodes?${searchParams}`, {
            headers: getHeaders(),
        });
        return response.json() as Promise<PaginatedResponse<any>>;
    },

    /**
     * Get a specific QR code by ID
     */
    async getById(id: string) {
        const response = await fetch(`${API_BASE_URL}/qrcodes/${id}`, {
            headers: getHeaders(),
        });
        return response.json() as Promise<ApiResponse<any>>;
    },

    /**
     * Update a QR code
     */
    async update(id: string, data: {
        name?: string;
        payload?: any;
        design?: any;
        isActive?: boolean;
    }) {
        const response = await fetch(`${API_BASE_URL}/qrcodes/${id}`, {
            method: 'PATCH',
            headers: getHeaders(),
            body: JSON.stringify(data),
        });
        return response.json() as Promise<ApiResponse<any>>;
    },

    /**
     * Delete a QR code
     */
    async delete(id: string) {
        const response = await fetch(`${API_BASE_URL}/qrcodes/${id}`, {
            method: 'DELETE',
            headers: getHeaders(),
        });
        return response.json() as Promise<ApiResponse<any>>;
    },

    /**
     * Get dashboard statistics
     */
    async getDashboardStats() {
        const response = await fetch(`${API_BASE_URL}/dashboard/stats`, {
            headers: getHeaders(),
        });
        return response.json() as Promise<ApiResponse<{
            totalQrCodes: number;
            activeQrCodes: number;
            totalScans: number;
            recentScans: number;
        }>>;
    },

    /**
     * Get QR code by shortcode (public)
     */
    async getByShortcode(shortcode: string) {
        const response = await fetch(`${API_BASE_URL}/q/${shortcode}`);
        return response.json() as Promise<ApiResponse<any>>;
    },
};

// Analytics API
export const analyticsApi = {
    /**
     * Get analytics for a specific QR code
     */
    async getQrAnalytics(id: string, dateRange?: { startDate: string; endDate: string }) {
        const searchParams = new URLSearchParams();
        if (dateRange?.startDate) searchParams.set('startDate', dateRange.startDate);
        if (dateRange?.endDate) searchParams.set('endDate', dateRange.endDate);

        const response = await fetch(`${API_BASE_URL}/analytics/qrcodes/${id}?${searchParams}`, {
            headers: getHeaders(),
        });
        return response.json() as Promise<ApiResponse<any>>;
    },

    /**
     * Get recent scans for dashboard
     */
    async getRecentScans() {
        const response = await fetch(`${API_BASE_URL}/analytics/recent-scans`, {
            headers: getHeaders(),
        });
        return response.json() as Promise<ApiResponse<any[]>>;
    },

    /**
     * Record a scan (public endpoint)
     */
    async recordScan(shortcode: string, metadata: {
        country?: string;
        city?: string;
        device?: string;
        os?: string;
        browser?: string;
    }) {
        const response = await fetch(`${API_BASE_URL}/analytics/scan/${shortcode}`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(metadata),
        });
        return response.json() as Promise<ApiResponse<{ id: string }>>;
    },
};
