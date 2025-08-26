import React from 'react';

const KPICards = ({ products }) => {
  // Calculate KPIs exactly as specified by client
  const totalStock = products.reduce((sum, product) => sum + product.stock, 0);
  const totalDemand = products.reduce((sum, product) => sum + product.demand, 0);
  
  // Fill Rate = (sum(min(stock, demand)) / sum(demand)) * 100%
  const fillRate = totalDemand > 0 
    ? (products.reduce((sum, product) => sum + Math.min(product.stock, product.demand), 0) / totalDemand * 100).toFixed(1)
    : 0;

  const kpiData = [
    {
      title: 'Total Stock',
      value: totalStock.toLocaleString(),
      color: 'bg-blue-500',
      icon: '📦'
    },
    {
      title: 'Total Demand',
      value: totalDemand.toLocaleString(),
      color: 'bg-orange-500',
      icon: '📊'
    },
    {
      title: 'Fill Rate',
      value: `${fillRate}%`,
      color: 'bg-green-500',
      icon: '📈'
    }
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
      {kpiData.map((kpi, index) => (
        <div key={index} className="bg-white rounded-lg shadow-sm border p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">{kpi.title}</p>
              <p className="text-3xl font-bold text-gray-900 mt-2">{kpi.value}</p>
            </div>
            <div className={`${kpi.color} text-white p-3 rounded-full text-2xl`}>
              {kpi.icon}
            </div>
          </div>
        </div>
      ))}
    </div>
  );
};

export default KPICards;
