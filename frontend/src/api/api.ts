import axios from 'axios';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:8000/api';

const api = axios.create({
  baseURL: API_URL,
});

// Add a request interceptor to include JWT token
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Auth
export const login = (credentials: any) => api.post('/users/login', credentials);
export const register = (userData: any) => api.post('/users/register', userData);
export const getProfile = () => api.get('/users/profile');
export const updateProfile = (data: any) => api.put('/users/profile', data);

// Tournaments
export const getTournaments = () => api.get('/tournaments');
export const getTournamentById = (id: string) => api.get(`/tournaments/${id}`);
export const createTournament = (data: any) => api.post('/tournaments', data);
export const updateTournament = (id: string, data: any) => api.put(`/tournaments/${id}`, data);
export const deleteTournament = (id: string) => api.delete(`/tournaments/${id}`);
export const registerForTournament = (id: string, data: any) => api.post(`/tournaments/${id}/register`, data);
export const updatePayoutInfo = (id: string, data: any) => api.put(`/tournaments/${id}/payout-info`, data);
export const updatePayoutStatus = (id: string, data: any) => api.patch(`/tournaments/${id}/payout-status`, data);

// Bracket & Matches
export const generateBracket = (tournamentId: string) => api.post(`/bracket/generate/${tournamentId}`);
export const getBracket = (tournamentId: string) => api.get(`/bracket/${tournamentId}`);
export const declareWinner = (matchId: string, winnerId: string) => api.patch(`/bracket/match/${matchId}/winner`, { winnerId });
export const updateMatchStatus = (matchId: string, status: string) => api.patch(`/bracket/match/${matchId}/status`, { status });
export const setRoomDetails = (matchId: string, data: any) => api.patch(`/bracket/match/${matchId}/roomid`, data);
export const toggleRoomRelease = (matchId: string, release: boolean) => api.patch(`/bracket/match/${matchId}/release`, { release });
export const getMatchRoomId = (matchId: string) => api.get(`/bracket/match/${matchId}/roomid`);

// Leaderboard
export const getLeaderboard = () => api.get('/leaderboard');

// Teams
export const getMyTeam = (tournamentId: string) => api.get(`/teams/my-team/${tournamentId}`);
export const updateMyTeam = (tournamentId: string, data: any) => api.put(`/teams/my/${tournamentId}`, data);

// Reviews
export const getReviews = () => api.get('/reviews');
export const getAdminReviews = () => api.get('/reviews/admin');
export const createReview = (data: any) => api.post('/reviews', data);
export const updateReview = (id: string, data: any) => api.put(`/reviews/${id}`, data);
export const deleteReview = (id: string) => api.delete(`/reviews/${id}`);

// Settings
export const getSettings = () => api.get('/settings');
export const updateSettings = (data: any) => api.put('/settings', data);

export default api;
