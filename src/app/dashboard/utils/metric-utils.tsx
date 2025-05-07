import React from 'react';
import { IconTemperature, IconDroplet, IconBolt, IconWaveSine, IconPlugConnected, IconSmokingNo } from "@tabler/icons-react";

export const getStatusColor = (status: string): string => {
  switch (status) {
    case "normal":
      return "green";
    case "warning":
      return "amber";
    case "critical":
      return "red";
    default:
      return "gray";
  }
};

export const getMetricIcon = (metric: string): React.ReactNode => {
  switch (metric) {
    case "temperature":
      return <IconTemperature className="size-4" />;
    case "humidity":
      return <IconDroplet className="size-4" />;
    case "current":
      return <IconBolt className="size-4" />;
    case "voltage":
      return <IconPlugConnected className="size-4" />;
    case "vibration":
      return <IconWaveSine className="size-4" />;
    case "smoke":
      return <IconSmokingNo className="size-4" />;
    default:
      return null;
  }
};

// Map original panel IDs to new CX### format
export const getMappedControlPanelId = (panelId: string): string => {
  const mapping: { [key: string]: string } = {
    // Raw Materials Processing Center (Facility 1)
    "A1": "CX101",
    "A2": "CX102",
    "A3": "CX103",
    "A4": "CX104",
    // Catalyst Manufacturing Plant (Facility 2)
    "B1": "CX201",
    "B2": "CX202",
    "B3": "CX203",
    "B4": "CX204",
    // Finished Products Plant (Facility 3)
    "C1": "CX301",
    "C2": "CX302",
    "C3": "CX303",
    "C4": "CX304"
  };
  
  return mapping[panelId] || panelId;
}; 