import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Search, History as HistoryIcon, Download, Loader2 } from "lucide-react";
import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { API_BASE_URL } from "@/api/config";
import axios from "axios";
import { toast } from "sonner"; // Using simpler toast

interface Ticket {
    _id: string;
    ticketNumber: string;
    vehicleNumber: string;
    slotNumber: string;
    entryTime: string;
    exitTime?: string;
    status: 'Active' | 'Closed';
    amount?: number;
}

const History = () => {
    const [searchTerm, setSearchTerm] = useState("");
    const [selectedDate, setSelectedDate] = useState("");
    const [sortOrder, setSortOrder] = useState<'desc' | 'asc'>('desc');
    const [currentPage, setCurrentPage] = useState(1);
    const ITEMS_PER_PAGE = 20;

    const { data: tickets, isLoading, error } = useQuery<Ticket[]>({
        queryKey: ['userHistory'],
        queryFn: async () => {
            const response = await axios.get(`${API_BASE_URL}/entry/user-history`);
            return response.data;
        },
        refetchInterval: 30000
    });

    // Reset page when filters change
    const handleSearchChange = (val: string) => { setSearchTerm(val); setCurrentPage(1); };
    const handleDateChange = (val: string) => { setSelectedDate(val); setCurrentPage(1); };

    const filteredTickets = tickets?.filter(ticket => {
        const matchesSearch = ticket.vehicleNumber.toLowerCase().includes(searchTerm.toLowerCase()) ||
            ticket.ticketNumber.toLowerCase().includes(searchTerm.toLowerCase());

        const matchesDate = selectedDate
            ? new Date(ticket.entryTime).toLocaleDateString('en-CA') === selectedDate
            : true;

        return matchesSearch && matchesDate;
    }).sort((a, b) => {
        const dateA = new Date(a.entryTime).getTime();
        const dateB = new Date(b.entryTime).getTime();
        return sortOrder === 'desc' ? dateB - dateA : dateA - dateB;
    });

    const totalPages = Math.ceil((filteredTickets?.length || 0) / ITEMS_PER_PAGE);
    const paginatedTickets = filteredTickets?.slice((currentPage - 1) * ITEMS_PER_PAGE, currentPage * ITEMS_PER_PAGE);

    const handleDownloadCSV = () => {
        if (!filteredTickets || filteredTickets.length === 0) {
            toast.error("No data to download");
            return;
        }

        const headers = ["Ticket ID", "Vehicle Number", "Slot", "Entry Time", "Exit Time", "Status", "Amount"];
        const rows = filteredTickets.map(t => [
            t.ticketNumber,
            t.vehicleNumber,
            t.slotNumber,
            new Date(t.entryTime).toLocaleString(),
            t.exitTime ? new Date(t.exitTime).toLocaleString() : "-",
            t.status,
            t.amount ? `₹${t.amount}` : "-"
        ]);

        const csvContent = "data:text/csv;charset=utf-8,"
            + headers.join(",") + "\n"
            + rows.map(e => e.join(",")).join("\n");

        const encodedUri = encodeURI(csvContent);
        const link = document.createElement("a");
        link.setAttribute("href", encodedUri);
        link.setAttribute("download", `parking_history_${new Date().toISOString().split('T')[0]}.csv`);
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        toast.success("History downloaded successfully");
    };

    return (
        <div className="min-h-screen flex flex-col bg-gray-50 dark:bg-gray-900">
            <Header />
            <main className="flex-grow container mx-auto px-4 py-8">
                <Card className="w-full shadow-lg">
                    <CardHeader className="flex flex-col md:flex-row items-center justify-between space-y-4 md:space-y-0 pb-6">
                        <div className="flex items-center space-x-3">
                            <HistoryIcon className="h-8 w-8 text-primary" />
                            <div>
                                <CardTitle className="text-2xl font-bold">Parking History</CardTitle>
                                <p className="text-sm text-muted-foreground mt-1">View all vehicle entries and exits</p>
                            </div>
                        </div>

                        <div className="flex w-full md:w-auto items-center space-x-2 gap-2 flex-wrap md:flex-nowrap">
                            <Input
                                type="date"
                                className="w-full md:w-auto"
                                value={selectedDate}
                                onChange={(e) => handleDateChange(e.target.value)}
                            />
                            <div className="relative flex-grow md:w-64">
                                <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                                <Input
                                    placeholder="Search Vehicle or ID..."
                                    className="pl-9"
                                    value={searchTerm}
                                    onChange={(e) => handleSearchChange(e.target.value)}
                                />
                            </div>
                            <Button variant="outline" size="icon" onClick={handleDownloadCSV} title="Download CSV">
                                <Download className="h-4 w-4" />
                            </Button>
                        </div>
                    </CardHeader>
                    <CardContent>
                        {isLoading ? (
                            <div className="flex justify-center items-center h-64">
                                <Loader2 className="h-10 w-10 animate-spin text-primary" />
                            </div>
                        ) : error ? (
                            <div className="text-center text-red-500 py-10">
                                Failed to load history data. Please try again later.
                            </div>
                        ) : (
                            <>
                                <div className="rounded-md border overflow-x-auto">
                                    <Table>
                                        <TableHeader>
                                            <TableRow>
                                                <TableHead>Ticket ID</TableHead>
                                                <TableHead>Vehicle</TableHead>
                                                <TableHead>Slot</TableHead>
                                                <TableHead>Entry Time</TableHead>
                                                <TableHead>Exit Time</TableHead>
                                                <TableHead className="text-right">Status</TableHead>
                                            </TableRow>
                                        </TableHeader>
                                        <TableBody>
                                            {paginatedTickets && paginatedTickets.length > 0 ? (
                                                paginatedTickets.map((ticket) => (
                                                    <TableRow key={ticket._id} className={ticket.status === 'Active' ? 'bg-green-50/50 dark:bg-green-900/10' : ''}>
                                                        <TableCell className="font-mono text-xs">{ticket.ticketNumber}</TableCell>
                                                        <TableCell className="font-bold">{ticket.vehicleNumber}</TableCell>
                                                        <TableCell>
                                                            <Badge variant="outline">{ticket.slotNumber}</Badge>
                                                        </TableCell>
                                                        <TableCell className="text-muted-foreground text-sm">
                                                            {new Date(ticket.entryTime).toLocaleString()}
                                                        </TableCell>
                                                        <TableCell className="text-muted-foreground text-sm">
                                                            {ticket.exitTime ? new Date(ticket.exitTime).toLocaleString() : "-"}
                                                        </TableCell>
                                                        <TableCell className="text-right">
                                                            <Badge variant={ticket.status === 'Active' ? "default" : "secondary"}
                                                                className={ticket.status === 'Active' ? "bg-green-500 hover:bg-green-600" : ""}>
                                                                {ticket.status}
                                                            </Badge>
                                                        </TableCell>
                                                    </TableRow>
                                                ))
                                            ) : (
                                                <TableRow>
                                                    <TableCell colSpan={6} className="h-24 text-center text-muted-foreground">
                                                        No records found.
                                                    </TableCell>
                                                </TableRow>
                                            )}
                                        </TableBody>
                                    </Table>
                                </div>

                                {/* Pagination Controls */}
                                {totalPages > 1 && (
                                    <div className="flex items-center justify-between space-x-2 py-4">
                                        <div className="text-sm text-muted-foreground">
                                            Page {currentPage} of {totalPages} ({filteredTickets?.length} records)
                                        </div>
                                        <div className="space-x-2">
                                            <Button
                                                variant="outline"
                                                size="sm"
                                                onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
                                                disabled={currentPage === 1}
                                            >
                                                Previous
                                            </Button>
                                            <Button
                                                variant="outline"
                                                size="sm"
                                                onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))}
                                                disabled={currentPage === totalPages}
                                            >
                                                Next
                                            </Button>
                                        </div>
                                    </div>
                                )}
                            </>
                        )}
                    </CardContent>
                </Card>
            </main>
            <Footer />
        </div>
    );
};

export default History;
