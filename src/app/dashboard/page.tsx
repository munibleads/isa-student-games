import { SiteHeader } from "@/components/site-header"
import { DashboardContent } from "./components"

export default function Dashboard() {
  return (
    <div className="flex flex-col h-screen overflow-hidden">
      <SiteHeader />
      <main className="flex-1 overflow-hidden">
        <DashboardContent />
      </main>
    </div>
  )
}
