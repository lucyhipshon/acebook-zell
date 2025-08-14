import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Link } from "react-router-dom";

import { login } from "../../services/authentication";

export function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [emailError, setEmailError] = useState("");
  const [passwordError, setPasswordError] = useState("");
  const [submitError, setSubmitError] = useState("");
  const navigate = useNavigate();

  async function handleSubmit(event) {
    event.preventDefault();

    setEmailError("");
    setPasswordError("");
    setSubmitError("");

    let isValid = true;
    if (!email.trim()) {
      setEmailError("Email is required.");
      isValid = false;
    }
    if (!password.trim()) {
      setPasswordError("Password is required.");
      isValid = false;
    }

    try {
      const token = await login(email, password);
      localStorage.setItem("token", token);
      navigate("/posts");
    } catch (err) {
      console.error(err.message);
      setSubmitError(err.message);
      navigate("/login");
    }
  }

  function handleEmailChange(event) {
    setEmail(event.target.value);
  }

  function handlePasswordChange(event) {
    setPassword(event.target.value);
  }

  return (
    <div style={{
      position: "fixed",
      top: 0,
      left: 0,
      right: 0,
      bottom: 0,
      backgroundImage: "url('/rubber_duck_greet.gif')",
      backgroundSize: "cover",
      backgroundPosition: "center",
      display: "flex",
      justifyContent: "center",
      alignItems: "center",
      padding: "1rem"
    }}>
       <div className="box" style={{ 
        width: "100%",
        maxWidth: "500px",
        padding: "2rem",
      }}>
        <h1 className="title has-text-centered" style={{color: "#093FB4", fontSize: '5rem'}}>Log in</h1>
        {submitError && (
          <div className="notification is-danger" style={{ marginBottom: "1rem" }}>
            {submitError}
          </div>
        )}
        <form onSubmit={handleSubmit}>
          <div className="field">
            <p className="control has-icons-left has-icons-right">
              <input
                className={`input is-link ${emailError ? 'is-danger' : ''}`}
                id="email"
                type="email"
                placeholder="Email"
                value={email}
                onChange={handleEmailChange}
              />
                <span className="icon is-small is-left">
                  <i className="fas fa-envelope"></i>
                </span>
            </p>
            {emailError && <p className="help is-danger">{emailError}</p>}
          </div>
          <div className="field">
            <p className="control has-icons-left has-icons-right">
              <input
                className={`input is-link ${passwordError ? 'is-danger' : ''}`}
                id="password"
                type="password"
                placeholder="Password"
                value={password}
                onChange={handlePasswordChange}
              />
              <span className="icon is-small is-left">
                <i className="fas fa-lock"></i>
              </span>
            </p>
            {passwordError && <p className="help is-danger">{passwordError}</p>}
          </div>
          <div className="field">
            <p className="control">
              <button className="button is-link is-fullwidth" style={{ backgroundColor: "#093FB4" }}>
                Log in
              </button>
            </p>
          </div>
          <p>Don't have an account yet? Please{' '} 
            <Link to="/signup" className="has-text-link">
              sign up
            </Link> 
            {' '}and join the Quack community!</p>
        </form>
      </div>      
    </div>
  );
}
