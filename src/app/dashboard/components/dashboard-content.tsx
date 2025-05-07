"use client"

import { useState } from "react"
import { facilitiesData } from "../data/facilities-data"
import { SplitViewLayout } from "./split-view-layout"

export function DashboardContent() {
  const [selectedFacility, setSelectedFacility] = useState("");
  
  return (
    <div className="h-full w-full overflow-hidden">
      <SplitViewLayout initialFacilityId={selectedFacility} />
    </div>
  )
} 