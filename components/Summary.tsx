import React from 'react';
import { BuildState, COMPONENT_ORDER } from '../types';

interface SummaryProps {
  build: BuildState;
  onReset: () => void;
}

const Summary: React.FC<SummaryProps> = ({ build, onReset }) => {
  const totalPrice = Object.values(build).reduce((acc, prod) => acc + (prod?.price || 0), 0);

  // Generate a bulk search link for Amazon (basic string search)
  const buyAllLink = `https://www.amazon.in/s?k=${Object.values(build)
    .filter(p => p)
    .map(p => p?.name.split(' ').slice(0, 3).join('+'))
    .join('+')}`;

  return (
    <div className="h-full flex flex-col print-area bg-white text-black">
      <div className="text-center mb-8">
        <h2 className="text-3xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-indigo-400 to-cyan-400 print:text-black print:bg-none">
          Your Build is Ready!
        </h2>
        <p className="text-gray-400 mt-2 print:text-black">Here is your configuration summary.</p>
      </div>

      <div className="flex-1 overflow-y-auto space-y-3 mb-6 pr-2 print:overflow-visible print:h-auto print:block">
        {COMPONENT_ORDER.map((type) => {
          const part = build[type];
          if (!part) return null;
          return (
            <div key={type} className="flex justify-between items-start p-4 bg-gray-800 rounded-lg border border-gray-700 break-inside-avoid print:bg-white print:border-gray-300 print:mb-2">
              <div className="flex-1 mr-4">
                <span className="text-xs text-indigo-400 uppercase tracking-wider block mb-1 print:text-gray-600 font-bold">{type}</span>
                <span className="text-sm text-white font-medium block print:text-black text-lg">{part.name}</span>
                <p className="text-xs text-gray-400 mt-1 italic print:text-gray-600">"{part.reason}"</p>
              </div>
              <div className="flex flex-col items-end gap-2">
                <span className="text-green-400 font-bold print:text-black">₹{part.price.toLocaleString('en-IN')}</span>
                <a 
                  href={`https://www.amazon.in/s?k=${encodeURIComponent(part.name)}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="px-3 py-1 bg-indigo-600 hover:bg-indigo-700 text-white text-xs rounded shadow transition print:hidden"
                >
                  Buy
                </a>
              </div>
            </div>
          );
        })}
      </div>

      <div className="border-t border-gray-700 pt-6 print:border-gray-300">
        <div className="flex justify-between items-end mb-6">
          <span className="text-gray-400 print:text-black">Total Estimated Cost</span>
          <span className="text-3xl font-bold text-white print:text-black">₹{totalPrice.toLocaleString('en-IN')}</span>
        </div>
        
        <div className="grid grid-cols-2 gap-4 no-print">
          <button 
            onClick={onReset}
            className="w-full py-3 rounded-xl bg-gray-800 text-white font-semibold hover:bg-gray-700 transition"
          >
            Start New Build
          </button>
          <div className="flex gap-2 w-full">
            <button 
                onClick={() => window.print()}
                className="flex-1 py-3 rounded-xl bg-gray-700 text-white font-semibold hover:bg-gray-600 transition"
            >
                PDF / Print
            </button>
            <a 
                href={buyAllLink}
                target="_blank" 
                rel="noreferrer"
                className="flex-1 py-3 rounded-xl bg-indigo-600 text-white font-semibold hover:bg-indigo-700 shadow-lg shadow-indigo-500/30 transition flex items-center justify-center"
            >
                Buy All
            </a>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Summary;