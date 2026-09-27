import React from 'react';
import { Layers, RotateCcw, Sparkles } from 'lucide-react';

export type UiVersion = 'new_ui' | 'previous_ui';

interface UiVersionToggleProps {
  currentVersion: UiVersion;
  onSelectVersion: (version: UiVersion) => void;
}

export const UiVersionToggle: React.FC<UiVersionToggleProps> = ({
  currentVersion,
  onSelectVersion,
}) => {
  return (
    <aside
      aria-label="UI Version Switcher"
      className="bg-white border-b border-slate-200 px-3 sm:px-6 py-1.5 flex items-center justify-between text-xs transition-colors shadow-2xs select-none"
    >
      <div className="flex items-center gap-2">
        <div className="w-5 h-5 rounded-md bg-emerald-100 text-emerald-800 flex items-center justify-center font-bold">
          <Layers className="w-3.5 h-3.5" />
        </div>
        <div className="flex items-center gap-1.5">
          <span className="font-bold text-slate-800 text-[11px] sm:text-xs">UI Version Switch:</span>
          <span className="hidden md:inline text-[11px] text-slate-500 font-normal">
            (Safety Rollback Protected &bull; Backup: <code className="bg-slate-100 text-slate-700 px-1 py-0.2 rounded font-mono text-[10px]">HEALTHNEXUS_UI_STABLE_BACKUP</code>)
          </span>
        </div>
      </div>

      <div className="flex items-center gap-1 bg-slate-100 p-0.5 rounded-lg border border-slate-200">
        <button
          type="button"
          onClick={() => onSelectVersion('new_ui')}
          className={`flex items-center gap-1.5 px-3 py-1 rounded-md font-bold text-[11px] sm:text-xs transition-all ${
            currentVersion === 'new_ui'
              ? 'bg-emerald-600 text-white shadow-xs'
              : 'text-slate-600 hover:text-slate-900 hover:bg-slate-200/60'
          }`}
        >
          <Sparkles className="w-3 h-3" />
          <span>New UI (Healthcare AI)</span>
        </button>

        <button
          type="button"
          onClick={() => onSelectVersion('previous_ui')}
          className={`flex items-center gap-1.5 px-3 py-1 rounded-md font-bold text-[11px] sm:text-xs transition-all ${
            currentVersion === 'previous_ui'
              ? 'bg-slate-800 text-white shadow-xs'
              : 'text-slate-600 hover:text-slate-900 hover:bg-slate-200/60'
          }`}
        >
          <RotateCcw className="w-3 h-3" />
          <span>Previous UI (Preserved Backup)</span>
        </button>
      </div>
    </aside>
  );
};
