import React from 'react';
import { useNavigate } from 'react-router-dom';

const PDFExport = ({ invoice, isInvoiceValid }) => {
  const navigate = useNavigate();

  const previewInvoice = () => {
    navigate('/preview', { state: { invoice } });
  };

  const downloadInvoice = () => {
    navigate('/preview', { state: { invoice, autoDownload: true } });
  };

  return (
    <div className="flex gap-2">
      <button
        onClick={previewInvoice}
        disabled={!isInvoiceValid}
        title={!isInvoiceValid ? 'Complete required fields before previewing.' : undefined}
        className={`px-4 py-2 text-white font-semibold rounded-lg transition ${isInvoiceValid ? 'bg-green-500 hover:bg-green-600' : 'bg-green-300 cursor-not-allowed'}`}
      >
        👁️ Preview
      </button>
      <button
        onClick={downloadInvoice}
        disabled={!isInvoiceValid}
        title={!isInvoiceValid ? 'Complete required fields before downloading.' : undefined}
        className={`px-4 py-2 text-white font-semibold rounded-lg transition ${isInvoiceValid ? 'bg-green-500 hover:bg-green-600' : 'bg-green-300 cursor-not-allowed'}`}
      >
        ⬇️ Download
      </button>
    </div>
  );
};

export default PDFExport;
