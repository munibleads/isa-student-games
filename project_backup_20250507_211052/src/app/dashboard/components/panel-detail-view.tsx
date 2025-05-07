"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { 
  IconAlertTriangle, 
  IconBuilding,
  IconBulb,
  IconCircleCheck,
  IconFileDescription,
  IconPin,
  IconSettings
} from "@tabler/icons-react"

import { MetricCard } from "./metric-card"
import { Facility, ControlPanel } from "../data/facilities-data"
import { getMetricIcon, getStatusColor, getMappedControlPanelId } from "../utils/metric-utils"

interface PanelDetailViewProps {
  facility: Facility | null
  panel: ControlPanel | null
  isPinned: boolean
  onTogglePin: () => void
}

export function PanelDetailView({ 
  facility, 
  panel, 
  isPinned, 
  onTogglePin 
}: PanelDetailViewProps) {
  const [activeTab, setActiveTab] = useState("metrics")
  
  if (!facility || !panel) {
    return (
      <div className="flex items-center justify-center h-full p-4">
        <Card className="w-full max-w-md">
          <CardContent className="p-6 text-center">
            <p className="text-muted-foreground">Select a control panel to view details</p>
          </CardContent>
        </Card>
      </div>
    )
  }
  
  // Check if any metrics are in critical or warning state
  const hasCritical = Object.values(panel.metrics).some(m => m.status === "critical")
  const hasWarning = !hasCritical && Object.values(panel.metrics).some(m => m.status === "warning")
  
  return (
    <div className="p-4 md:p-6 h-full flex flex-col overflow-auto">
      <div className="flex flex-wrap items-start justify-between gap-4 mb-6">
        <div>
          <div className="flex flex-wrap items-center gap-2">
            <h2 className="text-xl md:text-2xl font-bold">{getMappedControlPanelId(panel.id)} - {panel.name}</h2>
            {hasCritical && (
              <Badge variant="destructive" className="text-xs">
                <IconAlertTriangle className="size-3 mr-1" />
                Critical Alert
              </Badge>
            )}
            {hasWarning && (
              <Badge variant="outline" className="text-xs border-amber-500 text-amber-500">
                <IconAlertTriangle className="size-3 mr-1" />
                Warning
              </Badge>
            )}
          </div>
          <p className="text-muted-foreground flex items-center gap-1.5 mt-1">
            <IconBuilding className="size-4 flex-shrink-0" />
            <span className="truncate">{facility.name} · {facility.location}</span>
          </p>
        </div>
        <div className="flex gap-2">
          <Button 
            variant="outline" 
            size="sm"
            onClick={onTogglePin}
            className="gap-1 h-9"
          >
            <IconPin className={isPinned ? "size-4 fill-current" : "size-4"} />
            {isPinned ? "Unpin" : "Pin"}
          </Button>
          <Button variant="outline" size="sm" className="h-9">Actions</Button>
        </div>
      </div>
      
      <Tabs value={activeTab} onValueChange={setActiveTab} className="flex-1 flex flex-col min-h-0">
        <TabsList className="mb-4">
          <TabsTrigger value="metrics">Metrics</TabsTrigger>
          <TabsTrigger value="history">History</TabsTrigger>
          <TabsTrigger value="documentation">Documentation</TabsTrigger>
          <TabsTrigger value="settings">Settings</TabsTrigger>
        </TabsList>
        
        <TabsContent value="metrics" className="flex-1 mt-0 overflow-auto">
          <Card className="mb-6">
            <CardHeader className="pb-3">
              <CardTitle className="text-lg">Current Status</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
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
              </div>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-4">
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
                <MetricCard 
                  label="Smoke" 
                  value={panel.metrics.smoke.value}
                  unit={panel.metrics.smoke.unit}
                  trend={panel.metrics.smoke.trend}
                  status={panel.metrics.smoke.status}
                  icon={getMetricIcon("smoke")}
                />
              </div>
            </CardContent>
          </Card>
          
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 md:gap-6 mb-6">
            <Card>
              <CardHeader className="pb-3">
                <CardTitle className="text-lg flex items-center">
                  <svg xmlns="http://www.w3.org/2000/svg" className="size-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M9 3v2m6-2v2M9 19v2m6-2v2M5 9H3m2 6H3m18-6h-2m2 6h-2M7 19h10a2 2 0 002-2V7a2 2 0 00-2-2H7a2 2 0 00-2 2v10a2 2 0 002 2zM9 9h6v6H9V9z" />
                  </svg>
                  Root Cause Analysis
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {getMappedControlPanelId(panel.id) === "CX201" ? (
                    <>
                      <div className="bg-green-50 dark:bg-green-900/20 p-3 rounded-lg border border-green-200 dark:border-green-800">
                        <h4 className="font-medium text-green-800 dark:text-green-300 flex items-center gap-1.5">
                          <IconCircleCheck className="size-4" />
                          System Status (99% confidence)
                        </h4>
                        <p className="text-sm text-green-700 dark:text-green-400 mt-1">
                          All systems operating within optimal parameters. No anomalies detected in the last 72 hours.
                        </p>
                        <div className="flex items-center gap-2 mt-2">
                          <Button variant="outline" size="sm" className="h-7 text-xs">View Performance History</Button>
                          <Button variant="outline" size="sm" className="h-7 text-xs">Schedule Routine Check</Button>
                        </div>
                      </div>
                      
                      <div className="p-3 rounded-lg border">
                        <h4 className="font-medium flex items-center gap-1.5">
                          Efficiency Metrics
                        </h4>
                        <p className="text-sm text-muted-foreground mt-1">
                          <span className="font-medium">Current efficiency rating: 97%</span> - Operating at peak performance with consistent metrics.
                        </p>
                      </div>
                      
                      <div className="p-3 rounded-lg border">
                        <h4 className="font-medium flex items-center gap-1.5">
                          Maintenance Status
                        </h4>
                        <p className="text-sm text-muted-foreground mt-1">
                          Last maintenance performed 42 days ago. Next scheduled maintenance in 78 days. No issues detected.
                        </p>
                      </div>
                    </>
                  ) : (
                    <>
                      <div className="bg-amber-50 dark:bg-amber-900/20 p-3 rounded-lg border border-amber-200 dark:border-amber-800">
                        <h4 className="font-medium text-amber-800 dark:text-amber-300 flex items-center gap-1.5">
                          <IconAlertTriangle className="size-4" />
                          Primary Cause (87% confidence)
                        </h4>
                        <p className="text-sm text-amber-700 dark:text-amber-400 mt-1">
                          Cooling system malfunction in the central unit is likely causing temperature increases.
                        </p>
                        <div className="flex items-center gap-2 mt-2">
                          <Button variant="outline" size="sm" className="h-7 text-xs">View Details</Button>
                          <Button variant="outline" size="sm" className="h-7 text-xs">Schedule Maintenance</Button>
                        </div>
                      </div>
                      
                      <div className="p-3 rounded-lg border">
                        <h4 className="font-medium flex items-center gap-1.5">
                          Correlation Discovery
                        </h4>
                        <p className="text-sm text-muted-foreground mt-1">
                          <span className="font-medium">Strong correlation (93%)</span> detected between temperature spikes and vibration increases with 5-10 minute lag.
                        </p>
                      </div>
                      
                      <div className="p-3 rounded-lg border">
                        <h4 className="font-medium flex items-center gap-1.5">
                          Historical Pattern Match
                        </h4>
                        <p className="text-sm text-muted-foreground mt-1">
                          Current behavior matches incident pattern from March 2024 when the cooling fan drive belt was worn.
                        </p>
                      </div>
                    </>
                  )}
                </div>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader className="pb-3">
                <CardTitle className="text-lg flex items-center">
                  <svg xmlns="http://www.w3.org/2000/svg" className="size-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M13 10V3L4 14h7v7l9-11h-7z" />
                  </svg>
                  AI Alerts & Insights
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {getMappedControlPanelId(panel.id) === "CX201" ? (
                    <>
                      <div className="bg-blue-50 dark:bg-blue-900/20 p-3 rounded-lg border border-blue-200 dark:border-blue-800">
                        <h4 className="font-medium text-blue-800 dark:text-blue-300 flex items-center gap-1.5">
                          <IconBulb className="size-4" />
                          Optimization Opportunity (92% confidence)
                        </h4>
                        <p className="text-sm text-blue-700 dark:text-blue-400 mt-1">
                          Analysis suggests potential for 8% energy efficiency improvement by adjusting catalyst flow rate during low-demand periods.
                        </p>
                        <div className="flex items-center gap-2 mt-2">
                          <Button variant="outline" size="sm" className="h-7 text-xs">View Analysis</Button>
                          <Button variant="outline" size="sm" className="h-7 text-xs">Implementation Plan</Button>
                        </div>
                      </div>
                      
                      <div className="bg-green-50 dark:bg-green-900/20 p-3 rounded-lg border border-green-200 dark:border-green-800">
                        <h4 className="font-medium text-green-800 dark:text-green-300 flex items-center gap-1.5">
                          <IconCircleCheck className="size-4" />
                          Predictive Maintenance
                        </h4>
                        <p className="text-sm text-green-700 dark:text-green-400 mt-1">
                          All components operating within optimal parameters with no signs of wear. Next scheduled maintenance can be safely postponed by 30 days.
                        </p>
                      </div>
                      
                      <div className="p-3 rounded-lg border">
                        <h4 className="font-medium flex items-center gap-1.5">
                          Performance Trend
                        </h4>
                        <p className="text-sm text-muted-foreground mt-1">
                          Consistent performance metrics over the past 90 days indicate excellent system stability and maintenance practices.
                        </p>
                      </div>
                    </>
                  ) : (
                    <>
                      <div className="bg-red-50 dark:bg-red-900/20 p-3 rounded-lg border border-red-200 dark:border-red-800">
                        <h4 className="font-medium text-red-800 dark:text-red-300 flex items-center gap-1.5">
                          <IconAlertTriangle className="size-4" />
                          Predictive Alert (95% confidence)
                        </h4>
                        <p className="text-sm text-red-700 dark:text-red-400 mt-1">
                          Temperature predicted to reach critical threshold in approximately 45 minutes if no action taken.
                        </p>
                        <div className="flex items-center gap-2 mt-2">
                          <Button variant="outline" size="sm" className="h-7 text-xs">View Trend</Button>
                          <Button variant="outline" size="sm" className="h-7 text-xs">Suggested Actions</Button>
                        </div>
                      </div>
                      
                      <div className="bg-blue-50 dark:bg-blue-900/20 p-3 rounded-lg border border-blue-200 dark:border-blue-800">
                        <h4 className="font-medium text-blue-800 dark:text-blue-300 flex items-center gap-1.5">
                          Anomaly Detection
                        </h4>
                        <p className="text-sm text-blue-700 dark:text-blue-400 mt-1">
                          Unusual smoke sensor reading pattern detected - values fluctuating more than normal reference pattern.
                        </p>
                      </div>
                      
                      <div className="p-3 rounded-lg border">
                        <h4 className="font-medium flex items-center gap-1.5">
                          Maintenance Forecast
                        </h4>
                        <p className="text-sm text-muted-foreground mt-1">
                          Main cooling component approaching end-of-life (~18 days remaining based on vibration signature analysis).
                        </p>
                      </div>
                    </>
                  )}
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
        
        <TabsContent value="history" className="mt-0 overflow-auto">
          <Card>
            <CardHeader>
              <CardTitle>Historical Data</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground">
                Historical data visualization would be displayed here.
              </p>
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="documentation" className="mt-0 overflow-auto">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <IconFileDescription className="size-5" />
                Documentation
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="prose max-w-none">
                <h3>Control Panel {getMappedControlPanelId(panel.id)} Overview</h3>
                <p>This control panel manages operations for specific equipment in {facility.name}.</p>
                <h4>Key Specifications</h4>
                <ul>
                  <li>Panel Model: XC-5000</li>
                  <li>Installation Date: March 15, 2023</li>
                  <li>Last Certification: January 10, 2024</li>
                </ul>
                <h4>Operating Procedures</h4>
                <p>
                  Standard operating procedures for this control panel include regular monitoring 
                  of temperature and vibration metrics, with special attention to voltage fluctuations.
                </p>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="settings" className="mt-0 overflow-auto">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <IconSettings className="size-5" />
                Settings
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground">
                Panel settings and configuration options would be displayed here.
              </p>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
} 