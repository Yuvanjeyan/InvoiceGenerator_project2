import React, { useState } from 'react';
import { getInvoiceValidation } from '../utils/validation';

const InvoiceForm = ({ invoice, onInvoiceChange, validation }) => {
  const [touched, setTouched] = useState({});
  const resolvedValidation = validation || getInvoiceValidation(invoice);
  const { fieldErrors = {}, itemsErrors = [] } = resolvedValidation;

  const markTouched = (key) => {
    setTouched((prev) => ({ ...prev, [key]: true }));
  };
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
      { id: newId, description: '', quantity: '', rate: '', amount: 0 }
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
              onBlur={() => markTouched('invoiceNumber')}
              aria-invalid={Boolean(touched.invoiceNumber && fieldErrors.invoiceNumber)}
              className={`w-full px-3 py-2 border rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent ${touched.invoiceNumber && fieldErrors.invoiceNumber ? 'border-red-400' : 'border-gray-300'}`}
            />
            {touched.invoiceNumber && fieldErrors.invoiceNumber && (
              <p className="mt-1 text-xs text-red-600">{fieldErrors.invoiceNumber}</p>
            )}
          </div>
          <div>
            <label className="block mb-2 font-semibold text-gray-700 text-sm">Date</label>
            <input
              type="date"
              name="date"
              value={invoice.date}
              onChange={handleMetadataChange}
              placeholder="YYYY-MM-DD"
              min={new Date().toISOString().split('T')[0]}
              onBlur={() => markTouched('date')}
              aria-invalid={Boolean(touched.date && fieldErrors.date)}
              className={`w-full px-3 py-2 border rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent ${touched.date && fieldErrors.date ? 'border-red-400' : 'border-gray-300'}`}
            />
            {touched.date && fieldErrors.date && (
              <p className="mt-1 text-xs text-red-600">{fieldErrors.date}</p>
            )}
          </div>
          <div>
            <label className="block mb-2 font-semibold text-gray-700 text-sm">Due Date</label>
            <input
              type="date"
              name="dueDate"
              value={invoice.dueDate}
              onChange={handleMetadataChange}
              placeholder="YYYY-MM-DD"
              min={new Date().toISOString().split('T')[0]}
              onBlur={() => markTouched('dueDate')}
              aria-invalid={Boolean(touched.dueDate && fieldErrors.dueDate)}
              className={`w-full px-3 py-2 border rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent ${touched.dueDate && fieldErrors.dueDate ? 'border-red-400' : 'border-gray-300'}`}
            />
            {touched.dueDate && fieldErrors.dueDate && (
              <p className="mt-1 text-xs text-red-600">{fieldErrors.dueDate}</p>
            )}
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
            onBlur={() => markTouched('companyName')}
            aria-invalid={Boolean(touched.companyName && fieldErrors.companyName)}
            className={`w-full px-3 py-2 border rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent ${touched.companyName && fieldErrors.companyName ? 'border-red-400' : 'border-gray-300'}`}
          />
          {touched.companyName && fieldErrors.companyName && (
            <p className="mt-1 text-xs text-red-600">{fieldErrors.companyName}</p>
          )}
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
              onBlur={() => markTouched('companyEmail')}
              aria-invalid={Boolean(touched.companyEmail && fieldErrors.companyEmail)}
              className={`w-full px-3 py-2 border rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent ${touched.companyEmail && fieldErrors.companyEmail ? 'border-red-400' : 'border-gray-300'}`}
            />
            {touched.companyEmail && fieldErrors.companyEmail && (
              <p className="mt-1 text-xs text-red-600">{fieldErrors.companyEmail}</p>
            )}
          </div>
          <div>
            <label className="block mb-2 font-semibold text-gray-700 text-sm">Phone</label>
            <input
              type="text"
              name="companyPhone"
              value={invoice.companyPhone}
              onChange={handleCompanyChange}
              placeholder="Enter official contact number"
              onBlur={() => markTouched('companyPhone')}
              aria-invalid={Boolean(touched.companyPhone && fieldErrors.companyPhone)}
              className={`w-full px-3 py-2 border rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent ${touched.companyPhone && fieldErrors.companyPhone ? 'border-red-400' : 'border-gray-300'}`}
            />
            {touched.companyPhone && fieldErrors.companyPhone && (
              <p className="mt-1 text-xs text-red-600">{fieldErrors.companyPhone}</p>
            )}
          </div>
        </div>
        <div>
          <label className="block mb-2 font-semibold text-gray-700 text-sm">Address</label>
          <textarea
            name="companyAddress"
            value={invoice.companyAddress}
            onChange={handleCompanyChange}
            placeholder="Enter your company address"
            onBlur={() => markTouched('companyAddress')}
            aria-invalid={Boolean(touched.companyAddress && fieldErrors.companyAddress)}
            className={`w-full px-3 py-2 border rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent resize-none min-h-20 ${touched.companyAddress && fieldErrors.companyAddress ? 'border-red-400' : 'border-gray-300'}`}
          />
          {touched.companyAddress && fieldErrors.companyAddress && (
            <p className="mt-1 text-xs text-red-600">{fieldErrors.companyAddress}</p>
          )}
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
            onBlur={() => markTouched('clientName')}
            aria-invalid={Boolean(touched.clientName && fieldErrors.clientName)}
            className={`w-full px-3 py-2 border rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent ${touched.clientName && fieldErrors.clientName ? 'border-red-400' : 'border-gray-300'}`}
          />
          {touched.clientName && fieldErrors.clientName && (
            <p className="mt-1 text-xs text-red-600">{fieldErrors.clientName}</p>
          )}
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
              onBlur={() => markTouched('clientEmail')}
              aria-invalid={Boolean(touched.clientEmail && fieldErrors.clientEmail)}
              className={`w-full px-3 py-2 border rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent ${touched.clientEmail && fieldErrors.clientEmail ? 'border-red-400' : 'border-gray-300'}`}
            />
            {touched.clientEmail && fieldErrors.clientEmail && (
              <p className="mt-1 text-xs text-red-600">{fieldErrors.clientEmail}</p>
            )}
          </div>
          <div>
            <label className="block mb-2 font-semibold text-gray-700 text-sm">Phone</label>
            <input
              type="text"
              name="clientPhone"
              value={invoice.clientPhone}
              onChange={handleClientChange}
              placeholder="Enter client's phone number"
              onBlur={() => markTouched('clientPhone')}
              aria-invalid={Boolean(touched.clientPhone && fieldErrors.clientPhone)}
              className={`w-full px-3 py-2 border rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent ${touched.clientPhone && fieldErrors.clientPhone ? 'border-red-400' : 'border-gray-300'}`}
            />
            {touched.clientPhone && fieldErrors.clientPhone && (
              <p className="mt-1 text-xs text-red-600">{fieldErrors.clientPhone}</p>
            )}
          </div>
        </div>
        <div>
          <label className="block mb-2 font-semibold text-gray-700 text-sm">Address</label>
          <textarea
            name="clientAddress"
            value={invoice.clientAddress}
            onChange={handleClientChange}
            placeholder="Enter client's address"
            onBlur={() => markTouched('clientAddress')}
            aria-invalid={Boolean(touched.clientAddress && fieldErrors.clientAddress)}
            className={`w-full px-3 py-2 border rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent resize-none min-h-20 ${touched.clientAddress && fieldErrors.clientAddress ? 'border-red-400' : 'border-gray-300'}`}
          />
          {touched.clientAddress && fieldErrors.clientAddress && (
            <p className="mt-1 text-xs text-red-600">{fieldErrors.clientAddress}</p>
          )}
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
          {invoice.items.map((item, index) => {
            const itemErrors = itemsErrors[index] || null;
            const descriptionKey = `item-${item.id}-description`;
            const quantityKey = `item-${item.id}-quantity`;
            const rateKey = `item-${item.id}-rate`;

            return (
              <div key={item.id} className="grid gap-0 border-b hover:bg-gray-100 items-center" style={{ gridTemplateColumns: '2fr 100px 100px 100px 80px' }}>
                <input
                  type="text"
                  placeholder="Item description"
                  value={item.description}
                  onChange={(e) => handleItemChange(item.id, 'description', e.target.value)}
                  onBlur={() => markTouched(descriptionKey)}
                  aria-invalid={Boolean(touched[descriptionKey] && itemErrors?.description)}
                  className={`p-3 border-r text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-inset ${touched[descriptionKey] && itemErrors?.description ? 'border-red-300' : 'border-gray-200'}`}
                />
                <input
                  type="number"
                  placeholder="Qty"
                  value={item.quantity}
                  onChange={(e) => handleItemChange(item.id, 'quantity', e.target.value)}
                  onBlur={() => markTouched(quantityKey)}
                  min="1"
                  aria-invalid={Boolean(touched[quantityKey] && itemErrors?.quantity)}
                  className={`p-3 border-r text-center text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-inset ${touched[quantityKey] && itemErrors?.quantity ? 'border-red-300' : 'border-gray-200'}`}
                />
                <input
                  type="number"
                  placeholder="Rate"
                  value={item.rate}
                  onChange={(e) => handleItemChange(item.id, 'rate', e.target.value)}
                  onBlur={() => markTouched(rateKey)}
                  min="0"
                  aria-invalid={Boolean(touched[rateKey] && itemErrors?.rate)}
                  className={`p-3 border-r text-right text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-inset ${touched[rateKey] && itemErrors?.rate ? 'border-red-300' : 'border-gray-200'}`}
                />
                <div className="p-3 border-r border-gray-200 text-right text-sm">${item.amount.toFixed(2)}</div>
                <button
                  onClick={() => removeItem(item.id)}
                  className="p-3 bg-red-500 hover:bg-red-600 text-white text-sm font-semibold transition"
                >
                  Delete
                </button>
              </div>
            );
          })}
          {invoice.items.map((item, index) => {
            const itemErrors = itemsErrors[index];
            if (!itemErrors) return null;
            const descriptionKey = `item-${item.id}-description`;
            const quantityKey = `item-${item.id}-quantity`;
            const rateKey = `item-${item.id}-rate`;
            const showRowError = touched[descriptionKey] || touched[quantityKey] || touched[rateKey];
            if (!showRowError) return null;
            return (
              <div key={`${item.id}-errors`} className="px-3 py-2 bg-red-50 text-xs text-red-600 border-b border-red-100">
                {[itemErrors.description, itemErrors.quantity, itemErrors.rate].filter(Boolean).join(' ')}
              </div>
            );
          })}
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
              onBlur={() => markTouched('tax')}
              aria-invalid={Boolean(touched.tax && fieldErrors.tax)}
              className={`w-full px-3 py-2 border rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent ${touched.tax && fieldErrors.tax ? 'border-red-400' : 'border-gray-300'}`}
            />
            {touched.tax && fieldErrors.tax && (
              <p className="mt-1 text-xs text-red-600">{fieldErrors.tax}</p>
            )}
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
              onBlur={() => markTouched('discount')}
              aria-invalid={Boolean(touched.discount && fieldErrors.discount)}
              className={`w-full px-3 py-2 border rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent ${touched.discount && fieldErrors.discount ? 'border-red-400' : 'border-gray-300'}`}
            />
            {touched.discount && fieldErrors.discount && (
              <p className="mt-1 text-xs text-red-600">{fieldErrors.discount}</p>
            )}
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
