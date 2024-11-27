import Link from 'next/link';
import Image from 'next/image';
import { ArrowRight, FileUp, Sparkles, BarChart3, Download, Shield } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Features } from '@/components/features';

export default function Home() {
  return (
    <div className="flex min-h-screen flex-col bg-background">
      {/* Hero Section */}
      <main className="flex-1">
        <div className="container flex flex-col items-center justify-center space-y-12 px-4 py-16 md:py-24">
          <div className="text-center space-y-6">
            <h1 className="text-4xl font-bold tracking-tighter sm:text-6xl md:text-7xl">
              Clean Your Data with
              <span className="bg-gradient-to-r from-blue-600 to-cyan-500 bg-clip-text text-transparent"> AI</span>
            </h1>
            <p className="mx-auto max-w-[700px] text-lg text-muted-foreground md:text-xl">
              Transform messy data into clean, analysis-ready datasets in minutes. No account required.
            </p>
            <div className="flex justify-center gap-4">
              <Link href="/upload">
                <Button size="lg" className="gap-2">
                  Start Cleaning <ArrowRight className="h-4 w-4" />
                </Button>
              </Link>
            </div>
          </div>

          {/* Process Steps */}
          <div className="grid gap-8 md:grid-cols-3 w-full max-w-5xl">
            <div className="flex flex-col items-center space-y-4 p-6 bg-card rounded-lg border">
              <div className="p-3 bg-primary/10 rounded-full">
                <FileUp className="h-6 w-6 text-primary" />
              </div>
              <h3 className="text-xl font-semibold">1. Upload</h3>
              <p className="text-center text-muted-foreground">
                Drag & drop your CSV, Excel, or text files
              </p>
            </div>
            <div className="flex flex-col items-center space-y-4 p-6 bg-card rounded-lg border">
              <div className="p-3 bg-primary/10 rounded-full">
                <Sparkles className="h-6 w-6 text-primary" />
              </div>
              <h3 className="text-xl font-semibold">2. Clean</h3>
              <p className="text-center text-muted-foreground">
                AI detects and fixes data issues automatically
              </p>
            </div>
            <div className="flex flex-col items-center space-y-4 p-6 bg-card rounded-lg border">
              <div className="p-3 bg-primary/10 rounded-full">
                <Download className="h-6 w-6 text-primary" />
              </div>
              <h3 className="text-xl font-semibold">3. Download</h3>
              <p className="text-center text-muted-foreground">
                Get your cleaned data in your preferred format
              </p>
            </div>
          </div>

          {/* Demo Image */}
          <div className="relative w-full max-w-5xl aspect-video rounded-lg overflow-hidden border">
            <Image
              src="https://images.unsplash.com/photo-1551288049-bebda4e38f71?q=80&w=2070"
              alt="DataCleaner AI Dashboard"
              fill
              className="object-cover"
              priority
            />
          </div>
        </div>

        {/* Features Section */}
        <Features />

        {/* Privacy Notice */}
        <div className="container px-4 py-12">
          <div className="mx-auto max-w-2xl text-center">
            <div className="inline-flex items-center justify-center p-3 mb-4 rounded-full bg-secondary">
              <Shield className="h-6 w-6 text-primary" />
            </div>
            <h2 className="text-2xl font-bold mb-4">Your Data Privacy Matters</h2>
            <p className="text-muted-foreground">
              We process your data securely in your browser. No data is stored on our servers, and everything is deleted after you download your cleaned dataset.
            </p>
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="border-t">
        <div className="container flex flex-col items-center justify-between gap-4 py-10 md:h-24 md:flex-row md:py-0">
          <div className="flex flex-col items-center gap-4 px-8 md:flex-row md:gap-2 md:px-0">
            <p className="text-center text-sm leading-loose md:text-left">
              Built with ❤️ for data scientists and analysts
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
}