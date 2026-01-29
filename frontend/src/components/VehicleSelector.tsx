import React, { useState } from 'react';
import { useVehicleProfile } from '@/hooks/useVehicleProfile';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Plus, Trash2, Car, History, ChevronDown, Save } from 'lucide-react';
import { validateVehicleNumber } from '@/utils/validation';

interface VehicleSelectorProps {
    value: string;
    onChange: (value: string) => void;
    disabled?: boolean;
}

const VehicleSelector: React.FC<VehicleSelectorProps> = ({ value, onChange, disabled }) => {
    const { vehicles, addVehicle, removeVehicle } = useVehicleProfile();
    const [validationError, setValidationError] = useState<string | null>(null);

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        // Enforce upper case immediately
        const val = e.target.value.toUpperCase();
        onChange(val);

        // Instant feedback validation (optional, maybe too noisy?)
        // Let's validate only if not empty to clear errors
        if (validationError) setValidationError(null);
    };

    const handleSave = () => {
        const validation = validateVehicleNumber(value);
        if (!validation.isValid) {
            setValidationError(validation.error || "Invalid format");
            return;
        }

        // Prevent duplicates
        if (vehicles.includes(value)) {
            setValidationError("Vehicle already saved");
            return;
        }

        addVehicle(value);
        setValidationError(null);
    };

    const handleDelete = (e: React.MouseEvent, v: string) => {
        e.stopPropagation();
        removeVehicle(v);
        if (value === v) onChange("");
    };

    const isSaved = vehicles.includes(value);
    const isValid = validateVehicleNumber(value).isValid;

    return (
        <div className="space-y-2">
            <Label>Vehicle Number</Label>

            {/* Saved Vehicles Chips */}
            {vehicles.length > 0 && (
                <div className="flex flex-wrap gap-2 mb-2 animate-in slide-in-from-top-2">
                    {vehicles.map((v) => (
                        <div
                            key={v}
                            className={`flex items-center px-3 py-1 text-xs font-mono font-medium rounded-full border cursor-pointer transition-colors
                                ${value === v
                                    ? "bg-primary text-primary-foreground border-primary"
                                    : "bg-secondary text-secondary-foreground hover:bg-secondary/80 border-transparent"
                                }`}
                            onClick={() => onChange(v)}
                        >
                            {v}
                            <button
                                onClick={(e) => handleDelete(e, v)}
                                className={`ml-2 rounded-full p-0.5 hover:bg-black/20 ${value === v ? "text-primary-foreground" : "text-muted-foreground"}`}
                                title="Remove"
                            >
                                <Trash2 className="h-3 w-3" />
                            </button>
                        </div>
                    ))}
                </div>
            )}

            <div className="flex gap-2">
                <div className="relative flex-grow">
                    <Car className="absolute left-3 top-2.5 h-4 w-4 text-muted-foreground" />
                    <Input
                        value={value}
                        onChange={handleInputChange}
                        placeholder="TN01AB1234"
                        className={`pl-9 font-mono uppercase ${validationError ? "border-red-500 focus-visible:ring-red-500" : ""}`}
                        disabled={disabled}
                    />
                </div>
            </div>

            {/* Validation Error Message */}
            {validationError && (
                <p className="text-xs text-red-500 font-medium animate-in slide-in-from-top-1">
                    {validationError}
                </p>
            )}

            {/* Save Option */}
            {value && isValid && !isSaved && (
                <div className="flex items-center justify-between text-xs bg-muted/50 p-2 rounded animate-in fade-in">
                    <span className="text-muted-foreground">Save {value} for next time?</span>
                    <Button
                        size="sm"
                        variant="ghost"
                        className="h-6 px-2 text-primary"
                        onClick={handleSave}
                        type="button"
                    >
                        <Save className="h-3 w-3 mr-1" /> Save
                    </Button>
                </div>
            )}
        </div>
    );
};

export default VehicleSelector;
