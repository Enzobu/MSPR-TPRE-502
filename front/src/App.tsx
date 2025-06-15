import { Routes, Route } from "react-router-dom";
import LoginPage from "./pages/LoginPage/LoginPage";
import ProfilPage from "./pages/ProfilePage/profilePage";
import "./App.css";
import RequireAuth from "./components/AuthGuard/AuthGuard";

function App() {
  return (
    <>
      <Routes>
        <Route path="/login" element={<LoginPage />} />
        <Route
          path="/profile"
          element={
            <RequireAuth>
              <ProfilPage />
            </RequireAuth>
          }
        />
      </Routes>
    </>
  );
}

export default App;
