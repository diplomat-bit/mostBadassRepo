// REPOSITORY SOURCE: diplomat-bit/ci-connect-enterprises | PATH: diplomat-bit-ci-connect-enterprises-4cf6219/env.d.ts
================================================================================

interface Window {
  aistudio?: {
    auth?: {
      login: (options: any) => Promise<any>;
      logout: () => Promise<any>;
      getUser: () => Promise<any>;
    };
    hasSelectedApiKey: () => Promise<boolean>;
    openSelectKey: () => Promise<void>;
  };
}


================================================================================
// APPENDED FROM REPO: diplomat-bit/ci-connect-enterprisesnb | ORIGINAL PATH: diplomat-bit-ci-connect-enterprisesnb-634c26e/env.d.ts
================================================================================

interface Window {
  aistudio?: {
    auth?: {
      login: (options: any) => Promise<any>;
      logout: () => Promise<any>;
      getUser: () => Promise<any>;
    };
    hasSelectedApiKey: () => Promise<boolean>;
    openSelectKey: () => Promise<void>;
  };
}
