import React, { useState, useEffect } from 'react';
import Header from './components/Header';
import KPICards from './components/KPICards';
import TrendChart from './components/TrendChart';
import Filters from './components/Filters';
import ProductsTable from './components/ProductsTable';
import ProductDrawer from './components/ProductDrawer';

function App() {
  const [dateRange, setDateRange] = useState('7d');
  const [filters, setFilters] = useState({
    search: '',
    warehouse: '',
    status: 'All'
  });
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const [products, setProducts] = useState([]);
  const [warehouses, setWarehouses] = useState([]);
  const [kpis, setKpis] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Fetch data from GraphQL server
  useEffect(() => {
    fetchData();
  }, [dateRange, filters]);

  const fetchData = async () => {
    try {
      setLoading(true);
      
      // Fetch products with filters
      const productsQuery = `
        query GetProducts($search: String, $status: String, $warehouse: String) {
          products(search: $search, status: $status, warehouse: $warehouse) {
            id
            name
            sku
            warehouse
            stock
            demand
          }
        }
      `;
      
      const productsResponse = await fetch('http://localhost:4000/graphql', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          query: productsQuery,
          variables: filters
        })
      });
      
      const productsData = await productsResponse.json();
      
      // Fetch warehouses
      const warehousesQuery = `
        query GetWarehouses {
          warehouses {
            code
            name
            city
            country
          }
        }
      `;
      
      const warehousesResponse = await fetch('http://localhost:4000/graphql', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ query: warehousesQuery })
      });
      
      const warehousesData = await warehousesResponse.json();
      
      // Fetch KPIs
      const kpisQuery = `
        query GetKPIs($range: String!) {
          kpis(range: $range) {
            date
            stock
            demand
          }
        }
      `;
      
      const kpisResponse = await fetch('http://localhost:4000/graphql', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          query: kpisQuery,
          variables: { range: dateRange }
        })
      });
      
      const kpisData = await kpisResponse.json();
      
      if (productsData.data) setProducts(productsData.data.products);
      if (warehousesData.data) setWarehouses(warehousesData.data.warehouses);
      if (kpisData.data) setKpis(kpisData.data.kpis);
      
    } catch (err) {
      setError('Failed to fetch data. Make sure the GraphQL server is running.');
      console.error('Error fetching data:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleProductSelect = (product) => {
    setSelectedProduct(product);
    setIsDrawerOpen(true);
  };

  const handleDrawerClose = () => {
    setIsDrawerOpen(false);
    setSelectedProduct(null);
  };

  const handleFiltersChange = (newFilters) => {
    setFilters(newFilters);
  };

  if (error) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="bg-white p-8 rounded-lg shadow-md max-w-md">
          <div className="text-red-500 text-center">
            <h2 className="text-xl font-semibold mb-4">Error</h2>
            <p className="mb-4">{error}</p>
            <button 
              onClick={() => window.location.reload()} 
              className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
            >
              Retry
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Header dateRange={dateRange} onDateRangeChange={setDateRange} />
      
      <main className="container mx-auto px-4 py-6">
        {loading ? (
          <div className="flex items-center justify-center py-20">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500"></div>
          </div>
        ) : (
          <>
            <KPICards products={products} />
            <TrendChart kpis={kpis} />
            <Filters 
              filters={filters} 
              warehouses={warehouses}
              onFiltersChange={handleFiltersChange}
            />
            <ProductsTable 
              products={products} 
              onProductSelect={handleProductSelect}
            />
          </>
        )}
      </main>
      
      {isDrawerOpen && selectedProduct && (
        <ProductDrawer
          product={selectedProduct}
          warehouses={warehouses}
          onClose={handleDrawerClose}
          onDataUpdate={fetchData}
        />
      )}
    </div>
  );
}

export default App;
