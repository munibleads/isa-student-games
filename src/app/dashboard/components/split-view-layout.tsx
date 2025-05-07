"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { IconArrowBarLeft, IconArrowBarRight } from "@tabler/icons-react"

import { FacilitySidebar } from "./facility-sidebar"
import { PanelDetailView } from "./panel-detail-view"
import { OverviewDashboard } from "./overview-dashboard"
import { facilitiesData, Facility, ControlPanel } from "../data/facilities-data"

interface SplitViewLayoutProps {
  initialFacilityId?: string
}

export function SplitViewLayout({ initialFacilityId }: SplitViewLayoutProps) {
  const [selectedFacilityId, setSelectedFacilityId] = useState(initialFacilityId || facilitiesData[0].id.toString())
  const [selectedPanelId, setSelectedPanelId] = useState<string | null>(null)
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false)
  const [pinnedPanels, setPinnedPanels] = useState<Array<{facilityId: string, panelId: string}>>([])
  
  // Handle smaller screens - collapse sidebar by default on mobile
  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth < 768) {
        setSidebarCollapsed(true)
      }
    }
    
    // Set initial state
    handleResize()
    
    // Add event listener
    window.addEventListener('resize', handleResize)
    
    // Cleanup
    return () => window.removeEventListener('resize', handleResize)
  }, [])
  
  // Find currently selected facility and panel
  const selectedFacility = selectedFacilityId ? facilitiesData.find(f => f.id.toString() === selectedFacilityId) || null : null
  const selectedPanel = selectedFacility?.controlPanels.find(p => p.id === selectedPanelId) || null
  
  // Handle selecting a facility
  const handleSelectFacility = (facilityId: string) => {
    setSelectedFacilityId(facilityId)
    setSelectedPanelId(null)
    
    // On mobile, auto-collapse sidebar after selection
    if (window.innerWidth < 768) {
      setSidebarCollapsed(true)
    }
  }
  
  // Handle selecting a panel
  const handleSelectPanel = (facilityId: string, panelId: string) => {
    setSelectedFacilityId(facilityId)
    setSelectedPanelId(panelId)
    
    // On mobile, auto-collapse sidebar after selection
    if (window.innerWidth < 768) {
      setSidebarCollapsed(true)
    }
  }
  
  // Handle pin/unpin panel
  const handleTogglePinPanel = (facilityId: string, panelId: string) => {
    const isPinned = pinnedPanels.some(p => 
      p.facilityId === facilityId && p.panelId === panelId
    )
    
    if (isPinned) {
      setPinnedPanels(pinnedPanels.filter(p => 
        !(p.facilityId === facilityId && p.panelId === panelId)
      ))
    } else {
      setPinnedPanels([...pinnedPanels, { facilityId, panelId }])
    }
  }
  
  // Check if current panel is pinned
  const isCurrentPanelPinned = !!selectedFacilityId && !!selectedPanelId && 
    pinnedPanels.some(p => p.facilityId === selectedFacilityId && p.panelId === selectedPanelId)
  
  return (
    <div className="h-full w-full">
      <div className="flex h-full border rounded-lg overflow-hidden">
        {/* Sidebar */}
        <div 
          className={`flex-shrink-0 transition-all border-r ${
            sidebarCollapsed ? 'w-0 overflow-hidden' : 'w-64 md:w-72'
          }`}
        >
          <FacilitySidebar 
            facilities={facilitiesData}
            selectedFacility={selectedFacilityId}
            selectedPanel={selectedPanelId}
            onSelectFacility={handleSelectFacility}
            onSelectPanel={handleSelectPanel}
            pinnedPanels={pinnedPanels}
            onTogglePinPanel={handleTogglePinPanel}
          />
        </div>
        
        {/* Sidebar toggle button */}
        <div className="flex-shrink-0 border-r">
          <Button 
            variant="ghost" 
            size="icon" 
            onClick={() => setSidebarCollapsed(!sidebarCollapsed)} 
            className="h-12 w-8 rounded-none flex items-center justify-center"
          >
            {sidebarCollapsed ? (
              <IconArrowBarRight className="h-4 w-4" />
            ) : (
              <IconArrowBarLeft className="h-4 w-4" />
            )}
          </Button>
        </div>
        
        {/* Main content */}
        <div className="flex-grow overflow-auto">
          {selectedFacilityId === "" ? (
            <OverviewDashboard
              pinnedPanels={pinnedPanels}
              onSelectFacility={handleSelectFacility}
              onSelectPanel={handleSelectPanel}
            />
          ) : (
            <PanelDetailView 
              facility={selectedFacility}
              panel={selectedPanel}
              isPinned={isCurrentPanelPinned}
              onTogglePin={() => {
                if (selectedFacilityId && selectedPanelId) {
                  handleTogglePinPanel(selectedFacilityId, selectedPanelId)
                }
              }}
            />
          )}
        </div>
      </div>
    </div>
  )
} 