# ExpenseTracker - Personal Finance Management

A modern, professional NextJS expense tracking application that helps you manage your personal finances with ease.

## Features

### Core Functionality
- ✅ **Add Expenses**: Create new expenses with date, amount, category, and description
- ✅ **View & Filter**: Browse expenses with advanced filtering by category, date range, and search
- ✅ **Edit & Delete**: Modify or remove existing expenses with confirmation dialogs
- ✅ **Data Persistence**: All data stored locally using localStorage for instant access

### Categories
- Food
- Transportation  
- Entertainment
- Shopping
- Bills
- Other

### Dashboard Analytics
- 📊 **Summary Cards**: Total spending, monthly spending, expense count, and categories
- 📈 **Category Breakdown**: Visual representation of spending by category with percentages
- 📋 **Recent Expenses**: Quick view of your latest 5 expenses
- 🎨 **Color-coded Charts**: Each category has a unique color for easy identification

### Export & Data Management
- 📤 **CSV Export**: Export filtered expenses to CSV format
- 📤 **JSON Export**: Export data in JSON format for backup or analysis
- 🔍 **Advanced Filtering**: Filter by category, date range, and description search
- 📱 **Responsive Design**: Works seamlessly on desktop, tablet, and mobile devices

### User Experience
- 🎨 **Modern UI**: Clean, professional design with Tailwind CSS
- ⚡ **Fast Performance**: Built with Next.js 14 and optimized for speed
- 🔒 **Type Safety**: Full TypeScript implementation for robust code
- 📱 **Mobile-First**: Responsive design that works on all screen sizes
- ⌨️ **Form Validation**: Comprehensive validation for all user inputs
- 🔔 **User Feedback**: Loading states, error handling, and confirmation dialogs

## Tech Stack

- **Framework**: Next.js 14 with App Router
- **Language**: TypeScript for type safety
- **Styling**: Tailwind CSS for modern, responsive design
- **Icons**: Lucide React for clean, consistent icons
- **Date Handling**: date-fns for robust date operations
- **Storage**: localStorage for client-side data persistence
- **Linting**: ESLint with Next.js configuration

## Getting Started

### Prerequisites
- Node.js 18+ 
- npm or yarn

### Installation

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd expense-tracker-ai
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Start the development server**
   ```bash
   npm run dev
   ```

4. **Open your browser**
   Navigate to [http://localhost:3000](http://localhost:3000)

### Available Scripts

- `npm run dev` - Start development server with Turbopack
- `npm run build` - Build for production
- `npm run start` - Start production server
- `npm run lint` - Run ESLint

## Usage Guide

### Adding an Expense
1. Click the "Add Expense" button on either Dashboard or Expenses page
2. Fill in the required fields:
   - **Date**: When the expense occurred
   - **Amount**: Cost in USD (positive numbers only)
   - **Category**: Select from predefined categories
   - **Description**: What was the expense for
3. Click "Add Expense" to save

### Viewing Expenses
- **Dashboard**: Overview with analytics and recent expenses
- **Expenses**: Complete list with filtering and search capabilities

### Filtering Expenses
1. Navigate to the Expenses page
2. Click the "Filters" button
3. Use any combination of:
   - Search term (searches description and category)
   - Category filter
   - Date range (from/to dates)
4. Click "Clear Filters" to reset

### Editing an Expense
1. In the Expenses list, click the edit icon (pencil)
2. Modify any fields in the modal dialog
3. Click "Save Changes" to update

### Deleting an Expense
1. In the Expenses list, click the delete icon (trash)
2. Confirm deletion in the dialog
3. The expense will be permanently removed

### Exporting Data
1. Navigate to the Expenses page
2. Apply any filters if desired
3. Click "CSV" or "JSON" button to download filtered data

## Data Storage

This application uses localStorage for data persistence:
- All expenses are stored in your browser's local storage
- Data persists between browser sessions
- Data is tied to the specific browser and domain
- No server or external database required

## Browser Compatibility

- Chrome 80+
- Firefox 75+
- Safari 13+
- Edge 80+

## Project Structure

```
src/
├── app/
│   ├── layout.tsx          # Root layout with metadata
│   ├── page.tsx            # Main application page
│   └── globals.css         # Global styles
├── components/
│   ├── AddExpenseForm.tsx  # Form for adding new expenses
│   ├── Dashboard.tsx       # Analytics and overview
│   ├── EditExpenseModal.tsx # Modal for editing expenses
│   ├── ExpenseList.tsx     # List with filtering and actions
│   └── Header.tsx          # Navigation header
├── lib/
│   ├── export.ts           # Export functionality (CSV/JSON)
│   ├── storage.ts          # localStorage utilities
│   └── utils.ts            # General utilities and helpers
└── types/
    └── expense.ts          # TypeScript interfaces
```

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Run tests and linting
5. Submit a pull request

## License

This project is open source and available under the MIT License.

## Support

If you encounter any issues or have questions:
1. Check the browser console for error messages
2. Ensure localStorage is enabled in your browser
3. Try clearing browser cache and localStorage
4. Use a supported browser version