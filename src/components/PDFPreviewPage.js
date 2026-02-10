import React, { useCallback, useEffect, useRef } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import html2pdf from 'html2pdf.js';
import './PDFPreviewPage.css';
import { getInvoiceValidation } from '../utils/validation';

const PDFPreviewPage = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const invoice = location.state?.invoice;
  const hasAutoDownloadedRef = useRef(false);

  const formatDate = (value) => (value ? new Date(value).toLocaleDateString() : '');
  const validation = getInvoiceValidation(invoice);
  const isInvoiceValid = validation.isValid;
  const subtotal = (invoice?.items || []).reduce((sum, item) => sum + (parseFloat(item.amount) || 0), 0);
  const taxRate = parseFloat(invoice?.tax) || 0;
  const discountAmount = parseFloat(invoice?.discount) || 0;
  const taxAmount = subtotal * (taxRate / 100);
  const total = subtotal + taxAmount - discountAmount;

  const downloadPDFWithHtml2PDF = useCallback(() => {
    const element = document.getElementById('invoice-print');
    if (!element) return;

    element.classList.add('export-mode');

    const options = {
      margin: 10,
      filename: `Invoice_${invoice?.invoiceNumber || 'Draft'}.pdf`,
      image: { type: 'jpeg', quality: 0.98 },
      html2canvas: { scale: 2, useCORS: true },
      jsPDF: { unit: 'mm', format: 'a4', orientation: 'portrait' }
    };

    const worker = html2pdf().set(options).from(element).toPdf();
    worker
      .get('pdf')
      .then((pdf) => {
        const pageCount = pdf.internal.getNumberOfPages();
        const pageWidth = pdf.internal.pageSize.getWidth();
        const pageHeight = pdf.internal.pageSize.getHeight();
        pdf.setFontSize(10);
        for (let page = 1; page <= pageCount; page += 1) {
          pdf.setPage(page);
          pdf.text('Thank you for your business!', pageWidth / 2, pageHeight - 6, { align: 'center' });
        }
      })
      .then(() => worker.save())
      .finally(() => {
        element.classList.remove('export-mode');
      });
  }, [invoice?.invoiceNumber]);

  useEffect(() => {
    if (invoice && location.state?.autoDownload && isInvoiceValid && !hasAutoDownloadedRef.current) {
      hasAutoDownloadedRef.current = true;
      setTimeout(() => downloadPDFWithHtml2PDF(), 0);
    }
  }, [invoice, location.state?.autoDownload, isInvoiceValid, downloadPDFWithHtml2PDF]);

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
            Back to Invoice
          </button>
        </div>
      </div>
    );
  }

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
                onClick={downloadPDFWithHtml2PDF}
                disabled={!isInvoiceValid}
                title={!isInvoiceValid ? 'Complete required fields before downloading.' : undefined}
                className={`px-4 py-2 font-semibold rounded-lg transition ${isInvoiceValid ? 'bg-white hover:bg-gray-100 text-indigo-600' : 'bg-gray-200 text-gray-400 cursor-not-allowed'}`}
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
                🔄 Back
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
            <div className="flex justify-end mb-8 summary-section">
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
              <div className="p-4 bg-blue-50 rounded-lg border-l-4 border-indigo-500 mb-6 notes-section">
                <h3 className="font-bold text-gray-800 mb-1">Notes</h3>
                <p className="text-sm text-gray-700">{invoice.notes}</p>
              </div>
            )}

            {/* Footer */}
            <div className="invoice-footer text-center pt-5 border-t border-gray-300 text-gray-600 text-sm">
              <p>Thank you for your business!</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PDFPreviewPage;
