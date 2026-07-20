'use client';

import React from 'react';
import Link from 'next/link';
import { FintechHeader } from '@/components/fintech-header';
import { ArrowRight, Zap, TrendingUp, Lock, BarChart3, Users } from 'lucide-react';

export default function HomePage() {
  return (
    <>
      <FintechHeader />
      
      <main className="min-h-screen bg-white dark:bg-slate-950">
        {/* Hero Section with Premium Mesh Gradient */}
        <section className="relative pt-32 pb-20 overflow-hidden">
          {/* Primary Mesh Gradient Background */}
          <div className="absolute inset-0 mesh-gradient-hero -z-10" />
          {/* Primary Radial Gradient from Top Right */}
          <div className="absolute inset-0 mesh-gradient-radial -z-10" />
          {/* Secondary Radial Gradient from Bottom Left */}
          <div className="absolute inset-0 mesh-gradient-secondary -z-10" />

          <div className="max-w-6xl mx-auto px-6 relative">
            <div className="grid lg:grid-cols-2 gap-12 items-center">
              {/* Left Content */}
              <div className="space-y-6">
                <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-blue-100/50 dark:bg-blue-900/30 border border-blue-200 dark:border-blue-800">
                  <Zap className="w-4 h-4 text-blue-600 dark:text-blue-400" />
                  <span className="text-sm font-medium text-blue-700 dark:text-blue-300">
                    Instant Credit. Frictionless Growth.
                  </span>
                </div>

                <h1 className="text-5xl md:text-6xl font-bold text-foreground leading-tight text-balance">
                  Instant Credit.<br />
                  <span className="bg-gradient-to-r from-blue-600 to-blue-500 dark:from-blue-400 dark:to-blue-300 bg-clip-text text-transparent">
                    Frictionless Growth.
                  </span>
                </h1>

                <p className="text-lg text-muted-foreground leading-relaxed max-w-lg text-balance">
                  Get instant credit decisions in minutes. LendSwift leverages cutting-edge AI to bridge the gap between financial intent and execution for Indian businesses and professionals.
                </p>

                <div className="flex flex-wrap gap-3 pt-4">
                  <Link
                    href="/wizard"
                    className="inline-flex items-center justify-center gap-2 px-8 py-3 rounded-lg bg-gradient-to-r from-blue-600 to-blue-500 hover:from-blue-700 hover:to-blue-600 text-white font-semibold shadow-lg hover:shadow-xl transition-all duration-300 group"
                  >
                    Get Started
                    <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                  </Link>
                  <button className="inline-flex items-center justify-center gap-2 px-8 py-3 rounded-lg border-2 border-slate-200 dark:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-900 text-foreground font-semibold transition-all duration-300">
                    Learn More
                  </button>
                </div>

                {/* Stats */}
                <div className="grid grid-cols-3 gap-4 pt-8">
                  <div>
                    <p className="text-2xl font-bold text-primary">₹500Cr+</p>
                    <p className="text-xs text-muted-foreground mt-1">Disbursed</p>
                  </div>
                  <div>
                    <p className="text-2xl font-bold text-primary">50K+</p>
                    <p className="text-xs text-muted-foreground mt-1">Active Customers</p>
                  </div>
                  <div>
                    <p className="text-2xl font-bold text-primary">2 Min</p>
                    <p className="text-xs text-muted-foreground mt-1">Approval Time</p>
                  </div>
                </div>
              </div>

              {/* Right - Floating Quote Badge */}
              <div className="relative h-96 flex items-center justify-center">
                <div className="absolute inset-0 bg-gradient-to-br from-blue-500/10 to-transparent rounded-3xl blur-3xl" />
                <div className="relative bg-white/80 dark:bg-slate-900/50 backdrop-blur-xl border border-slate-100 dark:border-slate-800 rounded-2xl p-8 max-w-md shadow-2xl">
                  <div className="absolute -top-3 -right-3 w-20 h-20 bg-gradient-to-br from-blue-600 to-blue-500 rounded-full blur-xl opacity-20" />
                  
                  <div className="relative space-y-4">
                    <p className="text-lg font-semibold text-foreground leading-relaxed">
                      &quot;The fastest bridge between financial intent and execution.&quot;
                    </p>
                    
                    <div className="flex items-center gap-3 pt-4 border-t border-slate-100 dark:border-slate-800">
                      <div className="w-10 h-10 rounded-full bg-gradient-to-br from-blue-600 to-blue-500" />
                      <div>
                        <p className="text-sm font-semibold text-foreground">Rajesh Kumar</p>
                        <p className="text-xs text-muted-foreground">Startup Founder, TechVentures</p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Features Section */}
        <section className="py-20 border-t border-slate-200 dark:border-slate-800 bg-gradient-to-b from-slate-50 to-white dark:from-slate-900 dark:to-slate-950">
          <div className="max-w-6xl mx-auto px-6">
            <div className="text-center max-w-2xl mx-auto mb-16">
              <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-4">
                Why LendSwift?
              </h2>
              <p className="text-lg text-muted-foreground">
                Experience the future of fintech with intelligent credit solutions built for India
              </p>
            </div>

            <div className="grid md:grid-cols-3 gap-8">
              {/* Feature 1 */}
              <div className="group p-6 rounded-2xl bg-slate-50/50 dark:bg-slate-900/30 border border-slate-100 dark:border-slate-800 hover:border-blue-200 dark:hover:border-blue-800 hover:bg-blue-50/30 dark:hover:bg-blue-900/10 transition-all duration-300">
                <div className="w-12 h-12 rounded-lg bg-gradient-to-br from-blue-600 to-blue-500 flex items-center justify-center text-white mb-4 group-hover:shadow-lg transition-shadow">
                  <Zap className="w-6 h-6" />
                </div>
                <h3 className="text-lg font-bold text-foreground mb-2">Lightning Fast</h3>
                <p className="text-sm text-muted-foreground">
                  Get instant credit decisions in under 2 minutes with our AI-powered underwriting
                </p>
              </div>

              {/* Feature 2 */}
              <div className="group p-6 rounded-2xl bg-slate-50/50 dark:bg-slate-900/30 border border-slate-100 dark:border-slate-800 hover:border-blue-200 dark:hover:border-blue-800 hover:bg-blue-50/30 dark:hover:bg-blue-900/10 transition-all duration-300">
                <div className="w-12 h-12 rounded-lg bg-gradient-to-br from-blue-600 to-blue-500 flex items-center justify-center text-white mb-4 group-hover:shadow-lg transition-shadow">
                  <TrendingUp className="w-6 h-6" />
                </div>
                <h3 className="text-lg font-bold text-foreground mb-2">Transparent Growth</h3>
                <p className="text-sm text-muted-foreground">
                  Crystal clear terms with no hidden charges. Scale your business with confidence
                </p>
              </div>

              {/* Feature 3 */}
              <div className="group p-6 rounded-2xl bg-slate-50/50 dark:bg-slate-900/30 border border-slate-100 dark:border-slate-800 hover:border-blue-200 dark:hover:border-blue-800 hover:bg-blue-50/30 dark:hover:bg-blue-900/10 transition-all duration-300">
                <div className="w-12 h-12 rounded-lg bg-gradient-to-br from-blue-600 to-blue-500 flex items-center justify-center text-white mb-4 group-hover:shadow-lg transition-shadow">
                  <Lock className="w-6 h-6" />
                </div>
                <h3 className="text-lg font-bold text-foreground mb-2">Secure & Safe</h3>
                <p className="text-sm text-muted-foreground">
                  Bank-grade security protecting your financial data with enterprise encryption
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* CTA Section */}
        <section className="py-20 bg-white dark:bg-slate-950">
          <div className="max-w-4xl mx-auto px-6">
            <div className="relative overflow-hidden bg-gradient-to-r from-blue-600 to-blue-500 dark:from-blue-900 dark:to-blue-800 rounded-2xl p-12 md:p-16 shadow-xl">
              <div className="absolute top-0 right-0 w-96 h-96 bg-white/10 rounded-full blur-3xl -z-10" />
              
              <div className="relative text-center space-y-6">
                <h2 className="text-3xl md:text-4xl font-bold text-white">
                  Ready to Transform Your Financial Future?
                </h2>
                <p className="text-lg text-blue-100 max-w-2xl mx-auto">
                  Join thousands of businesses and professionals who are experiencing seamless credit access with LendSwift
                </p>
                
                <Link
                  href="/wizard"
                  className="inline-flex items-center justify-center gap-2 px-8 py-3 rounded-lg bg-white hover:bg-blue-50 text-blue-600 font-semibold shadow-lg transition-all duration-300 group"
                >
                  Start Your Application
                  <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                </Link>
              </div>
            </div>
          </div>
        </section>

        {/* Enterprise Footer */}
        <footer className="border-t border-slate-200 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-900/50 py-16">
          <div className="max-w-6xl mx-auto px-6">
            {/* Main Footer Grid - 4 Columns */}
            <div className="grid md:grid-cols-4 gap-10 mb-12">
              {/* Column 1: Company & Contact */}
              <div>
                <div className="flex items-center gap-3 mb-6">
                  <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-blue-600 to-blue-500 flex items-center justify-center text-white font-bold text-base shadow-lg">
                    L
                  </div>
                  <div>
                    <h3 className="font-bold text-foreground text-lg">LendSwift</h3>
                    <p className="text-xs text-muted-foreground">Fintech Platform</p>
                  </div>
                </div>
                <p className="text-sm text-muted-foreground leading-relaxed mb-4">
                  Bridging the gap between financial intent and execution for modern India.
                </p>
                <div className="space-y-2 text-sm text-muted-foreground">
                  <p><span className="font-semibold text-foreground">Email:</span> hello@lendswift.in</p>
                  <p><span className="font-semibold text-foreground">Phone:</span> +91 1234 567 890</p>
                  <p><span className="font-semibold text-foreground">Address:</span> Bangalore, India</p>
                </div>
              </div>

              {/* Column 2: Industry Solutions */}
              <div>
                <h3 className="font-semibold text-foreground mb-4 text-sm uppercase tracking-widest">Industry Solutions</h3>
                <ul className="space-y-3">
                  <li>
                    <a href="#" className="text-sm text-muted-foreground hover:text-blue-600 dark:hover:text-blue-400 transition-colors duration-200 flex items-start gap-2">
                      <span className="text-blue-600 dark:text-blue-400 mt-0.5">→</span>
                      <span>MSME Loans</span>
                    </a>
                  </li>
                  <li>
                    <a href="#" className="text-sm text-muted-foreground hover:text-blue-600 dark:hover:text-blue-400 transition-colors duration-200 flex items-start gap-2">
                      <span className="text-blue-600 dark:text-blue-400 mt-0.5">→</span>
                      <span>Supply Chain Finance</span>
                    </a>
                  </li>
                  <li>
                    <a href="#" className="text-sm text-muted-foreground hover:text-blue-600 dark:hover:text-blue-400 transition-colors duration-200 flex items-start gap-2">
                      <span className="text-blue-600 dark:text-blue-400 mt-0.5">→</span>
                      <span>Personal Loans</span>
                    </a>
                  </li>
                  <li>
                    <a href="#" className="text-sm text-muted-foreground hover:text-blue-600 dark:hover:text-blue-400 transition-colors duration-200 flex items-start gap-2">
                      <span className="text-blue-600 dark:text-blue-400 mt-0.5">→</span>
                      <span>Business Loans</span>
                    </a>
                  </li>
                </ul>
              </div>

              {/* Column 3: Resources */}
              <div>
                <h3 className="font-semibold text-foreground mb-4 text-sm uppercase tracking-widest">Resources</h3>
                <ul className="space-y-3">
                  <li>
                    <a href="#" className="text-sm text-muted-foreground hover:text-blue-600 dark:hover:text-blue-400 transition-colors duration-200 flex items-start gap-2">
                      <span className="text-blue-600 dark:text-blue-400 mt-0.5">→</span>
                      <span>API Documentation</span>
                    </a>
                  </li>
                  <li>
                    <a href="#" className="text-sm text-muted-foreground hover:text-blue-600 dark:hover:text-blue-400 transition-colors duration-200 flex items-start gap-2">
                      <span className="text-blue-600 dark:text-blue-400 mt-0.5">→</span>
                      <span>Blog & Insights</span>
                    </a>
                  </li>
                  <li>
                    <a href="#" className="text-sm text-muted-foreground hover:text-blue-600 dark:hover:text-blue-400 transition-colors duration-200 flex items-start gap-2">
                      <span className="text-blue-600 dark:text-blue-400 mt-0.5">→</span>
                      <span>Developer Hub</span>
                    </a>
                  </li>
                  <li>
                    <a href="#" className="text-sm text-muted-foreground hover:text-blue-600 dark:hover:text-blue-400 transition-colors duration-200 flex items-start gap-2">
                      <span className="text-blue-600 dark:text-blue-400 mt-0.5">→</span>
                      <span>FAQ & Support</span>
                    </a>
                  </li>
                </ul>
              </div>

              {/* Column 4: Company */}
              <div>
                <h3 className="font-semibold text-foreground mb-4 text-sm uppercase tracking-widest">Company</h3>
                <ul className="space-y-3">
                  <li>
                    <a href="#" className="text-sm text-muted-foreground hover:text-blue-600 dark:hover:text-blue-400 transition-colors duration-200 flex items-start gap-2">
                      <span className="text-blue-600 dark:text-blue-400 mt-0.5">→</span>
                      <span>About Us</span>
                    </a>
                  </li>
                  <li>
                    <a href="#" className="text-sm text-muted-foreground hover:text-blue-600 dark:hover:text-blue-400 transition-colors duration-200 flex items-start gap-2">
                      <span className="text-blue-600 dark:text-blue-400 mt-0.5">→</span>
                      <span>Careers</span>
                    </a>
                  </li>
                  <li>
                    <a href="#" className="text-sm text-muted-foreground hover:text-blue-600 dark:hover:text-blue-400 transition-colors duration-200 flex items-start gap-2">
                      <span className="text-blue-600 dark:text-blue-400 mt-0.5">→</span>
                      <span>Press Kit</span>
                    </a>
                  </li>
                  <li>
                    <a href="#" className="text-sm text-muted-foreground hover:text-blue-600 dark:hover:text-blue-400 transition-colors duration-200 flex items-start gap-2">
                      <span className="text-blue-600 dark:text-blue-400 mt-0.5">→</span>
                      <span>Contact</span>
                    </a>
                  </li>
                </ul>
              </div>
            </div>

            {/* Sharp Legal Banner */}
            <div className="border-t-2 border-slate-200 dark:border-slate-700 pt-8">
              <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-6">
                <p className="text-sm text-muted-foreground">
                  © 2026 LendSwift Technologies. All rights reserved.
                </p>
                <div className="flex flex-wrap gap-6">
                  <a href="#" className="text-sm text-muted-foreground hover:text-foreground transition-colors duration-200">
                    Privacy Policy
                  </a>
                  <a href="#" className="text-sm text-muted-foreground hover:text-foreground transition-colors duration-200">
                    Terms of Service
                  </a>
                  <a href="#" className="text-sm text-muted-foreground hover:text-foreground transition-colors duration-200">
                    Cookie Policy
                  </a>
                  <a href="#" className="text-sm text-muted-foreground hover:text-foreground transition-colors duration-200">
                    Compliance
                  </a>
                </div>
              </div>
            </div>
          </div>
        </footer>
      </main>
    </>
  );
}
