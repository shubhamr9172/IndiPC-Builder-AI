import React from 'react';
import { BuildState, ComponentType } from '../types';

interface VisualizerProps {
  build: BuildState;
}

const Visualizer: React.FC<VisualizerProps> = ({ build }) => {
  const isSelected = (type: ComponentType) => !!build[type];

  // Helper to get color status
  const getStatusColor = (type: ComponentType) => 
    isSelected(type) ? 'bg-indigo-500 shadow-[0_0_15px_rgba(99,102,241,0.6)] border-indigo-400' : 'bg-gray-800 border-gray-700 opacity-50';

  const hasCase = isSelected(ComponentType.CASE);
  const hasPSU = isSelected(ComponentType.PSU);

  return (
    <div className={`relative w-full max-w-md mx-auto min-h-[500px] bg-gray-900 rounded-3xl border-4 p-6 flex flex-col shadow-2xl transform transition-transform hover:scale-[1.02] duration-300 ${hasCase ? 'border-gray-500 shadow-cyan-500/10' : 'border-gray-800'}`}>
      
      {/* Case Frame Overlay */}
      {hasCase && (
        <>
          {/* Glass Panel Glare */}
          <div className="absolute inset-2 border border-gray-700/50 rounded-2xl pointer-events-none z-40 bg-gradient-to-tr from-white/5 to-transparent"></div>
          {/* Case Feet */}
          <div className="absolute -bottom-3 left-8 w-12 h-3 bg-gray-800 rounded-b-lg"></div>
          <div className="absolute -bottom-3 right-8 w-12 h-3 bg-gray-800 rounded-b-lg"></div>
          {/* Screws */}
          <div className="absolute top-4 left-4 w-2 h-2 rounded-full bg-gray-600 z-50 flex items-center justify-center"><div className="w-1 h-0.5 bg-gray-800 rotate-45"></div></div>
          <div className="absolute top-4 right-4 w-2 h-2 rounded-full bg-gray-600 z-50 flex items-center justify-center"><div className="w-1 h-0.5 bg-gray-800 rotate-45"></div></div>
          <div className="absolute bottom-4 left-4 w-2 h-2 rounded-full bg-gray-600 z-50 flex items-center justify-center"><div className="w-1 h-0.5 bg-gray-800 rotate-45"></div></div>
          <div className="absolute bottom-4 right-4 w-2 h-2 rounded-full bg-gray-600 z-50 flex items-center justify-center"><div className="w-1 h-0.5 bg-gray-800 rotate-45"></div></div>
        </>
      )}

      {/* Case Header / Top Fans */}
      <div className={`h-12 mb-2 flex justify-center items-center space-x-4 z-10 transition-all duration-500 shrink-0 ${hasCase ? 'opacity-100 translate-y-0' : 'opacity-0 -translate-y-2'}`}>
        {hasCase ? (
          <>
            {[0, 1].map((i) => (
              <div key={i} className="relative w-10 h-10 rounded-full border-2 border-gray-700 bg-gray-800 flex items-center justify-center overflow-hidden shadow-lg shadow-cyan-900/20">
                 {/* RGB Glow */}
                 <div className="absolute inset-0 bg-cyan-500/10 animate-pulse"></div>
                 {/* Spinning Blades */}
                 <div className="w-8 h-8 border-4 border-t-cyan-500/50 border-r-transparent border-b-cyan-500/50 border-l-transparent rounded-full animate-[spin_2s_linear_infinite]"></div>
                 {/* Hub */}
                 <div className="absolute w-2 h-2 bg-gray-900 rounded-full border border-gray-600 z-10"></div>
              </div>
            ))}
          </>
        ) : (
          /* Placeholder to maintain layout height */
          <div className="h-10"></div>
        )}
      </div>

      <div className="flex-1 relative border-2 border-dashed border-gray-800 rounded-xl p-3 flex flex-col bg-gray-900/50 z-10 overflow-hidden">
        {/* Motherboard Area */}
        <div className={`flex-1 min-h-[250px] border-2 border-gray-600 rounded-lg p-2 relative transition-all duration-500 ${isSelected(ComponentType.MOTHERBOARD) ? 'bg-gray-800/80 border-indigo-500 shadow-inner' : ''}`}>
            <span className="absolute -top-3 left-2 bg-gray-900 px-2 text-xs text-gray-500 font-mono">MB</span>
            
            {/* CPU Socket */}
            <div className={`absolute top-6 left-1/2 -translate-x-1/2 w-14 h-14 border-2 flex items-center justify-center rounded-md transition-all duration-500 z-10 ${getStatusColor(ComponentType.CPU)}`}>
              <span className="text-[10px] font-bold text-white">CPU</span>
            </div>

            {/* RAM Slots */}
            <div className="absolute top-6 right-4 flex space-x-1 z-10">
              <div className={`w-1.5 h-16 rounded-sm transition-all duration-500 delay-75 ${getStatusColor(ComponentType.RAM)}`}></div>
              <div className={`w-1.5 h-16 rounded-sm transition-all duration-500 delay-150 ${getStatusColor(ComponentType.RAM)}`}></div>
            </div>

            {/* GPU Area */}
            {/* PCIe Slot marker */}
            <div className="absolute top-36 left-4 right-4 h-2 border-t-2 border-dashed border-gray-700">
               {!isSelected(ComponentType.GPU) && <span className="absolute -top-4 left-0 text-[9px] text-gray-600">PCIe x16</span>}
            </div>

            {/* The Actual GPU Card */}
            <div 
              className={`absolute top-32 left-2 right-2 h-12 bg-purple-600 rounded border-2 border-purple-400 shadow-xl flex items-center justify-between px-3 z-30 transition-all duration-700 ease-out transform origin-left ${
                isSelected(ComponentType.GPU) ? 'opacity-100 scale-100 translate-y-0' : 'opacity-0 scale-90 translate-y-4 pointer-events-none'
              }`}
            >
               {/* GPU Fans Visual */}
               <div className="flex space-x-2 items-center">
                 <div className="w-8 h-8 rounded-full border border-purple-800 bg-purple-700 flex items-center justify-center overflow-hidden relative">
                    <div className="absolute w-full h-full border-2 border-dashed border-purple-900 rounded-full animate-[spin_3s_linear_infinite] opacity-50"></div>
                 </div>
                 <div className="w-8 h-8 rounded-full border border-purple-800 bg-purple-700 flex items-center justify-center overflow-hidden relative">
                    <div className="absolute w-full h-full border-2 border-dashed border-purple-900 rounded-full animate-[spin_3s_linear_infinite] opacity-50"></div>
                 </div>
               </div>
               
               <div className="flex flex-col items-end">
                   <span className="text-[8px] font-bold text-white bg-purple-900/50 px-1 py-0.5 rounded backdrop-blur-sm">RTX/RX</span>
                   <div className="w-12 h-0.5 bg-purple-300 mt-1 rounded-full animate-pulse"></div>
               </div>
            </div>
            
             {/* Storage Area */}
            <div className={`absolute bottom-2 right-2 w-10 h-14 border border-gray-700 rounded-sm flex flex-col items-center justify-center transition-all duration-500 ${getStatusColor(ComponentType.STORAGE)}`}>
                <span className="text-[7px] text-white">SSD</span>
                <div className="w-6 h-0.5 bg-gray-900/50 mt-1 rounded"></div>
            </div>
        </div>

        {/* PSU Shroud (New Visual) */}
        <div className={`mt-2 h-20 shrink-0 rounded-lg border-2 relative transition-all duration-500 overflow-hidden z-20 ${hasPSU ? 'bg-gray-800 border-gray-600' : 'border-gray-800 border-dashed bg-transparent'}`}>
           {!hasPSU ? (
             <div className="absolute inset-0 flex items-center justify-center">
               <span className="text-xs font-bold text-gray-700">PSU Bay</span>
             </div>
           ) : (
             <div className="absolute inset-1 bg-gray-900 rounded border border-gray-700 flex items-center px-4 justify-between">
                {/* Fan Grill */}
                <div className="w-14 h-14 rounded-full border border-gray-600 bg-black flex items-center justify-center relative">
                   {/* Grill Lines */}
                   <div className="absolute inset-0 border-2 border-gray-700 rounded-full"></div>
                   <div className="absolute w-full h-[1px] bg-gray-700 rotate-0"></div>
                   <div className="absolute w-full h-[1px] bg-gray-700 rotate-45"></div>
                   <div className="absolute w-full h-[1px] bg-gray-700 rotate-90"></div>
                   <div className="absolute w-full h-[1px] bg-gray-700 -rotate-45"></div>
                   {/* Hub */}
                   <div className="absolute w-3 h-3 bg-gray-800 rounded-full z-10 border border-gray-600"></div>
                </div>

                {/* Info / Sticker */}
                <div className="flex flex-col items-end justify-center h-full space-y-1">
                   <div className="text-[8px] font-bold text-yellow-500 border border-yellow-600/50 px-1 py-0.5 rounded bg-yellow-900/20">
                     80 PLUS
                   </div>
                   <div className="flex items-center space-x-2">
                      <div className="w-6 h-2 bg-gray-700 rounded flex items-center px-0.5">
                          <div className="w-1 h-1 bg-red-500 rounded-full"></div>
                      </div>
                      <span className="text-[7px] text-gray-500 font-mono">MODULAR</span>
                   </div>
                </div>
             </div>
           )}
        </div>
      </div>

      {/* Case Footer */}
      <div className="mt-3 flex justify-between items-center h-4 px-2 z-10">
         <span className="text-[9px] text-gray-600">IndiPC Visualizer</span>
         {hasCase && <div className="flex items-center space-x-1">
             <span className="w-2 h-2 bg-green-500 rounded-full animate-pulse shadow-[0_0_5px_lime]"></span>
             <span className="text-[9px] text-cyan-400 font-mono">SYSTEM READY</span>
         </div>}
      </div>
    </div>
  );
};

export default Visualizer;