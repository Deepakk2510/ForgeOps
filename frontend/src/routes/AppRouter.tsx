import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";

import MainLayout from "@/layouts/MainLayout";

import DashboardPage from "@/pages/dashboard/DashboardPage";
import RepositoriesPage from "@/pages/repositories/RepositoriesPage";
import RepositoryDetailsPage from "@/pages/repositories/RepositoryDetailsPage";
import RepositorySettingsPage from "@/pages/repositories/RepositorySettingsPage";

import IssuesPage from "@/pages/issues/IssuesPage";
import PullRequestsPage from "@/pages/pull-requests/PullRequestsPage";

import LoginPage from "@/pages/auth/LoginPage";
import RegisterPage from "@/pages/auth/RegisterPage";

import ProtectedRoute from "@/components/auth/ProtectedRoute";
import { useAuth } from "@/contexts/AuthContext";

function PublicRoute({
  children,
}: {
  children: React.ReactNode;
}) {
  const { isAuthenticated } = useAuth();

  if (isAuthenticated) {
    return <Navigate to="/" replace />;
  }

  return <>{children}</>;
}

export default function AppRouter() {
  return (
    <BrowserRouter>
      <Routes>
        {/* Public Routes */}

        <Route
          path="/login"
          element={
            <PublicRoute>
              <LoginPage />
            </PublicRoute>
          }
        />

        <Route
          path="/register"
          element={
            <PublicRoute>
              <RegisterPage />
            </PublicRoute>
          }
        />

        {/* Protected Routes */}

        <Route
          element={
            <ProtectedRoute>
              <MainLayout />
            </ProtectedRoute>
          }
        >
          <Route
            path="/"
            element={<DashboardPage />}
          />

          <Route
            path="/repositories"
            element={<RepositoriesPage />}
          />

          <Route
            path="/repositories/:id"
            element={<RepositoryDetailsPage />}
          />

          <Route
            path="/repositories/:id/settings"
            element={<RepositorySettingsPage />}
          />

          <Route
            path="/repositories/:repositoryId/issues"
            element={<IssuesPage />}
          />

          <Route
            path="/repositories/:repositoryId/pull-requests"
            element={<PullRequestsPage />}
          />
        </Route>

        {/* Fallback */}

        <Route
          path="*"
          element={<Navigate to="/" replace />}
        />
      </Routes>
    </BrowserRouter>
  );
}
