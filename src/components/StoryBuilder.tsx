import React, { useState } from 'react';
import { TabType, InsightCard, DatasetSummary } from '../types';
import { Layers, Plus, Trash2, Edit3, ArrowUp, ArrowDown, ArrowRight, Save } from 'lucide-react';

interface StoryBuilderProps {
  currentDataset: DatasetSummary | null;
  savedStory: any | null;
  onSelectTab: (tab: TabType) => void;
  onUpdateStoryCards: (cards: InsightCard[]) => void;
}

export const StoryBuilder: React.FC<StoryBuilderProps> = ({
  currentDataset,
  savedStory,
  onSelectTab,
  onUpdateStoryCards
}) => {
  const initialCards: InsightCard[] = savedStory?.insightCards || [
    {
      id: 'card-1',
      title: 'Executive Overview',
      explanation: 'Initial dataset intake and quality verification.',
      keyFigure: currentDataset ? `${currentDataset.rowCount} Rows` : '0 Rows',
      takeaway: 'Dataset is clean and structurally sound for advanced analysis.'
    },
    {
      id: 'card-2',
      title: 'Metric Concentration',
      explanation: 'Analysis of key distribution centers across primary dimensions.',
      keyFigure: 'Balanced',
      takeaway: 'High statistical confidence across segments.'
    }
  ];

  const [cards, setCards] = useState<InsightCard[]>(initialCards);
  const [newTitle, setNewTitle] = useState('');
  const [newExplanation, setNewExplanation] = useState('');
  const [newKeyFigure, setNewKeyFigure] = useState('');
  const [newTakeaway, setNewTakeaway] = useState('');

  const handleAddCard = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTitle.trim()) return;

    const card: InsightCard = {
      id: `card-${Date.now()}`,
      title: newTitle,
      explanation: newExplanation || 'Detailed observation from data analysis.',
      keyFigure: newKeyFigure || 'N/A',
      takeaway: newTakeaway || 'Key action item or insight.'
    };

    const updated = [...cards, card];
    setCards(updated);
    onUpdateStoryCards(updated);
    setNewTitle('');
    setNewExplanation('');
    setNewKeyFigure('');
    setNewTakeaway('');
  };

  const handleDeleteCard = (id: string) => {
    const updated = cards.filter(c => c.id !== id);
    setCards(updated);
    onUpdateStoryCards(updated);
  };

  const handleMoveCard = (index: number, direction: 'up' | 'down') => {
    if ((direction === 'up' && index === 0) || (direction === 'down' && index === cards.length - 1)) return;
    const targetIndex = direction === 'up' ? index - 1 : index + 1;
    const updated = [...cards];
    const temp = updated[index];
    updated[index] = updated[targetIndex];
    updated[targetIndex] = temp;
    setCards(updated);
    onUpdateStoryCards(updated);
  };

  return (
    <div className="max-w-6xl mx-auto px-6 py-10 space-y-10">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-extrabold text-slate-900 tracking-tight">Story Builder</h1>
          <p className="text-sm text-slate-500 mt-1">Assemble, edit, and reorder narrative insight cards into a cohesive data story.</p>
        </div>
        <button
          onClick={() => onSelectTab('reports')}
          className="px-5 py-2.5 bg-slate-900 hover:bg-slate-800 text-white text-xs font-semibold rounded-xl transition-colors flex items-center gap-2"
        >
          Proceed to Reports <ArrowRight className="w-4 h-4" />
        </button>
      </div>

      {/* Add Card Form */}
      <div className="bg-white border border-slate-200 rounded-2xl p-8 space-y-6 shadow-xs">
        <h3 className="text-lg font-bold text-slate-900">Add New Insight Card</h3>
        <form onSubmit={handleAddCard} className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">Card Title</label>
            <input
              type="text"
              value={newTitle}
              onChange={(e) => setNewTitle(e.target.value)}
              placeholder="e.g., Regional Revenue Surge"
              className="w-full p-3 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-900"
              required
            />
          </div>
          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">Key Figure / Metric</label>
            <input
              type="text"
              value={newKeyFigure}
              onChange={(e) => setNewKeyFigure(e.target.value)}
              placeholder="e.g., +42% YoY"
              className="w-full p-3 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-900"
            />
          </div>
          <div className="md:col-span-2">
            <label className="block text-xs font-semibold text-slate-700 mb-1">Detailed Explanation</label>
            <textarea
              value={newExplanation}
              onChange={(e) => setNewExplanation(e.target.value)}
              placeholder="Explain the finding with supporting evidence..."
              className="w-full p-3 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-900"
              rows={2}
            />
          </div>
          <div className="md:col-span-2">
            <label className="block text-xs font-semibold text-slate-700 mb-1">Key Takeaway</label>
            <input
              type="text"
              value={newTakeaway}
              onChange={(e) => setNewTakeaway(e.target.value)}
              placeholder="Actionable conclusion or takeaway..."
              className="w-full p-3 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-900"
            />
          </div>
          <div className="md:col-span-2 flex justify-end">
            <button
              type="submit"
              className="px-6 py-3 bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-semibold rounded-xl transition-colors shadow-sm flex items-center gap-2"
            >
              <Plus className="w-4 h-4" /> Add Insight Card
            </button>
          </div>
        </form>
      </div>

      {/* Cards List */}
      <div className="space-y-6">
        <h3 className="text-lg font-bold text-slate-900">Ordered Narrative Cards ({cards.length})</h3>
        <div className="space-y-4">
          {cards.map((card, idx) => (
            <div key={card.id} className="bg-white border border-slate-200 rounded-2xl p-6 flex items-start justify-between gap-6 shadow-xs">
              <div className="space-y-3 flex-1">
                <div className="flex items-center gap-3">
                  <span className="w-6 h-6 rounded-full bg-slate-900 text-white text-xs font-bold flex items-center justify-center font-mono">
                    {idx + 1}
                  </span>
                  <h4 className="text-base font-bold text-slate-900">{card.title}</h4>
                  <span className="px-2.5 py-1 bg-indigo-50 text-indigo-700 text-xs font-bold rounded-md font-mono">
                    {card.keyFigure}
                  </span>
                </div>
                <p className="text-sm text-slate-600">{card.explanation}</p>
                <div className="p-3 bg-slate-50 rounded-xl text-xs font-medium text-slate-800 border border-slate-100">
                  <span className="font-semibold text-slate-900">Takeaway:</span> {card.takeaway}
                </div>
              </div>

              <div className="flex items-center gap-2 shrink-0">
                <button
                  onClick={() => handleMoveCard(idx, 'up')}
                  disabled={idx === 0}
                  className="p-2 bg-slate-100 hover:bg-slate-200 rounded-lg text-slate-700 disabled:opacity-30"
                  title="Move Up"
                >
                  <ArrowUp className="w-4 h-4" />
                </button>
                <button
                  onClick={() => handleMoveCard(idx, 'down')}
                  disabled={idx === cards.length - 1}
                  className="p-2 bg-slate-100 hover:bg-slate-200 rounded-lg text-slate-700 disabled:opacity-30"
                  title="Move Down"
                >
                  <ArrowDown className="w-4 h-4" />
                </button>
                <button
                  onClick={() => handleDeleteCard(card.id)}
                  className="p-2 bg-red-50 hover:bg-red-100 rounded-lg text-red-600"
                  title="Delete Card"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
