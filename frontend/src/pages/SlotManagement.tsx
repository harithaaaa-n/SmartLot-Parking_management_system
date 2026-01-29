import { useState } from "react";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import SectionWrapper from "@/components/SectionWrapper";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { fetchSlots, createSlot, updateSlotStatus, deleteSlot } from "@/api/api";
import { Loader2, Plus, Trash2, Power, PowerOff, AlertCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table";
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
    DialogFooter,
    DialogDescription,
} from "@/components/ui/dialog";
import { Badge } from "@/components/ui/badge";
import { showSuccess, showError } from "@/utils/toast";

const SlotManagement = () => {
    const queryClient = useQueryClient();
    const [newSlotNumber, setNewSlotNumber] = useState("");
    const [isAddOpen, setIsAddOpen] = useState(false);

    // Fetch Slots
    const { data: slots = [], isLoading } = useQuery({
        queryKey: ['adminSlots'],
        queryFn: fetchSlots,
    });

    // Mutations
    const createMutation = useMutation({
        mutationFn: createSlot,
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['adminSlots'] });
            showSuccess("Slot created successfully");
            setIsAddOpen(false);
            setNewSlotNumber("");
        },
        onError: (err: Error) => showError(err.message),
    });

    const updateStatusMutation = useMutation({
        mutationFn: ({ id, status }: { id: string; status: string }) =>
            updateSlotStatus(id, status),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['adminSlots'] });
            showSuccess("Slot status updated");
        },
        onError: (err: Error) => showError(err.message),
    });

    const deleteMutation = useMutation({
        mutationFn: deleteSlot,
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['adminSlots'] });
            showSuccess("Slot deleted successfully");
        },
        onError: (err: Error) => showError(err.message),
    });

    const handleCreate = () => {
        if (!newSlotNumber.trim()) return;
        createMutation.mutate(newSlotNumber.toUpperCase());
    };

    const toggleMaintenance = (slotNumber: string, currentStatus: string) => {
        // If currently maintenance, set to Available. If not, set to Maintenance.
        const newStatus = currentStatus === 'maintenance' ? 'Available' : 'Maintenance';
        updateStatusMutation.mutate({ id: slotNumber, status: newStatus });
    };

    return (
        <div className="min-h-screen flex flex-col bg-gray-50 dark:bg-gray-900">
            <Header />
            <main className="flex-grow">
                <SectionWrapper id="slot-management" title="Slot Management" className="bg-transparent">
                    <div className="flex justify-between items-center mb-6">
                        <p className="text-muted-foreground">
                            Configure parking slots, enable maintenance mode, or remove unused slots.
                        </p>

                        <Dialog open={isAddOpen} onOpenChange={setIsAddOpen}>
                            <DialogTrigger asChild>
                                <Button><Plus className="mr-2 h-4 w-4" /> Add Slot</Button>
                            </DialogTrigger>
                            <DialogContent>
                                <DialogHeader>
                                    <DialogTitle>Add New Parking Slot</DialogTitle>
                                    <DialogDescription>
                                        Enter the slot identifier (e.g., A01, B12).
                                    </DialogDescription>
                                </DialogHeader>
                                <div className="py-4">
                                    <Input
                                        placeholder="Slot Number (e.g. C01)"
                                        value={newSlotNumber}
                                        onChange={(e) => setNewSlotNumber(e.target.value)}
                                    />
                                </div>
                                <DialogFooter>
                                    <Button onClick={handleCreate} disabled={createMutation.isPending}>
                                        {createMutation.isPending && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                                        Create Slot
                                    </Button>
                                </DialogFooter>
                            </DialogContent>
                        </Dialog>
                    </div>

                    <div className="bg-white dark:bg-card rounded-lg shadow border overflow-hidden">
                        <Table>
                            <TableHeader>
                                <TableRow>
                                    <TableHead>Slot Number</TableHead>
                                    <TableHead>Status</TableHead>
                                    <TableHead className="text-right">Actions</TableHead>
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                {isLoading ? (
                                    <TableRow>
                                        <TableCell colSpan={3} className="h-24 text-center">
                                            <div className="flex justify-center items-center">
                                                <Loader2 className="h-6 w-6 animate-spin text-primary mr-2" />
                                                Loading slots...
                                            </div>
                                        </TableCell>
                                    </TableRow>
                                ) : slots.length === 0 ? (
                                    <TableRow>
                                        <TableCell colSpan={3} className="h-24 text-center text-muted-foreground">
                                            No slots found. Create one to get started.
                                        </TableCell>
                                    </TableRow>
                                ) : (
                                    slots.map((slot) => (
                                        <TableRow key={slot._id}>
                                            <TableCell className="font-mono font-bold text-lg">{slot.slotNumber}</TableCell>
                                            <TableCell>
                                                {slot.status === 'available' && <Badge className="bg-green-100 text-green-800 hover:bg-green-200 border-none">Available</Badge>}
                                                {slot.status === 'occupied' && <Badge className="bg-red-100 text-red-800 hover:bg-red-200 border-none">Occupied</Badge>}
                                                {slot.status === 'maintenance' && <Badge className="bg-yellow-100 text-yellow-800 hover:bg-yellow-200 border-none">Maintenance</Badge>}
                                            </TableCell>
                                            <TableCell className="text-right space-x-2">
                                                <Button
                                                    variant="ghost"
                                                    size="sm"
                                                    className={slot.status === 'maintenance' ? "text-green-600 hover:text-green-700 hover:bg-green-50" : "text-yellow-600 hover:text-yellow-700 hover:bg-yellow-50"}
                                                    onClick={() => toggleMaintenance(slot.slotNumber, slot.status)}
                                                    disabled={slot.status === 'occupied'}
                                                    title={slot.status === 'occupied' ? "Cannot change status while Occupied" : (slot.status === 'maintenance' ? "Enable Slot" : "Disable Slot (Maintenance)")}
                                                >
                                                    {slot.status === 'maintenance' ? <Power className="h-4 w-4" /> : <PowerOff className={`h-4 w-4 ${slot.status === 'occupied' ? 'opacity-50' : ''}`} />}
                                                </Button>

                                                <Button
                                                    variant="ghost"
                                                    size="sm"
                                                    className="text-red-600 hover:text-red-700 hover:bg-red-50"
                                                    onClick={() => {
                                                        if (window.confirm(`Delete slot ${slot.slotNumber}? This cannot be undone.`)) {
                                                            deleteMutation.mutate(slot.slotNumber);
                                                        }
                                                    }}
                                                    title="Delete Slot"
                                                >
                                                    <Trash2 className="h-4 w-4" />
                                                </Button>
                                            </TableCell>
                                        </TableRow>
                                    ))
                                )}
                            </TableBody>
                        </Table>
                    </div>
                </SectionWrapper>
            </main>
            <Footer />
        </div>
    );
};

export default SlotManagement;
