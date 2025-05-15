

function LoginComponent() {

    return (
        <div className="globalContainer">
            <div className="inputContainer"> 
                <label htmlFor="email">E-mail</label>
                <input type="email" name="email" placeholder="Enter your email" />
            </div>
            <div className="inputContainer">
                <label htmlFor="password">Password</label>
                <input type="password" name="password" placeholder="Enter your password" />
            </div>
        </div>
    )
}

export default LoginComponent