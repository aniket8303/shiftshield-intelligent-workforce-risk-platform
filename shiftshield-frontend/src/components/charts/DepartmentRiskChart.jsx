import React from 'react';
import { PieChart, Pie, Cell, Tooltip, Legend, ResponsiveContainer } from 'recharts';

export const DepartmentRiskChart = ({ data }) => {
  if (!data || data.length === 0) {
    return (
      <div style={{ height: '300px', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--text-secondary)' }}>
        No department risk data available
      </div>
    );
  }

  // Transform data for pie chart: show departments with highest total open risks
  const chartData = data
    .filter(dept => dept.openRisks > 0)
    .map(dept => ({
      name: dept.departmentName,
      value: dept.openRisks,
      critical: dept.criticalRisks,
      high: dept.highRisks
    }))
    .sort((a, b) => b.value - a.value);

  const COLORS = ['#ef4444', '#f97316', '#f59e0b', '#3b82f6', '#8b5cf6', '#64748b'];

  const CustomTooltip = ({ active, payload }) => {
    if (active && payload && payload.length) {
      const data = payload[0].payload;
      return (
        <div style={{ backgroundColor: 'var(--panel-bg)', padding: '10px', border: '1px solid var(--panel-border)', borderRadius: '8px' }}>
          <p style={{ margin: 0, fontWeight: 'bold' }}>{data.name}</p>
          <p style={{ margin: '5px 0' }}>Open Risks: {data.value}</p>
          <p style={{ margin: 0, color: '#ef4444', fontSize: '12px' }}>Critical: {data.critical}</p>
          <p style={{ margin: 0, color: '#f97316', fontSize: '12px' }}>High: {data.high}</p>
        </div>
      );
    }
    return null;
  };

  return (
    <div style={{ width: '100%', height: '300px' }}>
      <ResponsiveContainer>
        <PieChart>
          <Pie
            data={chartData}
            cx="50%"
            cy="50%"
            innerRadius={60}
            outerRadius={100}
            fill="#8884d8"
            paddingAngle={2}
            dataKey="value"
          >
            {chartData.map((entry, index) => (
              <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
            ))}
          </Pie>
          <Tooltip content={<CustomTooltip />} />
          <Legend layout="vertical" verticalAlign="middle" align="right" />
        </PieChart>
      </ResponsiveContainer>
    </div>
  );
};
