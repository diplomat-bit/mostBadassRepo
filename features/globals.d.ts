// REPOSITORY SOURCE: diplomat-bit/Citibank_Demo_Business_Inc_Demonstration- | PATH: diplomat-bit-Citibank_Demo_Business_Inc_Demonstration--ab2501d/features/globals.d.ts
================================================================================

// Copyright James Burvel O’Callaghan III
// President Citibank Demo Business Inc.

// globals.d.ts
declare global {
  /**
   * Loads the Pyodide WebAssembly module.
   * @param config Optional configuration for Pyodide.
   */
  function loadPyodide(config?: { indexURL?: string }): Promise<any>;

  interface Window {
    google?: {
      accounts: {
        id: {
          disableAutoSelect: () => void;
        };
      };
    };
  }
}

// This export statement is required to make the file a module.
export {};