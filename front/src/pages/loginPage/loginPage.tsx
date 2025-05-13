import { useState } from "react"
import "./loginPage.css"
import analyseLogo from "../../assets/analyze-it-logo.png"
import LoginComponent from "../../components/loginComponent/loginComponent"
import RegisterComponent from "../../components/registerComponent/registerComponent"





function LoginPage() {



    const [module, setModule] = useState("register")

    return (
        <div className="loginPageWrapper">
            <img src={analyseLogo} alt="Analyze it logo" />
            <div className="moduleChoice">
                <h1 onClick={() => setModule("register")}>S'inscrire</h1>
                <h1 onClick={() => setModule("login")}>Se connecter</h1>
            </div>

            {module === "register" && (<RegisterComponent />)}
            {module === "login" && (<LoginComponent />)}

            <h1>{module === "login" ? "Je me connecte" : "Je m'inscrit"}</h1>
        </div>
    )
}
export default LoginPage