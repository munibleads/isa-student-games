"use client"

import React, { useState } from 'react';
import { Card, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { IconInfoCircle, IconTrendingUp, IconTrendingDown } from "@tabler/icons-react";
import { cn } from "@/lib/utils";
import { getStatusColor } from "../utils/metric-utils";
import { Area, AreaChart, CartesianGrid, XAxis, YAxis } from "recharts";
import { ChartConfig, ChartContainer, ChartTooltip, ChartTooltipContent } from "@/components/ui/chart";
import { ToggleGroup, ToggleGroupItem } from "@/components/ui/toggle-group";
import { Metric } from "../data/facilities-data";

interface MetricCardProps {
  label: string;
  value: number;
  unit: string;
  trend: string;
  status: string;
  icon: React.ReactNode;
  historyData?: MetricHistoryData;
}

interface MetricDataPoint {
  timestamp: string;
  value: number;
}

interface MetricHistoryData {
  "6h": MetricDataPoint[];
  "1d": MetricDataPoint[];
  "1w": MetricDataPoint[];
}

export function MetricCard({ 
  label, 
  value, 
  unit, 
  trend, 
  status, 
  icon,
  historyData = {
    "6h": Array(6).fill(0).map((_, i) => ({ 
      timestamp: `${i}h`, 
      value: Math.floor(Math.random() * 100) 
    })),
    "1d": Array(8).fill(0).map((_, i) => ({ 
      timestamp: `${i*3}h`, 
      value: Math.floor(Math.random() * 100) 
    })),
    "1w": Array(7).fill(0).map((_, i) => ({ 
      timestamp: `Day ${i+1}`, 
      value: Math.floor(Math.random() * 100) 
    })),
  }
}: MetricCardProps) {
  const [timeRange, setTimeRange] = useState<string>("6h");
  const statusColor = getStatusColor(status);
  const isTrendingUp = trend.includes('+');
  
  const chartData = historyData[timeRange as keyof typeof historyData];
  
  const chartConfig = {
    value: {
      label: label,
      color: statusColor === "green" ? "hsl(142.1 76.2% 36.3%)" :
             statusColor === "amber" ? "hsl(38 92.7% 50.6%)" :
             statusColor === "red" ? "hsl(0 84.2% 60.2%)" : 
             "hsl(215.4 16.3% 46.9%)",
    },
  } satisfies ChartConfig;

  return (
    <Card className={cn(
      "min-w-[180px] flex-1 transition-all @container/card overflow-hidden", 
      {
        "bg-green-50 dark:bg-green-950/20": statusColor === "green",
        "bg-amber-50 dark:bg-amber-950/20": statusColor === "amber",
        "bg-red-50 dark:bg-red-950/20": statusColor === "red",
        "bg-slate-50 dark:bg-slate-900/20": statusColor === "gray"
      }
    )}>
      <CardHeader className="pb-2">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-1 text-sm font-medium">
            <span className={cn({
              "text-green-600 dark:text-green-400": statusColor === "green",
              "text-amber-600 dark:text-amber-400": statusColor === "amber",
              "text-red-600 dark:text-red-400": statusColor === "red",
              "text-slate-600 dark:text-slate-400": statusColor === "gray"
            })}>{icon}</span> {label}
          </div>
          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger asChild>
                <Button variant="ghost" size="sm" className="h-6 w-6 p-0">
                  <IconInfoCircle className="h-4 w-4" />
                  <span className="sr-only">Info</span>
                </Button>
              </TooltipTrigger>
              <TooltipContent>
                <p className="max-w-xs text-xs">
                  {label} readings for this control panel. 
                  {status === "critical" && " Currently at critical levels."}
                  {status === "warning" && " Currently at warning levels."}
                </p>
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>
        </div>
        <CardTitle className="flex items-baseline gap-2 text-xl font-semibold tabular-nums">
          {value}{unit}
          <Badge variant={statusColor === "gray" ? "outline" : "secondary"} className={cn("text-xs", {
            "text-green-600 bg-green-100 dark:bg-green-900/30 dark:text-green-400": statusColor === "green",
            "text-amber-600 bg-amber-100 dark:bg-amber-900/30 dark:text-amber-400": statusColor === "amber",
            "text-red-600 bg-red-100 dark:bg-red-900/30 dark:text-red-400": statusColor === "red",
            "text-slate-600 dark:text-slate-400": statusColor === "gray"
          })}>
            {isTrendingUp ? (
              <IconTrendingUp className="size-3 mr-0.5" />
            ) : (
              <IconTrendingDown className="size-3 mr-0.5" />
            )}
            {trend}
          </Badge>
        </CardTitle>
        
        <div className="mt-3">
          <ToggleGroup type="single" value={timeRange} onValueChange={(value) => value && setTimeRange(value)} className="flex justify-center mb-2 gap-1">
            <ToggleGroupItem value="6h" size="sm" className="text-xs h-6">6h</ToggleGroupItem>
            <ToggleGroupItem value="1d" size="sm" className="text-xs h-6">1d</ToggleGroupItem>
            <ToggleGroupItem value="1w" size="sm" className="text-xs h-6">1w</ToggleGroupItem>
          </ToggleGroup>
          
          <div className="h-32">
            <ChartContainer config={chartConfig}>
              <AreaChart
                accessibilityLayer
                data={chartData}
                margin={{
                  top: 5,
                  right: 5,
                  left: 5,
                  bottom: 15,
                }}
              >
                <defs>
                  <linearGradient id={`fill-${label}`} x1="0" y1="0" x2="0" y2="1">
                    <stop
                      offset="5%"
                      stopColor={chartConfig.value.color}
                      stopOpacity={0.8}
                    />
                    <stop
                      offset="95%"
                      stopColor={chartConfig.value.color}
                      stopOpacity={0.1}
                    />
                  </linearGradient>
                </defs>
                <XAxis
                  dataKey="timestamp"
                  tickLine={false}
                  axisLine={false}
                  tick={{ fontSize: 10 }}
                  height={20}
                />
                <YAxis hide domain={['dataMin - 5', 'dataMax + 5']} />
                <ChartTooltip cursor={false} content={<ChartTooltipContent />} />
                <Area
                  dataKey="value"
                  type="monotone"
                  fill={`url(#fill-${label})`}
                  fillOpacity={0.4}
                  stroke={chartConfig.value.color}
                  strokeWidth={1.5}
                  animationDuration={500}
                />
              </AreaChart>
            </ChartContainer>
          </div>
        </div>
      </CardHeader>
    </Card>
  );
} 