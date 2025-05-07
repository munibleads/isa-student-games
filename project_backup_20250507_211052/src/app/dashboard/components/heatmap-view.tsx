"use client"

import React from 'react';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";
import { IconTemperature, IconDroplet, IconBolt, IconWaveSine, IconPlugConnected } from "@tabler/icons-react";
import { Facility } from "../data/facilities-data";
import { HeatmapCell } from "./heatmap-cell";
import { getMappedControlPanelId } from "../utils/metric-utils";

interface HeatmapViewProps {
  facility: Facility;
}

export function HeatmapView({ facility }: HeatmapViewProps) {
  // Define max values for each type of metric
  const maxValues = {
    temperature: 100, // °C
    humidity: 100,    // %
    current: 20,      // A
    voltage: 250,     // V
    vibration: 6      // mm/s
  };
  
  return (
    <Card className="p-6">
      <CardHeader className="p-0 pb-4">
        <CardTitle className="text-lg font-medium">Metrics Heatmap</CardTitle>
        <CardDescription>Visual overview of all control panel metrics</CardDescription>
      </CardHeader>
      <CardContent className="p-0">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr>
                <th className="text-sm font-medium text-left p-2">Control Panel</th>
                <th className="text-sm font-medium text-center p-2">
                  <span className="flex items-center justify-center gap-1">
                    <IconTemperature className="size-4" /> Temperature
                  </span>
                </th>
                <th className="text-sm font-medium text-center p-2">
                  <span className="flex items-center justify-center gap-1">
                    <IconDroplet className="size-4" /> Humidity
                  </span>
                </th>
                <th className="text-sm font-medium text-center p-2">
                  <span className="flex items-center justify-center gap-1">
                    <IconBolt className="size-4" /> Current
                  </span>
                </th>
                <th className="text-sm font-medium text-center p-2">
                  <span className="flex items-center justify-center gap-1">
                    <IconPlugConnected className="size-4" /> Voltage
                  </span>
                </th>
                <th className="text-sm font-medium text-center p-2">
                  <span className="flex items-center justify-center gap-1">
                    <IconWaveSine className="size-4" /> Vibration
                  </span>
                </th>
              </tr>
            </thead>
            <tbody>
              {facility.controlPanels.map(panel => (
                <tr key={panel.id}>
                  <td className="p-2 font-medium">{getMappedControlPanelId(panel.id)} - {panel.name}</td>
                  <td className="p-2">
                    <HeatmapCell 
                      value={panel.metrics.temperature.value} 
                      max={maxValues.temperature}
                      status={panel.metrics.temperature.status}
                      label={`Temperature: ${panel.metrics.temperature.value}${panel.metrics.temperature.unit} (${panel.metrics.temperature.trend})`}
                    />
                  </td>
                  <td className="p-2">
                    <HeatmapCell 
                      value={panel.metrics.humidity.value} 
                      max={maxValues.humidity}
                      status={panel.metrics.humidity.status}
                      label={`Humidity: ${panel.metrics.humidity.value}${panel.metrics.humidity.unit} (${panel.metrics.humidity.trend})`}
                    />
                  </td>
                  <td className="p-2">
                    <HeatmapCell 
                      value={panel.metrics.current.value} 
                      max={maxValues.current}
                      status={panel.metrics.current.status}
                      label={`Current: ${panel.metrics.current.value}${panel.metrics.current.unit} (${panel.metrics.current.trend})`}
                    />
                  </td>
                  <td className="p-2">
                    <HeatmapCell 
                      value={panel.metrics.voltage.value} 
                      max={maxValues.voltage}
                      status={panel.metrics.voltage.status}
                      label={`Voltage: ${panel.metrics.voltage.value}${panel.metrics.voltage.unit} (${panel.metrics.voltage.trend})`}
                    />
                  </td>
                  <td className="p-2">
                    <HeatmapCell 
                      value={panel.metrics.vibration.value} 
                      max={maxValues.vibration}
                      status={panel.metrics.vibration.status}
                      label={`Vibration: ${panel.metrics.vibration.value}${panel.metrics.vibration.unit} (${panel.metrics.vibration.trend})`}
                    />
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </CardContent>
    </Card>
  );
} 