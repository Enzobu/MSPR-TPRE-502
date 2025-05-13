

function LoginComponent() {

    return (
        <div>
            <div>
                <label htmlFor="email">E-mail</label>
                <input type="email" name="email" />
            </div>
            <div>
                <label htmlFor="password">Password</label>
                <input type="password" name="password" />
            </div>
        </div>
    )
}

export default LoginComponent