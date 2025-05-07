"use client"

import React from 'react';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { IconAlertTriangle } from "@tabler/icons-react";
import { Facility, ControlPanel } from "../data/facilities-data";
import { getMetricIcon, getStatusColor, getMappedControlPanelId } from "../utils/metric-utils";

interface MiniViewProps {
  facility: Facility;
}

export function MiniView({ facility }: MiniViewProps) {
  const sortedPanels = [...facility.controlPanels].sort((a, b) => {
    const aCritical = Object.values(a.metrics).some(m => m.status === "critical") ? 2 :
                     Object.values(a.metrics).some(m => m.status === "warning") ? 1 : 0;
                     
    const bCritical = Object.values(b.metrics).some(m => m.status === "critical") ? 2 :
                     Object.values(b.metrics).some(m => m.status === "warning") ? 1 : 0;
                     
    return bCritical - aCritical;
  });
  
  return (
    <div className="space-y-4">
      <Table className="border rounded-md">
        <TableHeader className="bg-muted/50">
          <TableRow>
            <TableHead className="w-[180px]">Panel</TableHead>
            <TableHead>Temp</TableHead>
            <TableHead>Humidity</TableHead>
            <TableHead>Current</TableHead>
            <TableHead>Voltage</TableHead>
            <TableHead>Vibration</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {sortedPanels.map((panel) => (
            <TableRow key={panel.id}>
              <TableCell className="font-medium">
                <div className="flex items-center space-x-2">
                  {Object.values(panel.metrics).some(m => m.status === "critical") && 
                    <IconAlertTriangle className="h-4 w-4 text-red-500" />}
                  {getMappedControlPanelId(panel.id)} - {panel.name}
                </div>
              </TableCell>
              <MetricTableCell metric={panel.metrics.temperature} />
              <MetricTableCell metric={panel.metrics.humidity} />
              <MetricTableCell metric={panel.metrics.current} />
              <MetricTableCell metric={panel.metrics.voltage} />
              <MetricTableCell metric={panel.metrics.vibration} />
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
}

interface MetricTableCellProps {
  metric: {
    value: number;
    unit: string;
    trend: string;
    status: string;
  };
}

function MetricTableCell({ metric }: MetricTableCellProps) {
  const statusColor = getStatusColor(metric.status);
  const isTrendingUp = metric.trend.includes('+');
  
  return (
    <TableCell>
      <div className={`flex items-center space-x-1 ${
        statusColor === "red" ? "text-red-500" :
        statusColor === "amber" ? "text-amber-500" :
        "text-muted-foreground"
      }`}>
        <span className="font-medium">{metric.value}{metric.unit}</span>
        <Badge variant="outline" className="text-[10px] px-1 h-4">
          {metric.trend}
        </Badge>
      </div>
    </TableCell>
  );
} 