import "./UserRegister.css";

function UserRegister() {
  return (
    <div className="globalContainer">
      <form>
        <div className="nameContainer inputContainer">
          <label htmlFor="name">Name</label>
          <input id="name" type="text" name="name" placeholder="Enter your name" aria-required="true" />
        </div>
        <div className="lastNameContainer inputContainer">
          <label htmlFor="lastName">Last name</label>
          <input id="lastName" type="text" name="lastName" placeholder="Enter your last name" aria-required="true" />
        </div>
        <div className="emailContainer inputContainer">
          <label htmlFor="email">E-mail</label>
          <input id="email" type="email" name="email" placeholder="Enter your email" aria-required="true" />
        </div>
        <div className="passwordContainer inputContainer">
          <label htmlFor="password">Password</label>
          <input id="password" type="password" name="password" placeholder="Enter your password" aria-required="true" />
        </div>
        <button type="submit" className="loginCTA" aria-label="S'inscrire">Sign up</button>
      </form>
    </div>
  );
}
export default UserRegister;
