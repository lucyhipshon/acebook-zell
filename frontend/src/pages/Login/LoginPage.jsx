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
      navigate("/quacks");
    } catch (err) {
      console.error(err.message);
      setSubmitError(err.message || "An unexpected error occurred. Please try again.");
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
    <div className="section">
      <div className="container">
        <div className="columns">
        <div className="column is-half is-centered">
          <figure className="image is-96x96-mobile is-128x128-tablet is-128x128-desktop">
              <img className="is-rounded" src="/signup_rubberduck.gif" alt="rubber duck"/>
            </figure>
        <h1 className="has-text-centered has-text-link" style={{fontSize: "5rem", fontWeight: "bold"}}>QuackBook</h1>
          </div>
            <div className="column is-half is-centered is-7">
              <div className="box my-6 mx-6">
        <h1 className="title has-text-centered has-text-link" style={{fontSize: '5rem'}}>Log in</h1>
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
              <button className="button is-link is-fullwidth is-linked is-focused">
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
    </div>
    </div>
    </div>
  );
}
