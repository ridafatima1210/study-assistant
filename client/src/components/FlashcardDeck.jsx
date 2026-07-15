import React, { useState } from 'react';

export default function FlashcardDeck({ cards }) {
  const [index, setIndex] = useState(0);
  const [flipped, setFlipped] = useState(false);

  if (!cards || cards.length === 0) return null;
  const currentCard = cards[index];

  const handleNavigation = (direction) => {
    setFlipped(false);
    setTimeout(() => {
      if (direction === 'next') {
        setIndex((prev) => (prev + 1) % cards.length);
      } else {
        setIndex((prev) => (prev - 1 + cards.length) % cards.length);
      }
    }, 150);
  };

  return (
    <div className="w-full max-w-2xl mx-auto flex flex-col gap-6 bg-slate-900/40 border border-slate-850/80 rounded-2xl p-6 backdrop-blur-md shadow-xl">
      <div 
        onClick={() => setFlipped(!flipped)}
        className="w-full h-64 perspective cursor-pointer"
      >
        <div className={`relative w-full h-full duration-300 transform-style preserve-3d ${flipped ? 'rotate-y-180' : ''}`}>
          
          {/* Front Face */}
          <div className="absolute inset-0 bg-slate-950 border border-slate-850/80 rounded-xl p-8 flex flex-col justify-between backface-hidden shadow-inner">
            <span className="text-[10px] font-mono tracking-widest text-amber-500 font-semibold uppercase">Concept Definition</span>
            <p className="text-base sm:text-lg text-slate-200 font-normal text-center my-auto px-4 leading-relaxed">{currentCard.question}</p>
            <span className="text-[10px] text-center text-slate-600 font-mono tracking-wide">Click card layer to invert view</span>
          </div>

          {/* Reverse Face */}
          <div className="absolute inset-0 bg-amber-950/20 border border-amber-800/60 rounded-xl p-8 flex flex-col justify-between backface-hidden rotate-y-180 shadow-inner">
            <span className="text-[10px] font-mono tracking-widest text-amber-400 font-semibold uppercase">Core Target Analysis</span>
            <p className="text-sm sm:text-base text-amber-100/90 text-center my-auto px-4 leading-relaxed">{currentCard.answer}</p>
            <span className="text-[10px] text-center text-amber-600 font-mono tracking-wide">Click card layer to restore view</span>
          </div>

        </div>
      </div>

      {/* Pagination Controls */}
      <div className="flex items-center justify-between border-t border-slate-850/80 pt-4 px-1">
        <button 
          onClick={(e) => { e.stopPropagation(); handleNavigation('prev'); }}
          className="px-4 py-2 bg-slate-950 hover:bg-slate-900 border border-slate-800 hover:border-slate-750 text-slate-300 rounded-lg transition-all text-xs font-medium active:scale-95"
        >
          Previous
        </button>
        <span className="text-xs font-mono text-slate-400 tracking-widest bg-slate-950 px-3 py-1.5 rounded-md border border-slate-900">
          CARD {index + 1} // {cards.length}
        </span>
        <button 
          onClick={(e) => { e.stopPropagation(); handleNavigation('next'); }}
          className="px-4 py-2 bg-slate-950 hover:bg-slate-900 border border-slate-800 hover:border-slate-750 text-slate-300 rounded-lg transition-all text-xs font-medium active:scale-95"
        >
          Next Variant
        </button>
      </div>
    </div>
  );
}