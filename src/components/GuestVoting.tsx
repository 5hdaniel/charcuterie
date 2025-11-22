import React, { useState, useMemo, useEffect } from 'react';
import { PartyState, Guest } from '../types';
import { BOARD_DATA } from '../constants';
import { ItemCard } from './ItemCard';
import { submitVotes, saveDraftVotes, getDraftVotes } from '../services/partyService';
import { UtensilsCrossed, CheckCircle, Lock, Clock, AlertCircle, Save } from 'lucide-react';

interface GuestVotingProps {
  party: PartyState;
  guest: Guest;
}

export const GuestVoting: React.FC<GuestVotingProps> = ({ party, guest }) => {
  // Initialize with Draft if available, otherwise existing votes, otherwise empty
  const [currentVotes, setCurrentVotes] = useState<Record<string, string[]>>(() => {
    const draft = getDraftVotes(party.id, guest.id);
    return draft || guest.votes || {};
  });
  
  const [submitted, setSubmitted] = useState(false);
  const [autoSaveStatus, setAutoSaveStatus] = useState<'saved' | 'saving'>('saved');

  // Auto-save draft whenever votes change
  useEffect(() => {
    setAutoSaveStatus('saving');
    const timer = setTimeout(() => {
      saveDraftVotes(party.id, guest.id, currentVotes);
      setAutoSaveStatus('saved');
    }, 800); // Debounce saves
    return () => clearTimeout(timer);
  }, [currentVotes, party.id, guest.id]);

  // Safe fallback for allowed items
  const allowedItemIds = useMemo(() => {
    return party.allowedItemIds || BOARD_DATA.flatMap(c => c.items.map(i => i.id));
  }, [party.allowedItemIds]);

  // Filter Data based on Allowed Items
  const filteredBoardData = useMemo(() => {
    return BOARD_DATA.map(cat => ({
      ...cat,
      items: cat.items.filter(item => allowedItemIds.includes(item.id))
    })).filter(cat => cat.items.length > 0);
  }, [allowedItemIds]);

  // --- SETUP STATE VIEW ---
  if (party.status === 'setup') {
    return (
      <div className="min-h-[60vh] flex flex-col items-center justify-center text-center p-8">
        <div className="bg-white p-12 rounded-3xl shadow-xl border border-stone-100 max-w-lg w-full">
           <div className="mx-auto w-20 h-20 bg-amber-100 text-amber-600 rounded-full flex items-center justify-center mb-6">
            <Clock size={40} />
          </div>
          <h1 className="font-serif text-3xl font-bold text-stone-800 mb-4">
            Preparing the Menu
          </h1>
          <p className="text-stone-600 text-lg">
            <strong>{party.hostName}</strong> is currently setting up the menu options.
            Please wait a moment or refresh the page in a few minutes.
          </p>
        </div>
      </div>
    );
  }

  // --- FINALIZED STATE VIEW ---
  if (party.status === 'finalized') {
    const finalItems = new Set(party.finalSelections || []);
    
    return (
      <div className="max-w-4xl mx-auto py-10">
        <div className="text-center mb-12">
          <div className="inline-flex items-center justify-center p-3 bg-stone-100 rounded-full mb-4 text-stone-600">
            <Lock size={32} />
          </div>
          <h1 className="font-serif text-4xl md:text-5xl font-bold text-stone-800 mb-4">
            The Menu is Set
          </h1>
          <p className="text-xl text-stone-600">
            <strong>{party.hostName}</strong> has finalized the charcuterie board! Here is what will be served.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {filteredBoardData.map(category => {
            const selectedInCat = category.items.filter(item => finalItems.has(item.id));
            if (selectedInCat.length === 0) return null;

            return (
              <div key={category.id} className="bg-white p-6 rounded-2xl border border-stone-200 shadow-sm">
                <h3 className="font-serif text-xl font-bold text-accent mb-4 border-b border-stone-100 pb-2">
                  {category.title}
                </h3>
                <ul className="space-y-4">
                  {selectedInCat.map(item => (
                    <li key={item.id} className="flex gap-4 items-start">
                      <div className="mt-1 text-green-600">
                        <CheckCircle size={20} />
                      </div>
                      <div>
                        <span className="font-bold text-stone-800 block">{item.name}</span>
                        <span className="text-sm text-stone-500">{item.description}</span>
                      </div>
                    </li>
                  ))}
                </ul>
              </div>
            );
          })}
        </div>
      </div>
    );
  }

  // --- VOTING STATE VIEW ---
  
  const handleToggle = (categoryId: string, itemId: string) => {
    setCurrentVotes(prev => {
      const catVotes = prev[categoryId] || [];
      const isSelected = catVotes.includes(itemId);
      
      if (isSelected) {
        // Remove
        return { ...prev, [categoryId]: catVotes.filter(id => id !== itemId) };
      } else {
        // Add (No limit enforcement)
        return { ...prev, [categoryId]: [...catVotes, itemId] };
      }
    });
  };

  const handleSubmit = () => {
    submitVotes(party.id, guest.id, currentVotes);
    setSubmitted(true);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  if (submitted) {
    return (
      <div className="min-h-[60vh] flex flex-col items-center justify-center text-center p-8">
        <div className="bg-white p-12 rounded-3xl shadow-xl border border-stone-100 max-w-lg w-full">
          <div className="mx-auto w-20 h-20 bg-green-100 text-green-600 rounded-full flex items-center justify-center mb-6">
            <CheckCircle size={40} />
          </div>
          <h2 className="font-serif text-3xl font-bold text-stone-800 mb-4">Votes Cast!</h2>
          <p className="text-stone-600 mb-8">
            Thank you, <strong>{guest.name}</strong>. Your preferences have been sent to the host. 
            Get ready for an amazing charcuterie board!
          </p>
          <button 
            onClick={() => setSubmitted(false)}
            className="text-accent hover:underline text-sm font-bold"
          >
            Change my votes
          </button>
        </div>
      </div>
    );
  }

  // Calculate progress based on visible categories only
  const totalCategories = filteredBoardData.length;
  const votedCategories = filteredBoardData.filter(cat => (currentVotes[cat.id]?.length || 0) > 0).length;
  const progress = totalCategories > 0 ? Math.round((votedCategories / totalCategories) * 100) : 0;

  if (filteredBoardData.length === 0) {
    return (
      <div className="text-center py-20">
        <div className="text-stone-500 mb-4"><AlertCircle size={48} className="mx-auto" /></div>
        <h2 className="text-2xl font-bold text-stone-800">No items available</h2>
        <p className="text-stone-500 mt-2">The host hasn't selected any items for this board yet.</p>
      </div>
    );
  }

  return (
    <div className="max-w-5xl mx-auto pb-24">
      
      {/* Header */}
      <div className="mb-10 text-center">
        <h1 className="font-serif text-4xl md:text-5xl font-bold text-stone-800 mb-4">
          Curate the Board
        </h1>
        <p className="text-stone-500 text-lg max-w-2xl mx-auto">
          Help <strong>{party.hostName}</strong> choose the perfect spread. 
          Select all the items you'd love to see on the board.
        </p>
      </div>

      {/* Progress Bar */}
      <div className="sticky top-0 z-30 bg-board-light/95 backdrop-blur-sm py-4 mb-8 border-b border-stone-200 shadow-sm">
         <div className="flex justify-between text-xs font-bold text-stone-500 mb-1 px-1 container mx-auto max-w-5xl">
            <span>YOUR PROGRESS</span>
            <span className="flex items-center gap-1">
              {autoSaveStatus === 'saving' ? (
                <span className="text-stone-400 font-normal flex items-center gap-1"><span className="animate-pulse">Saving...</span></span>
              ) : (
                <span className="text-green-600 font-normal flex items-center gap-1"><Save size={10}/> Saved</span>
              )}
              <span className="ml-2">{progress}%</span>
            </span>
         </div>
         <div className="container mx-auto max-w-5xl">
           <div className="h-2 bg-stone-200 rounded-full overflow-hidden">
             <div 
                className="h-full bg-accent transition-all duration-500 ease-out" 
                style={{ width: `${progress}%` }}
             />
           </div>
         </div>
      </div>

      {/* Categories */}
      <div className="space-y-12">
        {filteredBoardData.map(category => {
          const currentSelections = currentVotes[category.id] || [];
          
          return (
            <div key={category.id} className="scroll-mt-24" id={category.id}>
              <div className="flex items-baseline justify-between mb-6 border-b border-stone-300 pb-2">
                <h2 className="font-serif text-2xl font-bold text-stone-800">
                  {category.title}
                </h2>
                <span className="text-sm font-bold px-3 py-1 rounded-full bg-stone-200 text-stone-600">
                  Vote for your favorites
                </span>
              </div>
              
              <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-6">
                {category.items.map(item => (
                  <ItemCard
                    key={item.id}
                    item={item}
                    isSelected={currentSelections.includes(item.id)}
                    disabled={false} // Never disable, allow unlimited selection
                    onToggle={() => handleToggle(category.id, item.id)}
                  />
                ))}
              </div>
            </div>
          );
        })}
      </div>

      {/* Floating Submit Button */}
      <div className="fixed bottom-6 left-0 right-0 flex justify-center p-4 z-40 pointer-events-none">
        <button
          onClick={handleSubmit}
          disabled={votedCategories === 0}
          className={`
            pointer-events-auto
            px-8 py-4 rounded-full font-bold text-lg shadow-xl flex items-center gap-3 transition-all transform hover:scale-105
            ${votedCategories > 0 ? 'bg-stone-800 text-white hover:bg-black' : 'bg-stone-300 text-stone-500 cursor-not-allowed'}
          `}
        >
          <UtensilsCrossed size={24} />
          Submit My Selections
        </button>
      </div>
    </div>
  );
};