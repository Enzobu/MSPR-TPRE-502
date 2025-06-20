import { Routes, Route } from "react-router-dom";
import LoginPage from "./pages/LoginPage/LoginPage";
import ProfilePage from "./pages/ProfilePage/profilePage";
import HomePage from "./pages/HomePage/HomePage";
import "./App.css";
import RequireAuth from "./components/AuthGuard/AuthGuard";

function App() {
  return (
    <>
      <a href="#main-content" className="skip-link">Aller au contenu principal</a>
      <Routes>
        <Route path="/login" element={<LoginPage />} />
        <Route
          path="/"
          element={
            <RequireAuth>
              <HomePage />
            </RequireAuth>
          }
        />
        <Route
          path="/profile"
          element={
            <RequireAuth>
              <ProfilePage />
            </RequireAuth>
          }
        />
      </Routes>
    </>
  );
}

export default App;
