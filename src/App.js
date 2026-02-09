import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import './App.css';
import InvoiceForm from './components/InvoiceForm';
import PDFExport from './components/PDFExport';
import PDFPreviewPage from './components/PDFPreviewPage';

const defaultInvoice = {
  invoiceNumber: 'INV-001',
  date: '',
  dueDate: '',
  companyName: '',
  companyEmail: '',
  companyPhone: '',
  companyAddress: '',
  clientName: '',
  clientEmail: '',
  clientPhone: '',
  clientAddress: '',
  items: [
    { id: 1, description: '', quantity: '', rate: '', amount: 0 },
  ],
  tax: '',
  discount: '',
  notes: ''
};

function InvoiceGenerator() {
  const [invoice, setInvoice] = useState(() => {
    const saved = localStorage.getItem('invoiceData');
    return saved ? JSON.parse(saved) : defaultInvoice;
  });

  useEffect(() => {
    localStorage.setItem('invoiceData', JSON.stringify(invoice));
  }, [invoice]);

  const handleInvoiceChange = (updatedInvoice) => {
    setInvoice(updatedInvoice);
  };

  const handleNewInvoice = () => {
    localStorage.removeItem('invoiceData');
    setInvoice(defaultInvoice);
  };

  return (
    <div className="min-h-screen font-sans" style={{ background: '#f8f9fa' }}>
      <header className="sticky top-0 z-50 text-white p-6 shadow-xl" style={{ background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)' }}>
        <div className="max-w-7xl mx-auto">
          <div className="flex justify-between items-center">
            <div className="flex-1">
              <h1 className="text-3xl font-bold m-0 drop-shadow-md">📋 Invoice Builder</h1>
              <p className="text-sm m-1 opacity-95 mt-2">Professional invoice management tool</p>
            </div>
            <div className="flex gap-2 items-center ml-6">
              <button
                onClick={handleNewInvoice}
                className="px-4 py-2 bg-green-500 hover:bg-green-600 text-white font-semibold rounded-lg transition"
              >
                ➕ New Invoice
              </button>
              <PDFExport invoice={invoice} />
            </div>
          </div>
        </div>
      </header>
      <div className="p-6">
        <div className="max-w-5xl mx-auto">
          <div className="bg-white rounded-2xl p-8 shadow-lg">
            <InvoiceForm invoice={invoice} onInvoiceChange={handleInvoiceChange} />
          </div>
        </div>
      </div>
    </div>
  );
}

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<InvoiceGenerator />} />
        <Route path="/preview" element={<PDFPreviewPage />} />
      </Routes>
    </Router>
  );
}

export default App;
