import React from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import jsPDF from 'jspdf';
import './PDFPreviewPage.css';

const PDFPreviewPage = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const invoice = location.state?.invoice;

  if (!invoice) {
    return (
      <div className="min-h-screen  p-5 flex items-center justify-center" style={{ background: 'linear-gradient(to right, #4f46e5, #6b21a8)' }}>
        <div className="bg-white rounded-xl p-8 shadow-2xl text-center">
          <h2 className="text-2xl font-bold text-gray-800 mb-4">No Invoice Data</h2>
          <p className="text-gray-600 mb-6">Please create an invoice first before previewing.</p>
          <button
            onClick={() => navigate('/')}
            className="px-6 py-2 bg-indigo-600 hover:bg-indigo-700 text-white font-semibold rounded-lg transition"
          >
            ← Back to Invoice
          </button>
        </div>
      </div>
    );
  }

  const formatDate = (value) => (value ? new Date(value).toLocaleDateString() : '');
  const subtotal = invoice.items.reduce((sum, item) => sum + (parseFloat(item.amount) || 0), 0);
  const taxRate = parseFloat(invoice.tax) || 0;
  const discountAmount = parseFloat(invoice.discount) || 0;
  const taxAmount = subtotal * (taxRate / 100);
  const total = subtotal + taxAmount - discountAmount;

  const downloadPDFWithJsPDF = () => {
    const doc = new jsPDF();
    const pageHeight = doc.internal.pageSize.getHeight();
    const pageWidth = doc.internal.pageSize.getWidth();
    const margin = 15;
    let yPosition = margin;

    // Header
    doc.setFontSize(20);
    doc.text('INVOICE', pageWidth / 2, yPosition, { align: 'center' });
    yPosition += 15;

    // Company Info
    doc.setFontSize(12);
    doc.text(invoice.companyName, margin, yPosition);
    yPosition += 7;
    doc.setFontSize(10);
    doc.text(invoice.companyEmail, margin, yPosition);
    yPosition += 5;
    doc.text(invoice.companyPhone, margin, yPosition);
    yPosition += 5;
    doc.text(invoice.companyAddress, margin, yPosition, { maxWidth: pageWidth - 2 * margin });
    yPosition += 10;

    // Invoice Details
    const detailsX = pageWidth - margin - 50;
    doc.setFontSize(10);
    doc.text(`Invoice #: ${invoice.invoiceNumber}`, detailsX, yPosition);
    yPosition += 7;
    doc.text(`Date: ${formatDate(invoice.date)}`, detailsX, yPosition);
    yPosition += 7;
    doc.text(`Due Date: ${formatDate(invoice.dueDate)}`, detailsX, yPosition);
    yPosition += 15;

    // Bill To
    doc.setFontSize(11);
    doc.text('BILL TO:', margin, yPosition);
    yPosition += 7;
    doc.setFontSize(10);
    doc.text(invoice.clientName, margin, yPosition);
    yPosition += 5;
    doc.text(invoice.clientEmail, margin, yPosition);
    yPosition += 5;
    doc.text(invoice.clientPhone, margin, yPosition);
    yPosition += 5;
    doc.text(invoice.clientAddress, margin, yPosition, { maxWidth: pageWidth - 2 * margin });
    yPosition += 15;

    // Items Table
    doc.setFontSize(10);
    const tableStartY = yPosition;
    const columnWidths = [70, 20, 30, 30];
    const columns = ['Description', 'Qty', 'Rate', 'Amount'];
    const rowHeight = 8;

    // Header row with border
    doc.setFillColor(79, 70, 229); // indigo color
    doc.setTextColor(255, 255, 255); // white text
    let xPos = margin;
    columns.forEach((col, i) => {
      doc.rect(xPos, tableStartY, columnWidths[i], rowHeight, 'F'); // 'F' fills the rect
      doc.text(col, xPos + 3, tableStartY + 5, { maxWidth: columnWidths[i] - 4 });
      xPos += columnWidths[i];
    });

    // Draw header borders
    xPos = margin;
    for (let i = 0; i < 4; i++) {
      doc.setDrawColor(0);
      doc.rect(xPos, tableStartY, columnWidths[i], rowHeight);
      xPos += columnWidths[i];
    }

    // Items rows
    doc.setTextColor(0, 0, 0); // black text
    yPosition = tableStartY + rowHeight;
    invoice.items.forEach((item, index) => {
      if (yPosition > pageHeight - 50) {
        doc.addPage();
        yPosition = margin;
      }

      // Alternate row colors
      if (index % 2 === 0) {
        doc.setFillColor(245, 245, 245); // light gray
        xPos = margin;
        for (let i = 0; i < 4; i++) {
          doc.rect(xPos, yPosition, columnWidths[i], rowHeight, 'F');
          xPos += columnWidths[i];
        }
      }

      // Draw borders
      xPos = margin;
      for (let i = 0; i < 4; i++) {
        doc.rect(xPos, yPosition, columnWidths[i], rowHeight);
        xPos += columnWidths[i];
      }

      // Add text
      xPos = margin;
      doc.text(item.description.substring(0, 12), xPos + 2, yPosition + 5, { maxWidth: columnWidths[0] - 4 });
      xPos += columnWidths[0];
      doc.text(item.quantity.toString(), xPos + 6, yPosition + 5, { align: 'center' });
      xPos += columnWidths[1];
      doc.text(`$${(parseFloat(item.rate) || 0).toFixed(2)}`, xPos + 20, yPosition + 5, { align: 'right' });
      xPos += columnWidths[2];
      doc.text(`$${(parseFloat(item.amount) || 0).toFixed(2)}`, xPos + 20, yPosition + 5, { align: 'right' });

      yPosition += rowHeight;
    });

    yPosition += 10;

    // Summary
    doc.setFontSize(10);
    doc.text(`Subtotal: $${subtotal.toFixed(2)}`, pageWidth - margin - 50, yPosition);
    yPosition += 8;

    if (taxRate > 0) {
      doc.text(`Tax (${taxRate}%): $${taxAmount.toFixed(2)}`, pageWidth - margin - 50, yPosition);
      yPosition += 8;
    }

    if (discountAmount > 0) {
      doc.text(`Discount: -$${discountAmount.toFixed(2)}`, pageWidth - margin - 50, yPosition);
      yPosition += 8;
    }

    doc.setFontSize(12);
    doc.setFont(undefined, 'bold');
    doc.text(`Total: $${total.toFixed(2)}`, pageWidth - margin - 50, yPosition);

    // Notes
    if (invoice.notes) {
      yPosition += 15;
      doc.setFont(undefined, 'normal');
      doc.setFontSize(10);
      doc.text('Notes:', margin, yPosition);
      yPosition += 7;
      doc.text(invoice.notes, margin, yPosition, { maxWidth: pageWidth - 2 * margin });
    }

    // Download
    doc.save(`Invoice_${invoice.invoiceNumber}.pdf`);
  };

  const handleNewInvoice = () => {
    localStorage.removeItem('invoiceData');
    navigate('/');
  };

  return (
    <div className="min-h-screen p-5">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <header className="sticky top-0 z-50 text-white p-5 shadow-lg rounded-xl" style={{ background: 'linear-gradient(to right, #4f46e5, #6b21a8)' }}>
          <div className="flex justify-between items-center">
            <div>
              <h1 className="text-4xl font-bold text-white m-0">Invoice Preview</h1>
            </div>
            <div className="flex gap-3 items-center">
              <button
                onClick={handleNewInvoice}
                className="px-4 py-2 bg-green-500 hover:bg-green-600 text-white font-semibold rounded-lg transition"
              >
                ➕ New Invoice
              </button>
              <button
                onClick={downloadPDFWithJsPDF}
                className="px-4 py-2 bg-white hover:bg-gray-100 text-indigo-600 font-semibold rounded-lg transition"
              >
                ⬇️ Download PDF
              </button>
              <button
                onClick={() => window.print()}
                className="px-4 py-2 bg-white hover:bg-gray-100 text-indigo-600 font-semibold rounded-lg transition"
              >
                🖨️ Print
              </button>
              <button
                onClick={() => navigate('/')}
                className="px-4 py-2 bg-white hover:bg-gray-100 text-indigo-600 font-semibold rounded-lg transition"
              >
                ← Back
              </button>
            </div>
          </div>
        </header>

        {/* Invoice Preview */}
        <div className="bg-white rounded-xl shadow-2xl p-8 mt-5">
          <div id="invoice-print" className="bg-white text-gray-800">
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
            <div className="text-center pt-5 border-t border-gray-300 text-gray-600 text-sm">
              <p>Thank you for your business!</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PDFPreviewPage;
