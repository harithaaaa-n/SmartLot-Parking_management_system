export interface TicketData {
    vehicleNumber: string;
    slot: string;
    ticketId: string;
    entryTime?: string;
}

const TICKET_KEY = 'smartlot_active_ticket';

export const saveTicket = (ticket: TicketData) => {
    localStorage.setItem(TICKET_KEY, JSON.stringify(ticket));
};

export const getActiveTicket = (): TicketData | null => {
    const data = localStorage.getItem(TICKET_KEY);
    return data ? JSON.parse(data) : null;
};

export const clearTicket = () => {
    localStorage.removeItem(TICKET_KEY);
};
