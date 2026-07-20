/**
 * LendSwift Encryption Key Management Service
 * Manages master passwords and key derivation for secure storage
 * Provides key rotation, validation, and secure key handling
 */

export interface KeyMetadata {
  keyId: string; // Unique key identifier
  createdAt: number; // Timestamp when key was created
  rotatedAt: number; // Last rotation timestamp
  version: number; // Key version for rotation tracking
  algorithm: string; // Key derivation algorithm
  isActive: boolean; // Whether key is currently active
}

export interface KeyConfig {
  masterPassword: string; // Master encryption password
  metadata: KeyMetadata;
}

// In-memory key store (in production, use secure session/server-side storage)
let currentKeyConfig: KeyConfig | null = null;

/**
 * Initialize encryption key with metadata
 * @param masterPassword - Master encryption password
 * @returns Key configuration with metadata
 */
export function initializeKey(masterPassword: string): KeyConfig {
  if (!masterPassword || masterPassword.length < 8) {
    throw new Error('Master password must be at least 8 characters long');
  }

  const keyId = generateKeyId();
  const now = Date.now();

  const keyConfig: KeyConfig = {
    masterPassword,
    metadata: {
      keyId,
      createdAt: now,
      rotatedAt: now,
      version: 1,
      algorithm: 'PBKDF2-SHA256',
      isActive: true,
    },
  };

  currentKeyConfig = keyConfig;
  return keyConfig;
}

/**
 * Set active encryption key
 * @param masterPassword - Master encryption password
 * @returns True if key was set successfully
 */
export function setActiveKey(masterPassword: string): boolean {
  try {
    const keyConfig = initializeKey(masterPassword);
    currentKeyConfig = keyConfig;
    return true;
  } catch {
    return false;
  }
}

/**
 * Get current active key
 * @returns Current key configuration or null
 */
export function getActiveKey(): KeyConfig | null {
  return currentKeyConfig;
}

/**
 * Get current master password
 * @returns Master password if key is initialized
 */
export function getMasterPassword(): string | null {
  return currentKeyConfig?.masterPassword || null;
}

/**
 * Validate master password against current key
 * @param password - Password to validate
 * @returns True if password matches active key
 */
export function validateMasterPassword(password: string): boolean {
  if (!currentKeyConfig) {
    return false;
  }

  return secureStringCompare(password, currentKeyConfig.masterPassword);
}

/**
 * Rotate encryption key to new password
 * @param oldPassword - Current master password
 * @param newPassword - New master password
 * @returns Updated key configuration
 */
export function rotateKey(oldPassword: string, newPassword: string): KeyConfig {
  if (!validateMasterPassword(oldPassword)) {
    throw new Error('Invalid current master password');
  }

  if (!newPassword || newPassword.length < 8) {
    throw new Error('New password must be at least 8 characters long');
  }

  if (oldPassword === newPassword) {
    throw new Error('New password must be different from current password');
  }

  if (!currentKeyConfig) {
    throw new Error('No active key to rotate');
  }

  const updatedConfig: KeyConfig = {
    masterPassword: newPassword,
    metadata: {
      ...currentKeyConfig.metadata,
      version: currentKeyConfig.metadata.version + 1,
      rotatedAt: Date.now(),
    },
  };

  currentKeyConfig = updatedConfig;
  return updatedConfig;
}

/**
 * Get key metadata
 * @returns Key metadata if key exists
 */
export function getKeyMetadata(): KeyMetadata | null {
  return currentKeyConfig?.metadata || null;
}

/**
 * Check if key is initialized
 * @returns True if master key is set
 */
export function isKeyInitialized(): boolean {
  return currentKeyConfig !== null;
}

/**
 * Clear current encryption key from memory
 * Use with caution - data will not be recoverable without password
 */
export function clearKey(): void {
  currentKeyConfig = null;
}

/**
 * Generate unique key identifier
 * @returns Unique key ID
 */
function generateKeyId(): string {
  return `key_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
}

/**
 * Secure string comparison (timing-safe)
 * Prevents timing attacks on password comparison
 * @param str1 - First string
 * @param str2 - Second string
 * @returns True if strings are equal
 */
function secureStringCompare(str1: string, str2: string): boolean {
  if (str1.length !== str2.length) {
    return false;
  }

  let result = 0;
  for (let i = 0; i < str1.length; i++) {
    result |= str1.charCodeAt(i) ^ str2.charCodeAt(i);
  }

  return result === 0;
}

/**
 * Validate password strength
 * @param password - Password to validate
 * @returns Object with validation results
 */
export function validatePasswordStrength(password: string): {
  isValid: boolean;
  score: number; // 0-5
  feedback: string[];
} {
  const feedback: string[] = [];
  let score = 0;

  if (password.length >= 8) score++;
  else feedback.push('Password should be at least 8 characters');

  if (password.length >= 12) score++;
  if (password.length >= 16) score++;

  if (/[a-z]/.test(password)) score++;
  else feedback.push('Include lowercase letters');

  if (/[A-Z]/.test(password)) score++;
  else feedback.push('Include uppercase letters');

  if (/\d/.test(password)) score++;
  else feedback.push('Include numbers');

  if (/[!@#$%^&*]/.test(password)) score++;
  else feedback.push('Include special characters');

  return {
    isValid: score >= 4,
    score: Math.min(score, 5),
    feedback: feedback.slice(0, 3), // Only top 3 feedback items
  };
}

/**
 * Generate secure random password
 * @param length - Password length (default: 16)
 * @returns Generated password
 */
export function generateSecurePassword(length: number = 16): string {
  const chars = {
    lowercase: 'abcdefghijklmnopqrstuvwxyz',
    uppercase: 'ABCDEFGHIJKLMNOPQRSTUVWXYZ',
    digits: '0123456789',
    special: '!@#$%^&*_+-=[]{}|;:,.<>?',
  };

  const allChars = chars.lowercase + chars.uppercase + chars.digits + chars.special;
  let password = '';

  // Ensure at least one char from each category
  password += chars.lowercase[Math.floor(Math.random() * chars.lowercase.length)];
  password += chars.uppercase[Math.floor(Math.random() * chars.uppercase.length)];
  password += chars.digits[Math.floor(Math.random() * chars.digits.length)];
  password += chars.special[Math.floor(Math.random() * chars.special.length)];

  // Fill rest randomly
  for (let i = password.length; i < length; i++) {
    password += allChars[Math.floor(Math.random() * allChars.length)];
  }

  // Shuffle password
  return password.split('').sort(() => Math.random() - 0.5).join('');
}

/**
 * Hash password for verification (one-way)
 * Use for password verification without storing plain password
 * @param password - Password to hash
 * @returns Promise with hashed password
 */
export async function hashPassword(password: string): Promise<string> {
  const encoder = new TextEncoder();
  const data = encoder.encode(password);
  const hashBuffer = await crypto.subtle.digest('SHA-256', data);

  // Convert to hex string
  const hashArray = Array.from(new Uint8Array(hashBuffer));
  return hashArray.map((b) => b.toString(16).padStart(2, '0')).join('');
}

/**
 * Verify password against hash
 * @param password - Password to verify
 * @param hash - Hash to compare against
 * @returns Promise with verification result
 */
export async function verifyPasswordHash(password: string, hash: string): Promise<boolean> {
  const passwordHash = await hashPassword(password);
  return secureStringCompare(passwordHash, hash);
}

/**
 * Get key age in milliseconds
 * @returns Age of current key
 */
export function getKeyAge(): number | null {
  if (!currentKeyConfig) {
    return null;
  }

  return Date.now() - currentKeyConfig.metadata.createdAt;
}

/**
 * Check if key needs rotation based on age
 * @param maxAgeMs - Maximum key age in milliseconds (default: 90 days)
 * @returns True if key should be rotated
 */
export function shouldRotateKey(maxAgeMs: number = 90 * 24 * 60 * 60 * 1000): boolean {
  const age = getKeyAge();
  return age !== null && age > maxAgeMs;
}
