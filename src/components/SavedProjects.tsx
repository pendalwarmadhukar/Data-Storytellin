import React from 'react';
import { TabType, SavedProject, DatasetSummary } from '../types';
import { FolderOpen, Trash2, ArrowRight, Database } from 'lucide-react';

interface SavedProjectsProps {
  savedProjects: SavedProject[];
  onLoadProject: (project: SavedProject) => void;
  onDeleteProject: (id: string) => void;
  onSelectTab: (tab: TabType) => void;
}

export const SavedProjects: React.FC<SavedProjectsProps> = ({
  savedProjects,
  onLoadProject,
  onDeleteProject,
  onSelectTab
}) => {
  return (
    <div className="max-w-6xl mx-auto px-6 py-10 space-y-8">
      <div>
        <h1 className="text-3xl font-extrabold text-slate-900 tracking-tight">Saved Projects & History</h1>
        <p className="text-sm text-slate-500 mt-1">Manage persistent project configurations, datasets, and saved narratives.</p>
      </div>

      {savedProjects.length === 0 ? (
        <div className="bg-white border border-slate-200 rounded-2xl p-12 text-center space-y-4">
          <FolderOpen className="w-12 h-12 text-slate-400 mx-auto" />
          <h3 className="text-lg font-semibold text-slate-900">No Saved Projects Yet</h3>
          <p className="text-sm text-slate-500">Import a dataset and generate narratives to save your projects.</p>
          <button
            onClick={() => onSelectTab('import')}
            className="px-4 py-2 bg-slate-900 text-white text-xs font-semibold rounded-xl"
          >
            Import New Dataset
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {savedProjects.map((proj) => (
            <div key={proj.id} className="bg-white border border-slate-200 rounded-2xl p-6 space-y-4 shadow-xs flex flex-col justify-between">
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-mono text-slate-500">{proj.datasetName}</span>
                  <span className="text-xs text-slate-400">{new Date(proj.updatedAt).toLocaleDateString()}</span>
                </div>
                <h3 className="text-lg font-bold text-slate-900">{proj.title}</h3>
                <p className="text-sm text-slate-600">{proj.description}</p>
              </div>

              <div className="pt-4 border-t border-slate-100 flex items-center justify-between">
                <span className="text-xs font-mono text-slate-500">{proj.rowCount} rows · {proj.columnCount} cols</span>
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => onDeleteProject(proj.id)}
                    className="p-2 bg-red-50 hover:bg-red-100 rounded-lg text-red-600"
                    title="Delete Project"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                  <button
                    onClick={() => {
                      onLoadProject(proj);
                      onSelectTab('eda');
                    }}
                    className="px-4 py-2 bg-slate-900 hover:bg-slate-800 text-white text-xs font-semibold rounded-lg flex items-center gap-1.5"
                  >
                    Open <ArrowRight className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};
