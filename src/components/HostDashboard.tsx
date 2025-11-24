import React, { useMemo, useState, useEffect } from 'react';
import { PartyState } from '../types';
import { BOARD_DATA } from '../constants';
import { updatePartyStatus, updatePartyAllowedItems } from '../services/partyService';
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, Cell } from 'recharts';
import { Share2, Users, Lock, Check, Edit, ArrowRight, Settings, Square, CheckSquare, ChevronDown, ChevronUp, Sparkles } from 'lucide-react';
import Joyride, { CallBackProps, STATUS, Step } from 'react-joyride';

interface HostDashboardProps {
  party: PartyState;
}

export const HostDashboard: React.FC<HostDashboardProps> = ({ party }) => {
  const [finalPicks, setFinalPicks] = useState<string[]>(party.finalSelections || []);

  // Safe fallback for existing parties created before allowedItemIds existed
  const activeAllowedIds = useMemo(() => {
    return party.allowedItemIds || BOARD_DATA.flatMap(c => c.items.map(i => i.id));
  }, [party.allowedItemIds]);

  // For new parties (status === 'setup'), start with no items selected. For existing parties, use activeAllowedIds
  const [tempAllowedIds, setTempAllowedIds] = useState<string[]>(
    party.status === 'setup' ? [] : activeAllowedIds
  );
  const [isEditingMenu, setIsEditingMenu] = useState(party.status === 'setup');
  const [collapsedCategories, setCollapsedCategories] = useState<Set<string>>(new Set());

  // Joyride tour state
  const [runTour, setRunTour] = useState(false);
  const tourSteps: Step[] = [
    {
      target: '.menu-setup-header',
      content: 'Welcome! This is where you customize what items guests can vote on for your charcuterie board.',
      disableBeacon: true,
    },
    {
      target: '.category-section:first-child',
      content: 'Each category shows different items. Click on items to toggle them on/off. Only selected items will appear on the voting form.',
    },
    {
      target: '.select-all-btn',
      content: 'Use "Select All" or "Deselect All" to quickly manage all items in a category.',
    },
    {
      target: '.surprise-me-btn',
      content: 'Feeling adventurous? Click "Surprise Me" to randomly select items across all categories!',
    },
    {
      target: '.start-party-btn',
      content: 'Once you\'re happy with your selections, click here to start the party and invite your guests!',
    },
  ];

  // Check if user has seen the tour
  useEffect(() => {
    const hasSeenTour = localStorage.getItem('charcuterie-host-tour-seen');
    if (!hasSeenTour && isEditingMenu && party.status === 'setup') {
      // Delay tour start to ensure DOM is ready
      const timer = setTimeout(() => setRunTour(true), 500);
      return () => clearTimeout(timer);
    }
  }, [isEditingMenu, party.status]);

  const handleJoyrideCallback = (data: CallBackProps) => {
    const { status } = data;
    const finishedStatuses: string[] = [STATUS.FINISHED, STATUS.SKIPPED];

    if (finishedStatuses.includes(status)) {
      setRunTour(false);
      localStorage.setItem('charcuterie-host-tour-seen', 'true');
    }
  };

  // Sync local state with party state if it updates from another source
  useEffect(() => {
    setFinalPicks(party.finalSelections || []);
  }, [party.finalSelections]);

  useEffect(() => {
    if (party.status === 'setup') {
      setIsEditingMenu(true);
    }
  }, [party.status]);

  // Filtered Data based on Host Config
  const filteredBoardData = useMemo(() => {
    return BOARD_DATA.map(cat => ({
      ...cat,
      items: cat.items.filter(item => activeAllowedIds.includes(item.id))
    })).filter(cat => cat.items.length > 0);
  }, [activeAllowedIds]);

  // Aggregate Votes
  const results = useMemo(() => {
    const counts: Record<string, number> = {};
    
    // Initialize zero counts for visible items
    filteredBoardData.forEach(cat => {
      cat.items.forEach(item => {
        counts[item.id] = 0;
      });
    });

    // Sum up votes (only for items that are still allowed)
    party.guests.forEach(guest => {
      Object.values(guest.votes).forEach((selectedIds: string[]) => {
        selectedIds.forEach(itemId => {
          if (counts[itemId] !== undefined) {
            counts[itemId]++;
          }
        });
      });
    });

    return counts;
  }, [party.guests, filteredBoardData]);

  // Auto-select winners logic
  useEffect(() => {
    if (party.status === 'active' && finalPicks.length === 0 && party.guests.length > 0) {
      const autoPicks: string[] = [];
      filteredBoardData.forEach(cat => {
        const catItems = cat.items
          .map(item => ({ id: item.id, votes: results[item.id] || 0 }))
          .sort((a, b) => b.votes - a.votes);
        
        catItems.slice(0, cat.selectionLimit).forEach(i => {
          if (i.votes > 0) autoPicks.push(i.id);
        });
      });
      if (autoPicks.length > 0) setFinalPicks(autoPicks);
    }
  }, [results, party.status, party.guests.length, filteredBoardData]); 

  // --- HANDLERS ---

  const togglePick = (itemId: string) => {
    if (party.status === 'finalized') return;
    setFinalPicks(prev => 
      prev.includes(itemId) ? prev.filter(id => id !== itemId) : [...prev, itemId]
    );
  };

  const handleFinalize = () => {
    if (window.confirm("Are you sure you want to finalize the board? This will close voting for guests.")) {
      updatePartyStatus(party.id, 'finalized', finalPicks);
    }
  };

  const handleReopen = () => {
    if (window.confirm("Re-open voting? Guests will be able to change their votes.")) {
      updatePartyStatus(party.id, 'active', finalPicks);
    }
  };

  const copyLink = () => {
    const url = `${window.location.origin}${window.location.pathname}#/vote/${party.id}`;
    navigator.clipboard.writeText(url);
    alert("Invitation link copied to clipboard!");
  };

  // --- SETUP MENU LOGIC ---

  const toggleAllowedItem = (itemId: string) => {
    setTempAllowedIds(prev => 
      prev.includes(itemId) ? prev.filter(id => id !== itemId) : [...prev, itemId]
    );
  };

  const toggleCategoryAll = (categoryId: string, allSelected: boolean) => {
    const categoryItems = BOARD_DATA.find(c => c.id === categoryId)?.items || [];
    const itemIds = categoryItems.map(i => i.id);
    
    if (allSelected) {
      // Deselect all
      setTempAllowedIds(prev => prev.filter(id => !itemIds.includes(id)));
    } else {
      // Select all
      const newIds = new Set([...tempAllowedIds, ...itemIds]);
      setTempAllowedIds(Array.from(newIds));
    }
  };

  const saveMenu = () => {
    updatePartyAllowedItems(party.id, tempAllowedIds);
    if (party.status === 'setup') {
      updatePartyStatus(party.id, 'active');
    }
    setIsEditingMenu(false);
  };

  const cancelEdit = () => {
    setTempAllowedIds(activeAllowedIds);
    setIsEditingMenu(false);
  };

  const toggleCategoryCollapse = (categoryId: string) => {
    setCollapsedCategories(prev => {
      const newSet = new Set(prev);
      if (newSet.has(categoryId)) {
        newSet.delete(categoryId);
      } else {
        newSet.add(categoryId);
      }
      return newSet;
    });
  };

  const handleSurpriseMe = () => {
    const randomSelections: string[] = [];
    BOARD_DATA.forEach(cat => {
      const availableItems = [...cat.items];
      const numToSelect = Math.min(
        Math.floor(Math.random() * (cat.selectionLimit + 1)),
        availableItems.length
      );

      // Shuffle and select random items
      for (let i = 0; i < numToSelect; i++) {
        const randomIndex = Math.floor(Math.random() * availableItems.length);
        randomSelections.push(availableItems[randomIndex].id);
        availableItems.splice(randomIndex, 1);
      }
    });
    setTempAllowedIds(randomSelections);
  };

  // --- RENDER: SETUP VIEW ---
  if (isEditingMenu) {
    return (
      <div className="max-w-5xl mx-auto pb-20">
        <Joyride
          steps={tourSteps}
          run={runTour}
          continuous
          showSkipButton
          showProgress
          callback={handleJoyrideCallback}
          scrollOffset={120}
          disableScrollParentFix={true}
          spotlightPadding={8}
          styles={{
            options: {
              primaryColor: '#b45309',
              textColor: '#1c1917',
              zIndex: 10000,
            },
          }}
        />
        <div className="bg-white p-8 rounded-2xl shadow-lg border border-stone-200 mb-8">
          <div className="menu-setup-header flex flex-col md:flex-row justify-between items-start md:items-center gap-6 mb-8 border-b border-stone-100 pb-6">
            <div>
              <h2 className="font-serif text-3xl font-bold text-stone-800">Setup Your Menu</h2>
              <p className="text-stone-500 mt-2">
                Uncheck items you don't want to offer. Guests will only vote on the selected items.
              </p>
            </div>
            <div className="flex gap-3">
              <button
                onClick={handleSurpriseMe}
                className="surprise-me-btn px-4 py-3 bg-[#6B7C3F] hover:bg-[#5a6735] text-white rounded-lg font-bold flex items-center gap-2 shadow-lg shadow-[#6B7C3F]/20 transition-all"
              >
                <Sparkles size={18} /> Surprise Me
              </button>
              {party.status !== 'setup' && (
                 <button onClick={cancelEdit} className="px-4 py-2 text-stone-500 hover:text-stone-800 font-bold">
                   Cancel
                 </button>
              )}
              <button
                onClick={saveMenu}
                className="start-party-btn px-6 py-3 bg-accent hover:bg-accent-hover text-white rounded-lg font-bold flex items-center gap-2 shadow-lg shadow-accent/20 transition-all"
              >
                {party.status === 'setup' ? (
                  <>Start Party & Invite Guests <ArrowRight size={18} /></>
                ) : (
                  <>Save Changes</>
                )}
              </button>
            </div>
          </div>

          <div className="space-y-8">
            {BOARD_DATA.map(cat => {
              const catItemIds = cat.items.map(i => i.id);
              const selectedCount = cat.items.filter(i => tempAllowedIds.includes(i.id)).length;
              const isAllSelected = selectedCount === cat.items.length;
              const isNoneSelected = selectedCount === 0;
              const isCollapsed = collapsedCategories.has(cat.id);

              return (
                <div key={cat.id} className="category-section bg-stone-50/50 rounded-xl p-4 border border-stone-200">
                  <div className="flex items-center justify-between mb-4">
                    <div className="flex items-center gap-3">
                      <button
                        onClick={() => toggleCategoryCollapse(cat.id)}
                        className="text-stone-600 hover:text-stone-800 transition-colors"
                      >
                        {isCollapsed ? <ChevronDown size={20} /> : <ChevronUp size={20} />}
                      </button>
                      <h3 className="font-serif text-xl font-bold text-stone-800">
                        {cat.title} {selectedCount > 0 && <span className="text-sm text-accent">({selectedCount} selected)</span>}
                      </h3>
                    </div>
                    {!isCollapsed && (
                      <button
                        onClick={() => toggleCategoryAll(cat.id, isAllSelected)}
                        className="select-all-btn text-xs font-bold text-stone-500 hover:text-accent uppercase tracking-wider"
                      >
                        {isAllSelected ? 'Deselect All' : 'Select All'}
                      </button>
                    )}
                  </div>
                  {!isCollapsed && (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
                      {cat.items.map(item => {
                        const isSelected = tempAllowedIds.includes(item.id);
                        return (
                          <div
                            key={item.id}
                            onClick={() => toggleAllowedItem(item.id)}
                            className={`
                              flex items-start gap-3 p-3 rounded-lg cursor-pointer border transition-all
                              ${isSelected ? 'bg-white border-accent/30 shadow-sm' : 'bg-stone-100 border-transparent opacity-60'}
                            `}
                          >
                            <div className={`mt-0.5 ${isSelected ? 'text-accent' : 'text-stone-400'}`}>
                              {isSelected ? <CheckSquare size={20} /> : <Square size={20} />}
                            </div>
                            <div>
                              <div className={`font-bold leading-tight ${isSelected ? 'text-stone-800' : 'text-stone-500'}`}>{item.name}</div>
                              <div className="text-xs text-stone-400 mt-1 line-clamp-1">{item.description}</div>
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  )}
                </div>
              );
            })}
          </div>

          {/* Duplicate buttons at bottom */}
          <div className="flex flex-col md:flex-row justify-center items-center gap-3 mt-8 pt-8 border-t border-stone-200">
            {party.status !== 'setup' && (
              <button onClick={cancelEdit} className="px-4 py-2 text-stone-500 hover:text-stone-800 font-bold">
                Cancel
              </button>
            )}
            <button
              onClick={saveMenu}
              className="px-6 py-3 bg-accent hover:bg-accent-hover text-white rounded-lg font-bold flex items-center gap-2 shadow-lg shadow-accent/20 transition-all"
            >
              {party.status === 'setup' ? (
                <>Start Party & Invite Guests <ArrowRight size={18} /></>
              ) : (
                <>Save Changes</>
              )}
            </button>
          </div>
        </div>
      </div>
    );
  }

  // --- RENDER: DASHBOARD VIEW ---
  
  return (
    <div className="space-y-8 pb-20">
      {/* Header */}
      <div className="bg-white p-6 rounded-2xl shadow-sm border border-stone-200 flex flex-col lg:flex-row justify-between items-center gap-6">
        <div>
          <h2 className="font-serif text-3xl font-bold text-stone-800">Host Dashboard</h2>
          <div className="flex items-center gap-2 mt-1">
            <span className="text-stone-500">Hosted by <span className="font-semibold text-accent">{party.hostName}</span></span>
            {party.status === 'finalized' && (
              <span className="bg-stone-800 text-white text-xs px-2 py-0.5 rounded font-bold flex items-center gap-1">
                <Lock size={10} /> FINALIZED
              </span>
            )}
          </div>
        </div>
        
        <div className="flex flex-wrap justify-center gap-3">
          <div className="px-4 py-2 bg-stone-100 rounded-lg flex items-center gap-2 text-stone-600">
            <Users size={18} />
            <span className="font-bold">{party.guests.length}</span> Guests
          </div>
          
          <button 
            onClick={() => setIsEditingMenu(true)}
            disabled={party.status === 'finalized'}
            className="px-4 py-2 border border-stone-300 hover:bg-stone-50 rounded-lg font-bold transition-colors flex items-center gap-2 text-stone-600 disabled:opacity-50"
          >
            <Settings size={18} /> Menu
          </button>

          <button 
            onClick={copyLink}
            className="px-5 py-2 border border-stone-300 hover:bg-stone-50 rounded-lg font-bold transition-colors flex items-center gap-2 text-stone-600"
          >
            <Share2 size={18} /> Invite
          </button>

          {party.status === 'active' ? (
            <button 
              onClick={handleFinalize}
              className="px-6 py-2 bg-green-600 hover:bg-green-700 text-white rounded-lg font-bold transition-colors flex items-center gap-2 shadow-lg shadow-green-600/20"
            >
              <Check size={18} /> Finalize Selections
            </button>
          ) : (
            <button 
              onClick={handleReopen}
              className="px-6 py-2 bg-stone-800 hover:bg-black text-white rounded-lg font-bold transition-colors flex items-center gap-2"
            >
              <Edit size={18} /> Re-open Voting
            </button>
          )}
        </div>
      </div>

      {party.status === 'active' && (
        <div className="text-sm text-stone-600 bg-amber-50 p-4 rounded-lg border border-amber-100 flex items-start gap-3">
          <div className="bg-amber-200 p-1 rounded-full mt-0.5 text-amber-800"><Edit size={12}/></div>
          <div>
            <strong>Instructions:</strong> Review the votes below. The most popular items are automatically highlighted. 
            Click any bar to toggle it as a "Final Selection". When you are happy with the list, click <strong>Finalize Selections</strong> above.
          </div>
        </div>
      )}

      {/* Results Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {filteredBoardData.map(category => {
          // Prepare data for chart
          const data = category.items
            .map(item => ({
              name: item.name,
              shortName: item.name.length > 20 ? item.name.substring(0, 18) + '...' : item.name,
              votes: results[item.id] || 0,
              id: item.id,
              isFinal: finalPicks.includes(item.id)
            }))
            .sort((a, b) => b.votes - a.votes); 

          const totalCategoryVotes = data.reduce((acc, curr) => acc + curr.votes, 0);

          return (
            <div key={category.id} className={`
               bg-white p-5 rounded-xl border transition-all
               ${party.status === 'active' ? 'border-stone-200 shadow-sm' : 'border-stone-200'}
            `}>
              <h3 className="font-serif text-xl font-bold mb-4 text-stone-800 flex justify-between border-b border-stone-100 pb-2">
                {category.title}
                <span className="text-xs font-sans font-normal text-stone-400 self-center">Limit: {category.selectionLimit}</span>
              </h3>
              
              <div className="h-80 w-full">
                {data.length > 0 ? (
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart 
                      data={data} 
                      layout="vertical" 
                      margin={{ left: 0, right: 40, top: 5, bottom: 5 }}
                    >
                      <XAxis type="number" hide />
                      <YAxis 
                        type="category" 
                        dataKey="shortName" 
                        width={140} 
                        tick={{fontSize: 11, fill: '#57534e'}} 
                        interval={0}
                      />
                      <Tooltip 
                        cursor={{fill: '#f5f5f4'}}
                        content={({ active, payload }) => {
                          if (active && payload && payload.length) {
                            const d = payload[0].payload;
                            return (
                              <div className="bg-white p-2 border border-stone-200 shadow-lg rounded text-xs">
                                <p className="font-bold">{d.name}</p>
                                <p>{d.votes} votes</p>
                                {d.isFinal && <p className="text-green-600 font-bold mt-1">Selected</p>}
                              </div>
                            );
                          }
                          return null;
                        }}
                      />
                      <Bar 
                        dataKey="votes" 
                        barSize={24}
                        radius={[0, 4, 4, 0]}
                        background={{ fill: '#f5f5f4' }} // Grey background track
                        onClick={(data) => togglePick(data.id)}
                        style={{ cursor: party.status === 'active' ? 'pointer' : 'default' }}
                      >
                        {data.map((entry, index) => (
                          <Cell 
                            key={`cell-${index}`} 
                            fill={entry.isFinal ? '#16a34a' : (entry.votes > 0 ? '#b45309' : '#d6d3d1')} 
                            className="transition-all duration-300"
                          />
                        ))}
                      </Bar>
                    </BarChart>
                  </ResponsiveContainer>
                ) : (
                  <div className="h-full flex items-center justify-center text-stone-400 text-sm italic">
                    No items in this category
                  </div>
                )}
              </div>
              
              <div className="mt-2 flex flex-wrap gap-2">
                 {data.filter(d => d.isFinal).map(d => (
                   <span key={d.id} className="text-xs bg-green-50 text-green-700 border border-green-200 px-2 py-1 rounded-full flex items-center gap-1">
                     <Check size={10} /> {d.name}
                   </span>
                 ))}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};