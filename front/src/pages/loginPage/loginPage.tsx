import { useState } from "react";
import "./loginPage.css";
import analyseLogo from "../../assets/analyze-it-logo.png";
import whoBackground from "../../assets/who_background.jpg";
import LoginComponent from "../../components/UserLogin/UserLogin";
import UserRegister from "../../components/UserRegister/UserRegister";

function LoginPage() {
  const [module, setModule] = useState("login");

  return (
    <div className="loginPageWrapper">
      <div>
        <div className="loginContainer">
          <div className="logo">
            <img src={analyseLogo} alt="Analyze it logo" />
            <h3>
              {module === "login" ? "Welcome back" : "Getting started now"}
            </h3>
          </div>
          {module === "login" && <LoginComponent />}
          {module === "register" && <UserRegister />}
          <hr />
          <div className="loginSwitch">
            {module === "login" && (
              <p>
                <b>Not registered yet? : </b>
                <span onClick={() => setModule("register")}>Register</span>
              </p>
            )}
            {module === "register" && (
              <p>
                <b>Already registered? : </b>
                <span onClick={() => setModule("login")}>Log in</span>
              </p>
            )}
          </div>
        </div>
      </div>
      <div className="whoBackground">
        <img src={whoBackground} alt="Who background image" />
      </div>
    </div>
  );
}
export default LoginPage;
