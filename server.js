const { ApolloServer } = require('apollo-server-express');
const express = require('express');
const cors = require('cors');
const { gql } = require('apollo-server-express');

const app = express();
app.use(cors());
app.use(express.json());

// Sample data exactly as provided by client
const products = [
  { "id": "P-1001", "name": "12mm Hex Bolt", "sku": "HEX-12-100", "warehouse": "BLR-A", "stock": 180, "demand": 120 },
  { "id": "P-1002", "name": "Steel Washer", "sku": "WSR-08-500", "warehouse": "BLR-A", "stock": 50, "demand": 80 },
  { "id": "P-1003", "name": "M8 Nut", "sku": "NUT-08-200", "warehouse": "PNQ-C", "stock": 80, "demand": 80 },
  { "id": "P-1004", "name": "Bearing 608ZZ", "sku": "BRG-608-50", "warehouse": "DEL-B", "stock": 24, "demand": 120 }
];

const warehouses = [
  { "code": "BLR-A", "name": "Bangalore Central", "city": "Bangalore", "country": "India" },
  { "code": "PNQ-C", "name": "Pune West", "city": "Pune", "country": "India" },
  { "code": "DEL-B", "name": "Delhi North", "city": "Delhi", "country": "India" }
];

// Mock KPI data for different date ranges
const generateKPIs = (range) => {
  const days = range === '7d' ? 7 : range === '14d' ? 14 : 30;
  const kpis = [];
  
  for (let i = days - 1; i >= 0; i--) {
    const date = new Date();
    date.setDate(date.getDate() - i);
    const dateStr = date.toISOString().split('T')[0];
    
    // Generate realistic stock and demand trends
    const baseStock = 334; // Total from sample data
    const baseDemand = 400; // Total from sample data
    const variation = 0.2;
    
    const stock = Math.round(baseStock * (1 + (Math.random() - 0.5) * variation));
    const demand = Math.round(baseDemand * (1 + (Math.random() - 0.5) * variation));
    
    kpis.push({
      date: dateStr,
      stock: stock,
      demand: demand
    });
  }
  
  return kpis;
};

// GraphQL schema exactly as provided by client
const typeDefs = gql`
  type Warehouse {
    code: ID!
    name: String!
    city: String!
    country: String!
  }

  type Product {
    id: ID!
    name: String!
    sku: String!
    warehouse: String!
    stock: Int!
    demand: Int!
  }

  type KPI {
    date: String!
    stock: Int!
    demand: Int!
  }

  type Query {
    products(search: String, status: String, warehouse: String): [Product!]!
    warehouses: [Warehouse!]!
    kpis(range: String!): [KPI!]!
  }

  type Mutation {
    updateDemand(id: ID!, demand: Int!): Product!
    transferStock(id: ID!, from: String!, to: String!, qty: Int!): Product!
  }
`;

const resolvers = {
  Query: {
    products: (_, { search, status, warehouse }) => {
      let filtered = [...products];
      
      if (search) {
        filtered = filtered.filter(p => 
          p.name.toLowerCase().includes(search.toLowerCase()) ||
          p.sku.toLowerCase().includes(search.toLowerCase()) ||
          p.id.toLowerCase().includes(search.toLowerCase())
        );
      }
      
      if (warehouse) {
        filtered = filtered.filter(p => p.warehouse === warehouse);
      }
      
      if (status && status !== 'All') {
        filtered = filtered.filter(p => {
          if (status === 'Healthy') return p.stock > p.demand;
          if (status === 'Low') return p.stock === p.demand;
          if (status === 'Critical') return p.stock < p.demand;
          return true;
        });
      }
      
      return filtered;
    },
    
    warehouses: () => warehouses,
    
    kpis: (_, { range }) => {
      return generateKPIs(range);
    }
  },
  
  Mutation: {
    updateDemand: (_, { id, demand }) => {
      const product = products.find(p => p.id === id);
      if (!product) throw new Error('Product not found');
      
      product.demand = demand;
      return product;
    },
    
    transferStock: (_, { id, from, to, qty }) => {
      const product = products.find(p => p.id === id);
      if (!product) throw new Error('Product not found');
      if (product.warehouse !== from) throw new Error('Product not in source warehouse');
      if (product.stock < qty) throw new Error('Insufficient stock');
      
      product.stock -= qty;
      // In a real app, you'd create a new product entry for the destination warehouse
      // For this mock, we'll just update the current product
      return product;
    }
  }
};

const server = new ApolloServer({
  typeDefs,
  resolvers,
  introspection: true,
  playground: true
});

async function startServer() {
  await server.start();
  server.applyMiddleware({ app, path: '/graphql' });
  
  const PORT = process.env.PORT || 4000;
  app.listen(PORT, () => {
    console.log(`🚀 Mock GraphQL server running at http://localhost:${PORT}${server.graphqlPath}`);
    console.log(`📊 Sample data loaded: ${products.length} products, ${warehouses.length} warehouses`);
  });
}

startServer();
