import React, { useState, useEffect } from 'react';
import { ComponentType, Product, BuildState, UserPreferences, COMPONENT_ORDER } from '../types';
import { fetchRecommendations } from '../services/geminiService';

interface StepWizardProps {
  prefs: UserPreferences;
  build: BuildState;
  onUpdateBuild: (type: ComponentType, product: Product) => void;
  onComplete: () => void;
}

const StepWizard: React.FC<StepWizardProps> = ({ prefs, build, onUpdateBuild, onComplete }) => {
  const [currentStepIndex, setCurrentStepIndex] = useState(0);
  const [recommendations, setRecommendations] = useState<Product[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const currentComponentType = COMPONENT_ORDER[currentStepIndex];
  const isLastStep = currentStepIndex === COMPONENT_ORDER.length - 1;

  useEffect(() => {
    loadRecommendations();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [currentStepIndex]);

  const loadRecommendations = async () => {
    setLoading(true);
    setError(null);
    setRecommendations([]); // Clear previous
    try {
      const prods = await fetchRecommendations(currentComponentType, build, prefs);
      if (prods && prods.length > 0) {
        setRecommendations(prods);
      } else {
        setError("AI couldn't find products right now. Please try again.");
      }
    } catch (err) {
      setError("Failed to load recommendations.");
    } finally {
      setLoading(false);
    }
  };

  const handleSelect = (product: Product) => {
    onUpdateBuild(currentComponentType, product);
    if (isLastStep) {
      onComplete();
    } else {
      setCurrentStepIndex((prev) => prev + 1);
    }
  };

  return (
    <div className="flex flex-col h-full">
      <div className="mb-6">
        <h2 className="text-2xl font-bold text-white mb-2">
          Select <span className="text-indigo-400">{currentComponentType}</span>
        </h2>
        <div className="w-full bg-gray-800 h-2 rounded-full overflow-hidden">
          <div 
            className="bg-indigo-500 h-full transition-all duration-300"
            style={{ width: `${((currentStepIndex) / COMPONENT_ORDER.length) * 100}%` }}
          ></div>
        </div>
        <p className="text-gray-400 text-sm mt-2">Step {currentStepIndex + 1} of {COMPONENT_ORDER.length}</p>
      </div>

      <div className="flex-1 overflow-y-auto pr-2 pb-20 scrollbar-hide">
        {loading ? (
          <div className="flex flex-col items-center justify-center h-64 space-y-4">
             <div className="w-12 h-12 border-4 border-indigo-500 border-t-transparent rounded-full animate-spin"></div>
             <p className="text-indigo-300 animate-pulse">Consulting the AI experts...</p>
             <p className="text-xs text-gray-500">Checking compatibility & Amazon India availability</p>
          </div>
        ) : error ? (
          <div className="text-center p-8 bg-red-900/20 border border-red-800 rounded-xl">
            <p className="text-red-400 mb-4">{error}</p>
            <button 
              onClick={loadRecommendations}
              className="px-4 py-2 bg-red-600 hover:bg-red-700 rounded text-white text-sm"
            >
              Retry
            </button>
          </div>
        ) : (
          <div className="space-y-4">
            {recommendations.map((prod, idx) => (
              <div 
                key={idx}
                className="group relative p-4 bg-gray-800 border border-gray-700 rounded-xl hover:border-indigo-500 transition-all cursor-pointer hover:shadow-lg hover:shadow-indigo-500/20"
                onClick={() => handleSelect(prod)}
              >
                <div className="flex justify-between items-start">
                  <div>
                    <h3 className="font-semibold text-white group-hover:text-indigo-300">{prod.name}</h3>
                    <p className="text-xs text-gray-400 mt-1">{prod.features}</p>
                  </div>
                  <div className="text-right">
                    <span className="block text-lg font-bold text-green-400">₹{prod.price.toLocaleString('en-IN')}</span>
                    <div className="flex items-center justify-end text-yellow-500 text-xs mt-1">
                       {'★'.repeat(Math.round(prod.rating))}
                       <span className="text-gray-600 ml-1">({prod.rating})</span>
                    </div>
                  </div>
                </div>
                <div className="mt-3 pt-3 border-t border-gray-700">
                  <p className="text-sm text-gray-300 italic">" {prod.reason} "</p>
                </div>
                
                {/* Search Link Button (stops propagation to avoid selecting card when just checking link) */}
                <div className="mt-3 flex justify-end">
                   <a 
                     href={`https://www.amazon.in/s?k=${encodeURIComponent(prod.name)}`}
                     target="_blank"
                     rel="noopener noreferrer"
                     onClick={(e) => e.stopPropagation()}
                     className="text-xs text-indigo-400 hover:text-indigo-300 hover:underline flex items-center"
                   >
                     View on Amazon.in <span className="ml-1">↗</span>
                   </a>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default StepWizard;
