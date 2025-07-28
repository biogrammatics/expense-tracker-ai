# Expense Tracker

A modern, professional expense tracking application built with Next.js 14, TypeScript, and Tailwind CSS.

## Features

### Core Functionality
- **Add Expenses**: Create new expenses with amount, category, description, and date
- **View & Manage**: Browse all expenses in a clean, organized list
- **Edit & Delete**: Modify or remove existing expenses
- **Search & Filter**: Find expenses by description, category, or date range
- **Data Persistence**: All data is saved locally using localStorage

### Dashboard Analytics
- **Summary Cards**: View total expenses, monthly spending, transaction count, and top category
- **Monthly Trends**: Interactive bar chart showing spending trends over the last 6 months
- **Category Breakdown**: Pie chart displaying spending distribution across categories
- **Recent Expenses**: Quick view of your latest transactions

### Categories
- Food
- Transportation
- Entertainment
- Shopping
- Bills
- Other

### Additional Features
- **Export to CSV**: Download your expense data as a CSV file
- **Responsive Design**: Works seamlessly on desktop, tablet, and mobile devices
- **Form Validation**: Comprehensive input validation with error messages
- **Loading States**: Visual feedback during data operations
- **Modern UI**: Clean, professional interface with smooth animations

## Technology Stack

- **Framework**: Next.js 14 with App Router
- **Language**: TypeScript
- **Styling**: Tailwind CSS
- **Charts**: Recharts
- **Icons**: Lucide React
- **Date Handling**: date-fns
- **Data Storage**: localStorage (browser-based)

## Getting Started

### Prerequisites

- Node.js 18+ 
- npm or yarn

### Installation

1. **Install dependencies**
   ```bash
   npm install
   ```

2. **Start the development server**
   ```bash
   npm run dev
   ```

3. **Open your browser**
   Navigate to [http://localhost:3000](http://localhost:3000)

### Build for Production

```bash
npm run build
npm start
```

## How to Use

### Adding Your First Expense

1. Click on the **"Add Expense"** tab in the navigation
2. Fill in the expense details:
   - **Amount**: Enter the expense amount (must be greater than 0)
   - **Category**: Select from the dropdown menu
   - **Date**: Choose the date of the expense
   - **Description**: Add a description of what the expense was for
3. Click **"Add Expense"** to save

### Viewing and Managing Expenses

1. Click on the **"Expenses"** tab to view all your expenses
2. Use the **"Filters"** button to:
   - Search by description or category
   - Filter by category
   - Filter by date range
3. Click the **edit icon** (pencil) to modify an expense
4. Click the **delete icon** (trash) to remove an expense
5. Use column headers to sort by date, amount, or category

### Dashboard Overview

The **Dashboard** tab provides:
- **Summary cards** with key metrics
- **Monthly spending trends** chart
- **Category breakdown** pie chart
- **Recent expenses** list

### Exporting Data

Click the **"Export CSV"** button in the navigation to download your expense data as a CSV file.

## Features in Detail

### Form Validation
- Amount must be a positive number
- Description is required
- Date is required
- Real-time validation with error messages

### Responsive Design
- **Desktop**: Full layout with all features
- **Tablet**: Adapted layout with touch-friendly controls
- **Mobile**: Optimized mobile experience with simplified navigation

### Data Management
- All data is stored in your browser's localStorage
- Data persists between sessions
- No data is sent to external servers
- Export functionality available for backup

## Project Structure

```
src/
├── app/                    # Next.js app directory
│   ├── globals.css        # Global styles
│   ├── layout.tsx         # Root layout
│   └── page.tsx           # Main page component
├── components/            # React components
│   ├── AddExpenseForm.tsx # Expense creation form
│   ├── Dashboard.tsx      # Dashboard with analytics
│   ├── EditExpenseModal.tsx # Expense editing modal
│   ├── ExpenseList.tsx    # Expense list with filters
│   ├── Header.tsx         # Application header
│   └── Navigation.tsx     # Main navigation
├── lib/                   # Utility functions
│   ├── storage.ts         # localStorage utilities
│   └── utils.ts           # General utilities
└── types/                 # TypeScript type definitions
    └── expense.ts         # Expense-related types
```

## Testing the Application

### Quick Test Workflow

1. **Start the application**:
   ```bash
   npm run dev
   ```

2. **Test adding expenses**:
   - Go to "Add Expense" tab
   - Add expenses across different categories
   - Verify form validation works

3. **Test expense management**:
   - Go to "Expenses" tab
   - Use search and filters
   - Edit and delete expenses
   - Sort by different columns

4. **Test dashboard**:
   - View summary cards
   - Check charts update with your data
   - Verify recent expenses display

5. **Test export**:
   - Click "Export CSV" button
   - Verify CSV file downloads with your expense data

6. **Test responsive design**:
   - Resize browser window
   - Test on mobile device
   - Verify all features work on different screen sizes

## Contributing

This is a demo application, but you can extend it with:
- Cloud data synchronization
- Receipt photo uploads
- Budget tracking
- Recurring expenses
- Multiple currencies
- Data visualization improvements

---

**Built with ❤️ using Next.js, TypeScript, and Tailwind CSS**
