import React, { useState } from 'react';
import { BuildState, ComponentType, UserPreferences, Product } from './types';
import Visualizer from './components/Visualizer';
import StepWizard from './components/StepWizard';
import Summary from './components/Summary';

const App: React.FC = () => {
  const [started, setStarted] = useState(false);
  const [completed, setCompleted] = useState(false);
  
  const [prefs, setPrefs] = useState<UserPreferences>({
    usage: 'Gaming',
    budgetRange: 'Mid Range (₹50k-100k)',
  });

  const [build, setBuild] = useState<BuildState>({});

  const handleStart = () => {
    setStarted(true);
    setCompleted(false);
    setBuild({});
  };

  const updateBuild = (type: ComponentType, product: Product) => {
    setBuild(prev => ({ ...prev, [type]: product }));
  };

  const resetBuild = () => {
    setStarted(false);
    setCompleted(false);
    setBuild({});
  };

  // Welcome Screen
  if (!started) {
    return (
      <div className="min-h-screen flex items-center justify-center p-4 bg-[url('https://images.unsplash.com/photo-1587202372775-e229f172b9d7?q=80&w=2574&auto=format&fit=crop')] bg-cover bg-center">
        <div className="absolute inset-0 bg-black/80 backdrop-blur-sm"></div>
        <div className="relative z-10 max-w-lg w-full bg-gray-900/90 p-8 rounded-3xl border border-gray-700 shadow-2xl">
          <h1 className="text-4xl font-bold text-center mb-2 bg-clip-text text-transparent bg-gradient-to-r from-indigo-400 to-cyan-400">
            IndiPC Builder
          </h1>
          <p className="text-center text-gray-400 mb-8">AI-Powered Custom PC Wizard for India</p>

          <div className="space-y-6">
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">What will you use this PC for?</label>
              <div className="grid grid-cols-2 gap-3">
                {['Gaming', 'Productivity', 'Casual', 'Programming'].map(u => (
                  <button
                    key={u}
                    onClick={() => setPrefs(p => ({ ...p, usage: u as any }))}
                    className={`py-3 px-4 rounded-xl text-sm font-medium border transition-all ${
                      prefs.usage === u 
                      ? 'bg-indigo-600 border-indigo-500 text-white shadow-lg shadow-indigo-500/30' 
                      : 'bg-gray-800 border-gray-700 text-gray-400 hover:bg-gray-700'
                    }`}
                  >
                    {u}
                  </button>
                ))}
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">What is your budget?</label>
              <select 
                value={prefs.budgetRange}
                onChange={(e) => setPrefs(p => ({ ...p, budgetRange: e.target.value as any }))}
                className="w-full bg-gray-800 border border-gray-700 text-white rounded-xl px-4 py-3 focus:ring-2 focus:ring-indigo-500 outline-none"
              >
                <option value="Entry Level (₹30k-50k)">Entry Level (₹30k-50k)</option>
                <option value="Mid Range (₹50k-100k)">Mid Range (₹50k-100k)</option>
                <option value="High End (₹100k-200k)">High End (₹100k-200k)</option>
                <option value="Enthusiast (₹200k+)">Enthusiast (₹200k+)</option>
              </select>
            </div>

            <button 
              onClick={handleStart}
              className="w-full py-4 bg-gradient-to-r from-indigo-600 to-purple-600 text-white font-bold rounded-xl text-lg hover:shadow-lg hover:shadow-indigo-500/40 transition transform hover:-translate-y-1"
            >
              Start Building 🚀
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col lg:flex-row max-w-7xl mx-auto p-4 lg:p-8 gap-8 print:block print:p-0">
      
      {/* Left Panel: Visualizer & Running Cost - HIDDEN ON PRINT */}
      <div className="lg:w-1/3 flex flex-col gap-6 print:hidden">
        <div className="bg-gray-900/50 p-6 rounded-3xl border border-gray-800 backdrop-blur">
          <h3 className="text-xl font-bold text-white mb-4 flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-green-500 animate-pulse"></span>
            Live Visualizer
          </h3>
          <Visualizer build={build} />
        </div>

        <div className="bg-gray-800 p-6 rounded-2xl border border-gray-700">
           <p className="text-gray-400 text-sm">Running Total</p>
           <p className="text-3xl font-bold text-white mt-1">
             ₹{Object.values(build).reduce((a, b) => a + (b?.price || 0), 0).toLocaleString('en-IN')}
           </p>
        </div>
      </div>

      {/* Right Panel: Wizard or Summary - FULL WIDTH ON PRINT */}
      <div className="lg:w-2/3 bg-gray-900 rounded-3xl border border-gray-800 p-6 lg:p-8 shadow-2xl flex flex-col relative overflow-hidden print:w-full print:bg-white print:border-none print:shadow-none print:overflow-visible print:p-0">
        {completed ? (
          <Summary build={build} onReset={resetBuild} />
        ) : (
          <StepWizard 
            prefs={prefs} 
            build={build} 
            onUpdateBuild={updateBuild} 
            onComplete={() => setCompleted(true)} 
          />
        )}
      </div>
    </div>
  );
};

export default App;