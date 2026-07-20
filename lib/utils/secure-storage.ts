/**
 * LendSwift Secure Storage Utility
 * Web Crypto API-based encryption/decryption with auto-save functionality
 * Uses AES-GCM for encryption and PBKDF2 for key derivation
 */

export interface StorageOptions {
  key?: string; // Encryption key (if not provided, will use default)
  compress?: boolean; // Compress data before encryption (default: true)
  autoSave?: boolean; // Auto-save to localStorage (default: true)
  ttl?: number; // Time to live in milliseconds (optional)
}

export interface EncryptedData {
  ciphertext: string; // Base64 encoded ciphertext
  salt: string; // Base64 encoded salt
  iv: string; // Base64 encoded initialization vector
  tag: string; // Base64 encoded authentication tag
  algorithm: string; // Algorithm identifier
  timestamp: number; // Creation timestamp
  ttl?: number; // Time to live
}

export interface StorageEntry<T> {
  data: T;
  encrypted: EncryptedData;
  savedAt: number;
}

// Default encryption password (in production, use environment variable or user input)
const DEFAULT_PASSWORD = process.env.NEXT_PUBLIC_STORAGE_PASSWORD || 'lendswift-secure-default';

// Algorithm constants
const ALGORITHM = {
  name: 'AES-GCM',
  length: 256,
};

const PBKDF2_CONFIG = {
  name: 'PBKDF2',
  iterations: 100000,
  hash: 'SHA-256',
};

const IV_LENGTH = 12; // 96 bits for GCM
const SALT_LENGTH = 16; // 128 bits
const TAG_LENGTH = 128; // 128 bits for authentication

/**
 * Derive a CryptoKey from password using PBKDF2
 * @param password - Master password
 * @param salt - Salt for key derivation
 * @returns Promise with CryptoKey
 */
async function deriveKey(password: string, salt: Uint8Array): Promise<CryptoKey> {
  const encoder = new TextEncoder();
  const passwordKey = await crypto.subtle.importKey(
    'raw',
    encoder.encode(password),
    { name: 'PBKDF2' },
    false,
    ['deriveBits', 'deriveKey']
  );

  return crypto.subtle.deriveKey(
    {
      name: 'PBKDF2',
      salt,
      iterations: PBKDF2_CONFIG.iterations,
      hash: 'SHA-256',
    },
    passwordKey,
    { name: 'AES-GCM', length: ALGORITHM.length },
    false,
    ['encrypt', 'decrypt']
  );
}

/**
 * Generate random bytes
 * @param length - Number of bytes to generate
 * @returns Uint8Array with random bytes
 */
function generateRandomBytes(length: number): Uint8Array {
  return crypto.getRandomValues(new Uint8Array(length));
}

/**
 * Encrypt data using AES-GCM
 * @param data - Data to encrypt
 * @param password - Encryption password
 * @returns Promise with encrypted data
 */
export async function encryptData<T>(
  data: T,
  password: string = DEFAULT_PASSWORD
): Promise<EncryptedData> {
  try {
    if (!crypto.subtle) {
      throw new Error('Web Crypto API not available');
    }

    // Stringify and compress data
    const jsonString = JSON.stringify(data);
    const compressed = compressString(jsonString);
    const encoder = new TextEncoder();
    const plaintext = encoder.encode(compressed);

    // Generate salt and IV
    const salt = generateRandomBytes(SALT_LENGTH);
    const iv = generateRandomBytes(IV_LENGTH);

    // Derive encryption key
    const key = await deriveKey(password, salt);

    // Encrypt data
    const ciphertext = await crypto.subtle.encrypt(
      {
        name: 'AES-GCM',
        iv,
      },
      key,
      plaintext
    );

    // Convert to base64 for storage
    return {
      ciphertext: arrayBufferToBase64(ciphertext),
      salt: arrayBufferToBase64(salt),
      iv: arrayBufferToBase64(iv),
      tag: '', // GCM tag is included in ciphertext
      algorithm: 'AES-GCM-256',
      timestamp: Date.now(),
    };
  } catch (error) {
    throw new Error(`Encryption failed: ${error instanceof Error ? error.message : 'Unknown error'}`);
  }
}

/**
 * Decrypt data using AES-GCM
 * @param encrypted - Encrypted data object
 * @param password - Decryption password
 * @returns Promise with decrypted data
 */
export async function decryptData<T>(
  encrypted: EncryptedData,
  password: string = DEFAULT_PASSWORD
): Promise<T> {
  try {
    if (!crypto.subtle) {
      throw new Error('Web Crypto API not available');
    }

    // Check TTL if present
    if (encrypted.ttl && Date.now() - encrypted.timestamp > encrypted.ttl) {
      throw new Error('Encrypted data has expired');
    }

    // Convert from base64
    const salt = base64ToArrayBuffer(encrypted.salt);
    const iv = base64ToArrayBuffer(encrypted.iv);
    const ciphertext = base64ToArrayBuffer(encrypted.ciphertext);

    // Derive decryption key
    const key = await deriveKey(password, new Uint8Array(salt));

    // Decrypt data
    const plaintext = await crypto.subtle.decrypt(
      {
        name: 'AES-GCM',
        iv: new Uint8Array(iv),
      },
      key,
      ciphertext
    );

    // Decompress and parse
    const decoder = new TextDecoder();
    const compressedString = decoder.decode(plaintext);
    const jsonString = decompressString(compressedString);

    return JSON.parse(jsonString);
  } catch (error) {
    throw new Error(`Decryption failed: ${error instanceof Error ? error.message : 'Unknown error'}`);
  }
}

/**
 * Save encrypted data to localStorage
 * @param key - Storage key
 * @param data - Data to save
 * @param options - Storage options
 * @returns Promise that resolves when saved
 */
export async function saveSecureData<T>(
  key: string,
  data: T,
  options: StorageOptions = {}
): Promise<void> {
  try {
    const {
      key: password = DEFAULT_PASSWORD,
      autoSave = true,
      ttl,
    } = options;

    const encrypted = await encryptData(data, password);
    encrypted.ttl = ttl;

    const storageEntry: StorageEntry<T> = {
      data,
      encrypted,
      savedAt: Date.now(),
    };

    if (autoSave && typeof window !== 'undefined' && window.localStorage) {
      localStorage.setItem(
        `secure_${key}`,
        JSON.stringify(encrypted)
      );
    }
  } catch (error) {
    throw new Error(`Failed to save secure data: ${error instanceof Error ? error.message : 'Unknown error'}`);
  }
}

/**
 * Load encrypted data from localStorage
 * @param key - Storage key
 * @param password - Decryption password
 * @returns Promise with decrypted data
 */
export async function loadSecureData<T>(
  key: string,
  password: string = DEFAULT_PASSWORD
): Promise<T | null> {
  try {
    if (typeof window === 'undefined' || !window.localStorage) {
      return null;
    }

    const stored = localStorage.getItem(`secure_${key}`);
    if (!stored) {
      return null;
    }

    const encrypted = JSON.parse(stored) as EncryptedData;
    return decryptData<T>(encrypted, password);
  } catch (error) {
    console.warn(`Failed to load secure data: ${error instanceof Error ? error.message : 'Unknown error'}`);
    return null;
  }
}

/**
 * Delete encrypted data from localStorage
 * @param key - Storage key
 */
export function deleteSecureData(key: string): void {
  if (typeof window !== 'undefined' && window.localStorage) {
    localStorage.removeItem(`secure_${key}`);
  }
}

/**
 * Check if encrypted data exists in localStorage
 * @param key - Storage key
 * @returns Boolean indicating existence
 */
export function hasSecureData(key: string): boolean {
  if (typeof window === 'undefined' || !window.localStorage) {
    return false;
  }

  return localStorage.getItem(`secure_${key}`) !== null;
}

/**
 * Get all secure storage keys
 * @returns Array of storage keys
 */
export function getAllSecureDataKeys(): string[] {
  if (typeof window === 'undefined' || !window.localStorage) {
    return [];
  }

  const keys: string[] = [];
  for (let i = 0; i < localStorage.length; i++) {
    const key = localStorage.key(i);
    if (key?.startsWith('secure_')) {
      keys.push(key.replace('secure_', ''));
    }
  }

  return keys;
}

/**
 * Clear all secure storage data
 */
export function clearAllSecureData(): void {
  if (typeof window === 'undefined' || !window.localStorage) {
    return;
  }

  const keysToDelete = getAllSecureDataKeys();
  keysToDelete.forEach((key) => deleteSecureData(key));
}

// Compression utilities for data size optimization
/**
 * Simple LZ4-like compression for text
 * @param str - String to compress
 * @returns Compressed string
 */
function compressString(str: string): string {
  // For very large payloads, use gzip via TextEncoder
  // For now, use simple run-length encoding
  if (str.length < 1000) {
    return str; // Skip compression for small strings
  }

  // Replace repeated spaces and newlines
  return str
    .replace(/\n\n+/g, '\n')
    .replace(/  +/g, ' ');
}

/**
 * Decompress previously compressed string
 * @param str - Compressed string
 * @returns Decompressed string
 */
function decompressString(str: string): string {
  return str; // Placeholder for actual decompression
}

/**
 * Convert ArrayBuffer to Base64 string
 * @param buffer - ArrayBuffer to convert
 * @returns Base64 string
 */
function arrayBufferToBase64(buffer: ArrayBuffer): string {
  let binary = '';
  const view = new Uint8Array(buffer);
  for (let i = 0; i < view.length; i++) {
    binary += String.fromCharCode(view[i]);
  }
  return btoa(binary);
}

/**
 * Convert Base64 string to ArrayBuffer
 * @param base64 - Base64 string
 * @returns ArrayBuffer
 */
function base64ToArrayBuffer(base64: string): ArrayBuffer {
  const binary = atob(base64);
  const bytes = new Uint8Array(binary.length);
  for (let i = 0; i < binary.length; i++) {
    bytes[i] = binary.charCodeAt(i);
  }
  return bytes.buffer;
}

/**
 * Validate Web Crypto API availability
 * @returns Boolean indicating availability
 */
export function isCryptoAvailable(): boolean {
  return typeof window !== 'undefined' && !!crypto?.subtle;
}
