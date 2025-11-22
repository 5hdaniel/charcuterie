import React, { useState, useEffect, useRef } from 'react';
import { Item } from '../types';
import { generateItemSketch } from '../services/geminiService';
import { Check, Info, Loader2 } from 'lucide-react';

interface ItemCardProps {
  item: Item;
  isSelected: boolean;
  onToggle: () => void;
  disabled: boolean; // If max selection reached and this isn't selected
}

export const ItemCard: React.FC<ItemCardProps> = ({ item, isSelected, onToggle, disabled }) => {
  const [imageSrc, setImageSrc] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [showInfo, setShowInfo] = useState(false);
  
  // Use a ref to track if we've already attempted to load to prevent double firing in StrictMode
  const attemptedLoad = useRef(false);

  useEffect(() => {
    if (attemptedLoad.current) return;
    attemptedLoad.current = true;

    const loadImg = async () => {
      setLoading(true);
      const src = await generateItemSketch(item.name, item.description);
      if (src) setImageSrc(src);
      setLoading(false);
    };
    loadImg();
  }, [item.name, item.description]);

  return (
    <div 
      className={`
        relative flex flex-col rounded-xl overflow-hidden border-2 transition-all duration-300 cursor-pointer shadow-sm group
        ${isSelected ? 'border-accent bg-board-light ring-2 ring-accent/20' : 'border-stone-200 bg-white hover:border-stone-300'}
        ${disabled && !isSelected ? 'opacity-50 cursor-not-allowed grayscale' : ''}
      `}
      onClick={() => !disabled || isSelected ? onToggle() : null}
    >
      {/* Image Area */}
      <div className="aspect-square w-full bg-white flex items-center justify-center overflow-hidden relative">
        {loading ? (
          <Loader2 className="w-6 h-6 text-stone-300 animate-spin" />
        ) : imageSrc ? (
          <img src={imageSrc} alt={item.name} className="w-full h-full object-contain p-4 mix-blend-multiply" />
        ) : (
          <div className="text-stone-300 text-xs italic">No sketch available</div>
        )}
        
        {/* Selection Indicator Overlay */}
        {isSelected && (
          <div className="absolute top-2 right-2 bg-accent text-white rounded-full p-1 shadow-md z-10 animate-in fade-in zoom-in duration-200">
            <Check size={16} strokeWidth={3} />
          </div>
        )}
      </div>

      {/* Content Area */}
      <div className="p-3 flex-1 flex flex-col justify-between border-t border-stone-100">
        <div>
          <div className="flex justify-between items-start gap-2">
            <h3 className={`font-serif font-bold leading-tight ${isSelected ? 'text-accent' : 'text-stone-800'}`}>
              {item.name}
            </h3>
            <button 
              onClick={(e) => {
                e.stopPropagation();
                setShowInfo(!showInfo);
              }}
              className="text-stone-400 hover:text-accent transition-colors"
            >
              <Info size={16} />
            </button>
          </div>
          
          {/* Inline description or popup */}
          {(showInfo || isSelected) && (
             <p className="text-xs text-stone-500 mt-2 leading-relaxed animate-in slide-in-from-top-2 fade-in duration-200">
               {item.description}
             </p>
          )}
        </div>
      </div>
    </div>
  );
};