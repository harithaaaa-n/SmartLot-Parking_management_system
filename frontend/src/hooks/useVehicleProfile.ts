import { useState, useEffect } from 'react';

const STORAGE_KEY = 'my_vehicles';

export const useVehicleProfile = () => {
    const [vehicles, setVehicles] = useState<string[]>([]);

    // Load from local storage on mount
    useEffect(() => {
        const stored = localStorage.getItem(STORAGE_KEY);
        if (stored) {
            try {
                setVehicles(JSON.parse(stored));
            } catch (e) {
                console.error("Failed to parse stored vehicles", e);
            }
        }
    }, []);

    // Sync to local storage whenever vehicles change
    // We don't put this in useEffect with [vehicles] dep to avoid race conditions with initial load
    // Instead, we save explicitly in actions
    const saveToStorage = (newVehicles: string[]) => {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(newVehicles));
        setVehicles(newVehicles);
    };

    const addVehicle = (vehicleNumber: string) => {
        const formatted = vehicleNumber.toUpperCase().trim();
        if (!formatted) return;
        if (vehicles.includes(formatted)) return;

        const newVehicles = [...vehicles, formatted];
        saveToStorage(newVehicles);
    };

    const removeVehicle = (vehicleNumber: string) => {
        const newVehicles = vehicles.filter(v => v !== vehicleNumber);
        saveToStorage(newVehicles);
    };

    return {
        vehicles,
        addVehicle,
        removeVehicle
    };
};
