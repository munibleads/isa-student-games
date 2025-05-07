export interface Metric {
  value: number;
  unit: string;
  trend: string;
  status: "normal" | "warning" | "critical";
}

export interface ControlPanel {
  id: string;
  name: string;
  metrics: {
    temperature: Metric;
    humidity: Metric;
    current: Metric;
    voltage: Metric;
    vibration: Metric;
    smoke: Metric;
  };
}

export interface Facility {
  id: number;
  name: string;
  location: string;
  status: "Operational" | "Warning" | "Critical";
  controlPanels: ControlPanel[];
}

export const facilitiesData: Facility[] = [
  {
    id: 1,
    name: "Raw Materials Processing Center",
    location: "Jubail Industrial City",
    status: "Operational",
    controlPanels: [
      {
        id: "A1",
        name: "Reactor Input Control Panel",
        metrics: {
          temperature: { value: 68.2, unit: "°C", trend: "+1.2°C/hr", status: "warning" },
          humidity: { value: 58, unit: "%", trend: "-2%/day", status: "normal" },
          current: { value: 12.4, unit: "A", trend: "+0.3A/hr", status: "normal" },
          voltage: { value: 224, unit: "V", trend: "-1V/day", status: "normal" },
          vibration: { value: 3.2, unit: "mm/s", trend: "+0.5mm/s/hr", status: "warning" },
          smoke: { value: 8, unit: "ppm", trend: "+1ppm/hr", status: "normal" },
        }
      },
      {
        id: "A2",
        name: "Heating System Control Panel",
        metrics: {
          temperature: { value: 55.1, unit: "°C", trend: "-0.5°C/hr", status: "normal" },
          humidity: { value: 62, unit: "%", trend: "+1%/day", status: "normal" },
          current: { value: 8.7, unit: "A", trend: "-0.1A/hr", status: "normal" },
          voltage: { value: 228, unit: "V", trend: "+0.5V/day", status: "normal" },
          vibration: { value: 1.8, unit: "mm/s", trend: "-0.2mm/s/day", status: "normal" },
          smoke: { value: 5, unit: "ppm", trend: "-1ppm/day", status: "normal" },
        }
      },
      {
        id: "A3",
        name: "Pressure Regulation Control Panel",
        metrics: {
          temperature: { value: 72.4, unit: "°C", trend: "+2.8°C/hr", status: "critical" },
          humidity: { value: 45, unit: "%", trend: "-4%/day", status: "normal" },
          current: { value: 15.8, unit: "A", trend: "+1.2A/hr", status: "warning" },
          voltage: { value: 218, unit: "V", trend: "-2V/hr", status: "warning" },
          vibration: { value: 4.7, unit: "mm/s", trend: "+1.1mm/s/hr", status: "critical" },
          smoke: { value: 18, unit: "ppm", trend: "+5ppm/hr", status: "warning" },
        }
      },
      {
        id: "A4",
        name: "Material Transport Control Panel",
        metrics: {
          temperature: { value: 59.6, unit: "°C", trend: "+0.3°C/hr", status: "normal" },
          humidity: { value: 60, unit: "%", trend: "0%/day", status: "normal" },
          current: { value: 10.1, unit: "A", trend: "+0.1A/hr", status: "normal" },
          voltage: { value: 226, unit: "V", trend: "+0.2V/day", status: "normal" },
          vibration: { value: 2.2, unit: "mm/s", trend: "-0.1mm/s/day", status: "normal" },
          smoke: { value: 6, unit: "ppm", trend: "0ppm/day", status: "normal" },
        }
      }
    ]
  },
  {
    id: 2,
    name: "Catalyst Manufacturing Plant",
    location: "Dammam Industrial Area 2",
    status: "Operational",
    controlPanels: [
      {
        id: "B1",
        name: "Catalyst Synthesis Control Panel",
        metrics: {
          temperature: { value: 62.1, unit: "°C", trend: "+0.2°C/hr", status: "normal" },
          humidity: { value: 54, unit: "%", trend: "-0.5%/day", status: "normal" },
          current: { value: 10.8, unit: "A", trend: "+0.1A/hr", status: "normal" },
          voltage: { value: 226, unit: "V", trend: "+0.2V/day", status: "normal" },
          vibration: { value: 2.1, unit: "mm/s", trend: "+0.1mm/s/hr", status: "normal" },
          smoke: { value: 6, unit: "ppm", trend: "+0.3ppm/hr", status: "normal" },
        }
      },
      {
        id: "B2",
        name: "Purification System Control Panel",
        metrics: {
          temperature: { value: 66.2, unit: "°C", trend: "-0.2°C/hr", status: "normal" },
          humidity: { value: 57, unit: "%", trend: "-0.3%/day", status: "normal" },
          current: { value: 11.5, unit: "A", trend: "+0.1A/hr", status: "normal" },
          voltage: { value: 224, unit: "V", trend: "+0.2V/day", status: "normal" },
          vibration: { value: 2.2, unit: "mm/s", trend: "+0.1mm/s/hr", status: "normal" },
          smoke: { value: 8, unit: "ppm", trend: "+0.4ppm/hr", status: "normal" },
        }
      },
      {
        id: "B3",
        name: "Quality Control Station Control Panel",
        metrics: {
          temperature: { value: 60.0, unit: "°C", trend: "+0.2°C/hr", status: "normal" },
          humidity: { value: 64, unit: "%", trend: "+1.0%/day", status: "normal" },
          current: { value: 9.7, unit: "A", trend: "+0.1A/hr", status: "normal" },
          voltage: { value: 227, unit: "V", trend: "+0.2V/day", status: "normal" },
          vibration: { value: 1.9, unit: "mm/s", trend: "+0.1mm/s/day", status: "normal" },
          smoke: { value: 4, unit: "ppm", trend: "0ppm/day", status: "normal" },
        }
      },
      {
        id: "B4",
        name: "Storage Environment Control Panel",
        metrics: {
          temperature: { value: 65.1, unit: "°C", trend: "+0.9°C/hr", status: "normal" },
          humidity: { value: 57, unit: "%", trend: "-1%/day", status: "normal" },
          current: { value: 11.5, unit: "A", trend: "+0.2A/hr", status: "normal" },
          voltage: { value: 226, unit: "V", trend: "-0.3V/day", status: "normal" },
          vibration: { value: 2.9, unit: "mm/s", trend: "+0.3mm/s/hr", status: "warning" },
          smoke: { value: 9, unit: "ppm", trend: "+1ppm/hr", status: "normal" },
        }
      }
    ]
  },
  {
    id: 3,
    name: "Finished Products Plant",
    location: "Yanbu Industrial City",
    status: "Warning",
    controlPanels: [
      {
        id: "C1",
        name: "Final Assembly Line Control Panel",
        metrics: {
          temperature: { value: 75.8, unit: "°C", trend: "+2.9°C/hr", status: "critical" },
          humidity: { value: 42, unit: "%", trend: "-3.5%/day", status: "warning" },
          current: { value: 14.6, unit: "A", trend: "+1.1A/hr", status: "warning" },
          voltage: { value: 217, unit: "V", trend: "-2.1V/hr", status: "warning" },
          vibration: { value: 4.5, unit: "mm/s", trend: "+1.2mm/s/hr", status: "critical" },
          smoke: { value: 20, unit: "ppm", trend: "+7ppm/hr", status: "warning" },
        }
      },
      {
        id: "C2",
        name: "Packaging System Control Panel",
        metrics: {
          temperature: { value: 61.2, unit: "°C", trend: "+0.5°C/hr", status: "normal" },
          humidity: { value: 59, unit: "%", trend: "+0.5%/day", status: "normal" },
          current: { value: 10.3, unit: "A", trend: "+0.1A/hr", status: "normal" },
          voltage: { value: 228, unit: "V", trend: "+0.2V/day", status: "normal" },
          vibration: { value: 2.3, unit: "mm/s", trend: "+0.1mm/s/day", status: "normal" },
          smoke: { value: 6, unit: "ppm", trend: "0ppm/day", status: "normal" },
        }
      },
      {
        id: "C3",
        name: "Product Testing Station Control Panel",
        metrics: {
          temperature: { value: 57.4, unit: "°C", trend: "-0.2°C/hr", status: "normal" },
          humidity: { value: 64, unit: "%", trend: "+1.5%/day", status: "normal" },
          current: { value: 9.2, unit: "A", trend: "-0.1A/hr", status: "normal" },
          voltage: { value: 229, unit: "V", trend: "+0.4V/day", status: "normal" },
          vibration: { value: 1.9, unit: "mm/s", trend: "-0.1mm/s/day", status: "normal" },
          smoke: { value: 3, unit: "ppm", trend: "-1ppm/day", status: "normal" },
        }
      },
      {
        id: "C4",
        name: "Distribution Prep Control Panel",
        metrics: {
          temperature: { value: 78.6, unit: "°C", trend: "+3.0°C/hr", status: "critical" },
          humidity: { value: 39, unit: "%", trend: "-3.8%/day", status: "warning" },
          current: { value: 16.2, unit: "A", trend: "+1.3A/hr", status: "warning" },
          voltage: { value: 216, unit: "V", trend: "-2.3V/hr", status: "warning" },
          vibration: { value: 5.0, unit: "mm/s", trend: "+1.2mm/s/hr", status: "critical" },
          smoke: { value: 28, unit: "ppm", trend: "+12ppm/hr", status: "critical" },
        }
      }
    ]
  }
]; 