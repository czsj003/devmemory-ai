import { BrowserRouter, Navigate, Route, Routes } from "react-router-dom";
import ProtectedRoute from "./components/ProtectedRoute";
import AppLayout from "./layouts/AppLayout";
import BugsPage from "./pages/BugsPage";
import ChatPage from "./pages/ChatPage";
import DashboardPage from "./pages/DashboardPage";
import DecisionsPage from "./pages/DecisionsPage";
import DocumentDetailPage from "./pages/DocumentDetailPage";
import DocumentsPage from "./pages/DocumentsPage";
import InterviewPrepPage from "./pages/InterviewPrepPage";
import LoginPage from "./pages/LoginPage";
import NoteDetailPage from "./pages/NoteDetailPage";
import NotesPage from "./pages/NotesPage";
import ProjectDetailPage from "./pages/ProjectDetailPage";
import ProjectsPage from "./pages/ProjectsPage";
import RegisterPage from "./pages/RegisterPage";
import SearchPage from "./pages/SearchPage";

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Navigate to="/dashboard" replace />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/register" element={<RegisterPage />} />

        <Route element={<ProtectedRoute />}>
          <Route element={<AppLayout />}>
            <Route path="/dashboard" element={<DashboardPage />} />
            <Route path="/projects" element={<ProjectsPage />} />
            <Route path="/projects/:projectId" element={<ProjectDetailPage />} />
            <Route path="/projects/:projectId/documents" element={<DocumentsPage />} />
            <Route
              path="/projects/:projectId/documents/:documentId"
              element={<DocumentDetailPage />}
            />
            <Route path="/projects/:projectId/search" element={<SearchPage />} />
            <Route path="/projects/:projectId/notes" element={<NotesPage />} />
            <Route
              path="/projects/:projectId/notes/:noteId"
              element={<NoteDetailPage />}
            />
            <Route path="/projects/:projectId/bugs" element={<BugsPage />} />
            <Route path="/projects/:projectId/decisions" element={<DecisionsPage />} />
            <Route path="/projects/:projectId/chat" element={<ChatPage />} />
            <Route
              path="/projects/:projectId/interview-prep"
              element={<InterviewPrepPage />}
            />
          </Route>
        </Route>
      </Routes>
    </BrowserRouter>
  );
}
