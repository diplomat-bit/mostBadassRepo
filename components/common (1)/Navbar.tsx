// REPOSITORY SOURCE: diplomat-bit/almost | PATH: diplomat-bit-almost-93a5466/components/common (1)/Navbar.tsx
================================================================================

import React from 'react';
import Link from 'next/link';

const Navbar: React.FC = () => {
  return (
    <nav className="bg-gray-800 p-4 shadow-md">
      <div className="container mx-auto flex justify-between items-center">
        <div className="text-white font-bold text-xl">
          <Link href="/">
            <a>MyApp</a>
          </Link>
        </div>
        <div className="space-x-4">
          <Link href="/features">
            <a className="text-gray-300 hover:text-white transition duration-300">Features</a>
          </Link>
          <Link href="/pricing">
            <a className="text-gray-300 hover:text-white transition duration-300">Pricing</a>
          </Link>
          <Link href="/about">
            <a className="text-gray-300 hover:text-white transition duration-300">About</a>
          </Link>
          <Link href="/contact">
            <a className="text-gray-300 hover:text-white transition duration-300">Contact</a>
          </Link>
        </div>
        <div className="space-x-4">
          <Link href="/login">
            <a className="text-gray-300 hover:text-white transition duration-300">Login</a>
          </Link>
          <Link href="/signup">
            <a className="bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2 px-4 rounded transition duration-300">
              Sign Up
            </a>
          </Link>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;

================================================================================
// APPENDED FROM REPO: diplomat-bit/Fuckyou | ORIGINAL PATH: diplomat-bit-Fuckyou-70f83c5/components/common (1)/Navbar.tsx
================================================================================

import React from 'react';
import Link from 'next/link';

const Navbar: React.FC = () => {
  return (
    <nav className="bg-gray-800 p-4 shadow-md">
      <div className="container mx-auto flex justify-between items-center">
        <div className="text-white font-bold text-xl">
          <Link href="/">
            <a>MyApp</a>
          </Link>
        </div>
        <div className="space-x-4">
          <Link href="/features">
            <a className="text-gray-300 hover:text-white transition duration-300">Features</a>
          </Link>
          <Link href="/pricing">
            <a className="text-gray-300 hover:text-white transition duration-300">Pricing</a>
          </Link>
          <Link href="/about">
            <a className="text-gray-300 hover:text-white transition duration-300">About</a>
          </Link>
          <Link href="/contact">
            <a className="text-gray-300 hover:text-white transition duration-300">Contact</a>
          </Link>
        </div>
        <div className="space-x-4">
          <Link href="/login">
            <a className="text-gray-300 hover:text-white transition duration-300">Login</a>
          </Link>
          <Link href="/signup">
            <a className="bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2 px-4 rounded transition duration-300">
              Sign Up
            </a>
          </Link>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;

================================================================================
// APPENDED FROM REPO: diplomat-bit/magic | ORIGINAL PATH: diplomat-bit-magic-a3f5ff1/components/common (1)/Navbar.tsx
================================================================================

import React from 'react';
import Link from 'next/link';

const Navbar: React.FC = () => {
  return (
    <nav className="bg-gray-800 p-4 shadow-md">
      <div className="container mx-auto flex justify-between items-center">
        <div className="text-white font-bold text-xl">
          <Link href="/">
            <a>MyApp</a>
          </Link>
        </div>
        <div className="space-x-4">
          <Link href="/features">
            <a className="text-gray-300 hover:text-white transition duration-300">Features</a>
          </Link>
          <Link href="/pricing">
            <a className="text-gray-300 hover:text-white transition duration-300">Pricing</a>
          </Link>
          <Link href="/about">
            <a className="text-gray-300 hover:text-white transition duration-300">About</a>
          </Link>
          <Link href="/contact">
            <a className="text-gray-300 hover:text-white transition duration-300">Contact</a>
          </Link>
        </div>
        <div className="space-x-4">
          <Link href="/login">
            <a className="text-gray-300 hover:text-white transition duration-300">Login</a>
          </Link>
          <Link href="/signup">
            <a className="bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2 px-4 rounded transition duration-300">
              Sign Up
            </a>
          </Link>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;