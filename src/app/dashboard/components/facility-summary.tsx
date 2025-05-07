"use client"

import React from 'react';
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { cn } from "@/lib/utils";
import { Facility } from "../data/facilities-data";

interface FacilitySummaryProps {
  facility: Facility;
}

export function FacilitySummary({ facility }: FacilitySummaryProps) {
  // Count metrics by status
  const counts = { normal: 0, warning: 0, critical: 0 };
  let totalMetrics = 0;
  
  facility.controlPanels.forEach(panel => {
    Object.values(panel.metrics).forEach(metric => {
      counts[metric.status as keyof typeof counts]++;
      totalMetrics++;
    });
  });
  
  // Calculate percentages
  const percentages = {
    normal: Math.round((counts.normal / totalMetrics) * 100),
    warning: Math.round((counts.warning / totalMetrics) * 100),
    critical: Math.round((counts.critical / totalMetrics) * 100)
  };
  
  return (
    <Card className="p-4">
      <CardHeader className="p-0 pb-4">
        <div className="flex items-center justify-between">
          <CardTitle className="text-lg font-medium">Facility Health Summary</CardTitle>
          <Badge 
            variant={facility.status === "Operational" ? "outline" : "destructive"}
            className={cn({
              "border-green-500 text-green-500": facility.status === "Operational"
            })}
          >
            {facility.status}
          </Badge>
        </div>
      </CardHeader>
      <CardContent className="p-0">
        <div className="grid grid-cols-3 gap-4">
          <div className="text-center">
            <div className="text-2xl font-semibold text-green-500">{counts.normal}</div>
            <div className="text-sm text-muted-foreground">Normal</div>
            <Progress value={percentages.normal} max={100} className="h-1.5 mt-1" 
              indicatorClassName="bg-green-500" />
          </div>
          <div className="text-center">
            <div className="text-2xl font-semibold text-amber-500">{counts.warning}</div>
            <div className="text-sm text-muted-foreground">Warning</div>
            <Progress value={percentages.warning} max={100} className="h-1.5 mt-1" 
              indicatorClassName="bg-amber-500" />
          </div>
          <div className="text-center">
            <div className="text-2xl font-semibold text-red-500">{counts.critical}</div>
            <div className="text-sm text-muted-foreground">Critical</div>
            <Progress value={percentages.critical} max={100} className="h-1.5 mt-1" 
              indicatorClassName="bg-red-500" />
          </div>
        </div>
      </CardContent>
    </Card>
  );
} 