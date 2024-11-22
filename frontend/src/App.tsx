import { Routes, Route } from "react-router";

import Login from "./pages/Login";
import Songs from "./pages/Songs";
import Users from "./pages/Users";
import Artists from "./pages/Artists";
import Register from "./pages/Register";
import Dashboard from "./pages/Dashboard";
import { AuthProvider } from "./hooks/useAuth";
import DashboardLayout from "./layouts/DashboardLayout";
import AuthorizationGuard from "./router/authorization";
import { MustBeAuthenticated, MustNotBeAuthenticated } from "./router/authentication";

function App() {
  return (
    <AuthProvider>
      <Routes>
        <Route element={<MustNotBeAuthenticated />}>
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
        </Route>

        <Route element={<MustBeAuthenticated />}>
          <Route path="/" element={<DashboardLayout />}>
            <Route
              index
              element={
                <AuthorizationGuard
                  allowedRoles={["super_admin", "artist_manager", "artist"]}
                >
                  <Dashboard />
                </AuthorizationGuard>
              }
            />
            <Route
              path="/users"
              element={
                <AuthorizationGuard allowedRoles={["super_admin"]}>
                  <Users />
                </AuthorizationGuard>
              }
            />
            <Route
              path="/artists"
              element={
                <AuthorizationGuard allowedRoles={["super_admin", "artist_manager"]}>
                  <Artists />
                </AuthorizationGuard>
              }
            />
            <Route
              path="/artists/:id/songs"
              element={
                <AuthorizationGuard allowedRoles={["super_admin", "artist_manager"]}>
                  <Songs />
                </AuthorizationGuard>
              }
            />
            <Route
              path="/songs"
              element={
                <AuthorizationGuard allowedRoles={["artist"]}>
                  <Songs />
                </AuthorizationGuard>
              }
            />
          </Route>
        </Route>
      </Routes>
    </AuthProvider>
  );
}

export default App;
