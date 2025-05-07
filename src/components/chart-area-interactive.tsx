"use client"

import * as React from "react"
import { Area, AreaChart, CartesianGrid, ResponsiveContainer, XAxis, YAxis, Tooltip } from "recharts"

import { useIsMobile } from "@/hooks/use-mobile"
import {
  Card,
  CardAction,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import {
  ChartConfig,
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import {
  ToggleGroup,
  ToggleGroupItem,
} from "@/components/ui/toggle-group"

export const description = "An interactive area chart"

const chartData = [
  { date: "2024-06-01", temperature: 65.2, humidity: 58, load: 72, predictedTemp: 65.4 },
  { date: "2024-06-02", temperature: 65.6, humidity: 57, load: 74, predictedTemp: 66.0 },
  { date: "2024-06-03", temperature: 66.3, humidity: 60, load: 75, predictedTemp: 66.8 },
  { date: "2024-06-04", temperature: 66.8, humidity: 61, load: 77, predictedTemp: 67.5 },
  { date: "2024-06-05", temperature: 67.2, humidity: 62, load: 75, predictedTemp: 68.1 },
  { date: "2024-06-06", temperature: 67.5, humidity: 63, load: 78, predictedTemp: 68.5 },
  { date: "2024-06-07", temperature: 67.8, humidity: 61, load: 79, predictedTemp: 69.0 },
  { date: "2024-06-08", temperature: 68.1, humidity: 60, load: 80, predictedTemp: 69.3 },
  { date: "2024-06-09", temperature: 68.4, humidity: 62, load: 82, predictedTemp: 69.6 },
  { date: "2024-06-10", temperature: 68.9, humidity: 63, load: 81, predictedTemp: 70.1 },
  { date: "2024-06-11", temperature: 69.3, humidity: 64, load: 83, predictedTemp: 70.5 },
  { date: "2024-06-12", temperature: 69.5, humidity: 63, load: 82, predictedTemp: 70.8 },
  { date: "2024-06-13", temperature: 69.8, humidity: 62, load: 84, predictedTemp: 71.2 },
  { date: "2024-06-14", temperature: 70.2, humidity: 61, load: 83, predictedTemp: 71.6 },
  { date: "2024-06-15", temperature: 70.4, humidity: 60, load: 85, predictedTemp: 72.0 },
  { date: "2024-06-16", temperature: 70.8, humidity: 59, load: 86, predictedTemp: 72.5 },
  { date: "2024-06-17", temperature: 71.1, humidity: 60, load: 85, predictedTemp: 73.0 },
  { date: "2024-06-18", temperature: 71.4, humidity: 61, load: 84, predictedTemp: 73.4 },
  { date: "2024-06-19", temperature: 71.8, humidity: 62, load: 83, predictedTemp: 73.9 },
  { date: "2024-06-20", temperature: 72.1, humidity: 63, load: 84, predictedTemp: 74.4 },
  { date: "2024-06-21", temperature: 72.5, humidity: 62, load: 85, predictedTemp: 74.9 },
  // Future predictions (after current date)
  { date: "2024-06-22", temperature: null, humidity: null, load: null, predictedTemp: 75.3 },
  { date: "2024-06-23", temperature: null, humidity: null, load: null, predictedTemp: 75.8 },
  { date: "2024-06-24", temperature: null, humidity: null, load: null, predictedTemp: 76.4 },
  { date: "2024-06-25", temperature: null, humidity: null, load: null, predictedTemp: 77.0 },
  { date: "2024-06-26", temperature: null, humidity: null, load: null, predictedTemp: 77.6 },
  { date: "2024-06-27", temperature: null, humidity: null, load: null, predictedTemp: 78.3 },
  { date: "2024-06-28", temperature: null, humidity: null, load: null, predictedTemp: 79.1 },
  { date: "2024-06-29", temperature: null, humidity: null, load: null, predictedTemp: 80.0 },
  { date: "2024-06-30", temperature: null, humidity: null, load: null, predictedTemp: 81.2 },
]

const chartConfig = {
  sensors: {
    label: "Sensor Data",
  },
  temperature: {
    label: "Temperature (°C)",
    color: "hsl(var(--primary))",
  },
  predictedTemp: {
    label: "Predicted Temperature (°C)",
    color: "rgba(234, 88, 12, 0.8)",
  },
  humidity: {
    label: "Humidity (%)",
    color: "rgba(16, 185, 129, 0.7)",
  },
  load: {
    label: "Load (%)",
    color: "rgba(239, 68, 68, 0.7)",
  },
} satisfies ChartConfig

export function ChartAreaInteractive() {
  const isMobile = useIsMobile()
  const [timeRange, setTimeRange] = React.useState("30d")
  const [dataType, setDataType] = React.useState("temperature")

  React.useEffect(() => {
    if (isMobile) {
      setTimeRange("7d")
    }
  }, [isMobile])

  const filteredData = chartData.filter((item) => {
    const date = new Date(item.date)
    const referenceDate = new Date("2024-06-21") // Current date in our example
    let daysToSubtract = 30
    if (timeRange === "14d") {
      daysToSubtract = 14
    } else if (timeRange === "7d") {
      daysToSubtract = 7
    }
    const startDate = new Date(referenceDate)
    startDate.setDate(startDate.getDate() - daysToSubtract)
    return date >= startDate
  })

  return (
    <Card className="@container/card w-full h-full flex flex-col">
      <CardHeader>
        <CardTitle>
          {dataType === "temperature"
            ? "Temperature Monitoring & Prediction"
            : dataType === "humidity"
            ? "Humidity Trends"
            : "Load Analysis"}
        </CardTitle>
        <CardDescription>
          <span className="hidden @[540px]/card:block">
            {dataType === "temperature"
              ? "Real-time temperature data with AI predictions"
              : dataType === "humidity"
              ? "Humidity patterns in control panels"
              : "Current and historical load metrics"}
          </span>
          <span className="@[540px]/card:hidden">Sensor trends and predictions</span>
        </CardDescription>
        <CardAction className="flex flex-col gap-2 sm:flex-row sm:items-center">
          <Select value={dataType} onValueChange={setDataType}>
            <SelectTrigger
              className="w-40"
              size="sm"
              aria-label="Select data type"
            >
              <SelectValue placeholder="Temperature" />
            </SelectTrigger>
            <SelectContent className="rounded-xl">
              <SelectItem value="temperature" className="rounded-lg">
                Temperature
              </SelectItem>
              <SelectItem value="humidity" className="rounded-lg">
                Humidity
              </SelectItem>
              <SelectItem value="load" className="rounded-lg">
                Load
              </SelectItem>
            </SelectContent>
          </Select>
          
          <ToggleGroup
            type="single"
            value={timeRange}
            onValueChange={setTimeRange}
            variant="outline"
            className="hidden *:data-[slot=toggle-group-item]:!px-4 @[767px]/card:flex"
          >
            <ToggleGroupItem value="30d">30 days</ToggleGroupItem>
            <ToggleGroupItem value="14d">14 days</ToggleGroupItem>
            <ToggleGroupItem value="7d">7 days</ToggleGroupItem>
          </ToggleGroup>
          <Select value={timeRange} onValueChange={setTimeRange}>
            <SelectTrigger
              className="w-32 @[767px]/card:hidden"
              size="sm"
              aria-label="Select time range"
            >
              <SelectValue placeholder="30 days" />
            </SelectTrigger>
            <SelectContent className="rounded-xl">
              <SelectItem value="30d" className="rounded-lg">
                30 days
              </SelectItem>
              <SelectItem value="14d" className="rounded-lg">
                14 days
              </SelectItem>
              <SelectItem value="7d" className="rounded-lg">
                7 days
              </SelectItem>
            </SelectContent>
          </Select>
        </CardAction>
      </CardHeader>
      <CardContent className="px-2 pt-4 sm:px-6 sm:pt-6 flex-1 flex flex-col">
        <div className="flex-1 w-full min-h-[250px]">
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={filteredData} margin={{ top: 10, right: 10, left: 0, bottom: 0 }}>
              <defs>
                <linearGradient id="fillTemperature" x1="0" y1="0" x2="0" y2="1">
                  <stop
                    offset="5%"
                    stopColor={chartConfig.temperature.color}
                    stopOpacity={0.8}
                  />
                  <stop
                    offset="95%"
                    stopColor={chartConfig.temperature.color}
                    stopOpacity={0.1}
                  />
                </linearGradient>
                <linearGradient id="fillPredictedTemp" x1="0" y1="0" x2="0" y2="1">
                  <stop
                    offset="5%"
                    stopColor={chartConfig.predictedTemp.color}
                    stopOpacity={0.6}
                  />
                  <stop
                    offset="95%"
                    stopColor={chartConfig.predictedTemp.color}
                    stopOpacity={0.1}
                  />
                </linearGradient>
                <linearGradient id="fillHumidity" x1="0" y1="0" x2="0" y2="1">
                  <stop
                    offset="5%"
                    stopColor={chartConfig.humidity.color}
                    stopOpacity={0.7}
                  />
                  <stop
                    offset="95%"
                    stopColor={chartConfig.humidity.color}
                    stopOpacity={0.1}
                  />
                </linearGradient>
                <linearGradient id="fillLoad" x1="0" y1="0" x2="0" y2="1">
                  <stop
                    offset="5%"
                    stopColor={chartConfig.load.color}
                    stopOpacity={0.7}
                  />
                  <stop
                    offset="95%"
                    stopColor={chartConfig.load.color}
                    stopOpacity={0.1}
                  />
                </linearGradient>
              </defs>
              <CartesianGrid vertical={false} strokeDasharray="3 3" />
              <XAxis
                dataKey="date"
                tickLine={false}
                axisLine={false}
                tickMargin={8}
                minTickGap={32}
                tickFormatter={(value) => {
                  const date = new Date(value)
                  return date.toLocaleDateString("en-US", {
                    month: "short",
                    day: "numeric",
                  })
                }}
              />
              <YAxis hide={false} tickLine={false} axisLine={false} />
              <Tooltip 
                content={({ active, payload, label }) => {
                  if (active && payload && payload.length) {
                    return (
                      <div className="bg-background border border-border/50 rounded-md shadow-md p-2 text-xs">
                        <p className="font-medium mb-1">{new Date(label).toLocaleDateString("en-US", {
                          month: "short",
                          day: "numeric",
                          year: "numeric"
                        })}</p>
                        {payload.map((entry, index) => {
                          let name = entry.name;
                          let unit = "";
                          
                          if (name === "temperature" || name === "predictedTemp") {
                            unit = "°C";
                            name = name === "predictedTemp" ? "Predicted Temp" : "Temperature";
                          } else if (name === "humidity" || name === "load") {
                            unit = "%";
                            name = name.charAt(0).toUpperCase() + name.slice(1);
                          }
                          
                          return (
                            <p key={`item-${index}`} className="flex justify-between items-center gap-2">
                              <span className="font-medium" style={{ color: entry.color }}>{name}:</span>
                              <span>{entry.value}{unit}</span>
                            </p>
                          );
                        })}
                      </div>
                    );
                  }
                  return null;
                }}
              />
              
              {dataType === "temperature" && (
                <>
                  <Area
                    type="monotone"
                    dataKey="temperature"
                    stroke={chartConfig.temperature.color}
                    strokeWidth={2}
                    fill="url(#fillTemperature)"
                    activeDot={{ r: 6, strokeWidth: 2 }}
                  />
                  <Area
                    type="monotone"
                    dataKey="predictedTemp"
                    stroke={chartConfig.predictedTemp.color}
                    strokeWidth={2}
                    strokeDasharray="5 5"
                    fill="url(#fillPredictedTemp)"
                    activeDot={{ r: 6, strokeWidth: 2 }}
                  />
                </>
              )}
              
              {dataType === "humidity" && (
                <Area
                  type="monotone"
                  dataKey="humidity"
                  stroke={chartConfig.humidity.color}
                  strokeWidth={2}
                  fill="url(#fillHumidity)"
                  activeDot={{ r: 6, strokeWidth: 2 }}
                />
              )}
              
              {dataType === "load" && (
                <Area
                  type="monotone"
                  dataKey="load"
                  stroke={chartConfig.load.color}
                  strokeWidth={2}
                  fill="url(#fillLoad)"
                  activeDot={{ r: 6, strokeWidth: 2 }}
                />
              )}
            </AreaChart>
          </ResponsiveContainer>
        </div>
        
        {dataType === "temperature" && (
          <div className="mt-4 text-sm text-muted-foreground">
            <div className="flex items-center gap-2">
              <div className="h-3 w-3 rounded-full bg-primary"></div>
              <span>Actual temperature data</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="h-3 w-3 rounded-full" style={{ backgroundColor: "rgba(234, 88, 12, 0.8)" }}></div>
              <span>AI temperature prediction (next 9 days)</span>
            </div>
            <div className="mt-2">
              <strong className="text-amber-500">Alert:</strong> Predicted critical temperature threshold exceeded on 06/29
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  )
}
