import { useState } from "react"
import "./loginPage.css"
import analyseLogo from "../../assets/analyze-it-logo.png"
import whoBackground from "../../assets/who-background.jpg"
import LoginComponent from "../../components/loginComponent/loginComponent"
import RegisterComponent from "../../components/registerComponent/registerComponent"





function LoginPage() {



    const [module, setModule] = useState("register")

    return (
        <div className="loginPageWrapper">
            <div className="loginContainer">
                <img  className="logo" src={analyseLogo} alt="Analyze it logo" />
                <div className="moduleChoice">
                    <h1 className={module === "register" ? "selected" : ""} onClick={() => setModule("register")}>S'inscrire</h1>
                    <h1 className={module === "login" ? "selected" : ""} onClick={() => setModule("login")}>Se connecter</h1>
                </div>

                {module === "register" && (<RegisterComponent />)}
                {module === "login" && (<LoginComponent />)}

                <h1 className="loginCTA">{module === "login" ? "Je me connecte" : "Je m'inscrit"}</h1>
            </div>
            <div className="whoBackground">
                <img src={whoBackground} alt="" />
            </div>
        </div>

    )
}
export default LoginPage