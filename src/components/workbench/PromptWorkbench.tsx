/**
 * PromptWorkbench orchestrates tone/provider/model selection, file parsing, and prompt generation.
 * It renders:
 * - Sidebar: ToneSelector, ProviderSelector, ModelIdInput
 * - Main: FileDropzone, FileList, Generate action, ResultsAccordion
 * - Testing: ModelSelector + AITester to try a selected prompt
 */

import { useMemo, useRef, useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card';
import { Button } from '../ui/button';
import { toast } from 'sonner';
import ToneSelector from './ToneSelector';
import ProviderSelector from './ProviderSelector';
import ModelIdInput from './ModelIdInput';
import FileDropzone from './FileDropzone';
import FileList from './FileList';
import ResultsAccordion from './ResultsAccordion';
import ModelSelector from '../ModelSelector';
import AITester from '../AITester';
import { parseFiles } from '../../utils/fileParsing';
import { generateResults } from '../../utils/promptGen';
import type { ParsedFile, PromptCandidate, ToneOption, ProviderOption } from '../../types/workbench';
import type { AIModel } from '../../types/aiProviders';

/**
 * Suggested default model per provider for convenience.
 */
const DEFAULT_MODEL_BY_PROVIDER: Record<ProviderOption, string> = {
  openrouter: 'deepseek/deepseek-r1',
  deepseek: 'deepseek-chat',
  openai: 'gpt-4o-mini',
  anthropic: 'claude-3-haiku-20240307',
  groq: 'llama-3.1-70b-versatile',
};

export default function PromptWorkbench() {
  const [tone, setTone] = useState<ToneOption>('Input/Output Driven');
  const [provider, setProvider] = useState<ProviderOption>('openrouter');
  const [modelId, setModelId] = useState<string>(DEFAULT_MODEL_BY_PROVIDER['openrouter']);

  const [files, setFiles] = useState<File[]>([]);
  const [parsed, setParsed] = useState<ParsedFile[]>([]);
  const [isParsing, setIsParsing] = useState(false);

  const [resultsOpen, setResultsOpen] = useState<boolean>(false);
  const [candidates, setCandidates] = useState<PromptCandidate[]>([]);
  const [summaries, setSummaries] = useState<{ perFile: Array<{ name: string; summary: string; keywords: string[] }>; themes: string[] }>({ perFile: [], themes: [] });

  const [selectedCandidate, setSelectedCandidate] = useState<PromptCandidate | null>(null);
  const [selectedModel, setSelectedModel] = useState<AIModel | null>(null);

  const fileInputRef = useRef<HTMLInputElement | null>(null);

  /** Handle provider change and set a sensible default modelId. */
  const onProviderChange = (p: ProviderOption) => {
    setProvider(p);
    setModelId(DEFAULT_MODEL_BY_PROVIDER[p] || '');
  };

  /** Add files from input or dropzone */
  const handleAddFiles = (incoming: File[]) => {
    const dedupNames = new Set(files.map((f) => f.name));
    const merged = [...files];
    for (const f of incoming) {
      if (!dedupNames.has(f.name)) {
        merged.push(f);
        dedupNames.add(f.name);
      } else {
        toast.info('Duplicate skipped', { description: f.name });
      }
    }
    setFiles(merged);
  };

  /** Remove a file by name */
  const handleRemoveFile = (name: string) => {
    setFiles((prev) => prev.filter((f) => f.name !== name));
    setParsed((prev) => prev.filter((p) => p.name !== name));
  };

  /** Run parsing + summarization + candidate generation */
  const handleGenerate = async () => {
    if (files.length === 0) {
      toast.warning('Add files first', { description: 'Drop or browse files to analyze.' });
      return;
    }
    setIsParsing(true);
    try {
      const parsedFiles = await parseFiles(files);
      setParsed(parsedFiles);

      const result = generateResults(parsedFiles, tone);
      setSummaries(result.summaries);
      setCandidates(result.candidates);
      setSelectedCandidate(result.candidates[0] || null);
      setResultsOpen(true);

      toast.success('Generated!', { description: 'Summaries and prompt candidates are ready.' });
    } catch (e) {
      console.error(e);
      toast.error('Generation failed', { description: e instanceof Error ? e.message : 'Unknown error' });
    } finally {
      setIsParsing(false);
    }
  };

  /** Inline helper to browse files */
  const browseFiles = () => fileInputRef.current?.click();

  const isGenerateDisabled = useMemo(() => files.length === 0 || isParsing, [files.length, isParsing]);

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6 lg:gap-8">
      {/* Sidebar */}
      <aside className="md:col-span-1 flex flex-col gap-6">
        <Card>
          <CardHeader>
            <CardTitle className="text-lg font-semibold">Tone &amp; Style</CardTitle>
          </CardHeader>
          <CardContent>
            <ToneSelector value={tone} onChange={setTone} />
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-lg font-semibold">Model Provider</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <ProviderSelector value={provider} onChange={onProviderChange} />
            <ModelIdInput
              value={modelId}
              onChange={setModelId}
              provider={provider}
              onPickModel={(m) => {
                setSelectedModel(m);
                setModelId(m.id);
              }}
            />
          </CardContent>
        </Card>

        <Card className="border-amber-200 dark:border-amber-800">
          <CardHeader>
            <CardTitle className="text-base font-semibold text-amber-700 dark:text-amber-200">Security</CardTitle>
          </CardHeader>
          <CardContent className="text-sm text-slate-600 dark:text-slate-300">
            Do not embed API keys in client code. This UI can call providers directly using runtime-injected keys or use your server proxy. Ask to enable a secure proxy route if needed.
          </CardContent>
        </Card>
      </aside>

      {/* Main area */}
      <section className="md:col-span-2">
        <Card className="mb-6">
          <CardContent className="pt-6">
            <FileDropzone onFiles={handleAddFiles} />
            <div className="mt-4">
              <FileList files={files} onRemove={handleRemoveFile} />
            </div>
            <div className="mt-6">
              <input
                ref={fileInputRef}
                type="file"
                className="hidden"
                multiple
                onChange={(e) => {
                  const list = e.target.files ? Array.from(e.target.files) : [];
                  if (list.length) handleAddFiles(list);
                  e.currentTarget.value = '';
                }}
                accept=".md,.txt,.ipynb,.html,.htm,.ts,.tsx,.js,.jsx,.py,.java,.cpp,.cs,.go,.rs,.php,.rb,.pdf,.docx,.xlsx"
              />
              <div className="flex gap-2">
                <Button onClick={browseFiles} variant="outline" className="bg-transparent">
                  Browse Files
                </Button>
                <Button onClick={handleGenerate} disabled={isGenerateDisabled}>
                  {isParsing ? 'Analyzing…' : 'Generate Prompts'}
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>

        <ResultsAccordion
          open={resultsOpen}
          onToggle={() => setResultsOpen((s) => !s)}
          summaries={summaries}
          candidates={candidates}
          selectedCandidateId={selectedCandidate?.id || null}
          onSelectCandidate={(id) => setSelectedCandidate(candidates.find((c) => c.id === id) || null)}
        />

        {/* Test with AI */}
        <div className="mt-6 space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="text-lg font-semibold">Test with AI</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <p className="text-sm text-slate-600 dark:text-slate-300">
                Choose a model and run the selected prompt candidate. You can edit or switch the candidate above.
              </p>

              <div className="rounded-lg border p-3">
                <ModelSelector
                  selectedModel={selectedModel}
                  onModelSelect={setSelectedModel}
                />
              </div>

              <div className="rounded-lg border p-3">
                <AITester prompt={selectedCandidate?.content || ''} initialModel={selectedModel || undefined} />
              </div>
            </CardContent>
          </Card>
        </div>
      </section>
    </div>
  );
}
