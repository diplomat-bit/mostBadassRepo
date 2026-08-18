// REPOSITORY SOURCE: diplomat-bit/ai-banking-swarm-roster | PATH: diplomat-bit-ai-banking-swarm-roster-20297ff/utils.ts
================================================================================

import { DirNode, FileNode } from './types';

export const getAllFilePaths = (nodes: (DirNode | FileNode)[]): string[] => {
    let paths: string[] = [];
    for (const node of nodes) {
        if (node.type === 'file') {
            paths.push(node.path);
        } else if (node.type === 'dir') {
            paths = paths.concat(getAllFilePaths(node.children));
        }
    }
    return paths;
};

================================================================================
// APPENDED FROM REPO: diplomat-bit/aibanking.dev-jocall3-new | ORIGINAL PATH: diplomat-bit-aibanking.dev-jocall3-new-84d7a30/utils.ts
================================================================================

/**
 * A simple utility for conditionally joining class names together.
 * @param classes A list of strings, which can include falsey values.
 * @returns A single string of space-separated class names.
 */
export const cn = (...classes: (string | undefined | null | false)[]): string => {
  return classes.filter(Boolean).join(' ');
};

/**
 * Creates a seeded random number generator (LCG).
 * This is essential for creating a reproducible simulation.
 * @param seed The initial seed value.
 * @returns A function that returns a pseudo-random number between 0 and 1.
 */
export function createSeededRandom(seed: number) {
  let state = seed;
  return function() {
    state = (state * 9301 + 49297) % 233280;
    return state / 233280;
  };
}


================================================================================
// APPENDED FROM REPO: diplomat-bit/almost | ORIGINAL PATH: diplomat-bit-almost-93a5466/utils.ts
================================================================================

/**
 * A simple utility for conditionally joining class names together.
 * @param classes A list of strings, which can include falsey values.
 * @returns A single string of space-separated class names.
 */
export const cn = (...classes: (string | undefined | null | false)[]): string => {
  return classes.filter(Boolean).join(' ');
};

/**
 * Creates a seeded random number generator (LCG).
 * This is essential for creating a reproducible simulation.
 * @param seed The initial seed value.
 * @returns A function that returns a pseudo-random number between 0 and 1.
 */
export function createSeededRandom(seed: number) {
  let state = seed;
  return function() {
    state = (state * 9301 + 49297) % 233280;
    return state / 233280;
  };
}


================================================================================
// APPENDED FROM REPO: diplomat-bit/autoomousai | ORIGINAL PATH: diplomat-bit-autoomousai-f4d320c/utils.ts
================================================================================

import { DirNode, FileNode } from './types';

export const getAllFilePaths = (nodes: (DirNode | FileNode)[]): string[] => {
    let paths: string[] = [];
    for (const node of nodes) {
        if (node.type === 'file') {
            paths.push(node.path);
        } else if (node.type === 'dir') {
            paths = paths.concat(getAllFilePaths(node.children));
        }
    }
    return paths;
};

================================================================================
// APPENDED FROM REPO: diplomat-bit/Fuckyou | ORIGINAL PATH: diplomat-bit-Fuckyou-70f83c5/utils.ts
================================================================================

/**
 * A simple utility for conditionally joining class names together.
 * @param classes A list of strings, which can include falsey values.
 * @returns A single string of space-separated class names.
 */
export const cn = (...classes: (string | undefined | null | false)[]): string => {
  return classes.filter(Boolean).join(' ');
};

/**
 * Creates a seeded random number generator (LCG).
 * This is essential for creating a reproducible simulation.
 * @param seed The initial seed value.
 * @returns A function that returns a pseudo-random number between 0 and 1.
 */
export function createSeededRandom(seed: number) {
  let state = seed;
  return function() {
    state = (state * 9301 + 49297) % 233280;
    return state / 233280;
  };
}


================================================================================
// APPENDED FROM REPO: diplomat-bit/jamesburvelocallaghaniiiand | ORIGINAL PATH: diplomat-bit-jamesburvelocallaghaniiiand-9414e97/utils.ts
================================================================================

/**
 * A simple utility for conditionally joining class names together.
 * @param classes A list of strings, which can include falsey values.
 * @returns A single string of space-separated class names.
 */
export const cn = (...classes: (string | undefined | null | false)[]): string => {
  return classes.filter(Boolean).join(' ');
};

/**
 * Creates a seeded random number generator (LCG).
 * This is essential for creating a reproducible simulation.
 * @param seed The initial seed value.
 * @returns A function that returns a pseudo-random number between 0 and 1.
 */
export function createSeededRandom(seed: number) {
  let state = seed;
  return function() {
    state = (state * 9301 + 49297) % 233280;
    return state / 233280;
  };
}


================================================================================
// APPENDED FROM REPO: diplomat-bit/magic | ORIGINAL PATH: diplomat-bit-magic-a3f5ff1/utils.ts
================================================================================

/**
 * A simple utility for conditionally joining class names together.
 * @param classes A list of strings, which can include falsey values.
 * @returns A single string of space-separated class names.
 */
export const cn = (...classes: (string | undefined | null | false)[]): string => {
  return classes.filter(Boolean).join(' ');
};

/**
 * Creates a seeded random number generator (LCG).
 * This is essential for creating a reproducible simulation.
 * @param seed The initial seed value.
 * @returns A function that returns a pseudo-random number between 0 and 1.
 */
export function createSeededRandom(seed: number) {
  let state = seed;
  return function() {
    state = (state * 9301 + 49297) % 233280;
    return state / 233280;
  };
}


================================================================================
// APPENDED FROM REPO: diplomat-bit/usa | ORIGINAL PATH: diplomat-bit-usa-d72fd59/utils.ts
================================================================================

import { DirNode, FileNode } from './types';

export const getAllFilePaths = (nodes: (DirNode | FileNode)[]): string[] => {
    let paths: string[] = [];
    for (const node of nodes) {
        if (node.type === 'file') {
            paths.push(node.path);
        } else if (node.type === 'dir') {
            paths = paths.concat(getAllFilePaths(node.children));
        }
    }
    return paths;
};

export const getRandomElements = <T>(array: T[], count: number): T[] => {
    const shuffled = [...array].sort(() => 0.5 - Math.random());
    return shuffled.slice(0, count);
};