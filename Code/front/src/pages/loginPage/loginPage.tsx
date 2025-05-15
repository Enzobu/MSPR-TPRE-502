import { useState } from "react"
import "./loginPage.css"
import analyseLogo from "../../assets/analyze-it-logo.png"
import whoBackground from "../../assets/who_background.jpg"
import LoginComponent from "../../components/loginComponent/loginComponent"
import RegisterComponent from "../../components/registerComponent/registerComponent"


function LoginPage() {

    const [module, setModule] = useState("register")

    return (
        <div className="loginPageWrapper">
            <form onSubmit={() => { console.log("kikou");
            }} className="formContainer">
                <div className="loginContainer">
                    <div className="logo">
                        <img src={analyseLogo} alt="Analyze it logo" />
                        <h3>{module === "login" ? "Welcome back" : "Getting started now"}</h3>
                    </div>


                    {module === "register" && (<RegisterComponent />)}
                    {module === "login" && (<LoginComponent />)}

                    <button type="submit" className="loginCTA">{module === "login" ? "Sign In" : "Sign Up"}</button>

                    <hr />

                    <div className="loginSwitch">
                        {module === "login" && (<p><b>Not registered yet? : </b>
                            <span onClick={() => setModule("register")}>Register</span></p>)}

                        {module === "register" && (<p><b>Already registered? : </b>
                            <span onClick={() => setModule("login")}>Log in</span></p>)}
                    </div>
                </div>
            </form>
            <div className="whoBackground">
                <img src={whoBackground} alt="Who background image" />
            </div>


        </div>

    )
}
export default LoginPage