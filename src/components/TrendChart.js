import React from 'react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';

const TrendChart = ({ kpis }) => {
  if (!kpis || kpis.length === 0) {
    return (
      <div className="bg-white rounded-lg shadow-sm border p-6 mb-8">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Stock vs Demand Trend</h3>
        <div className="text-center text-gray-500 py-8">No data available</div>
      </div>
    );
  }

  // Format dates for better display
  const chartData = kpis.map(kpi => ({
    ...kpi,
    date: new Date(kpi.date).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })
  }));

  return (
    <div className="bg-white rounded-lg shadow-sm border p-6 mb-8">
      <h3 className="text-lg font-semibold text-gray-900 mb-6">Stock vs Demand Trend</h3>
      <ResponsiveContainer width="100%" height={300}>
        <LineChart data={chartData}>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="date" />
          <YAxis />
          <Tooltip />
          <Legend />
          <Line 
            type="monotone" 
            dataKey="stock" 
            stroke="#3B82F6" 
            strokeWidth={2}
            name="Stock"
          />
          <Line 
            type="monotone" 
            dataKey="demand" 
            stroke="#F59E0B" 
            strokeWidth={2}
            name="Demand"
          />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
};

export default TrendChart;
