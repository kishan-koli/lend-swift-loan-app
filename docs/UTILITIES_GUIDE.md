# LendSwift Utility Functions Guide

Complete documentation for standalone TypeScript utilities providing image compression and secure storage.

## Overview

Two production-ready utility modules for LendSwift:

1. **Image Compression** - Client-side Canvas-based recursive compression
2. **Secure Storage** - Web Crypto API AES-GCM encryption with auto-save

## 1. Image Compression Utility

### File: `lib/utils/image-compression.ts`

#### Purpose
Compress images client-side to meet file size limits while maintaining quality. Optimized for document uploads (KYC, address proofs) and profile pictures.

#### Key Features

- **Recursive Quality Reduction**: Automatically reduces JPEG quality in iterations
- **Dimension Scaling**: Scales down images exceeding max dimensions
- **Format Support**: JPEG, WebP, PNG with browser capability detection
- **Batch Processing**: Compress multiple files in parallel
- **Compression Results**: Detailed metrics including ratio and compression stats

#### API Reference

### `compressImage(file, options?)`

Compress a single image file.

**Parameters:**
- `file` (File) - Image file to compress
- `options` (CompressionOptions) - Optional configuration

**Options:**
```typescript
interface CompressionOptions {
  targetSizeKB?: number;      // Target file size (default: 100KB)
  maxWidth?: number;           // Max width in pixels (default: 1920)
  maxHeight?: number;          // Max height in pixels (default: 1080)
  initialQuality?: number;     // Initial JPEG quality 0-1 (default: 0.8)
  format?: 'image/jpeg' | 'image/webp' | 'image/png';
}
```

**Returns:**
```typescript
interface CompressionResult {
  blob: Blob;                  // Compressed image blob
  originalSizeKB: number;      // Original file size in KB
  compressedSizeKB: number;    // Compressed file size in KB
  compressionRatio: number;    // Compression ratio (original/compressed)
  width: number;               // Final image width
  height: number;              // Final image height
  quality: number;             // Final quality level used
  format: string;              // Output MIME type
}
```

**Example:**
```typescript
import { compressImage } from '@/lib/utils/image-compression';

const input = document.querySelector('input[type="file"]') as HTMLInputElement;
const file = input.files?.[0];

if (file) {
  const result = await compressImage(file, {
    targetSizeKB: 100,
    maxWidth: 1920,
    format: 'image/jpeg'
  });

  console.log(`Compressed from ${result.originalSizeKB}KB to ${result.compressedSizeKB}KB`);
  console.log(`Ratio: ${result.compressionRatio.toFixed(2)}x`);
  
  // Upload compressed blob
  const formData = new FormData();
  formData.append('image', result.blob, 'image.jpg');
  await fetch('/api/upload', { method: 'POST', body: formData });
}
```

### `compressImageBatch(files, options?)`

Compress multiple images in parallel.

**Parameters:**
- `files` (File[]) - Array of image files
- `options` (CompressionOptions) - Configuration

**Returns:** Promise<CompressionResult[]>

**Example:**
```typescript
const files = Array.from(document.querySelector('input[type="file"]').files);
const results = await compressImageBatch(files, { targetSizeKB: 50 });

results.forEach((result, index) => {
  console.log(`Image ${index + 1}: ${result.compressionRatio.toFixed(2)}x smaller`);
});
```

### `compressionResultToFile(result, fileName)`

Convert compression result to File object for upload.

**Example:**
```typescript
const result = await compressImage(file);
const compressedFile = compressionResultToFile(result, 'kyc-document');

// Now can use with FormData or send to server
const form = new FormData();
form.append('file', compressedFile);
```

### `isFormatSupported(format)`

Check if browser supports a specific image format.

**Example:**
```typescript
const webpSupported = isFormatSupported('image/webp');
const format = webpSupported ? 'image/webp' : 'image/jpeg';
```

#### Use Cases in LendSwift

1. **KYC Document Upload**
   ```typescript
   // Step 3: KYC - Compress government ID before upload
   const { blob } = await compressImage(panImage, { 
     targetSizeKB: 80, 
     maxHeight: 600 
   });
   ```

2. **Address Proof Upload**
   ```typescript
   // Compress address proof document
   const result = await compressImage(addressProof, {
     targetSizeKB: 100,
     format: 'image/jpeg'
   });
   ```

3. **Profile Picture Upload**
   ```typescript
   // Batch compress multiple profile pictures
   const results = await compressImageBatch(pictureFiles, {
     targetSizeKB: 50,
     maxWidth: 800,
     maxHeight: 800
   });
   ```

---

## 2. Secure Storage Utility

### File: `lib/utils/secure-storage.ts`

#### Purpose
Encrypt sensitive form data and auto-save to localStorage with automatic decryption on load.

#### Key Features

- **AES-GCM Encryption**: 256-bit symmetric encryption
- **PBKDF2 Key Derivation**: 100,000 iterations for strong key generation
- **Random Salt & IV**: Unique per encryption for security
- **Auto-Save**: Automatic persistence to localStorage
- **TTL Support**: Optional expiration time for encrypted data
- **Data Compression**: Automatic compression for large payloads
- **Graceful Fallback**: Works with or without Web Crypto API

#### API Reference

### `encryptData(data, password?)`

Encrypt any JSON-serializable data.

**Parameters:**
- `data` (T) - Data to encrypt
- `password` (string) - Encryption password (optional)

**Returns:** Promise<EncryptedData>

**Example:**
```typescript
import { encryptData } from '@/lib/utils/secure-storage';

const formData = {
  personalInfo: { name: 'John', email: 'john@example.com' },
  loanDetails: { amount: 500000, tenure: 12 }
};

const encrypted = await encryptData(formData, 'master-password-123');
console.log(encrypted);
// {
//   ciphertext: "...",
//   salt: "...",
//   iv: "...",
//   algorithm: "AES-GCM-256",
//   timestamp: 1234567890
// }
```

### `decryptData(encrypted, password?)`

Decrypt previously encrypted data.

**Parameters:**
- `encrypted` (EncryptedData) - Encrypted data object
- `password` (string) - Decryption password

**Returns:** Promise<T>

**Example:**
```typescript
import { decryptData } from '@/lib/utils/secure-storage';

const decrypted = await decryptData(encryptedData, 'master-password-123');
console.log(decrypted); // Original data
```

### `saveSecureData(key, data, options?)`

Encrypt and save data to localStorage.

**Parameters:**
- `key` (string) - Storage key
- `data` (T) - Data to save
- `options` (StorageOptions) - Optional configuration

**Options:**
```typescript
interface StorageOptions {
  key?: string;           // Custom password (uses default if not provided)
  compress?: boolean;     // Compress before encryption (default: true)
  autoSave?: boolean;     // Save to localStorage (default: true)
  ttl?: number;           // Time to live in milliseconds
}
```

**Example:**
```typescript
import { saveSecureData } from '@/lib/utils/secure-storage';

// Auto-save with 7-day expiration
await saveSecureData('wizard-step-1', { 
  fullName: 'Alice Johnson',
  email: 'alice@example.com' 
}, {
  key: 'master-password',
  ttl: 7 * 24 * 60 * 60 * 1000  // 7 days
});
```

### `loadSecureData(key, password?)`

Load and decrypt data from localStorage.

**Parameters:**
- `key` (string) - Storage key
- `password` (string) - Decryption password

**Returns:** Promise<T | null>

**Example:**
```typescript
import { loadSecureData } from '@/lib/utils/secure-storage';

const savedData = await loadSecureData('wizard-step-1', 'master-password');
if (savedData) {
  // Use restored data
  restoreFormFields(savedData);
}
```

### `deleteSecureData(key)`

Remove encrypted data from localStorage.

**Example:**
```typescript
deleteSecureData('wizard-step-1');
```

### `hasSecureData(key)`

Check if encrypted data exists.

**Example:**
```typescript
if (hasSecureData('wizard-step-1')) {
  console.log('Saved data available');
}
```

### `getAllSecureDataKeys()`

Get all secure storage keys.

**Returns:** string[]

**Example:**
```typescript
const keys = getAllSecureDataKeys();
console.log(keys); // ['wizard-step-1', 'wizard-step-2', ...]
```

### `clearAllSecureData()`

Remove all encrypted data from localStorage.

**Example:**
```typescript
// Clear all saved wizard data
clearAllSecureData();
```

### `isCryptoAvailable()`

Check if Web Crypto API is available.

**Returns:** boolean

**Example:**
```typescript
if (!isCryptoAvailable()) {
  console.warn('Web Crypto API not available');
  // Fallback to unencrypted storage or disable feature
}
```

#### Use Cases in LendSwift

1. **Auto-save Form Progress**
   ```typescript
   import { useStepStore } from '@/lib/store/step-store';
   import { saveSecureData } from '@/lib/utils/secure-storage';

   export function AutoSaveStep() {
     const { personalInfo } = useStepStore();

     // Auto-save on blur
     const handleBlur = async () => {
       await saveSecureData('step1-personal', personalInfo, {
         key: 'wizard-master-key',
         ttl: 24 * 60 * 60 * 1000 // 24 hours
       });
     };

     return <input onBlur={handleBlur} />;
   }
   ```

2. **Session Recovery**
   ```typescript
   async function restoreWizardProgress() {
     const step1 = await loadSecureData('step1-personal', masterPassword);
     const step3 = await loadSecureData('step3-kyc', masterPassword);
     const step5 = await loadSecureData('step5-employment', masterPassword);

     if (step1) useStepStore.setState({ personalInfo: step1 });
     if (step3) useStepStore.setState({ kycData: step3 });
     if (step5) useStepStore.setState({ employmentInfo: step5 });
   }
   ```

3. **Sensitive Data Protection**
   ```typescript
   // Encrypt KYC data before storage
   await saveSecureData('kyc-data', {
     panNumber: 'XXXXX5678',
     aadharNumber: 'XXXX XXXX 1234',
     verificationStatus: 'verified'
   }, { key: userPassword });
   ```

---

## 3. Encryption Key Management Service

### File: `lib/utils/crypto-key-manager.ts`

#### Purpose
Manage master passwords, validate strength, and handle key rotation.

#### Key Features

- **Key Initialization**: Create and manage master encryption keys
- **Password Validation**: Check password strength (0-5 score)
- **Secure Comparison**: Timing-safe password comparison
- **Key Rotation**: Change encryption password safely
- **Key Metadata**: Track key version and creation/rotation timestamps
- **Password Generation**: Generate cryptographically secure passwords

#### API Reference

### `initializeKey(masterPassword)`

Initialize encryption key with metadata.

**Parameters:**
- `masterPassword` (string) - Master password (min 8 chars)

**Returns:** KeyConfig

**Example:**
```typescript
import { initializeKey } from '@/lib/utils/crypto-key-manager';

const keyConfig = initializeKey('SecurePassword123!');
console.log(keyConfig.metadata.keyId);
```

### `validateMasterPassword(password)`

Verify password against current key.

**Returns:** boolean

**Example:**
```typescript
if (validateMasterPassword(userInput)) {
  console.log('Password correct');
} else {
  console.log('Password incorrect');
}
```

### `validatePasswordStrength(password)`

Check password strength and get feedback.

**Returns:**
```typescript
{
  isValid: boolean;           // At least 4 out of 7 criteria
  score: number;              // 0-5
  feedback: string[];         // Up to 3 suggestions
}
```

**Example:**
```typescript
const strength = validatePasswordStrength('Pass123!');
console.log(`Score: ${strength.score}/5`);
console.log('Feedback:', strength.feedback);
```

### `generateSecurePassword(length?)`

Generate cryptographically secure password.

**Parameters:**
- `length` (number) - Password length (default: 16)

**Returns:** string

**Example:**
```typescript
const password = generateSecurePassword(20);
// "aK9@mL3#pQ2$xR5!nT8"
```

### `rotateKey(oldPassword, newPassword)`

Rotate encryption key to new password.

**Parameters:**
- `oldPassword` (string) - Current password
- `newPassword` (string) - New password

**Returns:** KeyConfig

**Example:**
```typescript
try {
  const newConfig = rotateKey('OldPassword123', 'NewPassword456!');
  console.log(`Key rotated to version ${newConfig.metadata.version}`);
} catch (error) {
  console.error('Key rotation failed:', error);
}
```

### `shouldRotateKey(maxAgeMs?)`

Check if key needs rotation based on age.

**Parameters:**
- `maxAgeMs` (number) - Max key age (default: 90 days)

**Returns:** boolean

**Example:**
```typescript
if (shouldRotateKey()) {
  console.log('Key should be rotated for security');
  // Prompt user to change password
}
```

---

## Security Considerations

### Best Practices

1. **Master Password Management**
   - Use strong passwords (16+ chars, mixed case, numbers, special chars)
   - Never store master password in code or version control
   - Use environment variables for default passwords in development

2. **Key Rotation**
   - Rotate keys every 90 days in production
   - Implement key versioning for backward compatibility
   - Keep audit logs of key rotations

3. **Data Protection**
   - Always use HTTPS in production
   - Clear sensitive data from memory when not needed
   - Use TTL for temporary data

4. **Browser Support**
   - Check `isCryptoAvailable()` before using encryption
   - Provide graceful fallback for older browsers
   - Test on target browsers

### Encryption Details

- **Algorithm**: AES-GCM (256-bit keys)
- **Key Derivation**: PBKDF2 with SHA-256
- **Iterations**: 100,000 (mitigates brute-force attacks)
- **IV Length**: 12 bytes (96 bits for GCM)
- **Salt Length**: 16 bytes (128 bits)
- **Authentication**: Built-in GCM authentication tag

---

## Integration Examples

### Complete Auto-Save Wizard Step

```typescript
import React, { useEffect } from 'react';
import { useStepStore } from '@/lib/store/step-store';
import { saveSecureData, loadSecureData } from '@/lib/utils/secure-storage';
import { initializeKey } from '@/lib/utils/crypto-key-manager';

export function WizardStep1() {
  const { personalInfo, updatePersonalInfo } = useStepStore();
  const masterPassword = 'wizard-master-key-123';

  // Initialize encryption on mount
  useEffect(() => {
    initializeKey(masterPassword);
  }, []);

  // Auto-save on data change
  useEffect(() => {
    const saveTimer = setTimeout(() => {
      if (personalInfo.fullName || personalInfo.email) {
        saveSecureData('step1-data', personalInfo, {
          key: masterPassword,
          ttl: 24 * 60 * 60 * 1000
        });
      }
    }, 1000);

    return () => clearTimeout(saveTimer);
  }, [personalInfo]);

  // Restore on mount
  useEffect(() => {
    loadSecureData('step1-data', masterPassword).then((data) => {
      if (data) {
        updatePersonalInfo(data);
      }
    });
  }, []);

  return (
    <div>
      <input
        value={personalInfo.fullName}
        onChange={(e) =>
          updatePersonalInfo({ fullName: e.target.value })
        }
        placeholder="Full Name"
      />
    </div>
  );
}
```

### Complete Image Compression Upload

```typescript
import { compressImage } from '@/lib/utils/image-compression';

async function handleKYCUpload(file: File) {
  try {
    // Compress image
    const result = await compressImage(file, {
      targetSizeKB: 80,
      maxWidth: 1200,
      format: 'image/jpeg'
    });

    console.log(
      `Compressed: ${result.originalSizeKB.toFixed(2)}KB → ` +
      `${result.compressedSizeKB.toFixed(2)}KB (${result.compressionRatio.toFixed(2)}x)`
    );

    // Upload compressed image
    const formData = new FormData();
    formData.append('document', result.blob, 'kyc-document.jpg');

    const response = await fetch('/api/upload/kyc', {
      method: 'POST',
      body: formData
    });

    if (!response.ok) throw new Error('Upload failed');

    console.log('KYC document uploaded successfully');
  } catch (error) {
    console.error('KYC upload failed:', error);
  }
}
```

---

## Demo Page

Visit `/utilities` to see interactive demonstrations of both utilities with:
- Real-time image compression with metrics
- Secure data encryption and decryption
- Password strength validation
- Local storage persistence

---

## Environment Variables

Add to `.env.local`:

```env
# Optional: Custom default password (use strong password in production)
NEXT_PUBLIC_STORAGE_PASSWORD=your-secure-password-here
```

---

## Performance Notes

- Image compression runs entirely client-side (no server roundtrip)
- Encryption operations take ~500ms for typical form data
- Batch compression processes images in parallel
- localStorage limits typically 5-10MB per domain

## Browser Compatibility

- **Image Compression**: All modern browsers
- **Web Crypto API**: Chrome 37+, Firefox 34+, Safari 11+, Edge 79+
- **Fallback**: Gracefully degrade for older browsers

