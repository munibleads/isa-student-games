import { IconTrendingDown, IconTrendingUp, IconTemperature, IconDroplet, IconBolt, IconAlertTriangle, IconInfoCircle, IconExternalLink } from "@tabler/icons-react"

import { Badge } from "@/components/ui/badge"
import {
  Card,
  CardAction,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { Progress } from "@/components/ui/progress"
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip"
import { Button } from "@/components/ui/button"

export function SectionCards() {
  return (
    <div className="*:data-[slot=card]:from-primary/5 *:data-[slot=card]:to-card dark:*:data-[slot=card]:bg-card grid grid-cols-1 gap-4 px-4 *:data-[slot=card]:bg-gradient-to-t *:data-[slot=card]:shadow-xs lg:px-6 @xl/main:grid-cols-2 @5xl/main:grid-cols-4">
      <Card className="@container/card overflow-hidden border-l-4 border-l-amber-500">
        <CardHeader className="pb-2">
          <div className="flex items-center justify-between">
            <CardDescription className="flex items-center gap-1 text-sm font-medium">
              <IconTemperature className="size-4 text-amber-500" /> Temperature
            </CardDescription>
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
                    Temperature levels above 70°C risk component damage. Current trend indicates potential thermal issues.
                  </p>
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>
          </div>
          <CardTitle className="flex items-baseline gap-2 text-2xl font-semibold tabular-nums @[250px]/card:text-3xl">
            72.5°C
            <Badge variant="outline" className="text-amber-500 text-xs">
              <IconTrendingUp className="size-3 text-amber-500 mr-0.5" />
              +2.8°C/hr
            </Badge>
          </CardTitle>
          <div className="mt-1">
            <div className="flex items-center justify-between text-xs mb-1">
              <span>Safe</span>
              <span>Warning</span>
              <span>Critical</span>
            </div>
            <Progress value={72.5} max={100} className="h-1.5" 
              indicatorClassName="bg-gradient-to-r from-green-500 via-amber-500 to-red-500" />
          </div>
        </CardHeader>
        <CardFooter className="flex-col items-start gap-1.5 pb-3 pt-0 text-sm">
          <div className="line-clamp-1 flex items-center gap-2 font-medium text-amber-500">
            <IconAlertTriangle className="size-4 text-amber-500" /> Prediction: Overheating in 48h
          </div>
          <div className="flex justify-between w-full items-center">
            <div className="text-muted-foreground text-xs">
              Above normal operating range
            </div>
            <Button variant="ghost" size="sm" className="h-6 px-2 text-xs">
              View Details <IconExternalLink className="ml-1 size-3" />
            </Button>
          </div>
        </CardFooter>
      </Card>
      
      <Card className="@container/card overflow-hidden border-l-4 border-l-green-500">
        <CardHeader className="pb-2">
          <div className="flex items-center justify-between">
            <CardDescription className="flex items-center gap-1 text-sm font-medium">
              <IconDroplet className="size-4 text-green-500" /> Humidity
            </CardDescription>
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
                    Humidity between 40-70% is optimal for electronics. Current levels are within safe parameters.
                  </p>
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>
          </div>
          <CardTitle className="flex items-baseline gap-2 text-2xl font-semibold tabular-nums @[250px]/card:text-3xl">
            62%
            <Badge variant="outline" className="text-green-500 text-xs">
              <IconTrendingDown className="size-3 text-green-500 mr-0.5" />
              -5%/day
            </Badge>
          </CardTitle>
          <div className="mt-1">
            <div className="flex items-center justify-between text-xs mb-1">
              <span>Low</span>
              <span className="text-green-500 font-medium">Optimal</span>
              <span>High</span>
            </div>
            <Progress value={62} max={100} className="h-1.5" 
              indicatorClassName="bg-gradient-to-r from-amber-500 via-green-500 to-amber-500" />
          </div>
        </CardHeader>
        <CardFooter className="flex-col items-start gap-1.5 pb-3 pt-0 text-sm">
          <div className="line-clamp-1 flex items-center gap-2 font-medium text-green-500">
            Within acceptable range
          </div>
          <div className="flex justify-between w-full items-center">
            <div className="text-muted-foreground text-xs">
              Optimal condition (40-70%)
            </div>
            <Button variant="ghost" size="sm" className="h-6 px-2 text-xs">
              View Details <IconExternalLink className="ml-1 size-3" />
            </Button>
          </div>
        </CardFooter>
      </Card>
      
      <Card className="@container/card overflow-hidden border-l-4 border-l-red-500">
        <CardHeader className="pb-2">
          <div className="flex items-center justify-between">
            <CardDescription className="flex items-center gap-1 text-sm font-medium">
              <IconBolt className="size-4 text-red-500" /> Load
            </CardDescription>
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
                    Load above 80% may cause overheating and reduced system stability. Immediate load balancing recommended.
                  </p>
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>
          </div>
          <CardTitle className="flex items-baseline gap-2 text-2xl font-semibold tabular-nums @[250px]/card:text-3xl">
            85%
            <Badge variant="outline" className="text-red-500 text-xs">
              <IconTrendingUp className="size-3 text-red-500 mr-0.5" />
              +12%/hr
            </Badge>
          </CardTitle>
          <div className="mt-1">
            <div className="flex items-center justify-between text-xs mb-1">
              <span>Normal</span>
              <span>High</span>
              <span className="text-red-500 font-medium">Critical</span>
            </div>
            <Progress value={85} max={100} className="h-1.5" 
              indicatorClassName="bg-gradient-to-r from-green-500 via-amber-500 to-red-500" />
          </div>
        </CardHeader>
        <CardFooter className="flex-col items-start gap-1.5 pb-3 pt-0 text-sm">
          <div className="line-clamp-1 flex items-center gap-2 font-medium text-red-500">
            <IconAlertTriangle className="size-4 text-red-500" /> Near maximum capacity
          </div>
          <div className="flex justify-between w-full items-center">
            <div className="text-muted-foreground text-xs">
              AI suggests load balancing needed
            </div>
            <Button variant="ghost" size="sm" className="h-6 px-2 text-xs">
              View Details <IconExternalLink className="ml-1 size-3" />
            </Button>
          </div>
        </CardFooter>
      </Card>
      
      <Card className="@container/card overflow-hidden border-l-4 border-l-amber-500">
        <CardHeader className="pb-2">
          <div className="flex items-center justify-between">
            <CardDescription className="flex items-center gap-1 text-sm font-medium">
              <IconAlertTriangle className="size-4 text-amber-500" /> Panel Health
            </CardDescription>
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
                    Overall health score calculated from multiple sensors. Declining trend suggests preventative maintenance should be scheduled.
                  </p>
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>
          </div>
          <CardTitle className="flex items-baseline gap-2 text-2xl font-semibold tabular-nums @[250px]/card:text-3xl">
            78%
            <Badge variant="outline" className="text-amber-500 text-xs">
              <IconTrendingDown className="size-3 text-amber-500 mr-0.5" />
              -4%/week
            </Badge>
          </CardTitle>
          <div className="mt-1">
            <div className="flex items-center justify-between text-xs mb-1">
              <span>Critical</span>
              <span className="text-amber-500 font-medium">Warning</span>
              <span>Optimal</span>
            </div>
            <Progress value={78} max={100} className="h-1.5" 
              indicatorClassName="bg-gradient-to-r from-red-500 via-amber-500 to-green-500" />
          </div>
        </CardHeader>
        <CardFooter className="flex-col items-start gap-1.5 pb-3 pt-0 text-sm">
          <div className="line-clamp-1 flex items-center gap-2 font-medium text-amber-500">
            Maintenance recommended within 30 days
          </div>
          <div className="flex justify-between w-full items-center">
            <div className="text-muted-foreground text-xs">
              Based on predictive analysis
            </div>
            <Button variant="ghost" size="sm" className="h-6 px-2 text-xs">
              View Details <IconExternalLink className="ml-1 size-3" />
            </Button>
          </div>
        </CardFooter>
      </Card>
    </div>
  )
}
