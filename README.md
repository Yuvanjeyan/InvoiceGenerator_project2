# Invoice Generator Application

A responsive React-based invoice generation application that allows users to create, manage, and export professional invoices as PDF files.

## 📋 Features

### Invoice Management
- **Create Invoices**: Enter client information and company details (placeholders provided)
- **Dynamic Line Items**: Add, edit, and delete invoice items
- **Auto-Calculations**: Real-time calculation of subtotal, tax, and total
- **Editable Details**: Modify invoice number, dates, and all information
- **Live Preview**: See invoice updates in real-time as you edit

### Financial Calculations
- Automatic line item amount calculation (Quantity × Rate)
- Tax calculation (percentage-based)
- Discount support (fixed amount)
- Real-time grand total computation
- Professional financial summary display

### PDF Export
- **Two Export Methods**:
  - **jsPDF**: Lightweight, structured text-based PDF (faster, smaller file size)
  - **HTML2PDF**: Layout-preserving PDF (better visual fidelity)
- Professional invoice layout
- Print-ready formatting
- All invoice details included

### User Interface
- **Responsive Design**: Works on desktop, tablet, and mobile devices
- **Intuitive Layout**: Two-column design with form on left, preview on right
- **Real-time Preview**: See changes instantly
- **Professional Styling**: Clean, modern interface using Tailwind CSS

## 🛠 Technology Stack

- **Frontend Framework**: React JS (v19.2.4)
- **Styling**: TailwindCSS (v3)
- **State Management**: React Hooks (useState)
- **PDF Generation**: 
  - jsPDF - for structured PDF creation
  - html2pdf.js - for HTML to PDF conversion
- **Build Tool**: Create React App with Webpack
- **CSS Processing**: PostCSS with Autoprefixer

## 📁 Project Structure

```
invoice-generator/
├── src/
│   ├── components/
│   │   ├── InvoiceForm.js          # Form component for invoice details
│   │   ├── InvoiceForm.css         # Styled with Tailwind (comments only)
│   │   ├── InvoicePreview.js       # Live preview component
│   │   ├── InvoicePreview.css      # Styled with Tailwind (comments only)
│   │   ├── PDFExport.js            # PDF export functionality
│   │   └── PDFExport.css           # Styled with Tailwind (comments only)
│   ├── App.js                      # Main app component
│   ├── App.css                     # Global Tailwind styles
│   ├── index.js                    # React entry point
│   └── index.css                   # Tailwind directives
├── public/
│   ├── index.html                  # HTML template
│   └── favicon.ico
├── package.json                    # Project dependencies
├── tailwind.config.js              # Tailwind CSS configuration
├── postcss.config.js               # PostCSS configuration
└── README.md                       # This file

```

## 🚀 Getting Started

### Prerequisites
- Node.js (v14 or higher)
- npm or yarn package manager

### Installation

1. **Navigate to project directory**:
```bash
cd invoice-generator
```

2. **Install dependencies**:
```bash
npm install
```

3. **Start development server**:
```bash
npm start
```

The application will open at `http://localhost:3000`

### Build for Production

```bash
npm run build
```

This creates an optimized production build in the `build/` folder.

## 📖 Usage Guide

### Creating an Invoice

1. **Enter Company Information** (Left Panel):
   - Company name, email, phone, and address
   - These appear in the invoice header

2. **Enter Client Information**:
   - Client name, email, phone, and address
   - These appear in the "Bill To" section

3. **Add Invoice Details**:
   - Invoice number (pre-filled, e.g., INV-001)
   - Invoice date (cannot be earlier than today)
   - Due date (cannot be earlier than today and must be on/after invoice date)

4. **Add Line Items**:
   - Click "Add Item" to create new line items
   - Enter description (e.g., "Web Development Service")
   - Enter quantity
   - Enter unit rate
   - Amount auto-calculates automatically

5. **Set Financial Details**:
   - Tax: Percentage applied to subtotal (0-100%)
   - Discount: Fixed amount to subtract
   - Notes: Additional terms or payment instructions

6. **Edit or Delete Items**:
   - Click "Delete" next to any item to remove it
   - Edit values directly in the form to update items
   - Changes reflect immediately in the preview

### Exporting to PDF

1. **Choose Export Method**:
   - **jsPDF Button**: Creates structured PDF with text elements
   - **HTML2PDF Button**: Creates PDF with full layout preservation

2. **Download**: Invoice automatically downloads as `Invoice_[NUMBER].pdf`

3. **Print**: Open the PDF and use your browser's print function

## 🎨 Customization

### Colors
Edit `tailwind.config.js` to change the color scheme:

```javascript
colors: {
  primary: '#667eea',    // Indigo
  secondary: '#764ba2',  // Purple
}
```

### Invoice Details
Modify default values in `App.js` to change defaults:

```javascript
invoiceNumber: 'INV-001',
date: '',
dueDate: '',
```

### PDF Styling
Adjust PDF layout in `PDFExport.js` and preview styling in `InvoicePreview.js`

## 🔧 Component Details

### InvoiceForm.js
Manages form inputs for:
- Invoice metadata (number, dates)
- Company information
- Client information
- Line items (add, edit, delete)
- Tax, discount, and notes

**Key Functions**:
- `handleCompanyChange()`: Updates company info
- `handleClientChange()`: Updates client info
- `handleItemChange()`: Updates individual items
- `addItem()`: Adds new line item
- `removeItem()`: Deletes line item

### InvoicePreview.js
Displays professional invoice layout:
- Invoice header with company info
- Client billing information
- Itemized table with all products/services
- Financial summary (subtotal, tax, discount, total)
- Notes section
- Footer

**Calculations**:
```javascript
subtotal = sum of all item amounts
taxAmount = subtotal × (tax / 100)
total = subtotal + taxAmount - discount
```

### PDFExport.js
Provides two export methods:

**jsPDF Method**:
- Creates structured PDF with text elements
- Faster performance
- Smaller file size
- Best for data-heavy invoices

**HTML2PDF Method**:
- Renders HTML to PDF
- Preserves all styling
- Better visual appearance
- Best for design-heavy invoices

## 📱 Responsive Breakpoints

- **Mobile**: < 768px - Single column layout
- **Tablet**: 768px - 1024px - Adjusted grid
- **Desktop**: > 1024px - Two-column layout (form + preview)

## ⚙️ Available Scripts

```bash
npm start       # Start development server
npm run build   # Build for production
npm run test    # Run tests
npm run eject   # Eject from Create React App (irreversible)
```

## 🐛 Troubleshooting

### PDF Not Downloading
- Ensure pop-ups are not blocked
- Check browser console for errors
- Try the alternative PDF export method

### Styling Issues
- Clear browser cache (Ctrl+Shift+Del)
- Rebuild project: `npm install && npm start`
- Check Tailwind CSS configuration

### State Not Updating
- Ensure all form inputs use `onChange` handlers
- Check console for JavaScript errors
- Verify React Developer Tools shows state changes

## 📦 Dependencies

```json
{
  "react": "^19.2.4",
  "react-dom": "^19.2.4",
  "jspdf": "^2.x",
  "html2pdf.js": "^0.x",
  "tailwindcss": "^3.x",
  "postcss": "^8.x",
  "autoprefixer": "^10.x"
}
```

## 🎯 Future Enhancements

- [ ] Save invoices to local storage
- [ ] Invoice templates
- [ ] Multiple currency support
- [ ] Email invoice functionality
- [ ] Invoice history/archive
- [ ] Bulk invoice generation
- [ ] Custom branding/logo upload
- [ ] Payment reminder system
- [ ] Client database
- [ ] Recurring invoices

## 📄 License

This project is open source and available under the MIT License.

## 👤 Author

Created as a learning project demonstrating React, TailwindCSS, and PDF generation capabilities.

## 🤝 Contributing

Feel free to fork this project and submit pull requests for any improvements.

---

**Happy Invoice Generating! 🎉**

For questions or issues, please check the component documentation or review the source code comments.

### `npm run build`

Builds the app for production to the `build` folder.\
It correctly bundles React in production mode and optimizes the build for the best performance.

The build is minified and the filenames include the hashes.\
Your app is ready to be deployed!

See the section about [deployment](https://facebook.github.io/create-react-app/docs/deployment) for more information.

### `npm run eject`

**Note: this is a one-way operation. Once you `eject`, you can't go back!**

If you aren't satisfied with the build tool and configuration choices, you can `eject` at any time. This command will remove the single build dependency from your project.

Instead, it will copy all the configuration files and the transitive dependencies (webpack, Babel, ESLint, etc) right into your project so you have full control over them. All of the commands except `eject` will still work, but they will point to the copied scripts so you can tweak them. At this point you're on your own.

You don't have to ever use `eject`. The curated feature set is suitable for small and middle deployments, and you shouldn't feel obligated to use this feature. However we understand that this tool wouldn't be useful if you couldn't customize it when you are ready for it.

## Learn More

You can learn more in the [Create React App documentation](https://facebook.github.io/create-react-app/docs/getting-started).

To learn React, check out the [React documentation](https://reactjs.org/).

### Code Splitting

This section has moved here: [https://facebook.github.io/create-react-app/docs/code-splitting](https://facebook.github.io/create-react-app/docs/code-splitting)

### Analyzing the Bundle Size

This section has moved here: [https://facebook.github.io/create-react-app/docs/analyzing-the-bundle-size](https://facebook.github.io/create-react-app/docs/analyzing-the-bundle-size)

### Making a Progressive Web App

This section has moved here: [https://facebook.github.io/create-react-app/docs/making-a-progressive-web-app](https://facebook.github.io/create-react-app/docs/making-a-progressive-web-app)

### Advanced Configuration

This section has moved here: [https://facebook.github.io/create-react-app/docs/advanced-configuration](https://facebook.github.io/create-react-app/docs/advanced-configuration)

### Deployment

This section has moved here: [https://facebook.github.io/create-react-app/docs/deployment](https://facebook.github.io/create-react-app/docs/deployment)

### `npm run build` fails to minify

This section has moved here: [https://facebook.github.io/create-react-app/docs/troubleshooting#npm-run-build-fails-to-minify](https://facebook.github.io/create-react-app/docs/troubleshooting#npm-run-build-fails-to-minify)
