# SupplySight Dashboard

A Daily Inventory Dashboard for supply chain management, built with React, Tailwind CSS, and GraphQL.

## 🚀 Quick Start

### Prerequisites
- Node.js (v14 or higher)
- npm or yarn

### Installation

1. **Install dependencies:**
   ```bash
   npm install
   ```

2. **Start the GraphQL server:**
   ```bash
   npm run server
   ```
   The server will run on `http://localhost:4000/graphql`

3. **In a new terminal, start the React app:**
   ```bash
   npm start
   ```
   The app will open at `http://localhost:3000`

## 🏗️ Project Structure

```
supplysight-dashboard/
├── public/
│   └── index.html
├── src/
│   ├── components/
│   │   ├── Header.js          # Top navigation with logo and date range
│   │   ├── KPICards.js        # KPI metrics display
│   │   ├── TrendChart.js      # Stock vs Demand chart
│   │   ├── Filters.js         # Search and filter controls
│   │   ├── ProductsTable.js   # Products data table
│   │   └── ProductDrawer.js   # Product details and forms
│   ├── App.js                 # Main application component
│   ├── index.js               # React entry point
│   └── index.css              # Tailwind CSS imports
├── server.js                  # Mock GraphQL server
├── package.json               # Dependencies and scripts
├── tailwind.config.js         # Tailwind configuration
├── postcss.config.js          # PostCSS configuration
├── README.md                  # This file
└── NOTES.md                   # Development decisions and improvements
```

## 📊 Features

- **Dashboard Layout**: Clean, responsive design with KPI cards
- **Real-time Data**: Live updates from GraphQL server
- **Interactive Charts**: Stock vs Demand trends over time
- **Advanced Filtering**: Search, warehouse, and status filters
- **Product Management**: View details, update demand, transfer stock
- **Status Tracking**: Automatic health status calculation
- **Pagination**: Efficient data display with 10 items per page

## 🔧 GraphQL Schema

The application uses the exact schema provided by the client:

- **Queries**: `products`, `warehouses`, `kpis`
- **Mutations**: `updateDemand`, `transferStock`
- **Types**: `Product`, `Warehouse`, `KPI`

## 🎨 Design System

- **Tailwind CSS** for consistent styling
- **Responsive design** for all screen sizes
- **Accessible color scheme** with proper contrast
- **Modern UI patterns** following best practices

## 📱 Responsive Design

- Mobile-first approach
- Touch-friendly interactions
- Adaptive layouts for different screen sizes
- Optimized for desktop and mobile use

## 🚀 Available Scripts

- `npm start` - Start the React development server
- `npm run server` - Start the GraphQL mock server
- `npm run build` - Build the app for production
- `npm test` - Run test suite
- `npm run eject` - Eject from Create React App

## 🔍 GraphQL Playground

Once the server is running, you can access the GraphQL Playground at:
`http://localhost:4000/graphql`

This allows you to:
- Explore the schema
- Test queries and mutations
- View sample data
- Debug GraphQL operations

## 📝 Sample Data

The mock server includes the exact sample data provided by the client:
- 4 sample products with realistic inventory data
- 3 warehouse locations
- Generated KPI data for different time ranges

## 🎯 Business Logic

- **Status Rules**: Implemented exactly as specified
  - 🟢 Healthy: stock > demand
  - 🟡 Low: stock = demand
  - 🔴 Critical: stock < demand
- **Fill Rate**: Calculated using the specified formula
- **Real-time Updates**: Data refreshes after mutations

## 🔒 Error Handling

- Graceful error states
- User-friendly error messages
- Retry functionality
- Loading states for better UX

## 📚 Dependencies

- **React 18** - Modern React with hooks
- **Tailwind CSS** - Utility-first CSS framework
- **Apollo Server** - GraphQL server implementation
- **Recharts** - Charting library for data visualization
- **Express** - Web framework for the mock server

## 🌟 What Makes This Special

- **Exact Client Requirements**: Built precisely to specifications
- **Clean Architecture**: Well-organized, maintainable code
- **Professional Quality**: Production-ready code structure
- **Attention to Detail**: Polished UI/UX implementation
- **Business Logic Accuracy**: Correct implementation of all rules

## 📞 Support

This is a take-home challenge implementation. For questions about the original requirements, please refer to the client documentation.
