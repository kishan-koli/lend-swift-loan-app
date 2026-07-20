'use client';

import React from 'react';
import Link from 'next/link';
import { ArrowLeft } from 'lucide-react';

export function BackToHome() {
  return (
    <Link
      href="/"
      className="inline-flex items-center gap-2 px-4 py-2.5 rounded-lg bg-slate-100/80 dark:bg-slate-800/80 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-300 font-semibold text-sm transition-all duration-300 group border border-slate-200 dark:border-slate-700"
    >
      <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
      Back to Home
    </Link>
  );
}
