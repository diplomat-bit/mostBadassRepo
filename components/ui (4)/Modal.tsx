// REPOSITORY SOURCE: diplomat-bit/almost | PATH: diplomat-bit-almost-93a5466/components/ui (4)/Modal.tsx
================================================================================


import React from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from './dialog';

interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  title: React.ReactNode;
  children: React.ReactNode;
  size?: 'small' | 'medium' | 'large';
}

export const Modal: React.FC<ModalProps> = ({ isOpen, onClose, title, children, size = 'medium' }) => {
  const maxWidthClass = size === 'small' ? 'max-w-sm' : size === 'large' ? 'max-w-4xl' : 'max-w-lg';

  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className={`${maxWidthClass} max-h-[90vh] overflow-y-auto bg-gray-900 border border-gray-700 text-white`}>
        <DialogHeader>
          <DialogTitle>{title}</DialogTitle>
        </DialogHeader>
        <div className="mt-2">
          {children}
        </div>
      </DialogContent>
    </Dialog>
  );
};


================================================================================
// APPENDED FROM REPO: diplomat-bit/Fuckyou | ORIGINAL PATH: diplomat-bit-Fuckyou-70f83c5/components/ui (4)/Modal.tsx
================================================================================


import React from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from './dialog';

interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  title: React.ReactNode;
  children: React.ReactNode;
  size?: 'small' | 'medium' | 'large';
}

export const Modal: React.FC<ModalProps> = ({ isOpen, onClose, title, children, size = 'medium' }) => {
  const maxWidthClass = size === 'small' ? 'max-w-sm' : size === 'large' ? 'max-w-4xl' : 'max-w-lg';

  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className={`${maxWidthClass} max-h-[90vh] overflow-y-auto bg-gray-900 border border-gray-700 text-white`}>
        <DialogHeader>
          <DialogTitle>{title}</DialogTitle>
        </DialogHeader>
        <div className="mt-2">
          {children}
        </div>
      </DialogContent>
    </Dialog>
  );
};


================================================================================
// APPENDED FROM REPO: diplomat-bit/magic | ORIGINAL PATH: diplomat-bit-magic-a3f5ff1/components/ui (4)/Modal.tsx
================================================================================


import React from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from './dialog';

interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  title: React.ReactNode;
  children: React.ReactNode;
  size?: 'small' | 'medium' | 'large';
}

export const Modal: React.FC<ModalProps> = ({ isOpen, onClose, title, children, size = 'medium' }) => {
  const maxWidthClass = size === 'small' ? 'max-w-sm' : size === 'large' ? 'max-w-4xl' : 'max-w-lg';

  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className={`${maxWidthClass} max-h-[90vh] overflow-y-auto bg-gray-900 border border-gray-700 text-white`}>
        <DialogHeader>
          <DialogTitle>{title}</DialogTitle>
        </DialogHeader>
        <div className="mt-2">
          {children}
        </div>
      </DialogContent>
    </Dialog>
  );
};
