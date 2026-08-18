// REPOSITORY SOURCE: diplomat-bit/almost | PATH: diplomat-bit-almost-93a5466/components/invoices/InvoiceList.tsx
================================================================================

import React from 'react';
import { Transaction } from '@/types/transaction'; // Assuming a new type definition based on the API
import { ArrowDownCircleIcon, ArrowUpCircleIcon } from '@heroicons/react/24/outline';

interface TransactionListProps {
  transactions: Transaction[];
  onViewDetails: (transactionId: string) => void;
  onCategorize: (transactionId: string) => void;
}

const categoryColors = [
  'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200',
  'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200',
  'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200',
  'bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-200',
  'bg-pink-100 text-pink-800 dark:bg-pink-900 dark:text-pink-200',
  'bg-indigo-100 text-indigo-800 dark:bg-indigo-900 dark:text-indigo-200',
  'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200',
  'bg-teal-100 text-teal-800 dark:bg-teal-900 dark:text-teal-200',
];

const getCategoryColor = (category: string) => {
  if (!category) return categoryColors[0];
  let hash = 0;
  for (let i = 0; i < category.length; i++) {
    hash = category.charCodeAt(i) + ((hash << 5) - hash);
  }
  const index = Math.abs(hash % categoryColors.length);
  return categoryColors[index];
};


const TransactionList: React.FC<TransactionListProps> = ({
  transactions,
  onViewDetails,
  onCategorize,
}) => {
  if (!transactions || transactions.length === 0) {
    return (
      <div className="text-center py-12 bg-gray-50 dark:bg-gray-800 rounded-lg">
        <h3 className="text-lg font-medium text-gray-900 dark:text-white">No Transactions Yet</h3>
        <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
          Connect a financial account to see your transactions appear here.
        </p>
      </div>
    );
  }

  return (
    <div className="overflow-hidden shadow-lg rounded-lg ring-1 ring-black ring-opacity-5">
      <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
        <thead className="bg-gray-50 dark:bg-gray-800">
          <tr>
            <th
              scope="col"
              className="px-6 py-3 text-left text-xs font-semibold text-gray-500 dark:text-gray-300 uppercase tracking-wider"
            >
              Transaction
            </th>
            <th
              scope="col"
              className="px-6 py-3 text-left text-xs font-semibold text-gray-500 dark:text-gray-300 uppercase tracking-wider"
            >
              Category
            </th>
            <th
              scope="col"
              className="px-6 py-3 text-left text-xs font-semibold text-gray-500 dark:text-gray-300 uppercase tracking-wider"
            >
              Date
            </th>
            <th
              scope="col"
              className="px-6 py-3 text-right text-xs font-semibold text-gray-500 dark:text-gray-300 uppercase tracking-wider"
            >
              Amount
            </th>
            <th scope="col" className="relative px-6 py-3">
              <span className="sr-only">Actions</span>
            </th>
          </tr>
        </thead>
        <tbody className="bg-white dark:bg-gray-900 divide-y divide-gray-200 dark:divide-gray-700">
          {transactions.map((transaction) => (
            <tr key={transaction.id} className="hover:bg-gray-50 dark:hover:bg-gray-800/50 transition-colors duration-150">
              <td className="px-6 py-4 whitespace-nowrap">
                <div className="flex items-center">
                  <div className="flex-shrink-0 h-10 w-10">
                    {transaction.type === 'income' ? (
                        <ArrowUpCircleIcon className="h-10 w-10 text-green-500" />
                    ) : transaction.type === 'expense' ? (
                        <ArrowDownCircleIcon className="h-10 w-10 text-gray-400" />
                    ) : (
                        <div className="h-10 w-10 rounded-full bg-gray-200 dark:bg-gray-700 flex items-center justify-center">
                            <span className="text-gray-500 dark:text-gray-400 font-bold">{transaction.description.charAt(0)}</span>
                        </div>
                    )}
                  </div>
                  <div className="ml-4">
                    <div className="text-sm font-medium text-gray-900 dark:text-white">
                      {transaction.description}
                    </div>
                    <div className="text-sm text-gray-500 dark:text-gray-400">
                      {transaction.merchantDetails?.name || `Account: ${transaction.accountId}`}
                    </div>
                  </div>
                </div>
              </td>
              <td className="px-6 py-4 whitespace-nowrap">
                <span
                  className={`px-3 py-1 inline-flex text-xs leading-5 font-semibold rounded-full ${getCategoryColor(transaction.category)}`}
                >
                  {transaction.category}
                </span>
              </td>
              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400">
                {new Date(transaction.date).toLocaleDateString('en-US', {
                  year: 'numeric',
                  month: 'short',
                  day: 'numeric',
                })}
              </td>
              <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                <span className={
                  transaction.type === 'income' ? 'text-green-600 dark:text-green-400' : 'text-gray-900 dark:text-gray-200'
                }>
                  {transaction.type === 'income' ? '+' : ''}
                  {new Intl.NumberFormat('en-US', { style: 'currency', currency: transaction.currency || 'USD' }).format(transaction.amount)}
                </span>
              </td>
              <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium space-x-4">
                <button
                  onClick={() => onViewDetails(transaction.id)}
                  className="text-indigo-600 hover:text-indigo-800 dark:text-indigo-400 dark:hover:text-indigo-300 transition-colors"
                >
                  Details
                </button>
                <button
                  onClick={() => onCategorize(transaction.id)}
                  className="text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200 transition-colors"
                >
                  Categorize
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default TransactionList;

================================================================================
// APPENDED FROM REPO: diplomat-bit/Fuckyou | ORIGINAL PATH: diplomat-bit-Fuckyou-70f83c5/components/invoices/InvoiceList.tsx
================================================================================

import React from 'react';
import { Transaction } from '@/types/transaction'; // Assuming a new type definition based on the API
import { ArrowDownCircleIcon, ArrowUpCircleIcon } from '@heroicons/react/24/outline';

interface TransactionListProps {
  transactions: Transaction[];
  onViewDetails: (transactionId: string) => void;
  onCategorize: (transactionId: string) => void;
}

const categoryColors = [
  'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200',
  'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200',
  'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200',
  'bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-200',
  'bg-pink-100 text-pink-800 dark:bg-pink-900 dark:text-pink-200',
  'bg-indigo-100 text-indigo-800 dark:bg-indigo-900 dark:text-indigo-200',
  'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200',
  'bg-teal-100 text-teal-800 dark:bg-teal-900 dark:text-teal-200',
];

const getCategoryColor = (category: string) => {
  if (!category) return categoryColors[0];
  let hash = 0;
  for (let i = 0; i < category.length; i++) {
    hash = category.charCodeAt(i) + ((hash << 5) - hash);
  }
  const index = Math.abs(hash % categoryColors.length);
  return categoryColors[index];
};


const TransactionList: React.FC<TransactionListProps> = ({
  transactions,
  onViewDetails,
  onCategorize,
}) => {
  if (!transactions || transactions.length === 0) {
    return (
      <div className="text-center py-12 bg-gray-50 dark:bg-gray-800 rounded-lg">
        <h3 className="text-lg font-medium text-gray-900 dark:text-white">No Transactions Yet</h3>
        <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
          Connect a financial account to see your transactions appear here.
        </p>
      </div>
    );
  }

  return (
    <div className="overflow-hidden shadow-lg rounded-lg ring-1 ring-black ring-opacity-5">
      <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
        <thead className="bg-gray-50 dark:bg-gray-800">
          <tr>
            <th
              scope="col"
              className="px-6 py-3 text-left text-xs font-semibold text-gray-500 dark:text-gray-300 uppercase tracking-wider"
            >
              Transaction
            </th>
            <th
              scope="col"
              className="px-6 py-3 text-left text-xs font-semibold text-gray-500 dark:text-gray-300 uppercase tracking-wider"
            >
              Category
            </th>
            <th
              scope="col"
              className="px-6 py-3 text-left text-xs font-semibold text-gray-500 dark:text-gray-300 uppercase tracking-wider"
            >
              Date
            </th>
            <th
              scope="col"
              className="px-6 py-3 text-right text-xs font-semibold text-gray-500 dark:text-gray-300 uppercase tracking-wider"
            >
              Amount
            </th>
            <th scope="col" className="relative px-6 py-3">
              <span className="sr-only">Actions</span>
            </th>
          </tr>
        </thead>
        <tbody className="bg-white dark:bg-gray-900 divide-y divide-gray-200 dark:divide-gray-700">
          {transactions.map((transaction) => (
            <tr key={transaction.id} className="hover:bg-gray-50 dark:hover:bg-gray-800/50 transition-colors duration-150">
              <td className="px-6 py-4 whitespace-nowrap">
                <div className="flex items-center">
                  <div className="flex-shrink-0 h-10 w-10">
                    {transaction.type === 'income' ? (
                        <ArrowUpCircleIcon className="h-10 w-10 text-green-500" />
                    ) : transaction.type === 'expense' ? (
                        <ArrowDownCircleIcon className="h-10 w-10 text-gray-400" />
                    ) : (
                        <div className="h-10 w-10 rounded-full bg-gray-200 dark:bg-gray-700 flex items-center justify-center">
                            <span className="text-gray-500 dark:text-gray-400 font-bold">{transaction.description.charAt(0)}</span>
                        </div>
                    )}
                  </div>
                  <div className="ml-4">
                    <div className="text-sm font-medium text-gray-900 dark:text-white">
                      {transaction.description}
                    </div>
                    <div className="text-sm text-gray-500 dark:text-gray-400">
                      {transaction.merchantDetails?.name || `Account: ${transaction.accountId}`}
                    </div>
                  </div>
                </div>
              </td>
              <td className="px-6 py-4 whitespace-nowrap">
                <span
                  className={`px-3 py-1 inline-flex text-xs leading-5 font-semibold rounded-full ${getCategoryColor(transaction.category)}`}
                >
                  {transaction.category}
                </span>
              </td>
              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400">
                {new Date(transaction.date).toLocaleDateString('en-US', {
                  year: 'numeric',
                  month: 'short',
                  day: 'numeric',
                })}
              </td>
              <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                <span className={
                  transaction.type === 'income' ? 'text-green-600 dark:text-green-400' : 'text-gray-900 dark:text-gray-200'
                }>
                  {transaction.type === 'income' ? '+' : ''}
                  {new Intl.NumberFormat('en-US', { style: 'currency', currency: transaction.currency || 'USD' }).format(transaction.amount)}
                </span>
              </td>
              <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium space-x-4">
                <button
                  onClick={() => onViewDetails(transaction.id)}
                  className="text-indigo-600 hover:text-indigo-800 dark:text-indigo-400 dark:hover:text-indigo-300 transition-colors"
                >
                  Details
                </button>
                <button
                  onClick={() => onCategorize(transaction.id)}
                  className="text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200 transition-colors"
                >
                  Categorize
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default TransactionList;

================================================================================
// APPENDED FROM REPO: diplomat-bit/jamesburvelocallaghaniiiand | ORIGINAL PATH: diplomat-bit-jamesburvelocallaghaniiiand-9414e97/components/invoices/InvoiceList.tsx
================================================================================

import React from 'react';
import { Invoice } from '@/types/invoice'; // Assuming you have a types/invoice.ts file

interface InvoiceListProps {
  invoices: Invoice[];
  onViewDetails: (invoiceId: string) => void;
  onEdit: (invoiceId: string) => void;
  onDelete: (invoiceId: string) => void;
}

const InvoiceList: React.FC<InvoiceListProps> = ({
  invoices,
  onViewDetails,
  onEdit,
  onDelete,
}) => {
  if (!invoices || invoices.length === 0) {
    return <p className="text-gray-500">No invoices found.</p>;
  }

  return (
    <div className="overflow-x-auto">
      <table className="min-w-full divide-y divide-gray-200">
        <thead className="bg-gray-50">
          <tr>
            <th
              scope="col"
              className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
            >
              Invoice ID
            </th>
            <th
              scope="col"
              className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
            >
              Customer Name
            </th>
            <th
              scope="col"
              className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
            >
              Amount
            </th>
            <th
              scope="col"
              className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
            >
              Due Date
            </th>
            <th
              scope="col"
              className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
            >
              Status
            </th>
            <th scope="col" className="relative px-6 py-3">
              <span className="sr-only">Actions</span>
            </th>
          </tr>
        </thead>
        <tbody className="bg-white divide-y divide-gray-200">
          {invoices.map((invoice) => (
            <tr key={invoice.id}>
              <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                {invoice.id}
              </td>
              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                {invoice.customerName}
              </td>
              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                ${invoice.amount.toFixed(2)}
              </td>
              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                {new Date(invoice.dueDate).toLocaleDateString()}
              </td>
              <td className="px-6 py-4 whitespace-nowrap">
                <span
                  className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                    invoice.status === 'Paid'
                      ? 'bg-green-100 text-green-800'
                      : invoice.status === 'Pending'
                      ? 'bg-yellow-100 text-yellow-800'
                      : 'bg-red-100 text-red-800'
                  }`}
                >
                  {invoice.status}
                </span>
              </td>
              <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-right space-x-2">
                <button
                  onClick={() => onViewDetails(invoice.id)}
                  className="text-indigo-600 hover:text-indigo-900"
                >
                  View
                </button>
                <button
                  onClick={() => onEdit(invoice.id)}
                  className="text-blue-600 hover:text-blue-900"
                >
                  Edit
                </button>
                <button
                  onClick={() => onDelete(invoice.id)}
                  className="text-red-600 hover:text-red-900"
                >
                  Delete
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default InvoiceList;

================================================================================
// APPENDED FROM REPO: diplomat-bit/magic | ORIGINAL PATH: diplomat-bit-magic-a3f5ff1/components/invoices/InvoiceList.tsx
================================================================================

import React from 'react';
import { Transaction } from '@/types/transaction'; // Assuming a new type definition based on the API
import { ArrowDownCircleIcon, ArrowUpCircleIcon } from '@heroicons/react/24/outline';

interface TransactionListProps {
  transactions: Transaction[];
  onViewDetails: (transactionId: string) => void;
  onCategorize: (transactionId: string) => void;
}

const categoryColors = [
  'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200',
  'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200',
  'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200',
  'bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-200',
  'bg-pink-100 text-pink-800 dark:bg-pink-900 dark:text-pink-200',
  'bg-indigo-100 text-indigo-800 dark:bg-indigo-900 dark:text-indigo-200',
  'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200',
  'bg-teal-100 text-teal-800 dark:bg-teal-900 dark:text-teal-200',
];

const getCategoryColor = (category: string) => {
  if (!category) return categoryColors[0];
  let hash = 0;
  for (let i = 0; i < category.length; i++) {
    hash = category.charCodeAt(i) + ((hash << 5) - hash);
  }
  const index = Math.abs(hash % categoryColors.length);
  return categoryColors[index];
};


const TransactionList: React.FC<TransactionListProps> = ({
  transactions,
  onViewDetails,
  onCategorize,
}) => {
  if (!transactions || transactions.length === 0) {
    return (
      <div className="text-center py-12 bg-gray-50 dark:bg-gray-800 rounded-lg">
        <h3 className="text-lg font-medium text-gray-900 dark:text-white">No Transactions Yet</h3>
        <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
          Connect a financial account to see your transactions appear here.
        </p>
      </div>
    );
  }

  return (
    <div className="overflow-hidden shadow-lg rounded-lg ring-1 ring-black ring-opacity-5">
      <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
        <thead className="bg-gray-50 dark:bg-gray-800">
          <tr>
            <th
              scope="col"
              className="px-6 py-3 text-left text-xs font-semibold text-gray-500 dark:text-gray-300 uppercase tracking-wider"
            >
              Transaction
            </th>
            <th
              scope="col"
              className="px-6 py-3 text-left text-xs font-semibold text-gray-500 dark:text-gray-300 uppercase tracking-wider"
            >
              Category
            </th>
            <th
              scope="col"
              className="px-6 py-3 text-left text-xs font-semibold text-gray-500 dark:text-gray-300 uppercase tracking-wider"
            >
              Date
            </th>
            <th
              scope="col"
              className="px-6 py-3 text-right text-xs font-semibold text-gray-500 dark:text-gray-300 uppercase tracking-wider"
            >
              Amount
            </th>
            <th scope="col" className="relative px-6 py-3">
              <span className="sr-only">Actions</span>
            </th>
          </tr>
        </thead>
        <tbody className="bg-white dark:bg-gray-900 divide-y divide-gray-200 dark:divide-gray-700">
          {transactions.map((transaction) => (
            <tr key={transaction.id} className="hover:bg-gray-50 dark:hover:bg-gray-800/50 transition-colors duration-150">
              <td className="px-6 py-4 whitespace-nowrap">
                <div className="flex items-center">
                  <div className="flex-shrink-0 h-10 w-10">
                    {transaction.type === 'income' ? (
                        <ArrowUpCircleIcon className="h-10 w-10 text-green-500" />
                    ) : transaction.type === 'expense' ? (
                        <ArrowDownCircleIcon className="h-10 w-10 text-gray-400" />
                    ) : (
                        <div className="h-10 w-10 rounded-full bg-gray-200 dark:bg-gray-700 flex items-center justify-center">
                            <span className="text-gray-500 dark:text-gray-400 font-bold">{transaction.description.charAt(0)}</span>
                        </div>
                    )}
                  </div>
                  <div className="ml-4">
                    <div className="text-sm font-medium text-gray-900 dark:text-white">
                      {transaction.description}
                    </div>
                    <div className="text-sm text-gray-500 dark:text-gray-400">
                      {transaction.merchantDetails?.name || `Account: ${transaction.accountId}`}
                    </div>
                  </div>
                </div>
              </td>
              <td className="px-6 py-4 whitespace-nowrap">
                <span
                  className={`px-3 py-1 inline-flex text-xs leading-5 font-semibold rounded-full ${getCategoryColor(transaction.category)}`}
                >
                  {transaction.category}
                </span>
              </td>
              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400">
                {new Date(transaction.date).toLocaleDateString('en-US', {
                  year: 'numeric',
                  month: 'short',
                  day: 'numeric',
                })}
              </td>
              <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                <span className={
                  transaction.type === 'income' ? 'text-green-600 dark:text-green-400' : 'text-gray-900 dark:text-gray-200'
                }>
                  {transaction.type === 'income' ? '+' : ''}
                  {new Intl.NumberFormat('en-US', { style: 'currency', currency: transaction.currency || 'USD' }).format(transaction.amount)}
                </span>
              </td>
              <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium space-x-4">
                <button
                  onClick={() => onViewDetails(transaction.id)}
                  className="text-indigo-600 hover:text-indigo-800 dark:text-indigo-400 dark:hover:text-indigo-300 transition-colors"
                >
                  Details
                </button>
                <button
                  onClick={() => onCategorize(transaction.id)}
                  className="text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200 transition-colors"
                >
                  Categorize
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default TransactionList;