'use client';

import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { ThemeToggle } from '@/components/theme-toggle';
import { Check, GitBranch, Cpu, Zap } from 'lucide-react';

export function PageHeader() {
  return (
    <header className="border-b border-border sticky top-0 z-50 bg-background/80 backdrop-blur-sm">
      <div className="max-w-7xl mx-auto px-6 py-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3 flex-1">
            <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-primary to-accent flex items-center justify-center">
              <Zap className="w-6 h-6 text-white" />
            </div>
            <div>
              <h1 className="text-lg font-bold text-foreground">LendSwift</h1>
              <p className="text-xs text-muted-foreground">Component Library</p>
            </div>
          </div>
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              <Check className="w-4 h-4 text-accent" />
              <span>WCAG 2.1 AA Accessible</span>
            </div>
            <Link href="/wizard">
              <Button variant="outline" size="sm" className="gap-2">
                <GitBranch size={16} />
                Multi-Step Wizard
              </Button>
            </Link>
            <Link href="/utilities">
              <Button variant="outline" size="sm" className="gap-2">
                <Cpu size={16} />
                Utilities Demo
              </Button>
            </Link>
            <ThemeToggle />
          </div>
        </div>
      </div>
    </header>
  );
}
