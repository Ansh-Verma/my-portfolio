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

  // Theme-aware colours matching the Obsidian design system
  const gridColor = isDark ? "rgba(255,255,255,0.06)" : "rgba(0,0,0,0.06)";
  const labelColor = isDark ? "#fafafa" : "#0a0a0a";
  const tickColor = isDark ? "#525252" : "#a3a3a3";
  const radarStroke = "#f59e0b"; // accent-primary (amber)
  const radarFill = isDark ? "rgba(245,158,11,0.2)" : "rgba(245,158,11,0.15)";
  const gridDash = "4 4";

  return (
    <div style={{ width: "100%", height: 400 }}>
      <ResponsiveContainer width="100%" height="100%">
        <RadarChart data={data}>
          <PolarGrid stroke={gridColor} strokeDasharray={gridDash} />
          <PolarAngleAxis
            dataKey="skill"
            tick={{
              fill: labelColor,
              fontSize: 13,
              fontWeight: 500,
              fontFamily: "'Inter', system-ui, sans-serif",
            }}
          />
          <PolarRadiusAxis
            angle={90}
            domain={[0, 100]}
            tick={{
              fill: tickColor,
              fontSize: 11,
            }}
            axisLine={false}
          />
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
