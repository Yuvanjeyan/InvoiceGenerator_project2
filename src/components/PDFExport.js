import React from 'react';
import { useNavigate } from 'react-router-dom';
import jsPDF from 'jspdf';

const PDFExport = ({ invoice }) => {
  const navigate = useNavigate();

  const downloadPDFWithJsPDF = () => {
    const formatDate = (value) => (value ? new Date(value).toLocaleDateString() : '');
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

    // Header row
    doc.setFillColor(240, 240, 240);
    let xPos = margin;
    columns.forEach((col, i) => {
      doc.rect(xPos, tableStartY, columnWidths[i], 8, 'F');
      doc.text(col, xPos + 2, tableStartY + 6);
      xPos += columnWidths[i];
    });

    // Items rows
    yPosition = tableStartY + 10;
    invoice.items.forEach(item => {
      if (yPosition > pageHeight - 50) {
        doc.addPage();
        yPosition = margin;
      }

      xPos = margin;
      doc.text(item.description, xPos + 2, yPosition);
      xPos += columnWidths[0];
      doc.text(item.quantity.toString(), xPos + 2, yPosition);
      xPos += columnWidths[1];
      doc.text(`$${(parseFloat(item.rate) || 0).toFixed(2)}`, xPos + 2, yPosition);
      xPos += columnWidths[2];
      doc.text(`$${(parseFloat(item.amount) || 0).toFixed(2)}`, xPos + 2, yPosition);

      yPosition += 8;
    });

    yPosition += 10;

    // Summary
    const subtotal = invoice.items.reduce((sum, item) => sum + (parseFloat(item.amount) || 0), 0);
    const taxRate = parseFloat(invoice.tax) || 0;
    const discountAmount = parseFloat(invoice.discount) || 0;
    const taxAmount = subtotal * (taxRate / 100);
    const total = subtotal + taxAmount - discountAmount;

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

  const previewInvoice = () => {
    navigate('/preview', { state: { invoice } });
  };

  return (
    <div className="flex gap-2">
      <button 
        onClick={previewInvoice}
        className="px-4 py-2 bg-green-500 hover:bg-green-600 text-white font-semibold rounded-lg transition"
      >
        👁️ Preview
      </button>
      <button 
        onClick={downloadPDFWithJsPDF}
        className="px-4 py-2 bg-green-500 hover:bg-green-600 text-white font-semibold rounded-lg transition"
      >
        📄 Download
      </button>
    </div>
  );
};

export default PDFExport;
