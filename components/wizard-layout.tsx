'use client';

import React, { ReactNode } from 'react';
import { StepSidebar } from './step-sidebar';
import { BackToHome } from './back-to-home';

interface WizardLayoutProps {
  children: ReactNode;
  title?: string;
}

export function WizardLayout({ children, title = 'Multi-Step Wizard' }: WizardLayoutProps) {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50/50 via-white to-slate-50 dark:from-slate-900 dark:via-slate-950 dark:to-slate-900">
      {/* Fixed Left Sidebar - Premium Design */}
      <aside className="hidden lg:block fixed left-0 top-0 bottom-0 w-80 bg-white/95 dark:bg-slate-900/95 backdrop-blur-xl border-r border-slate-200 dark:border-slate-800 overflow-y-auto pt-8 px-6 z-40">
        {/* Back to Home Button */}
        <div className="mb-8">
          <BackToHome />
        </div>

        {/* Section Label */}
        <div className="mb-6">
          <h3 className="text-xs font-bold text-muted-foreground uppercase tracking-widest">Application Steps</h3>
        </div>

        {/* Step Sidebar */}
        <StepSidebar />
      </aside>

      {/* Main Content Area */}
      <main className="lg:ml-80 min-h-screen pt-8 pb-16 px-4 md:px-8">
        <div className="max-w-4xl mx-auto">
          {title && (
            <div className="mb-8">
              <h1 className="text-4xl font-bold text-foreground">{title}</h1>
              <p className="text-muted-foreground mt-3">Complete all steps to submit your application</p>
            </div>
          )}
          <div className="transition-smooth">{children}</div>
        </div>
      </main>

      {/* Mobile Sidebar - Mobile Only */}
      <aside className="lg:hidden fixed left-0 top-0 bottom-0 w-full max-w-xs bg-white/95 dark:bg-slate-900/95 backdrop-blur-xl border-r border-slate-200 dark:border-slate-800 overflow-y-auto pt-8 px-6 z-40 transform -translate-x-full">
        {/* Back to Home Button */}
        <div className="mb-8">
          <BackToHome />
        </div>

        {/* Step Sidebar */}
        <StepSidebar />
      </aside>
    </div>
  );
}

interface WizardContentProps {
  children: ReactNode;
  title?: string;
  description?: string;
}

export function WizardContent({ children, title, description }: WizardContentProps) {
  return (
    <div className="bg-white/80 dark:bg-slate-900/50 backdrop-blur-md border border-slate-100 dark:border-slate-800 rounded-2xl p-8 shadow-xl transition-smooth">
      {(title || description) && (
        <div className="mb-6">
          {title && <h2 className="text-2xl font-semibold text-foreground">{title}</h2>}
          {description && <p className="text-muted-foreground mt-2">{description}</p>}
        </div>
      )}
      <div className="space-y-6">{children}</div>
    </div>
  );
}
