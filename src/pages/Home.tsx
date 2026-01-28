/**
 * Home page
 * Renders the PromptWorkbench as the main experience with basic layout and notifications.
 */

import { Toaster } from 'sonner';
import PromptWorkbench from '../components/workbench/PromptWorkbench';

/**
 * Home component showing the main workbench.
 */
export default function Home() {
  return (
    <div className="min-h-screen bg-slate-50 text-slate-900">
      <Toaster richColors closeButton />
      <main className="container mx-auto px-4 md:px-8 py-6 max-w-7xl">
        <header className="mb-6 flex items-center justify-between">
          <h1 className="text-2xl md:text-3xl font-bold tracking-tight">
            AI Prompt Generator <span className="text-indigo-600">(Secure, Multi‑Provider)</span>
          </h1>
          <div className="flex items-center gap-2 text-xs text-slate-500">
            <span className="hidden sm:inline">Keyboard: </span>
            <span className="border border-slate-300 rounded px-1">/</span>
            <span className="hidden sm:inline">focus search</span>
            <span className="border border-slate-300 rounded px-1">?</span>
            <span className="hidden sm:inline">help</span>
          </div>
        </header>

        <PromptWorkbench />
      </main>
    </div>
  );
}
