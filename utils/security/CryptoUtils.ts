// REPOSITORY SOURCE: diplomat-bit/Citibank_Demo_Business_Inc_Demonstration- | PATH: diplomat-bit-Citibank_Demo_Business_Inc_Demonstration--ab2501d/utils/security/CryptoUtils.ts
================================================================================

```typescript
// utils/security/CryptoUtils.ts

/**
 * @file CryptoUtils.ts
 * @description comprehensive suite of cryptographic utilities designed for high-security environments.
 * Leveraging the Web Crypto API for non-blocking, hardware-accelerated cryptographic operations.
 * Includes primitives for hashing, encryption, entropy generation, and secure storage management.
 */

// Configuration constants for cryptographic operations
const ENCRYPTION_ALGORITHM = 'AES-GCM';
const HASH_ALGORITHM = 'SHA-256';
const KEY_DERIVATION_ALGORITHM = 'PBKDF2';
const KEY_LENGTH_BITS = 256;
const SALT_LENGTH_BYTES = 16;
const IV_LENGTH_BYTES = 12;
const PBKDF2_ITERATIONS = 100000;

/**
 * Interface for Encrypted Payload structure
 */
interface EncryptedPayload {
  cipherText: string; // Base64 encoded
  iv: string;         // Base64 encoded
  salt: string;       // Base64 encoded
}

/**
 * Utility class for converting between ArrayBuffers and Strings (Hex/Base64)
 */
class BufferUtils {
  /**
   * Converts an ArrayBuffer to a Hex string
   */
  static bufferToHex(buffer: ArrayBuffer): string {
    return Array.from(new Uint8Array(buffer))
      .map((b) => b.toString(16).padStart(2, '0'))
      .join('');
  }

  /**
   * Converts a Hex string to an ArrayBuffer
   */
  static hexToBuffer(hex: string): ArrayBuffer {
    const tokens = hex.match(/.{1,2}/g);
    if (!tokens) return new ArrayBuffer(0);
    return new Uint8Array(tokens.map((byte) => parseInt(byte, 16))).buffer;
  }

  /**
   * Converts an ArrayBuffer to a Base64 string
   */
  static bufferToBase64(buffer: ArrayBuffer): string {
    let binary = '';
    const bytes = new Uint8Array(buffer);
    const len = bytes.byteLength;
    for (let i = 0; i < len; i++) {
      binary += String.fromCharCode(bytes[i]);
    }
    return window.btoa(binary);
  }

  /**
   * Converts a Base64 string to an ArrayBuffer
   */
  static base64ToBuffer(base64: string): ArrayBuffer {
    const binaryString = window.atob(base64);
    const len = binaryString.length;
    const bytes = new Uint8Array(len);
    for (let i = 0; i < len; i++) {
      bytes[i] = binaryString.charCodeAt(i);
    }
    return bytes.buffer;
  }

  /**
   * Converts a string to an ArrayBuffer using UTF-8 encoding
   */
  static stringToBuffer(str: string): ArrayBuffer {
    const encoder = new TextEncoder();
    return encoder.encode(str).buffer;
  }

  /**
   * Converts an ArrayBuffer to a string using UTF-8 decoding
   */
  static bufferToString(buffer: ArrayBuffer): string {
    const decoder = new TextDecoder();
    return decoder.decode(buffer);
  }
}

/**
 * Core Cryptographic Services
 */
export class CryptoUtils {
  /**
   * Generates a cryptographically strong random UUID (v4-like)
   * Uses Web Crypto API for entropy.
   */
  static generateUUID(): string {
    if (typeof crypto !== 'undefined' && crypto.randomUUID) {
      return crypto.randomUUID();
    }
    // Fallback for environments where randomUUID is not directly exposed
    const rnds = new Uint8Array(16);
    crypto.getRandomValues(rnds);

    // Per 4.4, set bits for version and `clock_seq_hi_and_reserved`
    rnds[6] = (rnds[6] & 0x0f) | 0x40;
    rnds[8] = (rnds[8] & 0x3f) | 0x80;

    return [...rnds]
      .map((b, i) => {
        const hex = b.toString(16).padStart(2, '0');
        return [4, 6, 8, 10].includes(i) ? `-${hex}` : hex;
      })
      .join('');
  }

  /**
   * Generates a secure random string of specified length
   */
  static generateNonce(length: number = 32): string {
    const array = new Uint8Array(length);
    crypto.getRandomValues(array);
    return BufferUtils.bufferToHex(array.buffer);
  }

  /**
   * Computes SHA-256 hash of a given string input
   * @param data - The plaintext string to hash
   * @returns Promise resolving to the hex string of the hash
   */
  static async hashString(data: string): Promise<string> {
    const buffer = BufferUtils.stringToBuffer(data);
    const hashBuffer = await crypto.subtle.digest(HASH_ALGORITHM, buffer);
    return BufferUtils.bufferToHex(hashBuffer);
  }

  /**
   * Verifies if a plain text matches a given hash
   */
  static async verifyHash(plainText: string, hash: string): Promise<boolean> {
    const computedHash = await this.hashString(plainText);
    return computedHash === hash;
  }

  /**
   * Derives a cryptographic key from a password and salt using PBKDF2
   */
  private static async deriveKey(password: string, salt: Uint8Array): Promise<CryptoKey> {
    const keyMaterial = await crypto.subtle.importKey(
      'raw',
      BufferUtils.stringToBuffer(password),
      { name: KEY_DERIVATION_ALGORITHM },
      false,
      ['deriveBits', 'deriveKey']
    );

    return crypto.subtle.deriveKey(
      {
        name: KEY_DERIVATION_ALGORITHM,
        salt: salt,
        iterations: PBKDF2_ITERATIONS,
        hash: HASH_ALGORITHM,
      },
      keyMaterial,
      { name: ENCRYPTION_ALGORITHM, length: KEY_LENGTH_BITS },
      false,
      ['encrypt', 'decrypt']
    );
  }

  /**
   * Encrypts sensitive data using AES-GCM
   * Generates a random salt and IV for each encryption operation.
   * @param plainText The data to encrypt
   * @param secretKey The secret key/passphrase used for derivation
   */
  static async encryptData(plainText: string, secretKey: string): Promise<EncryptedPayload> {
    try {
      const salt = crypto.getRandomValues(new Uint8Array(SALT_LENGTH_BYTES));
      const iv = crypto.getRandomValues(new Uint8Array(IV_LENGTH_BYTES));
      
      const key = await this.deriveKey(secretKey, salt);
      const encodedData = BufferUtils.stringToBuffer(plainText);

      const cipherBuffer = await crypto.subtle.encrypt(
        {
          name: ENCRYPTION_ALGORITHM,
          iv: iv,
        },
        key,
        encodedData
      );

      return {
        cipherText: BufferUtils.bufferToBase64(cipherBuffer),
        iv: BufferUtils.bufferToBase64(iv.buffer),
        salt: BufferUtils.bufferToBase64(salt.buffer),
      };
    } catch (error) {
      console.error('Encryption failed:', error);
      throw new Error('Security Error: Failed to encrypt data.');
    }
  }

  /**
   * Decrypts an encrypted payload using AES-GCM
   * @param payload The encrypted payload object
   * @param secretKey The secret key/passphrase used for derivation
   */
  static async decryptData(payload: EncryptedPayload, secretKey: string): Promise<string> {
    try {
      const salt = new Uint8Array(BufferUtils.base64ToBuffer(payload.salt));
      const iv = new Uint8Array(BufferUtils.base64ToBuffer(payload.iv));
      const cipherData = BufferUtils.base64ToBuffer(payload.cipherText);

      const key = await this.deriveKey(secretKey, salt);

      const decryptedBuffer = await crypto.subtle.decrypt(
        {
          name: ENCRYPTION_ALGORITHM,
          iv: iv,
        },
        key,
        cipherData
      );

      return BufferUtils.bufferToString(decryptedBuffer);
    } catch (error) {
      console.error('Decryption failed:', error);
      throw new Error('Security Error: Failed to decrypt data or invalid key.');
    }
  }

  /**
   * Generates a HMAC signature for a payload
   * Useful for API request signing simulation
   */
  static async generateHMAC(payload: string, secret: string): Promise<string> {
    const enc = new TextEncoder();
    const key = await crypto.subtle.importKey(
      'raw',
      enc.encode(secret),
      { name: 'HMAC', hash: 'SHA-256' },
      false,
      ['sign']
    );

    const signature = await crypto.subtle.sign(
      'HMAC',
      key,
      enc.encode(payload)
    );

    return BufferUtils.bufferToHex(signature);
  }
}

/**
 * Secure Storage Manager
 * Wraps localStorage/sessionStorage with automatic AES encryption.
 * This ensures that even if XSS occurs (to an extent) or physical access is gained,
 * data in LocalStorage is not plain text.
 * Note: The master key should ideally not be stored in LocalStorage alongside the data.
 * For this simulation, we assume the master key is held in memory or derived from user input.
 */
export class SecureStorage {
  private storageType: Storage;
  private encryptionKey: string;

  /**
   * @param type - 'local' or 'session'
   * @param sessionEncryptionKey - A high-entropy key associated with the user session. 
   * In a real app, this might come from a closure created after login, not stored permanently.
   */
  constructor(type: 'local' | 'session' = 'local', sessionEncryptionKey: string) {
    this.storageType = type === 'local' ? localStorage : sessionStorage;
    this.encryptionKey = sessionEncryptionKey;
  }

  /**
   * Securely saves an item to storage
   */
  async setItem(key: string, value: any): Promise<void> {
    try {
      const stringValue = JSON.stringify(value);
      const encrypted = await CryptoUtils.encryptData(stringValue, this.encryptionKey);
      // We store the encrypted object as a JSON string containing iv, salt, and ciphertext
      this.storageType.setItem(key, JSON.stringify(encrypted));
    } catch (e) {
      console.error(`SecureStorage Error: Could not set item ${key}`, e);
    }
  }

  /**
   * Securely retrieves an item from storage
   */
  async getItem<T>(key: string): Promise<T | null> {
    try {
      const storedItem = this.storageType.getItem(key);
      if (!storedItem) return null;

      const encryptedPayload: EncryptedPayload = JSON.parse(storedItem);
      const decryptedString = await CryptoUtils.decryptData(encryptedPayload, this.encryptionKey);
      
      return JSON.parse(decryptedString) as T;
    } catch (e) {
      console.error(`SecureStorage Error: Could not get item ${key}`, e);
      return null;
    }
  }

  /**
   * Removes an item from storage
   */
  removeItem(key: string): void {
    this.storageType.removeItem(key);
  }

  /**
   * Clears all items in storage
   */
  clear(): void {
    this.storageType.clear();
  }
}

/**
 * JWT Utility Functions
 * Helper functions to parse and inspect JWTs without validation (validation should happen server-side or via crypto signature check).
 */
export class JWTUtils {
  /**
   * Decodes a JWT token to get the payload
   * Warning: This does not verify the signature.
   */
  static decodeToken(token: string): any {
    try {
      const parts = token.split('.');
      if (parts.length !== 3) {
        throw new Error('Invalid JWT format');
      }
      const payload = parts[1];
      const decoded = window.atob(payload.replace(/-/g, '+').replace(/_/g, '/'));
      return JSON.parse(decoded);
    } catch (e) {
      console.error('Failed to decode JWT', e);
      return null;
    }
  }

  /**
   * Checks if a JWT token is expired
   */
  static isTokenExpired(token: string): boolean {
    const decoded = this.decodeToken(token);
    if (!decoded || !decoded.exp) {
      return true; // Assume expired if invalid
    }
    const currentTime = Date.now() / 1000;
    return decoded.exp < currentTime;
  }
}

/**
 * Password Strength Estimator
 * Basic heuristic to determine password complexity for UI feedback.
 */
export const evaluatePasswordStrength = (password: string): { score: number; feedback: string[] } => {
  let score = 0;
  const feedback: string[] = [];

  if (password.length > 8) score += 20;
  if (password.length > 12) score += 20;
  
  if (/[A-Z]/.test(password)) score += 15;
  else feedback.push('Add uppercase letters');

  if (/[a-z]/.test(password)) score += 15;
  else feedback.push('Add lowercase letters');

  if (/[0-9]/.test(password)) score += 15;
  else feedback.push('Add numbers');

  if (/[^A-Za-z0-9]/.test(password)) score += 15;
  else feedback.push('Add special characters');

  return { score: Math.min(score, 100), feedback };
};
```