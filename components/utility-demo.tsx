/**
 * LendSwift Utility Functions Demo Component
 * Shows integration of image compression and secure storage utilities
 */

'use client';

import React, { useState, useRef } from 'react';
import { Button } from '@/components/ui/button';
import { FormInput } from '@/components/form-input';
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from '@/components/card';
import { compressImage, type CompressionResult } from '@/lib/utils/image-compression';
import {
  encryptData,
  decryptData,
  saveSecureData,
  loadSecureData,
  deleteSecureData,
  isCryptoAvailable,
} from '@/lib/utils/secure-storage';
import {
  initializeKey,
  validateMasterPassword,
  validatePasswordStrength,
  generateSecurePassword,
} from '@/lib/utils/crypto-key-manager';
import { AlertCircle, CheckCircle, Image as ImageIcon, Lock, Unlock } from 'lucide-react';

export function UtilityDemo() {
  const [tab, setTab] = useState<'image' | 'storage'>('image');
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Image compression state
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [compressionResult, setCompressionResult] = useState<CompressionResult | null>(null);
  const [isCompressing, setIsCompressing] = useState(false);
  const [compressionError, setCompressionError] = useState<string>('');

  // Secure storage state
  const [masterPassword, setMasterPassword] = useState('');
  const [dataToEncrypt, setDataToEncrypt] = useState('');
  const [encryptedData, setEncryptedData] = useState<string>('');
  const [decryptedData, setDecryptedData] = useState('');
  const [isEncrypting, setIsEncrypting] = useState(false);
  const [storageError, setStorageError] = useState<string>('');
  const [passwordStrength, setPasswordStrength] = useState({ score: 0, feedback: [] as string[] });

  const cryptoAvailable = isCryptoAvailable();

  // Image Compression Handlers
  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setSelectedFile(file);
      setCompressionError('');
    }
  };

  const handleCompress = async () => {
    if (!selectedFile) {
      setCompressionError('Please select an image first');
      return;
    }

    try {
      setIsCompressing(true);
      setCompressionError('');

      const result = await compressImage(selectedFile, {
        targetSizeKB: 100,
        maxWidth: 1920,
        maxHeight: 1080,
        format: 'image/jpeg',
      });

      setCompressionResult(result);
    } catch (error) {
      setCompressionError(error instanceof Error ? error.message : 'Compression failed');
    } finally {
      setIsCompressing(false);
    }
  };

  const handleDownloadCompressed = () => {
    if (!compressionResult) return;

    const url = URL.createObjectURL(compressionResult.blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `compressed_image.jpg`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  // Secure Storage Handlers
  const handleInitializeKey = () => {
    try {
      if (!masterPassword || masterPassword.length < 8) {
        setStorageError('Password must be at least 8 characters');
        return;
      }

      initializeKey(masterPassword);
      setStorageError('');
    } catch (error) {
      setStorageError(error instanceof Error ? error.message : 'Initialization failed');
    }
  };

  const handleEncryptAndSave = async () => {
    try {
      if (!masterPassword) {
        setStorageError('Please initialize key first');
        return;
      }

      if (!dataToEncrypt) {
        setStorageError('Please enter data to encrypt');
        return;
      }

      setIsEncrypting(true);
      setStorageError('');

      // Parse JSON if possible, otherwise treat as string
      let dataToStore: unknown;
      try {
        dataToStore = JSON.parse(dataToEncrypt);
      } catch {
        dataToStore = dataToEncrypt;
      }

      // Encrypt and save
      await saveSecureData('demo-data', dataToStore, {
        key: masterPassword,
        autoSave: true,
      });

      const encrypted = await encryptData(dataToStore, masterPassword);
      setEncryptedData(JSON.stringify(encrypted, null, 2));
    } catch (error) {
      setStorageError(error instanceof Error ? error.message : 'Encryption failed');
    } finally {
      setIsEncrypting(false);
    }
  };

  const handleDecrypt = async () => {
    try {
      if (!masterPassword) {
        setStorageError('Please initialize key first');
        return;
      }

      const loaded = await loadSecureData('demo-data', masterPassword);
      setDecryptedData(JSON.stringify(loaded, null, 2));
      setStorageError('');
    } catch (error) {
      setStorageError(error instanceof Error ? error.message : 'Decryption failed');
    }
  };

  const handleGeneratePassword = () => {
    const generated = generateSecurePassword(16);
    setMasterPassword(generated);
  };

  const handlePasswordChange = (password: string) => {
    setMasterPassword(password);
    const strength = validatePasswordStrength(password);
    setPasswordStrength({ score: strength.score, feedback: strength.feedback });
  };

  return (
    <div className="space-y-6 p-6">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold text-foreground mb-2">Utility Functions Demo</h1>
        <p className="text-muted-foreground">
          Explore image compression and secure storage capabilities for LendSwift
        </p>
      </div>

      {/* Crypto Check */}
      {!cryptoAvailable && (
        <Card className="border-destructive/50 bg-destructive/5">
          <CardContent className="pt-6 flex items-center gap-3">
            <AlertCircle className="w-5 h-5 text-destructive" />
            <span className="text-sm text-destructive">
              Web Crypto API not available. Secure storage features will not work.
            </span>
          </CardContent>
        </Card>
      )}

      {/* Tab Navigation */}
      <div className="flex gap-2 border-b border-border">
        <button
          onClick={() => setTab('image')}
          className={`px-4 py-2 font-medium transition-colors ${
            tab === 'image'
              ? 'text-primary border-b-2 border-primary'
              : 'text-muted-foreground hover:text-foreground'
          }`}
        >
          <ImageIcon className="w-4 h-4 inline mr-2" />
          Image Compression
        </button>
        <button
          onClick={() => setTab('storage')}
          className={`px-4 py-2 font-medium transition-colors ${
            tab === 'storage'
              ? 'text-primary border-b-2 border-primary'
              : 'text-muted-foreground hover:text-foreground'
          }`}
        >
          <Lock className="w-4 h-4 inline mr-2" />
          Secure Storage
        </button>
      </div>

      {/* Image Compression Tab */}
      {tab === 'image' && (
        <div className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Canvas-based Image Compression</CardTitle>
              <CardDescription>
                Recursively reduces image quality and dimensions to meet file size targets
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              {/* File Input */}
              <div>
                <input
                  ref={fileInputRef}
                  type="file"
                  accept="image/*"
                  onChange={handleFileSelect}
                  className="hidden"
                />
                <Button
                  onClick={() => fileInputRef.current?.click()}
                  variant="outline"
                  className="w-full"
                >
                  Select Image
                </Button>
                {selectedFile && (
                  <p className="text-sm text-muted-foreground mt-2">
                    Selected: {selectedFile.name} ({(selectedFile.size / 1024).toFixed(2)} KB)
                  </p>
                )}
              </div>

              {/* Compress Button */}
              <Button
                onClick={handleCompress}
                disabled={!selectedFile || isCompressing}
                className="w-full"
              >
                {isCompressing ? 'Compressing...' : 'Compress Image'}
              </Button>

              {/* Error Message */}
              {compressionError && (
                <div className="p-3 bg-destructive/10 border border-destructive/20 rounded text-sm text-destructive">
                  {compressionError}
                </div>
              )}

              {/* Results */}
              {compressionResult && (
                <div className="space-y-3 p-4 bg-secondary/50 rounded">
                  <div className="flex items-center gap-2">
                    <CheckCircle className="w-5 h-5 text-accent" />
                    <span className="font-medium">Compression Complete</span>
                  </div>

                  <div className="grid grid-cols-2 gap-2 text-sm">
                    <div>
                      <p className="text-muted-foreground">Original Size</p>
                      <p className="font-semibold">{compressionResult.originalSizeKB.toFixed(2)} KB</p>
                    </div>
                    <div>
                      <p className="text-muted-foreground">Compressed Size</p>
                      <p className="font-semibold">{compressionResult.compressedSizeKB.toFixed(2)} KB</p>
                    </div>
                    <div>
                      <p className="text-muted-foreground">Ratio</p>
                      <p className="font-semibold">{compressionResult.compressionRatio.toFixed(2)}x</p>
                    </div>
                    <div>
                      <p className="text-muted-foreground">Dimensions</p>
                      <p className="font-semibold">
                        {compressionResult.width}x{compressionResult.height}
                      </p>
                    </div>
                  </div>

                  <Button onClick={handleDownloadCompressed} className="w-full">
                    Download Compressed Image
                  </Button>
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      )}

      {/* Secure Storage Tab */}
      {tab === 'storage' && (
        <div className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Web Crypto API Encryption</CardTitle>
              <CardDescription>
                AES-GCM encryption with automatic localStorage persistence and TTL support
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              {/* Master Password */}
              <div className="space-y-2">
                <label className="text-sm font-medium">Master Password</label>
                <div className="flex gap-2">
                  <FormInput
                    type="password"
                    placeholder="Enter master password"
                    value={masterPassword}
                    onChange={(e) => handlePasswordChange(e.target.value)}
                    disabled={!cryptoAvailable}
                  />
                  <Button
                    onClick={handleGeneratePassword}
                    variant="outline"
                    disabled={!cryptoAvailable}
                  >
                    Generate
                  </Button>
                </div>

                {/* Password Strength */}
                {masterPassword && (
                  <div className="text-sm space-y-1">
                    <p className="text-muted-foreground">
                      Strength: {['Very Weak', 'Weak', 'Fair', 'Good', 'Strong'][passwordStrength.score]}
                    </p>
                    {passwordStrength.feedback.length > 0 && (
                      <ul className="list-disc list-inside text-destructive/70">
                        {passwordStrength.feedback.map((fb, i) => (
                          <li key={i}>{fb}</li>
                        ))}
                      </ul>
                    )}
                  </div>
                )}
              </div>

              {/* Initialize Key Button */}
              <Button
                onClick={handleInitializeKey}
                variant="outline"
                className="w-full"
                disabled={!cryptoAvailable || !masterPassword}
              >
                Initialize Encryption Key
              </Button>

              {/* Data Input */}
              <div className="space-y-2">
                <label className="text-sm font-medium">Data to Encrypt</label>
                <textarea
                  value={dataToEncrypt}
                  onChange={(e) => setDataToEncrypt(e.target.value)}
                  placeholder='Enter JSON or plain text (e.g., {"name": "John", "email": "john@example.com"})'
                  className="w-full h-24 p-3 border border-border rounded bg-background text-foreground placeholder-muted-foreground focus:outline-none focus:ring-2 focus:ring-accent"
                  disabled={!cryptoAvailable}
                />
              </div>

              {/* Encrypt Button */}
              <Button
                onClick={handleEncryptAndSave}
                className="w-full"
                disabled={!cryptoAvailable || !masterPassword || !dataToEncrypt || isEncrypting}
              >
                {isEncrypting ? 'Encrypting...' : 'Encrypt & Save'}
              </Button>

              {/* Decrypt Button */}
              <Button
                onClick={handleDecrypt}
                variant="outline"
                className="w-full"
                disabled={!cryptoAvailable || !masterPassword}
              >
                <Unlock className="w-4 h-4 mr-2" />
                Load & Decrypt
              </Button>

              {/* Error Message */}
              {storageError && (
                <div className="p-3 bg-destructive/10 border border-destructive/20 rounded text-sm text-destructive">
                  {storageError}
                </div>
              )}

              {/* Encrypted Data Display */}
              {encryptedData && (
                <div className="p-4 bg-secondary/50 rounded space-y-2">
                  <p className="text-sm font-medium">Encrypted Data (Stored in localStorage)</p>
                  <pre className="text-xs bg-background p-2 rounded overflow-auto max-h-32 text-muted-foreground">
                    {encryptedData}
                  </pre>
                </div>
              )}

              {/* Decrypted Data Display */}
              {decryptedData && (
                <div className="p-4 bg-accent/10 rounded space-y-2">
                  <div className="flex items-center gap-2">
                    <CheckCircle className="w-4 h-4 text-accent" />
                    <p className="text-sm font-medium">Successfully Decrypted</p>
                  </div>
                  <pre className="text-xs bg-background p-2 rounded overflow-auto max-h-32 text-foreground">
                    {decryptedData}
                  </pre>
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      )}
    </div>
  );
}
