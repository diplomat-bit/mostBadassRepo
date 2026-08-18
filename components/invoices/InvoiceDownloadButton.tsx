// REPOSITORY SOURCE: diplomat-bit/almost | PATH: diplomat-bit-almost-93a5466/components/invoices/InvoiceDownloadButton.tsx
================================================================================

import React from 'react';
import { Button, ButtonProps } from '@mui/material';

interface InvoiceDownloadButtonProps extends ButtonProps {
  invoiceId: string;
  fileName?: string;
}

const InvoiceDownloadButton: React.FC<InvoiceDownloadButtonProps> = ({
  invoiceId,
  fileName = `invoice_${invoiceId}.pdf`,
  ...buttonProps
}) => {
  const handleDownload = async () => {
    try {
      // In a real application, this would involve fetching the invoice data
      // from an API and then generating/downloading the PDF.
      // For demonstration purposes, we'll simulate a download.

      // Replace with your actual API endpoint to get the invoice PDF
      const response = await fetch(`/api/invoices/${invoiceId}/download`);

      if (!response.ok) {
        throw new Error(`Failed to download invoice: ${response.statusText}`);
      }

      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', fileName);
      document.body.appendChild(link);
      link.click();
      link.parentNode?.removeChild(link);
      window.URL.revokeObjectURL(url);

    } catch (error) {
      console.error('Error downloading invoice:', error);
      // Optionally, display an error message to the user
      alert('Could not download the invoice. Please try again later.');
    }
  };

  return (
    <Button
      variant="contained"
      color="primary"
      onClick={handleDownload}
      {...buttonProps}
    >
      Download Invoice
    </Button>
  );
};

export default InvoiceDownloadButton;

================================================================================
// APPENDED FROM REPO: diplomat-bit/Fuckyou | ORIGINAL PATH: diplomat-bit-Fuckyou-70f83c5/components/invoices/InvoiceDownloadButton.tsx
================================================================================

import React from 'react';
import { Button, ButtonProps } from '@mui/material';

interface InvoiceDownloadButtonProps extends ButtonProps {
  invoiceId: string;
  fileName?: string;
}

const InvoiceDownloadButton: React.FC<InvoiceDownloadButtonProps> = ({
  invoiceId,
  fileName = `invoice_${invoiceId}.pdf`,
  ...buttonProps
}) => {
  const handleDownload = async () => {
    try {
      // In a real application, this would involve fetching the invoice data
      // from an API and then generating/downloading the PDF.
      // For demonstration purposes, we'll simulate a download.

      // Replace with your actual API endpoint to get the invoice PDF
      const response = await fetch(`/api/invoices/${invoiceId}/download`);

      if (!response.ok) {
        throw new Error(`Failed to download invoice: ${response.statusText}`);
      }

      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', fileName);
      document.body.appendChild(link);
      link.click();
      link.parentNode?.removeChild(link);
      window.URL.revokeObjectURL(url);

    } catch (error) {
      console.error('Error downloading invoice:', error);
      // Optionally, display an error message to the user
      alert('Could not download the invoice. Please try again later.');
    }
  };

  return (
    <Button
      variant="contained"
      color="primary"
      onClick={handleDownload}
      {...buttonProps}
    >
      Download Invoice
    </Button>
  );
};

export default InvoiceDownloadButton;

================================================================================
// APPENDED FROM REPO: diplomat-bit/jamesburvelocallaghaniiiand | ORIGINAL PATH: diplomat-bit-jamesburvelocallaghaniiiand-9414e97/components/invoices/InvoiceDownloadButton.tsx
================================================================================

import React from 'react';
import { Button, ButtonProps } from '@mui/material';

interface InvoiceDownloadButtonProps extends ButtonProps {
  invoiceId: string;
  fileName?: string;
}

const InvoiceDownloadButton: React.FC<InvoiceDownloadButtonProps> = ({
  invoiceId,
  fileName = `invoice_${invoiceId}.pdf`,
  ...buttonProps
}) => {
  const handleDownload = async () => {
    try {
      // In a real application, this would involve fetching the invoice data
      // from an API and then generating/downloading the PDF.
      // For demonstration purposes, we'll simulate a download.

      // Replace with your actual API endpoint to get the invoice PDF
      const response = await fetch(`/api/invoices/${invoiceId}/download`);

      if (!response.ok) {
        throw new Error(`Failed to download invoice: ${response.statusText}`);
      }

      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', fileName);
      document.body.appendChild(link);
      link.click();
      link.parentNode?.removeChild(link);
      window.URL.revokeObjectURL(url);

    } catch (error) {
      console.error('Error downloading invoice:', error);
      // Optionally, display an error message to the user
      alert('Could not download the invoice. Please try again later.');
    }
  };

  return (
    <Button
      variant="contained"
      color="primary"
      onClick={handleDownload}
      {...buttonProps}
    >
      Download Invoice
    </Button>
  );
};

export default InvoiceDownloadButton;

================================================================================
// APPENDED FROM REPO: diplomat-bit/magic | ORIGINAL PATH: diplomat-bit-magic-a3f5ff1/components/invoices/InvoiceDownloadButton.tsx
================================================================================

import React from 'react';
import { Button, ButtonProps } from '@mui/material';

interface InvoiceDownloadButtonProps extends ButtonProps {
  invoiceId: string;
  fileName?: string;
}

const InvoiceDownloadButton: React.FC<InvoiceDownloadButtonProps> = ({
  invoiceId,
  fileName = `invoice_${invoiceId}.pdf`,
  ...buttonProps
}) => {
  const handleDownload = async () => {
    try {
      // In a real application, this would involve fetching the invoice data
      // from an API and then generating/downloading the PDF.
      // For demonstration purposes, we'll simulate a download.

      // Replace with your actual API endpoint to get the invoice PDF
      const response = await fetch(`/api/invoices/${invoiceId}/download`);

      if (!response.ok) {
        throw new Error(`Failed to download invoice: ${response.statusText}`);
      }

      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', fileName);
      document.body.appendChild(link);
      link.click();
      link.parentNode?.removeChild(link);
      window.URL.revokeObjectURL(url);

    } catch (error) {
      console.error('Error downloading invoice:', error);
      // Optionally, display an error message to the user
      alert('Could not download the invoice. Please try again later.');
    }
  };

  return (
    <Button
      variant="contained"
      color="primary"
      onClick={handleDownload}
      {...buttonProps}
    >
      Download Invoice
    </Button>
  );
};

export default InvoiceDownloadButton;