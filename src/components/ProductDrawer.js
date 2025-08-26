import React, { useState } from 'react';

const ProductDrawer = ({ product, warehouses, onClose, onDataUpdate }) => {
  const [activeTab, setActiveTab] = useState('details');
  const [updateDemandForm, setUpdateDemandForm] = useState({ demand: product.demand });
  const [transferStockForm, setTransferStockForm] = useState({
    from: product.warehouse,
    to: '',
    qty: ''
  });
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');

  const handleUpdateDemand = async (e) => {
    e.preventDefault();
    setLoading(true);
    setMessage('');

    try {
      const mutation = `
        mutation UpdateDemand($id: ID!, $demand: Int!) {
          updateDemand(id: $id, demand: $demand) {
            id
            name
            stock
            demand
          }
        }
      `;

      const response = await fetch('http://localhost:4000/graphql', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          query: mutation,
          variables: { id: product.id, demand: parseInt(updateDemandForm.demand) }
        })
      });

      const result = await response.json();
      
      if (result.data) {
        setMessage('Demand updated successfully!');
        onDataUpdate();
        setUpdateDemandForm({ demand: result.data.updateDemand.demand });
      } else {
        setMessage('Error updating demand');
      }
    } catch (error) {
      setMessage('Error updating demand');
      console.error('Error:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleTransferStock = async (e) => {
    e.preventDefault();
    setLoading(true);
    setMessage('');

    try {
      const mutation = `
        mutation TransferStock($id: ID!, $from: String!, $to: String!, $qty: Int!) {
          transferStock(id: $id, from: $from, to: $to, qty: $qty) {
            id
            name
            stock
            warehouse
          }
        }
      `;

      const response = await fetch('http://localhost:4000/graphql', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          query: mutation,
          variables: {
            id: product.id,
            from: transferStockForm.from,
            to: transferStockForm.to,
            qty: parseInt(transferStockForm.qty)
          }
        })
      });

      const result = await response.json();
      
      if (result.data) {
        setMessage('Stock transferred successfully!');
        onDataUpdate();
        setTransferStockForm({ from: product.warehouse, to: '', qty: '' });
      } else {
        setMessage('Error transferring stock');
      }
    } catch (error) {
      setMessage('Error transferring stock');
      console.error('Error:', error);
    } finally {
      setLoading(false);
    }
  };

  const getStatusInfo = (stock, demand) => {
    if (stock > demand) return { status: 'Healthy', color: 'text-green-600', bgColor: 'bg-green-50' };
    if (stock === demand) return { status: 'Low', color: 'text-yellow-600', bgColor: 'bg-yellow-50' };
    return { status: 'Critical', color: 'text-red-600', bgColor: 'bg-red-50' };
  };

  const statusInfo = getStatusInfo(product.stock, product.demand);

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex justify-end">
      <div className="bg-white w-full max-w-md h-full overflow-y-auto">
        <div className="p-6 border-b">
          <div className="flex items-center justify-between">
            <h2 className="text-xl font-semibold text-gray-900">Product Details</h2>
            <button
              onClick={onClose}
              className="text-gray-400 hover:text-gray-600"
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>
        </div>

        {/* Tabs */}
        <div className="flex border-b">
          {['details', 'update-demand', 'transfer-stock'].map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`flex-1 py-3 px-4 text-sm font-medium border-b-2 ${
                activeTab === tab
                  ? 'border-blue-500 text-blue-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700'
              }`}
            >
              {tab === 'details' && 'Details'}
              {tab === 'update-demand' && 'Update Demand'}
              {tab === 'transfer-stock' && 'Transfer Stock'}
            </button>
          ))}
        </div>

        <div className="p-6">
          {/* Details Tab */}
          {activeTab === 'details' && (
            <div className="space-y-4">
              <div>
                <h3 className="text-lg font-medium text-gray-900">{product.name}</h3>
                <p className="text-sm text-gray-500">{product.id}</p>
              </div>
              
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-sm font-medium text-gray-700">SKU</label>
                  <p className="text-sm text-gray-900">{product.sku}</p>
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-700">Warehouse</label>
                  <p className="text-sm text-gray-900">{product.warehouse}</p>
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-700">Stock</label>
                  <p className="text-sm text-gray-900">{product.stock.toLocaleString()}</p>
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-700">Demand</label>
                  <p className="text-sm text-gray-900">{product.demand.toLocaleString()}</p>
                </div>
              </div>
              
              <div>
                <label className="text-sm font-medium text-gray-700">Status</label>
                <div className={`mt-1 inline-flex px-2 py-1 text-xs font-semibold rounded-full ${statusInfo.bgColor} ${statusInfo.color}`}>
                  {statusInfo.status === 'Healthy' && '🟢'}
                  {statusInfo.status === 'Low' && '🟡'}
                  {statusInfo.status === 'Critical' && '🔴'}
                  {statusInfo.status}
                </div>
              </div>
            </div>
          )}

          {/* Update Demand Tab */}
          {activeTab === 'update-demand' && (
            <form onSubmit={handleUpdateDemand} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  New Demand
                </label>
                <input
                  type="number"
                  min="0"
                  value={updateDemandForm.demand}
                  onChange={(e) => setUpdateDemandForm({ demand: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  required
                />
              </div>
              
              {message && (
                <div className={`p-3 rounded-md text-sm ${
                  message.includes('successfully') ? 'bg-green-50 text-green-800' : 'bg-red-50 text-red-800'
                }`}>
                  {message}
                </div>
              )}
              
              <button
                type="submit"
                disabled={loading}
                className="w-full bg-blue-500 text-white py-2 px-4 rounded-md hover:bg-blue-600 disabled:opacity-50"
              >
                {loading ? 'Updating...' : 'Update Demand'}
              </button>
            </form>
          )}

          {/* Transfer Stock Tab */}
          {activeTab === 'transfer-stock' && (
            <form onSubmit={handleTransferStock} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  From Warehouse
                </label>
                <input
                  type="text"
                  value={transferStockForm.from}
                  disabled
                  className="w-full px-3 py-2 border border-gray-300 rounded-md bg-gray-50 text-gray-500"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  To Warehouse
                </label>
                <select
                  value={transferStockForm.to}
                  onChange={(e) => setTransferStockForm({ ...transferStockForm, to: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  required
                >
                  <option value="">Select destination warehouse</option>
                  {warehouses
                    .filter(w => w.code !== product.warehouse)
                    .map(warehouse => (
                      <option key={warehouse.code} value={warehouse.code}>
                        {warehouse.name} ({warehouse.code})
                      </option>
                    ))}
                </select>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Quantity to Transfer
                </label>
                <input
                  type="number"
                  min="1"
                  max={product.stock}
                  value={transferStockForm.qty}
                  onChange={(e) => setTransferStockForm({ ...transferStockForm, qty: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder={`Max: ${product.stock}`}
                  required
                />
              </div>
              
              {message && (
                <div className={`p-3 rounded-md text-sm ${
                  message.includes('successfully') ? 'bg-green-50 text-green-800' : 'bg-red-50 text-red-800'
                }`}>
                  {message}
                </div>
              )}
              
              <button
                type="submit"
                disabled={loading || !transferStockForm.to || !transferStockForm.qty}
                className="w-full bg-green-500 text-white py-2 px-4 rounded-md hover:bg-green-600 disabled:opacity-50"
              >
                {loading ? 'Transferring...' : 'Transfer Stock'}
              </button>
            </form>
          )}
        </div>
      </div>
    </div>
  );
};

export default ProductDrawer;
