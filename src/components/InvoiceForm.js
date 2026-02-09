import React from 'react';

const InvoiceForm = ({ invoice, onInvoiceChange }) => {
  const handleCompanyChange = (e) => {
    const { name, value } = e.target;
    onInvoiceChange({
      ...invoice,
      [name]: value
    });
  };

  const handleClientChange = (e) => {
    const { name, value } = e.target;
    onInvoiceChange({
      ...invoice,
      [name]: value
    });
  };

  const handleItemChange = (id, field, value) => {
    const updatedItems = invoice.items.map(item => {
      if (item.id === id) {
        const updatedItem = { ...item, [field]: value };
        if (field === 'quantity' || field === 'rate') {
          const quantity = parseFloat(updatedItem.quantity) || 0;
          const rate = parseFloat(updatedItem.rate) || 0;
          updatedItem.amount = quantity * rate;
        }
        return updatedItem;
      }
      return item;
    });
    onInvoiceChange({ ...invoice, items: updatedItems });
  };

  const addItem = () => {
    const newId = Math.max(...invoice.items.map(i => i.id), 0) + 1;
    const newItems = [
      ...invoice.items,
      { id: newId, description: '', quantity: 1, rate: 0, amount: 0 }
    ];
    onInvoiceChange({ ...invoice, items: newItems });
  };

  const removeItem = (id) => {
    const updatedItems = invoice.items.filter(item => item.id !== id);
    onInvoiceChange({ ...invoice, items: updatedItems });
  };

  const handleMetadataChange = (e) => {
    const { name, value } = e.target;
    onInvoiceChange({
      ...invoice,
      [name]: name === 'tax' || name === 'discount'
        ? (value === '' ? '' : (parseFloat(value) || 0))
        : value
    });
  };

  return (
    <div className="flex flex-col gap-6">
      {/* Invoice Details Section */}
      <div className="border border-gray-200 rounded-lg p-5 bg-gray-50">
        <h2 className="text-xl font-bold mb-4 text-gray-800 border-b-2 border-indigo-500 pb-2">Invoice Details</h2>
        <div className="grid grid-cols-3 gap-4">
          <div>
            <label className="block mb-2 font-semibold text-gray-700 text-sm">Invoice Number</label>
            <input
              type="text"
              name="invoiceNumber"
              value={invoice.invoiceNumber}
              onChange={handleMetadataChange}
              placeholder="INV-0001"
              className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
            />
          </div>
          <div>
            <label className="block mb-2 font-semibold text-gray-700 text-sm">Date</label>
            <input
              type="date"
              name="date"
              value={invoice.date}
              onChange={handleMetadataChange}
              placeholder="YYYY-MM-DD"
              className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
            />
          </div>
          <div>
            <label className="block mb-2 font-semibold text-gray-700 text-sm">Due Date</label>
            <input
              type="date"
              name="dueDate"
              value={invoice.dueDate}
              onChange={handleMetadataChange}
              placeholder="YYYY-MM-DD"
              className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
            />
          </div>
        </div>
      </div>

      {/* Company Information Section */}
      <div className="border border-gray-200 rounded-lg p-5 bg-gray-50">
        <h2 className="text-xl font-bold mb-4 text-gray-800 border-b-2 border-indigo-500 pb-2">Company Information</h2>
        <div className="mb-4">
          <label className="block mb-2 font-semibold text-gray-700 text-sm">Company Name</label>
          <input
            type="text"
            name="companyName"
            value={invoice.companyName}
            onChange={handleCompanyChange}
            placeholder="Your Company Name"
            className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
          />
        </div>
        <div className="grid grid-cols-2 gap-4 mb-4">
          <div>
            <label className="block mb-2 font-semibold text-gray-700 text-sm">Email</label>
            <input
              type="email"
              name="companyEmail"
              value={invoice.companyEmail}
              onChange={handleCompanyChange}
              placeholder="Enter your company email"
              className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
            />
          </div>
          <div>
            <label className="block mb-2 font-semibold text-gray-700 text-sm">Phone</label>
            <input
              type="text"
              name="companyPhone"
              value={invoice.companyPhone}
              onChange={handleCompanyChange}
              placeholder="Enter official contact number"
              className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
            />
          </div>
        </div>
        <div>
          <label className="block mb-2 font-semibold text-gray-700 text-sm">Address</label>
          <textarea
            name="companyAddress"
            value={invoice.companyAddress}
            onChange={handleCompanyChange}
            placeholder="Enter your company address"
            className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent resize-none min-h-20"
          />
        </div>
      </div>

      {/* Client Information Section */}
      <div className="border border-gray-200 rounded-lg p-5 bg-gray-50">
        <h2 className="text-xl font-bold mb-4 text-gray-800 border-b-2 border-indigo-500 pb-2">Client Information</h2>
        <div className="mb-4">
          <label className="block mb-2 font-semibold text-gray-700 text-sm">Client Name</label>
          <input
            type="text"
            name="clientName"
            value={invoice.clientName}
            onChange={handleClientChange}
            placeholder="Client Name"
            className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
          />
        </div>
        <div className="grid grid-cols-2 gap-4 mb-4">
          <div>
            <label className="block mb-2 font-semibold text-gray-700 text-sm">Email</label>
            <input
              type="email"
              name="clientEmail"
              value={invoice.clientEmail}
              onChange={handleClientChange}
              placeholder="Client mail ID"
              className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
            />
          </div>
          <div>
            <label className="block mb-2 font-semibold text-gray-700 text-sm">Phone</label>
            <input
              type="text"
              name="clientPhone"
              value={invoice.clientPhone}
              onChange={handleClientChange}
              placeholder="Enter client's phone number"
              className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
            />
          </div>
        </div>
        <div>
          <label className="block mb-2 font-semibold text-gray-700 text-sm">Address</label>
          <textarea
            name="clientAddress"
            value={invoice.clientAddress}
            onChange={handleClientChange}
            placeholder="Enter client's address"
            className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent resize-none min-h-20"
          />
        </div>
      </div>

      {/* Items Section */}
      <div className="border border-gray-200 rounded-lg p-5 bg-gray-50">
        <h2 className="text-xl font-bold mb-4 text-gray-800 border-b-2 border-indigo-500 pb-2">Items</h2>
        <div className="overflow-x-auto border rounded-lg">
          <div className="bg-indigo-500 text-white font-semibold grid gap-0 border-b" style={{ gridTemplateColumns: '2fr 100px 100px 100px 80px' }}>
            <div className="p-3">Description</div>
            <div className="p-3 text-center">Qty</div>
            <div className="p-3 text-right">Rate</div>
            <div className="p-3 text-right">Amount</div>
            <div className="p-3 text-center">Action</div>
          </div>
          {invoice.items.map(item => (
            <div key={item.id} className="grid gap-0 border-b hover:bg-gray-100 items-center" style={{ gridTemplateColumns: '2fr 100px 100px 100px 80px' }}>
              <input
                type="text"
                placeholder="Item description"
                value={item.description}
                onChange={(e) => handleItemChange(item.id, 'description', e.target.value)}
                className="p-3 border-r border-gray-200 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-inset"
              />
              <input
                type="number"
                placeholder="Qty"
                value={item.quantity}
                onChange={(e) => handleItemChange(item.id, 'quantity', e.target.value)}
                className="p-3 border-r border-gray-200 text-center text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-inset"
              />
              <input
                type="number"
                placeholder="Rate"
                value={item.rate}
                onChange={(e) => handleItemChange(item.id, 'rate', e.target.value)}
                className="p-3 border-r border-gray-200 text-right text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-inset"
              />
              <div className="p-3 border-r border-gray-200 text-right text-sm">${item.amount.toFixed(2)}</div>
              <button
                onClick={() => removeItem(item.id)}
                className="p-3 bg-red-500 hover:bg-red-600 text-white text-sm font-semibold transition"
              >
                Delete
              </button>
            </div>
          ))}
        </div>
        <button onClick={addItem} className="mt-4 px-4 py-2 bg-green-500 hover:bg-green-600 text-white font-semibold rounded-md transition">
          + Add Item
        </button>
      </div>

      {/* Additional Details Section */}
      <div className="border border-gray-200 rounded-lg p-5 bg-gray-50">
        <h2 className="text-xl font-bold mb-4 text-gray-800 border-b-2 border-indigo-500 pb-2">Additional Details</h2>
        <div className="grid grid-cols-2 gap-4 mb-4">
          <div>
            <label className="block mb-2 font-semibold text-gray-700 text-sm">Tax (%)</label>
            <input
              type="number"
              name="tax"
              value={invoice.tax}
              onChange={handleMetadataChange}
              placeholder="0"
              min="0"
              max="100"
              className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
            />
          </div>
          <div>
            <label className="block mb-2 font-semibold text-gray-700 text-sm">Discount ($)</label>
            <input
              type="number"
              name="discount"
              value={invoice.discount}
              onChange={handleMetadataChange}
              placeholder="0"
              min="0"
              className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
            />
          </div>
        </div>
        <div>
          <label className="block mb-2 font-semibold text-gray-700 text-sm">Notes</label>
          <textarea
            name="notes"
            value={invoice.notes}
            onChange={handleMetadataChange}
            placeholder="Additional notes or terms..."
            className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent resize-none min-h-20"
          />
        </div>
      </div>
    </div>
  );
};

export default InvoiceForm;
