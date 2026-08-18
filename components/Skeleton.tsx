// REPOSITORY SOURCE: diplomat-bit/ci-connect-enterprises | PATH: diplomat-bit-ci-connect-enterprises-4cf6219/components/Skeleton.tsx
================================================================================


import React from 'react';

/* fix: added ...props and broad type to allow key and other standard attributes */
export const Skeleton = ({ className = "", ...props }: { className?: string, [key: string]: any }) => (
  <div {...props} className={`animate-pulse bg-zinc-900 rounded-xl ${className}`}></div>
);

export const CardSkeleton = () => (
  <div className="bg-zinc-950 border border-zinc-900 p-8 rounded-[2rem] space-y-4 shadow-2xl">
    <div className="flex justify-between">
      <Skeleton className="w-12 h-12 rounded-2xl" />
      <Skeleton className="w-16 h-6 rounded-full" />
    </div>
    <Skeleton className="w-24 h-3" />
    <Skeleton className="w-48 h-8" />
    <Skeleton className="w-32 h-3" />
  </div>
);

export const TableRowSkeleton = () => (
  <div className="flex items-center space-x-4 py-8 px-10">
    <Skeleton className="w-10 h-10 rounded-xl" />
    <div className="flex-1 space-y-2">
      <Skeleton className="w-1/4 h-4" />
      <Skeleton className="w-1/2 h-2" />
    </div>
    <Skeleton className="w-24 h-6" />
  </div>
);


================================================================================
// APPENDED FROM REPO: diplomat-bit/ci-connect-enterprisesnb | ORIGINAL PATH: diplomat-bit-ci-connect-enterprisesnb-634c26e/components/Skeleton.tsx
================================================================================


import React from 'react';

/* fix: added ...props and broad type to allow key and other standard attributes */
export const Skeleton = ({ className = "", ...props }: { className?: string, [key: string]: any }) => (
  <div {...props} className={`animate-pulse bg-zinc-900 rounded-xl ${className}`}></div>
);

export const CardSkeleton = () => (
  <div className="bg-zinc-950 border border-zinc-900 p-8 rounded-[2rem] space-y-4 shadow-2xl">
    <div className="flex justify-between">
      <Skeleton className="w-12 h-12 rounded-2xl" />
      <Skeleton className="w-16 h-6 rounded-full" />
    </div>
    <Skeleton className="w-24 h-3" />
    <Skeleton className="w-48 h-8" />
    <Skeleton className="w-32 h-3" />
  </div>
);

export const TableRowSkeleton = () => (
  <div className="flex items-center space-x-4 py-8 px-10">
    <Skeleton className="w-10 h-10 rounded-xl" />
    <div className="flex-1 space-y-2">
      <Skeleton className="w-1/4 h-4" />
      <Skeleton className="w-1/2 h-2" />
    </div>
    <Skeleton className="w-24 h-6" />
  </div>
);


================================================================================
// APPENDED FROM REPO: diplomat-bit/citi-connect-enterprise | ORIGINAL PATH: diplomat-bit-citi-connect-enterprise-0d00736/components/Skeleton.tsx
================================================================================


import React from 'react';

/* fix: added ...props and broad type to allow key and other standard attributes */
export const Skeleton = ({ className = "", ...props }: { className?: string, [key: string]: any }) => (
  <div {...props} className={`animate-pulse bg-zinc-900 rounded-xl ${className}`}></div>
);

export const CardSkeleton = () => (
  <div className="bg-zinc-950 border border-zinc-900 p-8 rounded-[2rem] space-y-4 shadow-2xl">
    <div className="flex justify-between">
      <Skeleton className="w-12 h-12 rounded-2xl" />
      <Skeleton className="w-16 h-6 rounded-full" />
    </div>
    <Skeleton className="w-24 h-3" />
    <Skeleton className="w-48 h-8" />
    <Skeleton className="w-32 h-3" />
  </div>
);

export const TableRowSkeleton = () => (
  <div className="flex items-center space-x-4 py-8 px-10">
    <Skeleton className="w-10 h-10 rounded-xl" />
    <div className="flex-1 space-y-2">
      <Skeleton className="w-1/4 h-4" />
      <Skeleton className="w-1/2 h-2" />
    </div>
    <Skeleton className="w-24 h-6" />
  </div>
);
