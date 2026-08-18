// REPOSITORY SOURCE: diplomat-bit/ai-banking-swarm-roster | PATH: diplomat-bit-ai-banking-swarm-roster-20297ff/components/AlertPopup.tsx
================================================================================

import React, { useEffect } from 'react';
import { Alert } from '../types';

interface AlertPopupProps {
  alert: Alert | null;
  onClose: () => void;
}

export const AlertPopup: React.FC<AlertPopupProps> = ({ alert, onClose }) => {
  useEffect(() => {
    if (alert) {
      const timer = setTimeout(() => {
        onClose();
      }, 4000);
      return () => clearTimeout(timer);
    }
  }, [alert, onClose]);

  if (!alert) return null;

  const bgColor = alert.type === 'success' ? 'bg-green-600' : 'bg-red-600';

  return (
    <div 
        className={`fixed top-5 right-5 ${bgColor} text-white px-6 py-3 rounded-lg shadow-lg z-50 animate-fade-in-down`}
    >
      <style>{`
        @keyframes fade-in-down {
          0% {
            opacity: 0;
            transform: translateY(-20px);
          }
          100% {
            opacity: 1;
            transform: translateY(0);
          }
        }
        .animate-fade-in-down {
          animation: fade-in-down 0.5s ease-out forwards;
        }
      `}</style>
      <p>{alert.message}</p>
    </div>
  );
};


================================================================================
// APPENDED FROM REPO: diplomat-bit/autoomousai | ORIGINAL PATH: diplomat-bit-autoomousai-f4d320c/components/AlertPopup.tsx
================================================================================

import React, { useEffect } from 'react';
import { Alert } from '../types';

interface AlertPopupProps {
  alert: Alert | null;
  onClose: () => void;
}

export const AlertPopup: React.FC<AlertPopupProps> = ({ alert, onClose }) => {
  useEffect(() => {
    if (alert) {
      const timer = setTimeout(() => {
        onClose();
      }, 4000);
      return () => clearTimeout(timer);
    }
  }, [alert, onClose]);

  if (!alert) return null;

  const bgColor = alert.type === 'success' ? 'bg-green-600' : 'bg-red-600';

  return (
    <div 
        className={`fixed top-5 right-5 ${bgColor} text-white px-6 py-3 rounded-lg shadow-lg z-50 animate-fade-in-down`}
    >
      <style>{`
        @keyframes fade-in-down {
          0% {
            opacity: 0;
            transform: translateY(-20px);
          }
          100% {
            opacity: 1;
            transform: translateY(0);
          }
        }
        .animate-fade-in-down {
          animation: fade-in-down 0.5s ease-out forwards;
        }
      `}</style>
      <p>{alert.message}</p>
    </div>
  );
};


================================================================================
// APPENDED FROM REPO: diplomat-bit/usa | ORIGINAL PATH: diplomat-bit-usa-d72fd59/components/AlertPopup.tsx
================================================================================

import React, { useEffect } from 'react';
import { Alert } from '../types';

interface AlertPopupProps {
  alert: Alert | null;
  onClose: () => void;
}

export const AlertPopup: React.FC<AlertPopupProps> = ({ alert, onClose }) => {
  useEffect(() => {
    if (alert) {
      const timer = setTimeout(() => {
        onClose();
      }, 4000);
      return () => clearTimeout(timer);
    }
  }, [alert, onClose]);

  if (!alert) return null;

  const bgColor = alert.type === 'success' ? 'bg-green-600' : 'bg-red-600';

  return (
    <div 
        className={`fixed top-5 right-5 ${bgColor} text-white px-6 py-3 rounded-lg shadow-lg z-50 animate-fade-in-down`}
    >
      <style>{`
        @keyframes fade-in-down {
          0% {
            opacity: 0;
            transform: translateY(-20px);
          }
          100% {
            opacity: 1;
            transform: translateY(0);
          }
        }
        .animate-fade-in-down {
          animation: fade-in-down 0.5s ease-out forwards;
        }
      `}</style>
      <p>{alert.message}</p>
    </div>
  );
};
