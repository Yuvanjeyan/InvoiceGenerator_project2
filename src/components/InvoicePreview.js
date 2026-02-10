import React from 'react';
import './InvoicePreview.css';

const InvoicePreview = ({ invoice }) => {
  const formatDate = (value) => (value ? new Date(value).toLocaleDateString() : '');
  const subtotal = invoice.items.reduce((sum, item) => sum + (parseFloat(item.amount) || 0), 0);
  const taxRate = parseFloat(invoice.tax) || 0;
  const discountAmount = parseFloat(invoice.discount) || 0;
  const taxAmount = subtotal * (taxRate / 100);
  const total = subtotal + taxAmount - discountAmount;

  return (
    <div className="bg-white rounded-xl p-8 shadow-2xl">
      <div id="invoice-preview" className="bg-white text-gray-800">
        {/* Header */}
        <div className="grid grid-cols-2 gap-8 mb-8 pb-5 border-b-4 border-indigo-500">
          <div>
            <h1 className="text-3xl font-bold text-indigo-600 mb-2">{invoice.companyName}</h1>
            <p className="text-sm text-gray-600">{invoice.companyEmail}</p>
            <p className="text-sm text-gray-600">{invoice.companyPhone}</p>
            <p className="text-sm text-gray-600">{invoice.companyAddress}</p>
          </div>
          <div className="text-right">
            <h2 className="text-4xl font-bold text-purple-700 tracking-wider mb-3">INVOICE</h2>
            <p className="text-sm"><strong>Invoice #:</strong> {invoice.invoiceNumber}</p>
            <p className="text-sm"><strong>Date:</strong> {formatDate(invoice.date)}</p>
            <p className="text-sm"><strong>Due Date:</strong> {formatDate(invoice.dueDate)}</p>
          </div>
        </div>

        {/* Bill To */}
        <div className="mb-8 p-5 bg-gray-50 rounded-lg">
          <h3 className="text-lg font-bold text-gray-800 mb-2">Bill To</h3>
          <p className="font-semibold text-gray-800">{invoice.clientName}</p>
          <p className="text-sm text-gray-600">{invoice.clientEmail}</p>
          <p className="text-sm text-gray-600">{invoice.clientPhone}</p>
          <p className="text-sm text-gray-600">{invoice.clientAddress}</p>
        </div>

        {/* Items Table */}
        <table className="w-full mb-8 border-collapse">
          <thead>
            <tr className="bg-indigo-500 text-white">
              <th className="px-4 py-3 text-left">Description</th>
              <th className="px-4 py-3 text-center">Quantity</th>
              <th className="px-4 py-3 text-right">Rate</th>
              <th className="px-4 py-3 text-right">Amount</th>
            </tr>
          </thead>
          <tbody>
            {invoice.items.map((item, index) => (
              <tr key={item.id} className={`${index % 2 === 0 ? 'bg-gray-50' : 'bg-white'} hover:bg-gray-100`}>
                <td className="px-4 py-3 text-sm border-b border-gray-200">{item.description}</td>
                <td className="px-4 py-3 text-center text-sm border-b border-gray-200">{item.quantity}</td>
                <td className="px-4 py-3 text-right text-sm border-b border-gray-200">${(parseFloat(item.rate) || 0).toFixed(2)}</td>
                <td className="px-4 py-3 text-right text-sm border-b border-gray-200">${(parseFloat(item.amount) || 0).toFixed(2)}</td>
              </tr>
            ))}
          </tbody>
        </table>

        {/* Summary */}
        <div className="flex justify-end mb-8">
          <div className="w-80 p-5 bg-gray-50 rounded-lg">
            <div className="flex justify-between mb-2 text-sm">
              <span>Subtotal:</span>
              <span>${subtotal.toFixed(2)}</span>
            </div>
            {taxRate > 0 && (
              <div className="flex justify-between mb-2 text-sm">
                <span>Tax ({taxRate}%):</span>
                <span>${taxAmount.toFixed(2)}</span>
              </div>
            )}
            {discountAmount > 0 && (
              <div className="flex justify-between mb-2 text-sm">
                <span>Discount:</span>
                <span>-${discountAmount.toFixed(2)}</span>
              </div>
            )}
            <div className="flex justify-between text-lg font-bold text-indigo-600 border-t-2 border-gray-300 pt-3 mt-3">
              <span>Total:</span>
              <span>${total.toFixed(2)}</span>
            </div>
          </div>
        </div>

        {/* Notes */}
        {invoice.notes && (
          <div className="p-4 bg-blue-50 rounded-lg border-l-4 border-indigo-500 mb-6">
            <h3 className="font-bold text-gray-800 mb-1">Notes</h3>
            <p className="text-sm text-gray-700">{invoice.notes}</p>
          </div>
        )}

        {/* Footer */}
        <div className="text-center pt-5 border-t border-gray-300 text-gray-600 text-sm mt-auto">
          <p>Thank you for your business!</p>
        </div>
      </div>
    </div>
  );
};

export default InvoicePreview;
