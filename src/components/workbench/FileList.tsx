/**
 * FileList
 * Displays selected files with basic info and remove actions.
 */

import { Button } from '../ui/button';

interface FileListProps {
  files: File[];
  onRemove: (name: string) => void;
}

export default function FileList({ files, onRemove }: FileListProps) {
  if (!files.length) {
    return (
      <div className="hidden" />
    );
  }

  return (
    <div>
      <h4 className="font-semibold mb-2">Selected Files</h4>
      <ul className="space-y-2">
        {files.map((f) => (
          <li key={f.name} className="flex items-center justify-between rounded-xl border p-3 bg-white">
            <div className="min-w-0">
              <div className="font-medium truncate">{f.name}</div>
              <div className="text-xs text-slate-500">
                {(f.size / 1024).toFixed(1)} KB • {f.type || 'unknown'}
              </div>
            </div>
            <Button variant="outline" className="bg-transparent" onClick={() => onRemove(f.name)}>
              Remove
            </Button>
          </li>
        ))}
      </ul>
    </div>
  );
}
