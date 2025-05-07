"use client"

import React from 'react';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { cn } from "@/lib/utils";
import { getStatusColor } from "../utils/metric-utils";

interface HeatmapCellProps {
  value: number;
  max: number;
  status: string;
  label: string;
}

export function HeatmapCell({ value, max, status, label }: HeatmapCellProps) {
  const statusColor = getStatusColor(status);
  
  return (
    <TooltipProvider>
      <Tooltip>
        <TooltipTrigger asChild>
          <div 
            className={cn("h-10 rounded-md flex items-center justify-center cursor-pointer transition-all hover:opacity-80", {
              "bg-green-100": statusColor === "green",
              "bg-amber-100": statusColor === "amber",
              "bg-red-100": statusColor === "red"
            })}
          >
            <span className={cn("text-sm font-medium", {
              "text-green-700": statusColor === "green",
              "text-amber-700": statusColor === "amber",
              "text-red-700": statusColor === "red"
            })}>
              {value}
            </span>
          </div>
        </TooltipTrigger>
        <TooltipContent>
          <div className="text-xs">
            <p className="font-medium">{label}</p>
            <p>Value: {value}</p>
            <p>Status: {status.charAt(0).toUpperCase() + status.slice(1)}</p>
          </div>
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
  );
} 