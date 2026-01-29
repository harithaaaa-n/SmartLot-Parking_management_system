import { API_BASE_URL } from "./config";

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
    const response = await fetch(`${API_BASE_URL}/slot/all`);
    if (!response.ok) {
        throw new Error("Failed to fetch slots");
    }
    const data = await response.json();
    // Map backend "Available"/"Occupied" to frontend lowercase
    return data.map((slot: any) => ({
        ...slot,
        status: slot.status.toLowerCase()
    }));
};

export const createSlot = async (slotNumber: string): Promise<any> => {
    const response = await fetch(`${API_BASE_URL}/slot/create`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ slotNumber, status: "Available" }),
    });
    const data = await response.json();
    if (!response.ok) throw new Error(data.message || "Failed to create slot");
    return data;
};

export const updateSlotStatus = async (slotNumber: string, status: string): Promise<any> => {
    const response = await fetch(`${API_BASE_URL}/slot/update/${slotNumber}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status }),
    });
    const data = await response.json();
    if (!response.ok) throw new Error(data.message || "Failed to update slot");
    return data;
};

export const deleteSlot = async (slotNumber: string): Promise<any> => {
    const response = await fetch(`${API_BASE_URL}/slot/delete/${slotNumber}`, {
        method: "DELETE",
    });
    const data = await response.json();
    if (!response.ok) throw new Error(data.message || "Failed to delete slot");
    return data;
};

export const enterVehicle = async (vehicleNumber: string): Promise<EntryResponse> => {
    const response = await fetch(`${API_BASE_URL}/entry/enter`, {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify({ vehicleNumber }),
    });

    const data = await response.json();
    if (!response.ok) {
        throw new Error(data.message || "Entry failed");
    }
    return data;
};

export const calculateExit = async (identifier: string): Promise<ExitPreview> => {
    const response = await fetch(`${API_BASE_URL}/entry/calculate/${identifier}`);
    const data = await response.json();
    if (!response.ok) {
        throw new Error(data.message || "Calculation failed");
    }
    return data;
};

export const exitVehicle = async (entryId: string, actualSlotNumber?: string, paymentMode?: string): Promise<any> => {
    const response = await fetch(`${API_BASE_URL}/entry/exit/${entryId}`, {
        method: "PUT",
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify({ actualSlotNumber: actualSlotNumber || undefined, paymentMode })
    });

    const data = await response.json();
    if (!response.ok) {
        throw new Error(data.message || "Exit failed");
    }
    return data;
};

export const fetchActiveSessions = async (): Promise<any[]> => {
    const response = await fetch(`${API_BASE_URL}/entry/active`);
    if (!response.ok) {
        throw new Error("Failed to fetch active sessions");
    }
    return await response.json();
};

export const fetchParkingHistory = async (): Promise<any[]> => {
    const response = await fetch(`${API_BASE_URL}/entry/history`);
    if (!response.ok) {
        throw new Error("Failed to fetch parking history");
    }
    return await response.json();
};

export const fetchDashboardStats = async (): Promise<DashboardStats> => {
    const response = await fetch(`${API_BASE_URL}/entry/stats`);
    if (!response.ok) {
        throw new Error("Failed to fetch dashboard stats");
    }
    return await response.json();
};


export const fetchDetailedAnalytics = async (): Promise<any> => {
    const response = await fetch(`${API_BASE_URL}/entry/analytics`);
    if (!response.ok) {
        throw new Error("Failed to fetch detailed analytics");
    }
    return await response.json();
};

export const submitFeedback = async (ticketNumber: string, rating: number, feedback: string): Promise<any> => {
    const response = await fetch(`${API_BASE_URL}/entry/feedback`, {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify({ ticketNumber, rating, feedback }),
    });

    const data = await response.json();
    if (!response.ok) {
        throw new Error(data.message || "Feedback submission failed");
    }
    return data;
};

