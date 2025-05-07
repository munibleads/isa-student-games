"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { Badge } from "@/components/ui/badge"
import { 
  IconBrain, 
  IconArrowUp, 
  IconArrowDown, 
  IconAlertTriangle, 
  IconTemperature, 
  IconDroplet, 
  IconBolt, 
  IconWaveSine,
  IconInfoCircle,
  IconBulb,
  IconTrendingUp,
  IconChartBar,
  IconExternalLink,
  IconClock,
  IconDeviceAnalytics,
  IconChevronRight,
  IconCircleCheck,
  IconBuildingFactory2
} from "@tabler/icons-react"
import { facilitiesData, Facility, ControlPanel } from "../data/facilities-data"
import { getMappedControlPanelId } from "../utils/metric-utils"

interface OverviewDashboardProps {
  pinnedPanels: Array<{facilityId: string, panelId: string}>
  onSelectFacility: (facilityId: string) => void
  onSelectPanel: (facilityId: string, panelId: string) => void
}

// Define the structure of metrics with additional fields
interface EnhancedMetric {
  facilityId: string
  facilityName: string
  panelId: string
  panelName: string
  metricName: string
  value: number
  unit: string
  trend: string
  status: string
}

// Define the insight type
type InsightType = "critical" | "warning" | "prediction" | "optimization" | "info" | "success"

// Define the structure of an insight
interface Insight {
  id: string
  title: string
  description: string
  type: InsightType
  metrics?: {
    ok: number
    warning: number
    critical: number
  }
  metric?: EnhancedMetric
  facilityId?: string
  panelId?: string
  timeframe?: string
  confidence?: number
  impact?: string
  recommendation?: string
}

export function OverviewDashboard({ 
  pinnedPanels, 
  onSelectFacility, 
  onSelectPanel 
}: OverviewDashboardProps) {
  // Calculate AI insights
  const totalFacilities = facilitiesData.length
  const totalPanels = facilitiesData.reduce((sum, facility) => sum + facility.controlPanels.length, 0)
  
  // Count warnings and critical issues
  const criticalPanels = facilitiesData.reduce((count, facility) => {
    return count + facility.controlPanels.filter(panel => 
      Object.values(panel.metrics).some(m => m.status === "critical")
    ).length
  }, 0)
  
  const warningPanels = facilitiesData.reduce((count, facility) => {
    return count + facility.controlPanels.filter(panel => 
      !Object.values(panel.metrics).some(m => m.status === "critical") &&
      Object.values(panel.metrics).some(m => m.status === "warning")
    ).length
  }, 0)
  
  // Find most concerning metrics
  const allMetrics: EnhancedMetric[] = facilitiesData.flatMap(facility => 
    facility.controlPanels.flatMap(panel => 
      Object.entries(panel.metrics).map(([key, value]) => ({
        facilityId: facility.id.toString(),
        facilityName: facility.name,
        panelId: panel.id,
        panelName: panel.name,
        metricName: key,
        ...value
      }))
    )
  )
  
  const criticalMetrics = allMetrics.filter(m => m.status === "critical")
  const warningMetrics = allMetrics.filter(m => m.status === "warning")
  
  // Generate AI insights based on metrics
  const generateInsights = (): Insight[] => {
    const insights: Insight[] = [];
    
    // Add system health insight
    insights.push({
      id: "system-health",
      title: "System Health Assessment",
      description: criticalPanels > 0 
        ? 'Critical issues detected in multiple control panels' 
        : warningPanels > 0 
          ? 'Warning conditions present but no critical failures' 
          : 'All systems operating within normal parameters',
      type: criticalPanels > 0 ? "critical" : warningPanels > 0 ? "warning" : "success",
      metrics: {
        ok: totalFacilities - criticalPanels - warningPanels,
        warning: warningPanels,
        critical: criticalPanels
      },
      timeframe: "Real-time",
      impact: criticalPanels > 0 ? "High" : warningPanels > 0 ? "Medium" : "Low",
      recommendation: criticalPanels > 0 
        ? "Immediate investigation required for critical systems" 
        : warningPanels > 0 
          ? "Schedule maintenance for affected components" 
          : "Continue normal monitoring procedures"
    });
    
    // Add insights for critical metrics (up to 2)
    criticalMetrics.slice(0, 2).forEach((metric, index) => {
      insights.push({
        id: `critical-${index}`,
        title: `Critical ${metric.metricName.charAt(0).toUpperCase() + metric.metricName.slice(1)} Alert`,
        description: `${metric.metricName.charAt(0).toUpperCase() + metric.metricName.slice(1)} exceeds safe operating threshold`,
        type: "critical",
        metric: metric,
        facilityId: metric.facilityId,
        panelId: metric.panelId,
        confidence: 89,
        timeframe: "Last 30 minutes",
        impact: "High",
        recommendation: `Reduce ${metric.metricName} levels or take system offline for inspection`
      });
    });
    
    // Add insights for warning metrics (up to 1)
    warningMetrics.slice(0, 1).forEach((metric, index) => {
      insights.push({
        id: `warning-${index}`,
        title: `${metric.metricName.charAt(0).toUpperCase() + metric.metricName.slice(1)} Approaching Threshold`,
        description: `${metric.metricName} trending upward at ${metric.facilityName}`,
        type: "warning",
        metric: metric,
        facilityId: metric.facilityId,
        panelId: metric.panelId,
        confidence: 91,
        timeframe: "Last 2 hours",
        impact: "Medium",
        recommendation: `Monitor ${metric.metricName} levels and prepare for potential intervention`
      });
    });
    
    // Add predictive insight if we have critical or warning metrics
    if (criticalMetrics.length > 0 || warningMetrics.length > 0) {
      // Get the metric with the most concerning trend
      const trendMetrics = [...criticalMetrics, ...warningMetrics]
        .filter(m => m.trend && m.trend.startsWith('+'))
        .sort((a, b) => {
          const aValue = parseFloat(a.trend.substring(1));
          const bValue = parseFloat(b.trend.substring(1));
          return bValue - aValue;
        });
      
      if (trendMetrics.length > 0) {
        const worstTrend = trendMetrics[0];
        insights.push({
          id: "predictive",
          title: "Failure Risk Prediction",
          description: `Predictive analysis shows high risk of ${worstTrend.metricName} failure`,
          type: "prediction",
          metric: worstTrend,
          facilityId: worstTrend.facilityId,
          panelId: worstTrend.panelId,
          confidence: 78,
          timeframe: "Next 24 hours",
          impact: "High",
          recommendation: "Schedule preventative maintenance within next operational cycle"
        });
      }
    } else {
      // Add optimization insight if everything is ok
      insights.push({
        id: "optimization",
        title: "Efficiency Optimization Opportunity",
        description: "Algorithm detected potential for energy efficiency improvements",
        type: "optimization",
        confidence: 82,
        timeframe: "Ongoing",
        impact: "Medium",
        recommendation: "Adjust power distribution during off-peak hours to reduce consumption by 12%"
      });
      
      // Add one more success insight
      insights.push({
        id: "success",
        title: "Maintenance Effectiveness",
        description: "Recent maintenance has successfully stabilized system parameters",
        type: "success",
        confidence: 91,
        timeframe: "Past 7 days",
        impact: "Positive",
        recommendation: "Continue with current maintenance schedule"
      });
    }
    
    return insights;
  };
  
  const insights = generateInsights();
  
  // Helper function to get icon for metric type
  const getMetricIcon = (metricName: string) => {
    switch(metricName) {
      case 'temperature': return <IconTemperature className="h-4 w-4" />;
      case 'humidity': return <IconDroplet className="h-4 w-4" />;
      case 'current': 
      case 'voltage': return <IconBolt className="h-4 w-4" />;
      case 'vibration': return <IconWaveSine className="h-4 w-4" />;
      default: return <IconInfoCircle className="h-4 w-4" />;
    }
  };
  
  // Helper function to get color classes for insight type
  const getInsightColorClasses = (type: InsightType) => {
    switch(type) {
      case 'critical': 
        return {
          border: "border-l-red-500",
          bg: "bg-red-50 dark:bg-red-950/10",
          iconBg: "bg-red-100/80 text-red-500",
          text: "text-red-700 dark:text-red-400",
          lightText: "text-red-600/80"
        };
      case 'warning': 
        return {
          border: "border-l-amber-500",
          bg: "bg-amber-50 dark:bg-amber-950/10",
          iconBg: "bg-amber-100/80 text-amber-500",
          text: "text-amber-700 dark:text-amber-400",
          lightText: "text-amber-600/80"
        };
      case 'prediction': 
        return {
          border: "border-l-purple-500",
          bg: "bg-purple-50 dark:bg-purple-950/10",
          iconBg: "bg-purple-100/80 text-purple-500",
          text: "text-purple-700 dark:text-purple-400",
          lightText: "text-purple-600/80"
        };
      case 'optimization': 
        return {
          border: "border-l-blue-500",
          bg: "bg-blue-50 dark:bg-blue-950/10",
          iconBg: "bg-blue-100/80 text-blue-500",
          text: "text-blue-700 dark:text-blue-400",
          lightText: "text-blue-600/80"
        };
      case 'success': 
        return {
          border: "border-l-green-500",
          bg: "bg-green-50 dark:bg-green-950/10",
          iconBg: "bg-green-100/80 text-green-500",
          text: "text-green-700 dark:text-green-400",
          lightText: "text-green-600/80"
        };
      default: 
        return {
          border: "border-l-slate-500",
          bg: "bg-slate-50 dark:bg-slate-950/10",
          iconBg: "bg-slate-100/80 text-slate-500",
          text: "text-slate-700 dark:text-slate-400",
          lightText: "text-slate-600/80"
        };
    }
  };
  
  // Helper function to get icon for insight type
  const getInsightIcon = (type: InsightType) => {
    switch(type) {
      case 'critical': return <IconAlertTriangle className="h-4 w-4" />;
      case 'warning': return <IconAlertTriangle className="h-4 w-4" />;
      case 'prediction': return <IconDeviceAnalytics className="h-4 w-4" />;
      case 'optimization': return <IconBulb className="h-4 w-4" />;
      case 'success': return <IconCircleCheck className="h-4 w-4" />;
      default: return <IconInfoCircle className="h-4 w-4" />;
    }
  };
  
  return (
    <div className="p-4 md:p-6 overflow-auto h-full">
      <Card>
        <CardHeader className="pb-3">
          <CardTitle>Overview Dashboard</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-6">
            {/* Facility Health Scores */}
            <div>
              <div className="flex items-center justify-between mb-3">
                <h3 className="text-lg font-medium">Facility Health Scores</h3>
                <Badge variant="outline" className="bg-purple-50/50 text-purple-600 border-purple-200">
                  <IconClock className="h-3 w-3 mr-1" /> AI-predicted
                </Badge>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-2">
                {facilitiesData.map(facility => {
                  // Count metrics for this facility
                  const facilityMetrics = allMetrics.filter(m => m.facilityId === facility.id.toString());
                  const facilityMetricsCount = facilityMetrics.length;
                  
                  if (facilityMetricsCount === 0) return null;
                  
                  const criticalCount = facilityMetrics.filter(m => m.status === "critical").length;
                  const warningCount = facilityMetrics.filter(m => m.status === "warning").length;
                  const okCount = facilityMetricsCount - criticalCount - warningCount;
                  
                  // Calculate health score (0-100)
                  const healthScore = Math.round((okCount / facilityMetricsCount) * 100);
                  
                  // Get score color
                  const getScoreColor = (score: number) => {
                    if (score >= 90) return "text-green-600";
                    if (score >= 75) return "text-blue-600";
                    if (score >= 60) return "text-amber-600";
                    return "text-red-600";
                  };
                  
                  // Get score rating text
                  const getScoreRating = (score: number) => {
                    if (score >= 90) return 'Excellent';
                    if (score >= 75) return 'Good';
                    if (score >= 60) return 'Fair';
                    return 'Poor';
                  };
                  
                  // Get trend 
                  const getTrend = () => {
                    // Simulate a trend based on the number of warnings and criticals
                    const trendValue = Math.round((criticalCount * -3) + (warningCount * -1) + (Math.random() * 5 - 2));
                    if (trendValue > 0) {
                      return { icon: <IconArrowUp className="h-3 w-3 mr-0.5" />, value: `+${trendValue}%`, class: "text-green-500" };
                    } else {
                      return { icon: <IconArrowDown className="h-3 w-3 mr-0.5" />, value: `${trendValue}%`, class: "text-red-500" };
                    }
                  };
                  
                  const trend = getTrend();
                  
                  return (
                    <Card 
                      key={facility.id} 
                      className="overflow-hidden cursor-pointer hover:shadow-md transition-shadow border border-slate-200 dark:border-slate-800"
                      onClick={() => onSelectFacility(facility.id.toString())}
                    >
                      <CardContent className="p-0">
                        {/* Card Header with icon and status indicators */}
                        <div className="flex items-center justify-between p-3 border-b border-slate-100 dark:border-slate-800">
                          <div className="flex items-center gap-2">
                            <div className="bg-slate-100 dark:bg-slate-800 p-1.5 rounded-md">
                              <IconBuildingFactory2 className="h-4 w-4 text-slate-500 dark:text-slate-400" />
                            </div>
                            <div>
                              <h4 className="font-medium truncate">{facility.name}</h4>
                              <p className="text-xs text-slate-500 dark:text-slate-400 truncate">{facility.location}</p>
                            </div>
                          </div>
                          <div className="flex gap-1.5">
                            {criticalCount > 0 && (
                              <div className="flex items-center gap-1">
                                <div className="w-2 h-2 rounded-full bg-red-500"></div>
                                <span className="text-xs text-red-600 dark:text-red-400">{criticalCount}</span>
                              </div>
                            )}
                            {warningCount > 0 && (
                              <div className="flex items-center gap-1">
                                <div className="w-2 h-2 rounded-full bg-amber-500"></div>
                                <span className="text-xs text-amber-600 dark:text-amber-400">{warningCount}</span>
                              </div>
                            )}
                          </div>
                        </div>
                        
                        {/* Health Score Display */}
                        <div className="p-4 pt-3">
                          <div className="flex items-baseline gap-2 mb-2">
                            <span className={`text-3xl font-bold ${getScoreColor(healthScore)}`}>
                              {healthScore}%
                            </span>
                            <span className="text-xs text-slate-500 dark:text-slate-400">
                              {getScoreRating(healthScore)}
                            </span>
                            <span className={`text-xs flex items-center ml-auto ${trend.class}`}>
                              {trend.icon}
                              {trend.value}
                            </span>
                          </div>
                          
                          {/* Health metrics breakdown */}
                          <div className="flex gap-2 items-center text-xs text-slate-500 dark:text-slate-400">
                            <div className="flex-1 bg-slate-200 dark:bg-slate-700 rounded-full h-1.5 overflow-hidden">
                              {/* Health bar with colored segments */}
                              <div className="flex h-full">
                                {criticalCount > 0 && (
                                  <div 
                                    className="bg-red-500 h-full" 
                                    style={{width: `${(criticalCount / facilityMetricsCount) * 100}%`}}
                                  ></div>
                                )}
                                {warningCount > 0 && (
                                  <div 
                                    className="bg-amber-500 h-full" 
                                    style={{width: `${(warningCount / facilityMetricsCount) * 100}%`}}
                                  ></div>
                                )}
                                <div 
                                  className="bg-green-500 h-full" 
                                  style={{width: `${(okCount / facilityMetricsCount) * 100}%`}}
                                ></div>
                              </div>
                            </div>
                            <div>
                              {facility.controlPanels.length} panel{facility.controlPanels.length !== 1 ? 's' : ''}
                            </div>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  );
                })}
              </div>
            </div>
            
            {/* AI Alerts */}
            <div>
              <div className="flex items-center justify-between mb-3">
                <div className="flex items-center gap-2">
                  <div className="bg-purple-100 dark:bg-purple-900/30 rounded-full p-1.5">
                    <IconBrain className="h-5 w-5 text-purple-600 dark:text-purple-400" />
                  </div>
                  <h3 className="text-lg font-medium">AI Alerts</h3>
                </div>
                <Badge variant="outline" className="bg-purple-50/50 text-purple-600 border-purple-200">
                  <IconClock className="h-3 w-3 mr-1" /> Live
                </Badge>
              </div>
              
              <Card className="overflow-hidden shadow-sm border-0">
                <div className="divide-y divide-slate-100 dark:divide-slate-800">
                  {/* System health insight (always first) */}
                  {insights.filter(i => i.id === "system-health").map(insight => {
                    const colors = getInsightColorClasses(insight.type);
                    return (
                      <div 
                        key={insight.id} 
                        className={`p-5 bg-white dark:bg-slate-950`}
                      >
                        <div className="flex items-center mb-4">
                          <div className={`w-2.5 h-2.5 rounded-full ${insight.type === "critical" ? "bg-red-500" : insight.type === "warning" ? "bg-amber-500" : "bg-green-500"} mr-2`}></div>
                          <h4 className="font-medium text-slate-900 dark:text-white">{insight.title}</h4>
                          
                          {/* Status badge */}
                          <div className="ml-auto">
                            <Badge className={`${
                              insight.type === "critical" ? "bg-red-100 text-red-800 dark:bg-red-900/40 dark:text-red-300" :
                              insight.type === "warning" ? "bg-amber-100 text-amber-800 dark:bg-amber-900/40 dark:text-amber-300" :
                              "bg-green-100 text-green-800 dark:bg-green-900/40 dark:text-green-300"
                            } border-0`}>
                              {insight.type === "critical" ? "Critical" : 
                               insight.type === "warning" ? "Warning" : 
                               "Normal"}
                            </Badge>
                          </div>
                        </div>
                        
                        <p className="text-sm text-slate-600 dark:text-slate-400 mb-4">{insight.description}</p>
                        
                        {/* Badges row */}
                        <div className="flex flex-wrap items-center gap-2 mb-4">
                          {/* Impact badge */}
                          {insight.impact && (
                            <Badge variant="outline" className={`
                              ${insight.impact === "High" ? "border-red-200 text-red-700 dark:border-red-800 dark:text-red-400" :
                                insight.impact === "Medium" ? "border-amber-200 text-amber-700 dark:border-amber-800 dark:text-amber-400" :
                                "border-blue-200 text-blue-700 dark:border-blue-800 dark:text-blue-400"}
                            `}>
                              {insight.impact} impact
                            </Badge>
                          )}
                          
                          {/* Confidence badge if high */}
                          {insight.confidence && (
                            <Badge variant="outline" className="border-green-200 text-green-700 dark:border-green-800 dark:text-green-400">
                              {insight.confidence}% confidence
                            </Badge>
                          )}
                          
                          {/* Timeframe badge */}
                          {insight.timeframe && (
                            <Badge variant="outline" className="border-slate-200 text-slate-700 dark:border-slate-700 dark:text-slate-400">
                              <IconClock className="h-3 w-3 mr-1 opacity-70" />
                              {insight.timeframe}
                            </Badge>
                          )}
                        </div>
                        
                        {insight.metrics && (
                          <div className="grid grid-cols-3 gap-3 mt-3">
                            <div className="flex items-center p-3 bg-slate-50 dark:bg-slate-900 rounded-lg">
                              <div className="flex items-center justify-center w-8 h-8 bg-green-100 dark:bg-green-900/30 rounded-full mr-3 flex-shrink-0">
                                <IconCircleCheck className="h-4 w-4 text-green-600 dark:text-green-400" />
                              </div>
                              <div>
                                <span className="block font-semibold text-lg text-green-600 dark:text-green-400">{insight.metrics.ok}</span>
                                <span className="text-xs text-slate-500 dark:text-slate-400">OK</span>
                              </div>
                            </div>

                            <div className="flex items-center p-3 bg-slate-50 dark:bg-slate-900 rounded-lg">
                              <div className={`flex items-center justify-center w-8 h-8 rounded-full mr-3 flex-shrink-0 ${insight.metrics.warning > 0 ? "bg-amber-100 dark:bg-amber-900/30" : "bg-slate-100 dark:bg-slate-800"}`}>
                                <IconAlertTriangle className={`h-4 w-4 ${insight.metrics.warning > 0 ? "text-amber-600 dark:text-amber-400" : "text-slate-400 dark:text-slate-600"}`} />
                              </div>
                              <div>
                                <span className={`block font-semibold text-lg ${insight.metrics.warning > 0 ? "text-amber-600 dark:text-amber-400" : "text-slate-400 dark:text-slate-600"}`}>{insight.metrics.warning}</span>
                                <span className="text-xs text-slate-500 dark:text-slate-400">Warning</span>
                              </div>
                            </div>

                            <div className="flex items-center p-3 bg-slate-50 dark:bg-slate-900 rounded-lg">
                              <div className={`flex items-center justify-center w-8 h-8 rounded-full mr-3 flex-shrink-0 ${insight.metrics.critical > 0 ? "bg-red-100 dark:bg-red-900/30" : "bg-slate-100 dark:bg-slate-800"}`}>
                                <IconAlertTriangle className={`h-4 w-4 ${insight.metrics.critical > 0 ? "text-red-600 dark:text-red-400" : "text-slate-400 dark:text-slate-600"}`} />
                              </div>
                              <div>
                                <span className={`block font-semibold text-lg ${insight.metrics.critical > 0 ? "text-red-600 dark:text-red-400" : "text-slate-400 dark:text-slate-600"}`}>{insight.metrics.critical}</span>
                                <span className="text-xs text-slate-500 dark:text-slate-400">Critical</span>
                              </div>
                            </div>
                          </div>
                        )}
                        
                        {insight.metrics && (insight.metrics.critical > 0 || insight.metrics.warning > 0) && (
                          <div className="mt-4 flex flex-col gap-2">
                            <h5 className="text-xs font-medium text-slate-700 dark:text-slate-300">Affected Facilities:</h5>
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                              {/* Show facilities with critical issues */}
                              {facilitiesData.filter(facility => 
                                facility.controlPanels.some(panel => 
                                  Object.values(panel.metrics).some(m => m.status === "critical")
                                )
                              ).slice(0, 2).map(facility => (
                                <div 
                                  key={`critical-${facility.id}`} 
                                  className="flex items-center gap-2 p-2 rounded-md bg-red-50 dark:bg-red-950/20 text-red-700 dark:text-red-400 text-xs"
                                >
                                  <IconBuildingFactory2 className="h-3.5 w-3.5" />
                                  <span className="font-medium truncate">{facility.name}</span>
                                  <span className="ml-auto text-red-600 dark:text-red-400">Critical</span>
                                </div>
                              ))}
                              
                              {/* Show facilities with warning issues */}
                              {facilitiesData.filter(facility => 
                                !facility.controlPanels.some(panel => 
                                  Object.values(panel.metrics).some(m => m.status === "critical")
                                ) &&
                                facility.controlPanels.some(panel => 
                                  Object.values(panel.metrics).some(m => m.status === "warning")
                                )
                              ).slice(0, 2).map(facility => (
                                <div 
                                  key={`warning-${facility.id}`} 
                                  className="flex items-center gap-2 p-2 rounded-md bg-amber-50 dark:bg-amber-950/20 text-amber-700 dark:text-amber-400 text-xs"
                                >
                                  <IconBuildingFactory2 className="h-3.5 w-3.5" />
                                  <span className="font-medium truncate">{facility.name}</span>
                                  <span className="ml-auto text-amber-600 dark:text-amber-400">Warning</span>
                                </div>
                              ))}
                            </div>
                          </div>
                        )}
                        
                        {insight.recommendation && (
                          <div className="mt-4 p-3 bg-blue-50 dark:bg-blue-950/20 rounded-lg border border-blue-100 dark:border-blue-900/30 flex items-start">
                            <IconBulb className="h-4 w-4 text-blue-500 mt-0.5 mr-2 flex-shrink-0" />
                            <span className="text-sm text-slate-700 dark:text-slate-300">{insight.recommendation}</span>
                          </div>
                        )}
                      </div>
                    );
                  })}
                  
                  {/* All other insights */}
                  {insights.filter(i => i.id !== "system-health").map(insight => {
                    const colors = getInsightColorClasses(insight.type);
                    const isPriority = insight.type === 'critical';
                    
                    return (
                      <div key={insight.id} className="group cursor-pointer">
                        <div 
                          className={`relative flex items-start p-4 hover:bg-slate-50 dark:hover:bg-slate-900/50 transition-colors`}
                        >
                          {/* Left colored indicator */}
                          <div className={`absolute left-0 top-0 bottom-0 w-1 ${insight.type === "critical" ? "bg-red-500" : insight.type === "warning" ? "bg-amber-500" : insight.type === "prediction" ? "bg-purple-500" : insight.type === "optimization" ? "bg-blue-500" : "bg-green-500"}`}></div>
                          
                          {/* Status indicator */}
                          <div className={`flex-shrink-0 rounded-full p-2 mt-0.5 mr-3 ${isPriority ? "relative bg-red-100/80 text-red-500 dark:bg-red-900/30 dark:text-red-400" : insight.type === "warning" ? "bg-amber-100/80 text-amber-600 dark:bg-amber-900/30 dark:text-amber-400" : insight.type === "prediction" ? "bg-purple-100/80 text-purple-600 dark:bg-purple-900/30 dark:text-purple-400" : insight.type === "optimization" ? "bg-blue-100/80 text-blue-600 dark:bg-blue-900/30 dark:text-blue-400" : "bg-green-100/80 text-green-600 dark:bg-green-900/30 dark:text-green-400"}`}>
                            {isPriority && (
                              <span className="absolute inset-0 rounded-full animate-ping bg-red-400 opacity-75"></span>
                            )}
                            {getInsightIcon(insight.type)}
                          </div>
                          
                          {/* Content */}
                          <div className="flex-1 min-w-0">
                            <div className="flex items-start justify-between gap-2 mb-1">
                              <h4 className="font-medium text-sm text-slate-900 dark:text-white leading-tight">{insight.title}</h4>
                              
                              {/* Status badges */}
                              <div className="flex flex-shrink-0 items-center">
                                {isPriority && (
                                  <Badge className="h-5 text-xs bg-red-100 text-red-800 border-none dark:bg-red-900/40 dark:text-red-300">
                                    Priority
                                  </Badge>
                                )}
                              </div>
                            </div>
                            
                            <p className="text-xs text-slate-500 dark:text-slate-400 mb-2">{insight.description}</p>
                            
                            {/* Facility and Panel info */}
                            {insight.facilityId && (
                              <div className="flex items-center gap-1 mb-2 text-xs text-slate-600 dark:text-slate-300">
                                <IconBuildingFactory2 className="h-3 w-3 text-slate-400" />
                                {insight.metric ? (
                                  <>
                                    <span className="font-medium">{insight.metric.facilityName}</span>
                                    <span className="mx-1">•</span>
                                    <span>{getMappedControlPanelId(insight.metric.panelId)} - {insight.metric.panelName}</span>
                                  </>
                                ) : (
                                  <>
                                    <span className="font-medium">
                                      {facilitiesData.find(f => f.id.toString() === insight.facilityId)?.name || "Unknown Facility"}
                                    </span>
                                    {insight.panelId && (
                                      <>
                                        <span className="mx-1">•</span>
                                        <span>
                                          {getMappedControlPanelId(insight.panelId)} - {facilitiesData.find(f => f.id.toString() === insight.facilityId)
                                            ?.controlPanels.find(p => p.id === insight.panelId)?.name || "Unknown Panel"}
                                        </span>
                                      </>
                                    )}
                                  </>
                                )}
                              </div>
                            )}
                            
                            {/* Status and badges row */}
                            <div className="flex flex-wrap items-center gap-2 mb-2">
                              {/* Status badge */}
                              <Badge className={`${
                                insight.type === "critical" ? "bg-red-100 text-red-800 dark:bg-red-900/40 dark:text-red-300" :
                                insight.type === "warning" ? "bg-amber-100 text-amber-800 dark:bg-amber-900/40 dark:text-amber-300" :
                                insight.type === "prediction" ? "bg-purple-100 text-purple-800 dark:bg-purple-900/40 dark:text-purple-300" :
                                insight.type === "optimization" ? "bg-blue-100 text-blue-800 dark:bg-blue-900/40 dark:text-blue-300" :
                                "bg-green-100 text-green-800 dark:bg-green-900/40 dark:text-green-300"
                              } border-0`}>
                                {insight.type.charAt(0).toUpperCase() + insight.type.slice(1)}
                              </Badge>
                              
                              {/* Impact badge */}
                              {insight.impact && (
                                <Badge variant="outline" className={`
                                  ${insight.impact === "High" ? "border-red-200 text-red-700 dark:border-red-800 dark:text-red-400" :
                                    insight.impact === "Medium" ? "border-amber-200 text-amber-700 dark:border-amber-800 dark:text-amber-400" :
                                    "border-blue-200 text-blue-700 dark:border-blue-800 dark:text-blue-400"}
                                `}>
                                  {insight.impact} impact
                                </Badge>
                              )}
                              
                              {/* Confidence badge if high */}
                              {insight.confidence && (
                                <Badge variant="outline" className="border-green-200 text-green-700 dark:border-green-800 dark:text-green-400">
                                  {insight.confidence}% confidence
                                </Badge>
                              )}
                              
                              {/* Timeframe badge */}
                              {insight.timeframe && (
                                <Badge variant="outline" className="border-slate-200 text-slate-700 dark:border-slate-700 dark:text-slate-400">
                                  <IconClock className="h-3 w-3 mr-1 opacity-70" />
                                  {insight.timeframe}
                                </Badge>
                              )}
                            </div>
                            
                            {/* Metric details (compact) */}
                            {insight.metric && (
                              <div className="p-2 bg-slate-50 dark:bg-slate-900/60 rounded-md mb-2">
                                <div className="flex items-center justify-between">
                                  <span className="flex items-center gap-1 text-xs text-slate-700 dark:text-slate-300">
                                    {getMetricIcon(insight.metric.metricName)}
                                    <span className="capitalize">{insight.metric.metricName}:</span>
                                    <span className="font-semibold">{insight.metric.value}{insight.metric.unit}</span>
                                  </span>
                                  
                                  <span className="flex items-center text-xs">
                                    {insight.metric.trend.startsWith("+") ? (
                                      <span className="text-red-500 flex items-center">
                                        <IconArrowUp className="h-3 w-3 mr-0.5" />
                                        {insight.metric.trend.substring(1)}
                                      </span>
                                    ) : (
                                      <span className="text-blue-500 flex items-center">
                                        <IconArrowDown className="h-3 w-3 mr-0.5" />
                                        {insight.metric.trend.substring(1)}
                                      </span>
                                    )}
                                  </span>
                                </div>
                              </div>
                            )}
                            
                            {/* Bottom row with timeframe and action */}
                            <div className="flex items-center justify-between text-xs">
                              <div className="flex items-center gap-3">
                                {insight.recommendation && (
                                  <span className="text-blue-600 dark:text-blue-400 flex items-center">
                                    <IconBulb className="h-3 w-3 mr-1" />
                                    <span>Recommendation</span>
                                  </span>
                                )}
                              </div>
                              
                              {insight.facilityId && insight.panelId && (
                                <button
                                  className="rounded-md px-2 py-1 flex items-center gap-1 text-blue-600 bg-blue-50 hover:bg-blue-100 dark:text-blue-400 dark:bg-blue-950/20 dark:hover:bg-blue-900/30 font-medium text-xs transition-all group-hover:shadow-sm"
                                  onClick={(e) => {
                                    e.stopPropagation();
                                    onSelectPanel(insight.facilityId!, insight.panelId!);
                                  }}
                                >
                                  View details
                                  <IconChevronRight className="h-3 w-3 group-hover:translate-x-0.5 transition-transform" />
                                </button>
                              )}
                            </div>
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </Card>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
} 