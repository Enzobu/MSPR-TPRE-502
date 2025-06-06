import { Routes, Route } from "react-router-dom";
import LoginPage from "./pages/loginPage/loginPage";
import ProfilPage from "./pages/profilePage/profilePage";
import RequireAuth from "./components/requireAuth/requireAuth";
import "./App.css";

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
