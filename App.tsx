import React, { useState, useCallback } from 'react';
import { LEAGUES, PredictionResult } from './types';
import { LeagueCard } from './components/LeagueCard';
import { PredictionDisplay } from './components/PredictionDisplay';
import { LoadingState } from './components/LoadingState';
import { getPredictionsForLeague } from './services/gemini';

const App: React.FC = () => {
  const [selectedLeague, setSelectedLeague] = useState<string | null>(null);
  const [predictionResult, setPredictionResult] = useState<PredictionResult | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleGenerate = useCallback(async () => {
    if (!selectedLeague) return;

    setIsLoading(true);
    setError(null);
    setPredictionResult(null);

    try {
      const result = await getPredictionsForLeague(selectedLeague);
      setPredictionResult(result);
    } catch (err) {
      setError(err instanceof Error ? err.message : "An unexpected error occurred");
    } finally {
      setIsLoading(false);
    }
  }, [selectedLeague]);

  const handleLeagueSelect = (leagueName: string) => {
    setSelectedLeague(leagueName);
    setPredictionResult(null); // Reset result when changing league
    setError(null);
  };

  return (
    <div className="min-h-screen bg-pitch-dark text-slate-100 selection:bg-pitch-accent selection:text-pitch-dark">
      {/* Header */}
      <header className="border-b border-slate-800 bg-pitch-dark/80 backdrop-blur-md sticky top-0 z-50">
        <div className="container mx-auto px-4 h-16 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="text-2xl">⚽</span>
            <h1 className="text-xl font-display font-bold tracking-tight text-white">
              PitchProphet <span className="text-pitch-accent">AI</span>
            </h1>
          </div>
          <div className="text-xs font-mono text-slate-500 bg-slate-900 px-3 py-1 rounded-full border border-slate-800">
            Powered by Gemini 2.5
          </div>
        </div>
      </header>

      <main className="container mx-auto px-4 py-8 max-w-6xl">
        {/* Intro */}
        <div className="text-center mb-12 space-y-4">
          <h2 className="text-4xl md:text-5xl font-display font-bold text-white leading-tight">
            Predict the Beautiful Game
          </h2>
          <p className="text-slate-400 max-w-2xl mx-auto text-lg">
            Select a league below. Our AI analyzes real-time standings, team form, injuries, and news to predict the outcome of the top 3 teams' next matches.
          </p>
        </div>

        {/* League Selection */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
          {LEAGUES.map((league) => (
            <LeagueCard
              key={league.id}
              {...league}
              isSelected={selectedLeague === league.name}
              onClick={() => handleLeagueSelect(league.name)}
            />
          ))}
        </div>

        {/* Action Area */}
        <div className="flex flex-col items-center mb-12">
            <button
              onClick={handleGenerate}
              disabled={!selectedLeague || isLoading}
              className={`
                px-8 py-4 rounded-full font-bold text-lg font-display tracking-wide transition-all duration-300 shadow-lg
                ${!selectedLeague 
                  ? 'bg-slate-800 text-slate-500 cursor-not-allowed' 
                  : isLoading 
                    ? 'bg-pitch-light text-pitch-accent border border-pitch-accent cursor-wait'
                    : 'bg-pitch-accent text-pitch-dark hover:bg-emerald-400 hover:shadow-emerald-500/20 hover:scale-105 active:scale-95'}
              `}
            >
              {isLoading ? 'Analyzing Data...' : selectedLeague ? `Predict ${selectedLeague}` : 'Select a League'}
            </button>
            {!selectedLeague && (
              <p className="mt-3 text-sm text-slate-500 animate-bounce">👆 Pick a league to start</p>
            )}
        </div>

        {/* Error Message */}
        {error && (
          <div className="bg-red-500/10 border border-red-500/20 text-red-200 p-4 rounded-lg text-center mb-8 max-w-2xl mx-auto">
            <p className="font-bold">Error</p>
            <p className="text-sm">{error}</p>
          </div>
        )}

        {/* Results Area */}
        <div className="min-h-[200px]">
          {isLoading && <LoadingState />}
          {!isLoading && predictionResult && (
            <PredictionDisplay result={predictionResult} />
          )}
        </div>
      </main>

      <footer className="border-t border-slate-800 mt-20 py-8 text-center text-slate-600 text-sm">
        <p>© {new Date().getFullYear()} PitchProphet AI. Predictions are estimates based on available data.</p>
      </footer>
    </div>
  );
};

export default App;