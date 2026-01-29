import { useState } from "react";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import SectionWrapper from "@/components/SectionWrapper";
import { useQuery } from "@tanstack/react-query";
import { fetchParkingHistory } from "@/api/api";
import { Loader2, Calendar, Search } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";

const ParkingHistory = () => {
    const [searchTerm, setSearchTerm] = useState("");
    const [selectedDate, setSelectedDate] = useState("");
    const [statusFilter, setStatusFilter] = useState("all");
    const [sortConfig, setSortConfig] = useState<{ key: string; direction: 'asc' | 'desc' } | null>({ key: 'entryTime', direction: 'desc' });
    const [currentPage, setCurrentPage] = useState(1);
    const ITEMS_PER_PAGE = 20;

    const { data: history = [], isLoading } = useQuery({
        queryKey: ['parkingHistory'],
        queryFn: fetchParkingHistory,
        refetchInterval: 10000,
    });

    // Reset pagination on filter change
    const handleSearchChange = (val: string) => { setSearchTerm(val); setCurrentPage(1); };
    const handleStatusChange = (val: string) => { setStatusFilter(val); setCurrentPage(1); };
    const handleDateChange = (val: string) => { setSelectedDate(val); setCurrentPage(1); };

    const filteredHistory = history.filter((item: any) => {
        const matchesSearch = item.vehicleNumber.toLowerCase().includes(searchTerm.toLowerCase()) ||
            item.slotNumber.toLowerCase().includes(searchTerm.toLowerCase());
        const matchesStatus = statusFilter === 'all' ? true : item.status.toLowerCase() === statusFilter;

        const matchesDate = selectedDate
            ? new Date(item.entryTime).toLocaleDateString('en-CA') === selectedDate
            : true;

        return matchesSearch && matchesStatus && matchesDate;
    });

    const sortedHistory = [...filteredHistory].sort((a: any, b: any) => {
        if (!sortConfig) return 0;
        const { key, direction } = sortConfig;

        let aValue = a[key];
        let bValue = b[key];

        // Handle special cases
        if (key === 'duration') {
            // Simple parse assuming format "X mins" or "Active"
            aValue = aValue === 'Active' ? -1 : parseInt(aValue);
            bValue = bValue === 'Active' ? -1 : parseInt(bValue);
        }

        if (aValue < bValue) return direction === 'asc' ? -1 : 1;
        if (aValue > bValue) return direction === 'asc' ? 1 : -1;
        return 0;
    });

    const totalPages = Math.ceil((sortedHistory.length || 0) / ITEMS_PER_PAGE);
    const paginatedHistory = sortedHistory.slice((currentPage - 1) * ITEMS_PER_PAGE, currentPage * ITEMS_PER_PAGE);

    const handleSort = (key: string) => {
        let direction: 'asc' | 'desc' = 'asc';
        if (sortConfig && sortConfig.key === key && sortConfig.direction === 'asc') {
            direction = 'desc';
        }
        setSortConfig({ key, direction });
    };

    return (
        <div className="min-h-screen flex flex-col bg-gray-50 dark:bg-gray-900">
            <Header />
            <main className="flex-grow p-4 md:p-8 container mx-auto">
                <SectionWrapper id="parking-history" title="Parking History" className="bg-transparent">
                    <div className="flex flex-col md:flex-row justify-between items-center mb-6 gap-4">
                        <p className="text-muted-foreground mr-auto text-lg">
                            Log of all past and active parking sessions.
                        </p>

                        <div className="flex flex-col sm:flex-row gap-3 w-full md:w-auto flex-wrap md:flex-nowrap items-center">
                            {/* Date Filter */}
                            <Input
                                type="date"
                                className="w-full md:w-auto h-10 bg-background"
                                value={selectedDate}
                                onChange={(e) => handleDateChange(e.target.value)}
                            />

                            {/* Status Filter */}
                            <div className="relative">
                                <select
                                    className="h-10 w-full md:w-[140px] appearance-none rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                                    value={statusFilter}
                                    onChange={(e) => handleStatusChange(e.target.value)}
                                >
                                    <option value="all">All Status</option>
                                    <option value="active">Active</option>
                                    <option value="completed">Completed</option>
                                </select>
                            </div>

                            <div className="relative w-full md:w-64">
                                <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
                                <Input
                                    placeholder="Search Vehicle or Slot..."
                                    value={searchTerm}
                                    onChange={(e) => handleSearchChange(e.target.value)}
                                    className="pl-8 bg-background"
                                />
                            </div>
                        </div>
                    </div>

                    <div className="bg-card rounded-xl shadow-sm border border-border overflow-hidden">
                        <Table>
                            <TableHeader className="bg-muted/50">
                                <TableRow>
                                    <TableHead>Vehicle No.</TableHead>
                                    <TableHead>Slot</TableHead>
                                    <TableHead
                                        className="cursor-pointer hover:text-primary transition-colors select-none"
                                        onClick={() => handleSort('entryTime')}
                                    >
                                        Entry Time {sortConfig?.key === 'entryTime' && (sortConfig.direction === 'asc' ? '↑' : '↓')}
                                    </TableHead>
                                    <TableHead>Exit Time</TableHead>
                                    <TableHead
                                        className="cursor-pointer hover:text-primary transition-colors select-none"
                                        onClick={() => handleSort('duration')}
                                    >
                                        Duration {sortConfig?.key === 'duration' && (sortConfig.direction === 'asc' ? '↑' : '↓')}
                                    </TableHead>
                                    <TableHead>Amount</TableHead>
                                    <TableHead>Status</TableHead>
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                {isLoading ? (
                                    <TableRow>
                                        <TableCell colSpan={7} className="h-32 text-center">
                                            <div className="flex justify-center items-center text-muted-foreground">
                                                <Loader2 className="h-6 w-6 animate-spin text-primary mr-2" />
                                                Loading records...
                                            </div>
                                        </TableCell>
                                    </TableRow>
                                ) : paginatedHistory.length === 0 ? (
                                    <TableRow>
                                        <TableCell colSpan={7} className="h-32 text-center text-muted-foreground italic">
                                            No matching records found.
                                        </TableCell>
                                    </TableRow>
                                ) : (
                                    paginatedHistory.map((item: any) => (
                                        <TableRow key={item.id} className="hover:bg-muted/50 transition-colors">
                                            <TableCell className="font-mono font-bold text-foreground">{item.vehicleNumber}</TableCell>
                                            <TableCell><Badge variant="outline" className="font-normal">{item.slotNumber}</Badge></TableCell>
                                            <TableCell>{new Date(item.entryTime).toLocaleString("en-IN", { timeZone: "Asia/Kolkata", hour12: true })}</TableCell>
                                            <TableCell>{item.exitTime ? new Date(item.exitTime).toLocaleString("en-IN", { timeZone: "Asia/Kolkata", hour12: true }) : "-"}</TableCell>
                                            <TableCell>{item.duration}</TableCell>
                                            <TableCell className="font-semibold">₹{item.amount}</TableCell>
                                            <TableCell>
                                                {item.status === 'Active' ? (
                                                    <Badge className="bg-green-100 text-green-800 hover:bg-green-200 border-green-200 dark:bg-green-900/30 dark:text-green-300 dark:border-green-800">Active</Badge>
                                                ) : (
                                                    <Badge variant="secondary">Completed</Badge>
                                                )}
                                            </TableCell>
                                        </TableRow>
                                    ))
                                )}
                            </TableBody>
                        </Table>
                    </div>

                    {/* Pagination Controls */}
                    {totalPages > 1 && (
                        <div className="flex items-center justify-between space-x-2 py-4">
                            <div className="text-sm text-muted-foreground">
                                Page {currentPage} of {totalPages} ({filteredHistory.length} records)
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
                </SectionWrapper>
            </main>
            <Footer />
        </div>
    );
};

export default ParkingHistory;
