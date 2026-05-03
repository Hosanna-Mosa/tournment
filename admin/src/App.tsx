import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "sonner";
import LoginPage from "./pages/LoginPage";
import DashboardPage from "./pages/DashboardPage";
import TournamentsPage from "./pages/TournamentsPage";
import CreateTournamentPage from "./pages/CreateTournamentPage";
import TournamentDetailPage from "./pages/TournamentDetailPage";
import BracketsPage from "./pages/BracketsPage";
import SettingsPage from "./pages/SettingsPage";
import VerifyTeamPage from "./pages/VerifyTeamPage";
import MatchControlPage from "./pages/MatchControlPage";
import RoomHubPage from "./pages/RoomHubPage";
import StreamPage from "./pages/StreamPage";
import HallOfFamePage from "./pages/HallOfFamePage";
import ModeratorsPage from "./pages/ModeratorsPage";

const queryClient = new QueryClient();

function ProtectedRoute({ children }: { children: React.ReactNode }) {
  const token = localStorage.getItem("token");
  if (!token) {
    return <Navigate to="/" replace />;
  }
  return <>{children}</>;
}

export default function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <Router>
        <Routes>
          <Route path="/" element={<LoginPage />} />
          <Route path="/dashboard" element={<ProtectedRoute><DashboardPage /></ProtectedRoute>} />
          <Route path="/tournaments" element={<ProtectedRoute><TournamentsPage /></ProtectedRoute>} />
          <Route path="/create-tournament" element={<ProtectedRoute><CreateTournamentPage /></ProtectedRoute>} />
          <Route path="/tournament-detail/:tournamentId" element={<ProtectedRoute><TournamentDetailPage /></ProtectedRoute>} />
          <Route path="/brackets" element={<ProtectedRoute><BracketsPage /></ProtectedRoute>} />
          <Route path="/settings" element={<ProtectedRoute><SettingsPage /></ProtectedRoute>} />
          <Route path="/verify-team/:teamId" element={<ProtectedRoute><VerifyTeamPage /></ProtectedRoute>} />
          <Route path="/match-control" element={<ProtectedRoute><MatchControlPage /></ProtectedRoute>} />
          <Route path="/room-hub" element={<ProtectedRoute><RoomHubPage /></ProtectedRoute>} />
          <Route path="/stream" element={<ProtectedRoute><StreamPage /></ProtectedRoute>} />
          <Route path="/hall-of-fame" element={<ProtectedRoute><HallOfFamePage /></ProtectedRoute>} />
          <Route path="/moderators" element={<ProtectedRoute><ModeratorsPage /></ProtectedRoute>} />
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </Router>
      <Toaster position="top-right" richColors />
    </QueryClientProvider>
  );
}
