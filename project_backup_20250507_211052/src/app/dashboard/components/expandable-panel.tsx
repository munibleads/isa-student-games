"use client"

import React, { useState } from 'react';
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { IconAlertTriangle, IconChevronDown, IconChevronRight } from "@tabler/icons-react";
import { cn } from "@/lib/utils";
import { ControlPanel } from "../data/facilities-data";
import { MetricCard } from "./metric-card";
import { getMetricIcon, getMappedControlPanelId } from "../utils/metric-utils";

interface ExpandablePanelProps {
  panel: ControlPanel;
}

export function ExpandablePanel({ panel }: ExpandablePanelProps) {
  const [expanded, setExpanded] = useState(false);
  
  // Check if panel has any critical or warning status
  const hasCritical = Object.values(panel.metrics).some(m => m.status === "critical");
  const hasWarning = Object.values(panel.metrics).some(m => m.status === "warning") && !hasCritical;
  
  return (
    <Card className={cn("mb-4 transition-all", {
      "bg-red-50 dark:bg-red-950/10": hasCritical,
      "bg-amber-50 dark:bg-amber-950/10": hasWarning
    })}>
      <div 
        className="p-4 flex items-center justify-between cursor-pointer"
        onClick={() => setExpanded(!expanded)}
      >
        <div className="flex items-center gap-2">
          {hasCritical && <IconAlertTriangle className="size-5 text-red-600 dark:text-red-400" />}
          {hasWarning && <IconAlertTriangle className="size-5 text-amber-600 dark:text-amber-400" />}
          <h3 className="font-medium">{getMappedControlPanelId(panel.id)} - {panel.name}</h3>
          {hasCritical && (
            <Badge variant="destructive" className="ml-2 text-xs">
              Critical Alert
            </Badge>
          )}
        </div>
        <Button variant="ghost" size="sm" className="ml-2">
          {expanded ? <IconChevronDown className="size-4" /> : <IconChevronRight className="size-4" />}
        </Button>
      </div>
      
      {expanded && (
        <CardContent className="pt-0 px-4 pb-4">
          <div className="flex flex-nowrap gap-4 overflow-x-auto pb-2">
            <MetricCard 
              label="Temperature" 
              value={panel.metrics.temperature.value}
              unit={panel.metrics.temperature.unit}
              trend={panel.metrics.temperature.trend}
              status={panel.metrics.temperature.status}
              icon={getMetricIcon("temperature")}
            />
            <MetricCard 
              label="Humidity" 
              value={panel.metrics.humidity.value}
              unit={panel.metrics.humidity.unit}
              trend={panel.metrics.humidity.trend}
              status={panel.metrics.humidity.status}
              icon={getMetricIcon("humidity")}
            />
            <MetricCard 
              label="Current" 
              value={panel.metrics.current.value}
              unit={panel.metrics.current.unit}
              trend={panel.metrics.current.trend}
              status={panel.metrics.current.status}
              icon={getMetricIcon("current")}
            />
            <MetricCard 
              label="Voltage" 
              value={panel.metrics.voltage.value}
              unit={panel.metrics.voltage.unit}
              trend={panel.metrics.voltage.trend}
              status={panel.metrics.voltage.status}
              icon={getMetricIcon("voltage")}
            />
            <MetricCard 
              label="Vibration" 
              value={panel.metrics.vibration.value}
              unit={panel.metrics.vibration.unit}
              trend={panel.metrics.vibration.trend}
              status={panel.metrics.vibration.status}
              icon={getMetricIcon("vibration")}
            />
          </div>
        </CardContent>
      )}
    </Card>
  );
} 