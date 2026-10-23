import React, { useState, useEffect } from 'react';
import { TabType, DatasetSummary, SavedProject, InsightCard } from './types';
import { Navbar } from './components/Navbar';
import { HomeDashboard } from './components/HomeDashboard';
import { DataImport } from './components/DataImport';
import { DataQuality } from './components/DataQuality';
import { ExploratoryAnalysis } from './components/ExploratoryAnalysis';
import { ChartStudio } from './components/ChartStudio';
import { AiStory } from './components/AiStory';
import { StoryBuilder } from './components/StoryBuilder';
import { ReportsView } from './components/ReportsView';
import { SavedProjects } from './components/SavedProjects';
import { HelpSettings } from './components/HelpSettings';

export default function App() {
  const [currentTab, setCurrentTab] = useState<TabType>('home');
  const [currentDataset, setCurrentDataset] = useState<DatasetSummary | null>(null);
  const [savedStory, setSavedStory] = useState<any | null>(null);
  const [savedProjects, setSavedProjects] = useState<SavedProject[]>([]);

  useEffect(() => {
    const stored = localStorage.getItem('dss_projects');
    if (stored) {
      try {
        setSavedProjects(JSON.parse(stored));
      } catch (e) {
        console.error("Failed to parse stored projects", e);
      }
    }
  }, []);

  const persistProjects = (projects: SavedProject[]) => {
    setSavedProjects(projects);
    localStorage.setItem('dss_projects', JSON.stringify(projects));
  };

  const handleLoadDataset = (summary: DatasetSummary) => {
    setCurrentDataset(summary);
    setSavedStory(null);

    // Save as project automatically
    const newProj: SavedProject = {
      id: `proj-${Date.now()}`,
      title: `Analysis of ${summary.fileName}`,
      description: `Dataset containing ${summary.rowCount} rows and ${summary.columnCount} columns.`,
      datasetName: summary.fileName,
      rowCount: summary.rowCount,
      columnCount: summary.columnCount,
      updatedAt: new Date().toISOString(),
      summary
    };

    persistProjects([newProj, ...savedProjects]);
  };

  const handleUpdateDataset = (updated: DatasetSummary) => {
    setCurrentDataset(updated);
  };

  const handleSaveStory = (story: any) => {
    setSavedStory(story);
    if (currentDataset && savedProjects.length > 0) {
      const updatedProjects = savedProjects.map((p, idx) => {
        if (idx === 0) {
          return { ...p, narrative: story, updatedAt: new Date().toISOString() };
        }
        return p;
      });
      persistProjects(updatedProjects);
    }
  };

  const handleUpdateStoryCards = (cards: InsightCard[]) => {
    if (savedStory) {
      const updatedStory = { ...savedStory, insightCards: cards };
      setSavedStory(updatedStory);
    } else {
      const newStory = { executiveSummary: "Custom narrative summary", insightCards: cards };
      setSavedStory(newStory);
    }
  };

  const handleLoadProject = (project: SavedProject) => {
    setCurrentDataset(project.summary);
    setSavedStory(project.narrative || null);
  };

  const handleDeleteProject = (id: string) => {
    const updated = savedProjects.filter(p => p.id !== id);
    persistProjects(updated);
  };

  return (
    <div className="min-h-screen bg-slate-50 font-sans text-slate-950 flex flex-col antialiased">
      <Navbar 
        currentTab={currentTab} 
        onSelectTab={setCurrentTab} 
        datasetName={currentDataset?.fileName} 
      />

      <main className="flex-1">
        {currentTab === 'home' && (
          <HomeDashboard 
            onSelectTab={setCurrentTab} 
            onLoadDataset={handleLoadDataset} 
            savedProjects={savedProjects}
            currentDataset={currentDataset}
          />
        )}
        {currentTab === 'import' && (
          <DataImport 
            onLoadDataset={handleLoadDataset} 
            onSelectTab={setCurrentTab} 
            currentDataset={currentDataset}
          />
        )}
        {currentTab === 'quality' && (
          <DataQuality 
            currentDataset={currentDataset} 
            onUpdateDataset={handleUpdateDataset} 
            onSelectTab={setCurrentTab} 
          />
        )}
        {currentTab === 'eda' && (
          <ExploratoryAnalysis 
            currentDataset={currentDataset} 
            onSelectTab={setCurrentTab} 
          />
        )}
        {currentTab === 'charts' && (
          <ChartStudio 
            currentDataset={currentDataset} 
            onSelectTab={setCurrentTab} 
          />
        )}
        {currentTab === 'aistory' && (
          <AiStory 
            currentDataset={currentDataset} 
            onSelectTab={setCurrentTab} 
            onSaveStory={handleSaveStory} 
          />
        )}
        {currentTab === 'builder' && (
          <StoryBuilder 
            currentDataset={currentDataset} 
            savedStory={savedStory} 
            onSelectTab={setCurrentTab} 
            onUpdateStoryCards={handleUpdateStoryCards} 
          />
        )}
        {currentTab === 'reports' && (
          <ReportsView 
            currentDataset={currentDataset} 
            savedStory={savedStory} 
            onSelectTab={setCurrentTab} 
          />
        )}
        {currentTab === 'projects' && (
          <SavedProjects 
            savedProjects={savedProjects} 
            onLoadProject={handleLoadProject} 
            onDeleteProject={handleDeleteProject} 
            onSelectTab={setCurrentTab} 
          />
        )}
        {currentTab === 'help' && (
          <HelpSettings 
            onSelectTab={setCurrentTab} 
          />
        )}
      </main>
    </div>
  );
}
