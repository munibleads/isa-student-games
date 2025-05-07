import { Button } from "@/components/ui/button"
import { Separator } from "@/components/ui/separator"
import { SidebarTrigger } from "@/components/ui/sidebar"

export function SiteHeader() {
  return (
      <header
      className="relative flex h-[--header-height] items-center justify-between gap-4 px-4 sm:px-6 lg:px-8"
    >
      <div className="flex flex-1 items-center gap-2">
        <div className="flex flex-1 items-stretch justify-start">
          <a className="flex items-center gap-1 text-xl" href="#">
            <span className="font-semibold tracking-tight"></span>
          </a>
        </div>
      </div>
    </header>
  )
}
