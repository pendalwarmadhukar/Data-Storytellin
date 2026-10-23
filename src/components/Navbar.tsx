import React from 'react';
import { TabType } from '../types';
import { BarChart3, Database, Sparkles, FolderOpen, HelpCircle, FileText, Layers } from 'lucide-react';

interface NavbarProps {
  currentTab: TabType;
  onSelectTab: (tab: TabType) => void;
  datasetName?: string;
}

export const Navbar: React.FC<NavbarProps> = ({ currentTab, onSelectTab, datasetName }) => {
  return (
    <header className="flex items-center justify-between gap-8 px-6 py-4 bg-white border-b border-slate-200 sticky top-0 z-50">
      {/* Zone 1: Single text element wordmark */}
      <div 
        onClick={() => onSelectTab('home')}
        className="flex items-center gap-3 cursor-pointer shrink-0"
      >
        <div className="w-8 h-8 rounded-lg bg-slate-900 flex items-center justify-center text-white font-bold">
          DS
        </div>
        <div>
          <span className="text-base font-bold tracking-tight text-slate-900 whitespace-nowrap">
            Data Storytelling Studio
          </span>
          {datasetName && (
            <div className="text-xs text-slate-500 font-mono truncate max-w-[200px]">
              {datasetName}
            </div>
          )}
        </div>
      </div>

      {/* Zone 2: 4-5 concise single-line text navigation links */}
      <nav className="hidden lg:flex items-center gap-6 text-sm font-medium text-slate-600">
        <button 
          onClick={() => onSelectTab('import')}
          className={`hover:text-slate-900 transition-colors whitespace-nowrap shrink-0 ${currentTab === 'import' ? 'text-slate-900 font-semibold underline underline-offset-4' : ''}`}
        >
          Data Import
        </button>
        <button 
          onClick={() => onSelectTab('quality')}
          className={`hover:text-slate-900 transition-colors whitespace-nowrap shrink-0 ${currentTab === 'quality' ? 'text-slate-900 font-semibold underline underline-offset-4' : ''}`}
        >
          Data Quality
        </button>
        <button 
          onClick={() => onSelectTab('eda')}
          className={`hover:text-slate-900 transition-colors whitespace-nowrap shrink-0 ${currentTab === 'eda' ? 'text-slate-900 font-semibold underline underline-offset-4' : ''}`}
        >
          Analytics
        </button>
        <button 
          onClick={() => onSelectTab('charts')}
          className={`hover:text-slate-900 transition-colors whitespace-nowrap shrink-0 ${currentTab === 'charts' ? 'text-slate-900 font-semibold underline underline-offset-4' : ''}`}
        >
          Chart Studio
        </button>
        <button 
          onClick={() => onSelectTab('aistory')}
          className={`hover:text-slate-900 transition-colors whitespace-nowrap shrink-0 ${currentTab === 'aistory' ? 'text-slate-900 font-semibold underline underline-offset-4' : ''}`}
        >
          AI Story
        </button>
        <button 
          onClick={() => onSelectTab('builder')}
          className={`hover:text-slate-900 transition-colors whitespace-nowrap shrink-0 ${currentTab === 'builder' ? 'text-slate-900 font-semibold underline underline-offset-4' : ''}`}
        >
          Story Builder
        </button>
        <button 
          onClick={() => onSelectTab('reports')}
          className={`hover:text-slate-900 transition-colors whitespace-nowrap shrink-0 ${currentTab === 'reports' ? 'text-slate-900 font-semibold underline underline-offset-4' : ''}`}
        >
          Reports
        </button>
      </nav>

      {/* Zone 3: 1 primary action */}
      <div className="flex items-center gap-3 shrink-0">
        <button
          onClick={() => onSelectTab('projects')}
          className="px-3 py-2 text-xs font-medium text-slate-700 bg-slate-100 hover:bg-slate-200 rounded-lg transition-colors whitespace-nowrap flex items-center gap-1.5"
        >
          <FolderOpen className="w-3.5 h-3.5" />
          Saved Projects
        </button>
        <button
          onClick={() => onSelectTab('help')}
          className="px-3 py-2 text-xs font-medium text-slate-700 bg-slate-100 hover:bg-slate-200 rounded-lg transition-colors whitespace-nowrap flex items-center gap-1.5"
        >
          <HelpCircle className="w-3.5 h-3.5" />
          Help
        </button>
        <button
          onClick={() => onSelectTab('import')}
          className="px-4 py-2 text-xs font-medium text-white bg-slate-900 rounded-lg hover:bg-slate-800 transition-colors whitespace-nowrap shrink-0 flex items-center gap-1.5 shadow-sm"
        >
          <Database className="w-3.5 h-3.5" />
          New Dataset
        </button>
      </div>
    </header>
  );
};
