import React from "react";
import {
  Radar,
  RadarChart,
  PolarGrid,
  PolarAngleAxis,
  PolarRadiusAxis,
  ResponsiveContainer,
} from "recharts";
import { useTheme } from "./ThemeContext";

export default function SkillsRadar() {
  const { theme } = useTheme();
  const isDark = theme === "dark";

  
  const data = [
    { skill: "Machine Learning", value: 92 },
    { skill: "Python/AI", value: 90 },
    { skill: "Full Stack", value: 85 },
    { skill: "C# & .NET", value: 82 },
    { skill: "Data Analysis", value: 88 },
    { skill: "Cloud Tech", value: 80 },
  ];

  // Theme-aware colours
  const gridColor = isDark ? "rgba(255,255,255,0.12)" : "rgba(15,23,42,0.08)";
  const labelColor = isDark ? "#e6eef6" : "#0f172a";       // angle labels (skill names)
  const tickColor = isDark ? "#cbd5e1" : "#475569";        // numeric tick labels
  const radarStroke = isDark ? "#06b6d4" : "#0284c7";
  const radarFill = isDark ? "rgba(6,182,212,0.36)" : "rgba(2,132,199,0.36)";
  const gridDash = "4 4";

  return (
    <div style={{ width: "100%", height: 400 }}>
      <ResponsiveContainer width="100%" height="100%">
        <RadarChart data={data}>
          {/* Grid lines */}
          <PolarGrid stroke={gridColor} strokeDasharray={gridDash} />
          {/* Angle labels (skill names) */}
          <PolarAngleAxis
            dataKey="skill"
            tick={{
              fill: labelColor,
              fontSize: 14,
              fontWeight: 600,
            }}
          />
          {/* Radius axis (numbers). angle sets where labels are drawn; domain 0-100 */}
          <PolarRadiusAxis
            angle={90}
            domain={[0, 100]}
            tick={{
              fill: tickColor,
              fontSize: 12,
            }}
            // hide axis line to reduce clutter (keeps tick labels)
            axisLine={false}
          />
          {/* Radar polygon */}
          <Radar
            name="Skills"
            dataKey="value"
            stroke={radarStroke}
            fill={radarFill}
            fillOpacity={0.9}
            strokeWidth={2}
          />
        </RadarChart>
      </ResponsiveContainer>
    </div>
  );
}
