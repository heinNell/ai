/**
 * ResultsAccordion
 * Shows summaries/themes and generated prompt candidates with a simple collapsible behavior.
 */

import { useState } from 'react';
import { Card, CardContent } from '../ui/card';
import { Button } from '../ui/button';
import type { PromptCandidate } from '../../types/workbench';

interface ResultsAccordionProps {
  open: boolean;
  onToggle: () => void;
  summaries: {
    perFile: Array<{ name: string; summary: string; keywords: string[] }>;
    themes: string[];
  };
  candidates: PromptCandidate[];
  selectedCandidateId: string | null;
  onSelectCandidate: (id: string) => void;
}

export default function ResultsAccordion({
  open,
  onToggle,
  summaries,
  candidates,
  selectedCandidateId,
  onSelectCandidate,
}: ResultsAccordionProps) {
  const [openSummaries, setOpenSummaries] = useState(true);
  const [openCandidates, setOpenCandidates] = useState(true);

  if (!candidates.length && !summaries.perFile.length) {
    return null;
  }

  return (
    <div id="results" className={`${open ? '' : 'hidden'}`}>
      {/* Summaries */}
      <Card className="mb-6 overflow-hidden">
        <button
          id="btn-summaries"
          className="w-full flex justify-between items-center text-left bg-slate-50 p-4 hover:bg-slate-100"
          onClick={() => setOpenSummaries((s) => !s)}
        >
          <h3 className="font-semibold">Summaries &amp; Themes</h3>
          <span className={`transition-transform ${openSummaries ? 'rotate-180' : ''}`}>⌄</span>
        </button>
        {openSummaries && (
          <CardContent className="p-4 space-y-4">
            <div className="space-y-3">
              {summaries.perFile.map((f) => (
                <div key={f.name} className="rounded-lg border p-3 bg-white">
                  <div className="font-medium">{f.name}</div>
                  <p className="text-sm text-slate-700 mt-1">{f.summary}</p>
                  <div className="mt-2 flex flex-wrap gap-1">
                    {f.keywords.slice(0, 10).map((k) => (
                      <span
                        key={k}
                        className="text-xs px-2 py-0.5 rounded-full bg-indigo-50 text-indigo-700 border border-indigo-200"
                      >
                        {k}
                      </span>
                    ))}
                  </div>
                </div>
              ))}
            </div>

            {summaries.themes.length > 0 && (
              <div className="rounded-lg border p-3 bg-white">
                <div className="font-medium mb-2">Cross-file themes</div>
                <div className="flex flex-wrap gap-1">
                  {summaries.themes.map((t) => (
                    <span
                      key={t}
                      className="text-xs px-2 py-0.5 rounded-full bg-slate-100 text-slate-700 border border-slate-200"
                    >
                      {t}
                    </span>
                  ))}
                </div>
              </div>
            )}
          </CardContent>
        )}
      </Card>

      {/* Candidates */}
      <Card className="mb-6 overflow-hidden">
        <button
          id="btn-candidates"
          className="w-full flex justify-between items-center text-left bg-slate-50 p-4 hover:bg-slate-100"
          onClick={() => setOpenCandidates((s) => !s)}
        >
          <h3 className="font-semibold">Prompt Candidates</h3>
          <span className={`transition-transform ${openCandidates ? 'rotate-180' : ''}`}>⌄</span>
        </button>
        {openCandidates && (
          <CardContent className="p-4 space-y-3">
            {candidates.map((c) => {
              const selected = c.id === selectedCandidateId;
              return (
                <div
                  key={c.id}
                  className={`rounded-lg border p-3 ${selected ? 'ring-2 ring-blue-500 bg-blue-50' : 'bg-white'}`}
                >
                  <div className="flex items-center justify-between gap-3">
                    <div className="min-w-0">
                      <div className="font-medium truncate">{c.title}</div>
                      <div className="text-xs text-slate-500">{c.tone}</div>
                    </div>
                    <div className="flex gap-2">
                      <Button variant="outline" className="bg-transparent" onClick={() => onSelectCandidate(c.id)}>
                        Use
                      </Button>
                      <Button
                        variant="outline"
                        className="bg-transparent"
                        onClick={() => {
                          navigator.clipboard.writeText(c.content);
                        }}
                      >
                        Copy
                      </Button>
                    </div>
                  </div>
                  <pre className="mt-3 whitespace-pre-wrap text-sm text-slate-800 font-mono">{c.content}</pre>
                </div>
              );
            })}
          </CardContent>
        )}
      </Card>
    </div>
  );
}
