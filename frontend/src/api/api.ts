import client from "./client";

export interface Slot {
    _id: string;
    slotNumber: string; // e.g., "A01"
    status: 'available' | 'occupied' | 'maintenance';
}

export interface EntryResponse {
    message: string;
    entryId: string;
    ticket: {
        ticketNumber: string;
        vehicleNumber: string;
        slotNumber: string;
        entryTime: string;
    };
}

export interface ExitPreview {
    vehicleNumber: string;
    entryTime: string;
    exitTime: string;
    durationMinutes: number;
    amount: number;
    slotNumber: string; // Assigned slot
    ticketNumber: string; // Ticket ID
    actualSlotNumber?: string; // Optional user reported slot
}

export interface Alert {
    id: string;
    vehicleNumber: string;
    assignedSlot: string;
    usedSlot: string;
    timestamp: string;
}

export interface DashboardStats {
    todayEntries: number;
    todayExits: number;
    currentActive: number;
    todayRevenue: number;
    recentAlerts: Alert[];
}

export const fetchSlots = async (): Promise<Slot[]> => {
    const response = await client.get('/slot/all');
    // Map backend "Available"/"Occupied" to frontend lowercase
    return response.data.map((slot: any) => ({
        ...slot,
        status: slot.status.toLowerCase()
    }));
};

export const createSlot = async (slotNumber: string): Promise<any> => {
    const response = await client.post('/slot/create', { slotNumber, status: "Available" });
    return response.data;
};

export const updateSlotStatus = async (slotNumber: string, status: string): Promise<any> => {
    const response = await client.put(`/slot/update/${slotNumber}`, { status });
    return response.data;
};

export const deleteSlot = async (slotNumber: string): Promise<any> => {
    const response = await client.delete(`/slot/delete/${slotNumber}`);
    return response.data;
};

export const enterVehicle = async (vehicleNumber: string): Promise<EntryResponse> => {
    const response = await client.post('/entry/enter', { vehicleNumber });
    return response.data;
};

export const calculateExit = async (identifier: string): Promise<ExitPreview> => {
    const response = await client.get(`/entry/calculate/${identifier}`);
    return response.data;
};

export const exitVehicle = async (entryId: string, actualSlotNumber?: string, paymentMode?: string): Promise<any> => {
    const response = await client.put(`/entry/exit/${entryId}`, {
        actualSlotNumber: actualSlotNumber || undefined,
        paymentMode
    });
    return response.data;
};

export const fetchActiveSessions = async (): Promise<any[]> => {
    const response = await client.get('/entry/active');
    return response.data;
};

export const fetchParkingHistory = async (): Promise<any[]> => {
    const response = await client.get('/entry/history');
    return response.data;
};

export const fetchDashboardStats = async (): Promise<DashboardStats> => {
    const response = await client.get('/entry/stats');
    return response.data;
};


export const fetchDetailedAnalytics = async (): Promise<any> => {
    const response = await client.get('/entry/analytics');
    return response.data;
};

export const submitFeedback = async (ticketNumber: string, rating: number, feedback: string): Promise<any> => {
    const response = await client.post('/entry/feedback', { ticketNumber, rating, feedback });
    return response.data;
};

