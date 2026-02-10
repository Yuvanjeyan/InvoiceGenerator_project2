const isEmpty = (value) => value === null || value === undefined || String(value).trim() === '';

const isValidEmail = (value) => {
  if (isEmpty(value)) return false;
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value);
};

const isValidPhone = (value) => {
  if (isEmpty(value)) return false;
  return /^[+()\-.\s\d]{7,}$/.test(value);
};

export const getInvoiceValidation = (invoice) => {
  const fieldErrors = {};
  const today = new Date().toISOString().split('T')[0];

  if (!invoice) {
    return { fieldErrors: { form: 'Invoice data is missing.' }, itemsErrors: [], isValid: false };
  }

  if (isEmpty(invoice.invoiceNumber)) fieldErrors.invoiceNumber = 'Invoice number is required.';
  if (isEmpty(invoice.date)) {
    fieldErrors.date = 'Invoice date is required.';
  } else if (invoice.date < today) {
    fieldErrors.date = 'Invoice date cannot be earlier than today.';
  }
  if (isEmpty(invoice.dueDate)) fieldErrors.dueDate = 'Due date is required.';
  if (invoice.date && invoice.dueDate && invoice.dueDate < invoice.date) {
    fieldErrors.dueDate = 'Due date must be on or after the invoice date.';
  }
  if (invoice.dueDate && invoice.dueDate < today) {
    fieldErrors.dueDate = 'Due date cannot be earlier than today.';
  }

  if (isEmpty(invoice.companyName)) fieldErrors.companyName = 'Company name is required.';
  if (!isValidEmail(invoice.companyEmail)) fieldErrors.companyEmail = 'Valid email is required.';
  if (!isValidPhone(invoice.companyPhone)) fieldErrors.companyPhone = 'Valid phone is required.';
  if (isEmpty(invoice.companyAddress)) fieldErrors.companyAddress = 'Company address is required.';

  if (isEmpty(invoice.clientName)) fieldErrors.clientName = 'Client name is required.';
  if (!isValidEmail(invoice.clientEmail)) fieldErrors.clientEmail = 'Valid email is required.';
  if (!isValidPhone(invoice.clientPhone)) fieldErrors.clientPhone = 'Valid phone is required.';
  if (isEmpty(invoice.clientAddress)) fieldErrors.clientAddress = 'Client address is required.';

  if (invoice.tax !== '' && (parseFloat(invoice.tax) < 0 || parseFloat(invoice.tax) > 100)) {
    fieldErrors.tax = 'Tax must be between 0 and 100.';
  }

  if (invoice.discount !== '' && parseFloat(invoice.discount) < 0) {
    fieldErrors.discount = 'Discount cannot be negative.';
  }

  const itemsErrors = (invoice.items || []).map((item) => {
    const itemErrors = {};
    if (isEmpty(item.description)) itemErrors.description = 'Description is required.';
    const quantity = parseFloat(item.quantity);
    if (isEmpty(item.quantity) || Number.isNaN(quantity) || quantity <= 0) {
      itemErrors.quantity = 'Quantity must be greater than 0.';
    }
    const rate = parseFloat(item.rate);
    if (isEmpty(item.rate) || Number.isNaN(rate) || rate < 0) {
      itemErrors.rate = 'Rate must be 0 or greater.';
    }
    return Object.keys(itemErrors).length ? itemErrors : null;
  });

  const hasItemErrors = itemsErrors.some(Boolean);
  const isValid = Object.keys(fieldErrors).length === 0 && !hasItemErrors;

  return { fieldErrors, itemsErrors, isValid };
};
