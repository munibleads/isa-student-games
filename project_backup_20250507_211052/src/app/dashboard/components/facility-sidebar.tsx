"use client"

import { useState } from "react"
import { cn } from "@/lib/utils"
import { 
  IconBuildingFactory,
  IconAlertTriangle, 
  IconSearch,
  IconPin,
  IconChevronDown,
  IconChevronRight,
  IconDashboard
} from "@tabler/icons-react"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip"

import { Facility, ControlPanel } from "../data/facilities-data"
import { getMappedControlPanelId } from "../utils/metric-utils"

interface FacilitySidebarProps {
  facilities: Facility[]
  selectedFacility: string
  selectedPanel: string | null
  onSelectFacility: (facilityId: string) => void
  onSelectPanel: (facilityId: string, panelId: string) => void
  pinnedPanels: Array<{facilityId: string, panelId: string}>
  onTogglePinPanel: (facilityId: string, panelId: string) => void
}

export function FacilitySidebar({
  facilities,
  selectedFacility,
  selectedPanel,
  onSelectFacility,
  onSelectPanel,
  pinnedPanels,
  onTogglePinPanel
}: FacilitySidebarProps) {
  const [searchQuery, setSearchQuery] = useState("")
  const [expandedFacilities, setExpandedFacilities] = useState<Record<string, boolean>>(
    // Initially expand the selected facility
    { [selectedFacility]: true }
  )

  // Toggle expanded state for a facility
  const toggleFacilityExpanded = (facilityId: string) => {
    setExpandedFacilities(prev => ({
      ...prev,
      [facilityId]: !prev[facilityId]
    }))
  }

  // Filter facilities and panels based on search query
  const filteredFacilities = searchQuery 
    ? facilities.map(facility => ({
        ...facility,
        controlPanels: facility.controlPanels.filter(panel => 
          panel.name.toLowerCase().includes(searchQuery.toLowerCase())
        )
      })).filter(facility => 
        facility.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
        facility.controlPanels.length > 0
      )
    : facilities

  // Check if a panel is pinned
  const isPanelPinned = (facilityId: string, panelId: string) => {
    return pinnedPanels.some(p => p.facilityId === facilityId && p.panelId === panelId)
  }

  // Get status color
  const getStatusColor = (status: "normal" | "warning" | "critical") => {
    switch (status) {
      case "normal": return "bg-green-500"
      case "warning": return "bg-amber-500"
      case "critical": return "bg-red-500"
      default: return "bg-gray-500"
    }
  }

  // Calculate panel's highest severity status
  const getPanelHighestSeverity = (panel: ControlPanel) => {
    if (Object.values(panel.metrics).some(m => m.status === "critical")) return "critical"
    if (Object.values(panel.metrics).some(m => m.status === "warning")) return "warning"
    return "normal"
  }

  return (
    <div className="flex flex-col h-full bg-background">
      {/* Fixed header section */}
      <div className="p-4 border-b">
        <h2 className="text-lg font-semibold mb-3">Facilities</h2>
        <div className="relative mb-4">
          <IconSearch className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input
            type="text"
            placeholder="Search..."
            className="pl-8"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
        
        {/* Overview Tab */}
        <div 
          className={cn(
            "flex items-center gap-2 px-3 py-2 rounded-md text-sm cursor-pointer hover:bg-muted mb-3 transition-colors",
            !selectedPanel && !selectedFacility && "bg-muted font-medium"
          )}
          onClick={() => onSelectFacility("")}
        >
          <IconDashboard className="h-4 w-4" />
          <span>Overview</span>
        </div>
      </div>
      
      {/* Scrollable section */}
      <div className="flex-1 overflow-auto p-3">
        {/* Pinned Panels Section - if any */}
        {pinnedPanels.length > 0 && (
          <div className="mb-4">
            <h3 className="text-sm font-medium text-muted-foreground px-2 mb-2">Pinned Panels</h3>
            <div className="space-y-1">
              {pinnedPanels.map(({ facilityId, panelId }) => {
                const facility = facilities.find(f => f.id.toString() === facilityId)
                const panel = facility?.controlPanels.find(p => p.id === panelId)
                if (!facility || !panel) return null
                
                const severity = getPanelHighestSeverity(panel)
                
                return (
                  <div 
                    key={`${facilityId}-${panelId}`}
                    className={cn(
                      "flex items-center gap-2 px-2 py-1.5 rounded-md text-sm cursor-pointer hover:bg-muted group transition-colors",
                      (selectedFacility === facilityId && selectedPanel === panelId) && "bg-muted"
                    )}
                    onClick={() => onSelectPanel(facilityId, panelId)}
                  >
                    <div className={cn("w-2 h-2 rounded-full", getStatusColor(severity))} />
                    <span className="truncate">{getMappedControlPanelId(panel.id)} - {panel.name}</span>
                    <span className="text-xs text-muted-foreground ml-auto">{facility.name}</span>
                    <Button
                      variant="ghost"
                      size="sm"
                      className="h-6 w-6 p-0 opacity-70 group-hover:opacity-100"
                      onClick={(e) => {
                        e.stopPropagation()
                        onTogglePinPanel(facilityId, panelId)
                      }}
                    >
                      <IconPin className="h-3.5 w-3.5 fill-current" />
                    </Button>
                  </div>
                )
              })}
            </div>
          </div>
        )}
        
        {/* Facilities List */}
        <div className="space-y-1">
          {filteredFacilities.length === 0 ? (
            <p className="text-sm text-muted-foreground px-2 py-4 text-center">
              No facilities found
            </p>
          ) : (
            filteredFacilities.map((facility) => {
              const isExpanded = expandedFacilities[facility.id.toString()]
              const hasCritical = facility.controlPanels.some(panel => 
                Object.values(panel.metrics).some(metric => metric.status === "critical")
              )
              
              return (
                <div key={facility.id} className="space-y-1">
                  <div 
                    className={cn(
                      "flex items-center gap-2 px-2 py-1.5 rounded-md text-sm cursor-pointer hover:bg-muted transition-colors",
                      selectedFacility === facility.id.toString() && !selectedPanel && "bg-muted"
                    )}
                    onClick={() => {
                      onSelectFacility(facility.id.toString())
                      toggleFacilityExpanded(facility.id.toString())
                    }}
                  >
                    <Button
                      variant="ghost"
                      size="sm"
                      className="h-5 w-5 p-0 flex items-center justify-center"
                      onClick={(e) => {
                        e.stopPropagation()
                        toggleFacilityExpanded(facility.id.toString())
                      }}
                    >
                      {isExpanded ? (
                        <IconChevronDown className="h-4 w-4" />
                      ) : (
                        <IconChevronRight className="h-4 w-4" />
                      )}
                    </Button>
                    <IconBuildingFactory className="h-4 w-4" />
                    <span className="font-medium truncate">{facility.name}</span>
                    {hasCritical && (
                      <IconAlertTriangle className="h-4 w-4 text-red-500 ml-auto flex-shrink-0" />
                    )}
                  </div>
                  
                  {/* Control Panels for this facility */}
                  {isExpanded && (
                    <div className="ml-6 space-y-1">
                      {facility.controlPanels.length === 0 ? (
                        <p className="text-xs text-muted-foreground px-2 py-1">
                          No control panels available
                        </p>
                      ) : (
                        facility.controlPanels.map((panel) => {
                          const isPinned = isPanelPinned(facility.id.toString(), panel.id)
                          const severity = getPanelHighestSeverity(panel)
                          
                          return (
                            <div 
                              key={panel.id}
                              className={cn(
                                "flex items-center gap-2 px-2 py-1.5 rounded-md text-sm cursor-pointer hover:bg-muted group transition-colors",
                                (selectedFacility === facility.id.toString() && selectedPanel === panel.id) && "bg-muted"
                              )}
                              onClick={() => onSelectPanel(facility.id.toString(), panel.id)}
                            >
                              <div className={cn("w-2 h-2 rounded-full", getStatusColor(severity))} />
                              <span className="truncate">{getMappedControlPanelId(panel.id)} - {panel.name}</span>
                              <TooltipProvider>
                                <Tooltip>
                                  <TooltipTrigger asChild>
                                    <Button
                                      variant="ghost"
                                      size="sm"
                                      className={cn(
                                        "h-6 w-6 p-0 ml-auto flex-shrink-0 flex items-center justify-center",
                                        isPinned ? "opacity-100" : "opacity-0 group-hover:opacity-70" 
                                      )}
                                      onClick={(e) => {
                                        e.stopPropagation()
                                        onTogglePinPanel(facility.id.toString(), panel.id)
                                      }}
                                    >
                                      <IconPin className={cn("h-3.5 w-3.5", isPinned && "fill-current")} />
                                    </Button>
                                  </TooltipTrigger>
                                  <TooltipContent side="right">
                                    {isPinned ? "Unpin panel" : "Pin panel"}
                                  </TooltipContent>
                                </Tooltip>
                              </TooltipProvider>
                            </div>
                          )
                        })
                      )}
                    </div>
                  )}
                </div>
              )
            })
          )}
        </div>
      </div>
      
      {/* Fixed footer with filters */}
      <div className="p-3 border-t">
        <div className="flex gap-2">
          <Button variant="outline" size="sm" className="flex-1 h-8 text-xs">All</Button>
          <Button variant="outline" size="sm" className="flex-1 h-8 text-xs text-amber-500">Warnings</Button>
          <Button variant="outline" size="sm" className="flex-1 h-8 text-xs text-red-500">Critical</Button>
        </div>
      </div>
    </div>
  )
} 