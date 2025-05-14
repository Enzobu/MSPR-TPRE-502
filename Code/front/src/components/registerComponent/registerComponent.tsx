
import "./registerComponent.css"

function RegisterComponent() {


    return (
        <div className="globalContainer">
            <div className="nameContainer inputContainer">
                <label htmlFor="name">Name</label>
                <input type="text" name="name" placeholder="Enter your name" />
            </div>
            <div className="lastNameContainer inputContainer">
                <label htmlFor="lastName">Last name</label>
                <input type="text" name="lastName" placeholder="Enter your last name" />
            </div>
            <div className="emailContainer inputContainer">
                <label htmlFor="email">E-mail</label>
                <input type="email" name="email" placeholder="Enter your email" />
            </div>
            <div className="passwordContainer inputContainer">
                <label htmlFor="password">Password</label>
                <input type="password" name="password" placeholder="Enter your password" />
            </div>
        </div>
    )
}
export default RegisterComponent;