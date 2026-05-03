import React from 'react';

interface Team {
  _id: string;
  teamName: string;
  captain?: string | { _id: string };
}

interface Match {
  _id: string;
  teamA: Team | null;
  teamB: Team | null;
  winner: Team | null;
  status: 'waiting' | 'ready' | 'live' | 'completed';
  isFinal?: boolean;
  roomId?: string;
  roomPassword?: string;
  isRoomReleased?: boolean;
}

const MatchCard: React.FC<{ match: Match; currentUserId?: string }> = ({ match, currentUserId }) => {
  const isWinner = (teamId?: string) => match.winner && match.winner._id === teamId;
  const isLoser = (teamId?: string) => match.winner && match.winner._id !== teamId;

  // Check if current user is part of either team
  const isUserInMatch = React.useMemo(() => {
    if (!currentUserId) return false;
    
    const getCaptainId = (team: Team | null) => {
      if (!team?.captain) return null;
      return typeof team.captain === 'string' ? team.captain : team.captain._id;
    };

    return getCaptainId(match.teamA) === currentUserId || getCaptainId(match.teamB) === currentUserId;
  }, [match.teamA, match.teamB, currentUserId]);

  return (
    <div className={`relative flex flex-col w-64 glass-card rounded-lg overflow-hidden border ${match.isFinal ? 'border-yellow-500/50 shadow-[0_0_20px_rgba(234,179,8,0.2)]' : 'border-white/10'}`}>
      {/* Status Badge */}
      <div className="absolute top-0 right-0 px-2 py-0.5 rounded-bl-lg text-[10px] font-label-caps bg-black/40 border-l border-b border-white/10">
        {match.status === 'live' && <span className="text-error animate-pulse flex items-center gap-1">🔴 LIVE</span>}
        {match.status === 'ready' && <span className="text-primary-container">READY</span>}
        {match.status === 'waiting' && <span className="text-outline">WAITING</span>}
        {match.status === 'completed' && <span className="text-tertiary">COMPLETED</span>}
      </div>

      <div className="p-3 space-y-2">
        {/* Team A */}
        <div className={`flex justify-between items-center p-2 rounded ${isWinner(match.teamA?._id) ? 'bg-primary/20 border border-primary/40' : 'bg-surface-container/50'}`}>
          <span className={`text-sm font-medium ${isLoser(match.teamA?._id) ? 'opacity-40 line-through' : 'text-white'}`}>
            {match.teamA?.teamName || 'TBD'}
          </span>
          {isWinner(match.teamA?._id) && <span className="text-primary text-xs font-bold">WINNER</span>}
        </div>

        <div className="flex justify-center items-center py-1">
          <span className="text-[10px] font-bold text-outline uppercase tracking-widest">VS</span>
        </div>

        {/* Team B */}
        <div className={`flex justify-between items-center p-2 rounded ${isWinner(match.teamB?._id) ? 'bg-primary/20 border border-primary/40' : 'bg-surface-container/50'}`}>
          <span className={`text-sm font-medium ${isLoser(match.teamB?._id) ? 'opacity-40 line-through' : 'text-white'}`}>
            {match.teamB?.teamName || 'TBD'}
          </span>
          {isWinner(match.teamB?._id) && <span className="text-primary text-xs font-bold">WINNER</span>}
        </div>

        {/* Room Details Overlay if Released - ONLY SHOW TO PARTICIPANTS */}
        {match.isRoomReleased && isUserInMatch && (
          <div className="mt-2 pt-2 border-t border-white/5 animate-in fade-in duration-500">
            <div className="flex items-center gap-1 mb-1">
              <span className="material-symbols-outlined text-[10px] text-primary">key</span>
              <p className="text-[9px] font-bold text-primary uppercase tracking-widest">Your Match Credentials</p>
            </div>
            <div className="grid grid-cols-2 gap-2">
              <div className="bg-white/5 p-1.5 rounded border border-white/5">
                <p className="text-[7px] text-slate-500 uppercase">Room ID</p>
                <p className="text-[10px] text-white font-mono">{match.roomId || '---'}</p>
              </div>
              <div className="bg-white/5 p-1.5 rounded border border-white/5">
                <p className="text-[7px] text-slate-500 uppercase">Password</p>
                <p className="text-[10px] text-white font-mono">{match.roomPassword || '---'}</p>
              </div>
            </div>
          </div>
        )}

        {/* Room Released but user NOT in match */}
        {match.isRoomReleased && !isUserInMatch && (
          <div className="mt-2 pt-2 border-t border-white/5 opacity-60">
            <div className="flex items-center gap-1">
              <span className="material-symbols-outlined text-[10px] text-slate-500">lock</span>
              <p className="text-[8px] font-bold text-slate-500 uppercase tracking-widest">Credentials Hidden for Spectators</p>
            </div>
          </div>
        )}
      </div>

      {match.isFinal && (
        <div className="bg-yellow-500/10 text-yellow-500 text-[10px] font-bold text-center py-1 border-t border-yellow-500/20 uppercase tracking-tighter">
          🏆 GRAND FINAL 🏆
        </div>
      )}
    </div>
  );
};

export default MatchCard;
