import React from 'react';
import { cn } from "@/lib/utils";
import { Car, Check, X } from "lucide-react";

interface ParkingSlotProps {
  id: string;
  status: 'available' | 'occupied' | 'maintenance';
}

const ParkingSlot: React.FC<ParkingSlotProps> = ({ id, status }) => {
  let imageSrc = "/iso_parking_empty.png";
  let statusColor = "text-green-400"; // Default glow

  if (status === 'occupied') {
    imageSrc = "/iso_parking_occupied.png";
    statusColor = "text-red-400";
  } else if (status === 'maintenance') {
    imageSrc = "/iso_parking_maintenance.png";
    statusColor = "text-orange-400";
  }

  return (
    <div className="relative group flex flex-col items-center justify-center transition-transform duration-300 hover:-translate-y-2 hover:scale-105">
      {/* Isometric Image */}
      <div className="relative w-full aspect-square filter drop-shadow-[0_10px_10px_rgba(0,0,0,0.5)]">
        <img
          src={imageSrc}
          alt={`Slot ${id} - ${status}`}
          className="w-full h-full object-contain"
        />

        {/* Glowing Slot ID Overlay - Positioned to look like it's hovering over the slot */}
        <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 z-10">
          <span className={cn(
            "text-lg font-bold tracking-widest px-2 py-0.5 rounded-md bg-black/40 backdrop-blur-md border border-white/10 shadow-[0_0_15px_currentColor]",
            statusColor
          )}>
            {id}
          </span>
        </div>
      </div>
    </div>
  );
};

export default ParkingSlot;