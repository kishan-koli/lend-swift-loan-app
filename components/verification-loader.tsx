import React, { useEffect, useState } from 'react';
import { Check, AlertCircle } from 'lucide-react';

interface VerificationLoaderProps {
  isVerifying: boolean;
  verificationStatus: 'pending' | 'verified' | 'failed';
  message?: string;
}

export const VerificationLoader = ({
  isVerifying,
  verificationStatus,
  message = 'Verifying document...',
}: VerificationLoaderProps) => {
  const [showBadge, setShowBadge] = useState(false);

  useEffect(() => {
    if (!isVerifying && verificationStatus !== 'pending') {
      // Small delay before showing the badge for better UX
      const timer = setTimeout(() => setShowBadge(true), 200);
      return () => clearTimeout(timer);
    }
    setShowBadge(false);
  }, [isVerifying, verificationStatus]);

  return (
    <div className="flex flex-col items-center gap-4 py-6">
      {isVerifying ? (
        // Pulse loading spinner
        <div className="relative flex items-center justify-center">
          <div className="absolute inset-0 rounded-full bg-accent/20 animate-pulse" style={{ animationDuration: '1.5s' }} />
          <div className="absolute inset-0 rounded-full border-2 border-transparent border-t-accent border-r-accent animate-spin" style={{ animationDuration: '2s' }} />
          <div className="relative w-16 h-16 rounded-full bg-gradient-to-br from-accent/10 to-accent/5 flex items-center justify-center">
            <div className="w-12 h-12 rounded-full bg-white border-2 border-accent/30 flex items-center justify-center">
              <div className="w-8 h-8 rounded-full bg-accent/10 animate-pulse" />
            </div>
          </div>
        </div>
      ) : null}

      {!isVerifying && showBadge ? (
        // Verification result badge
        <div
          className={`flex items-center gap-3 px-6 py-4 rounded-lg border-2 transition-all duration-500 transform ${
            verificationStatus === 'verified'
              ? 'bg-accent/5 border-accent scale-100 opacity-100'
              : 'bg-destructive/5 border-destructive scale-100 opacity-100'
          }`}
        >
          {verificationStatus === 'verified' ? (
            <>
              <div className="flex-shrink-0">
                <Check className="w-6 h-6 text-accent" />
              </div>
              <div>
                <p className="font-semibold text-accent">Document Verified</p>
                <p className="text-sm text-accent/70">Your identity has been successfully verified</p>
              </div>
            </>
          ) : (
            <>
              <div className="flex-shrink-0">
                <AlertCircle className="w-6 h-6 text-destructive" />
              </div>
              <div>
                <p className="font-semibold text-destructive">Verification Failed</p>
                <p className="text-sm text-destructive/70">Please check your details and try again</p>
              </div>
            </>
          )}
        </div>
      ) : null}

      {isVerifying && (
        <p className="text-sm text-muted-foreground animate-pulse">{message}</p>
      )}
    </div>
  );
};
