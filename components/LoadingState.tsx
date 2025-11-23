import React from 'react';

export const LoadingState: React.FC = () => {
  return (
    <div className="flex flex-col items-center justify-center min-h-[400px] gap-6">
      <div className="relative">
        <div className="w-16 h-16 border-4 border-pitch-light rounded-full"></div>
        <div className="absolute top-0 left-0 w-16 h-16 border-4 border-t-pitch-accent border-r-transparent border-b-transparent border-l-transparent rounded-full animate-spin"></div>
        <div className="absolute inset-0 flex items-center justify-center">
            <span className="text-xl">⚽</span>
        </div>
      </div>
      <div className="text-center space-y-2">
        <h3 className="text-xl font-display font-bold text-white animate-pulse">Scouting Matches...</h3>
        <p className="text-slate-400 text-sm">Analyzing form, reading news, and calculating probabilities.</p>
      </div>
    </div>
  );
};