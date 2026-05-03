import React from 'react';
import MatchCard from './MatchCard';

interface Match {
  _id: string;
  round: number;
  matchNumber: number;
  teamA: any;
  teamB: any;
  winner: any;
  status: any;
  isFinal: boolean;
}

interface BracketTreeProps {
  matches: Match[];
  totalRounds: number;
}

const BracketTree: React.FC<BracketTreeProps> = ({ matches, totalRounds }) => {
  const getRoundName = (round: number) => {
    const roundsLeft = totalRounds - round;
    if (roundsLeft === 0) return "GRAND FINAL";
    if (roundsLeft === 1) return "SEMI FINAL";
    if (roundsLeft === 2) return "QUARTER FINAL";
    return `ROUND ${round}`;
  };

  const rounds = Array.from({ length: totalRounds }, (_, i) => i + 1);

  return (
    <div className="flex flex-row gap-16 overflow-x-auto pb-12 pt-8 min-h-[600px] items-center justify-start px-8">
      {rounds.map((round) => (
        <div key={round} className="flex flex-col gap-12 items-center min-w-[256px]">
          <h2 className="text-primary-container font-label-caps text-xs tracking-[0.2em] mb-4 bg-primary-container/10 px-4 py-1 rounded-full border border-primary-container/20">
            {getRoundName(round)}
          </h2>
          <div className="flex flex-col h-full justify-around gap-16">
            {matches
              .filter((m) => m.round === round)
              .map((match) => (
                <div key={match._id} className="relative">
                  <MatchCard match={match} />
                  {/* Connecting lines logic would go here for a more advanced visualization */}
                </div>
              ))}
          </div>
        </div>
      ))}
    </div>
  );
};

export default BracketTree;
