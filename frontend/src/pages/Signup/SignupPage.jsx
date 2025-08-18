import { useState, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { Link } from "react-router-dom";
import ResponsiveSlider from "../../components/ResponsiveSlider";
import { signup } from "../../services/authentication";


export function SignupPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [birthdate, setBirthdate] = useState("");
  const [gender, setGender] = useState("");
  const [relationshipStatus, setRelationshipStatus] = useState("")
  const [job, setJob] = useState("");
  const [location, setLocation] = useState("");
  const [bio, setBio] = useState("");
  const [profilePicture, setProfilePicture] = useState(null);
  const [firstNameError, setFirstNameError] = useState("");
  const [lastNameError, setLastNameError] = useState("");
  const [emailError, setEmailError] = useState("");
  const [passwordError, setPasswordError] = useState("");
  const [confirmPasswordError, setConfirmPasswordError] = useState("");
  const [submitError, setSubmitError] = useState("");
  
  const navigate = useNavigate();
  const sliderRef = useRef();

  async function handleSubmit(event) {
    event.preventDefault();

    setFirstNameError("");
    setLastNameError("");
    setEmailError("");
    setPasswordError("");
    setConfirmPasswordError("");
    setSubmitError("");

    let isValid = true;
    if (!firstName.trim()) {
      setFirstNameError("First name is required.");
      isValid = false;
    }
    if (!lastName.trim()) {
      setLastNameError("Last name is required.");
      isValid = false;
    }
    if (!email.trim()) {
      setEmailError("Email is required.");
      isValid = false;
    }
    if (!password.trim()) {
      setPasswordError("Password is required.");
      isValid = false;
    }
    if (password !== confirmPassword) {
      setConfirmPasswordError("Passwords don't match. Try again.");
      isValid = false;
    }

    if (!isValid) {
      sliderRef.current.slickGoTo(0);
      return;
    }
    
    try {
      await signup(email, password);
      navigate("/login");
    } catch (err) {
      console.error(err);
      setSubmitError(err.message || "An unexpected error occurred. Please try again.");
      navigate("/signup");
    }
  }

  function handleEmailChange(event) {
    setEmail(event.target.value);
    setEmailError("");
  }

  function handlePasswordChange(event) {
    setPassword(event.target.value);
    setPasswordError("");
  }

  function handleConfirmPasswordChange(event) {
    setConfirmPassword(event.target.value);
    setConfirmPasswordError("");
  }

  function handleFirstNameChange(event) {
    setFirstName(event.target.value);
    setFirstNameError("");
  }

  function handleLastNameChange(event) {
    setLastName(event.target.value);
    setLastNameError("");
  }

  function handleBirthdateChange(event) {
    setBirthdate(event.target.value);
  }

  function handleGenderChange(event) {
    setGender(event.target.value);
  }

  function handleRelationshipStatusChange(event) {
    setRelationshipStatus(event.target.value);
  }

  function handleJobChange(event) {
    setJob(event.target.value);
  }

  function handleLocationChange(event) {
    setLocation(event.target.value);
  }

  function handleBioChange(event) {
    setBio(event.target.value);
  }

  function handleFileChange(event) {
    setProfilePicture(event.target.files[0]);
  }

  const sliderSettings = {
    dots: true,
    infinite: false,
    speed: 500,
    slidesToShow: 1,
    slidesToScroll: 1,
    initialSlide: 0,
    responsive: [
      {
        breakpoint: 1024,
        settings: {
          slidesToShow: 1,
          slidesToScroll: 1,
          infinite: true,
          dots: true
        }
      },
      {
        breakpoint: 600,
        settings: {
          slidesToShow: 1,
          slidesToScroll: 1,
          initialSlide: 1
        }
      },
      {
        breakpoint: 480,
        settings: {
          slidesToShow: 1,
          slidesToScroll: 1
        }
      }
    ]
  };

  return (
    <div className="section">
      <div className="container">
         <div className="columns is-centered">
            <div className="column is-full-mobile is-half-tablet is-half-desktop">
              <figure className="image is-96x96-mobile is-128x128-tablet is-128x128-desktop is-inline-block">
                <img className="is-rounded" src="/signup_rubberduck.gif" alt="rubber duck"/>
              </figure>
              <h1 className="has-text-centered has-text-link mt-3" style={{fontSize: "5rem", fontWeight: "bold"}}>QuackBook</h1>
            </div>
          <div className="column is-full-mobile is-half-tablet is-half-desktop">
            <div className="box">
            <h2 className="title has-text-centered has-text-link">Create a new quack account</h2>
              {submitError && (
              <div className="notification is-danger">
                {submitError}
              </div>
              )}
            <form onSubmit={handleSubmit}>
            <ResponsiveSlider settings={sliderSettings}ref={sliderRef}>
              {/* Slide 1*/}
              <div>
                  <div className="field is-grouped is-grouped-multiline">
                    <div className="control is-expanded">
                      <label className="label" htmlFor="firstName">First Name</label>
                      <div className="control has-icons-left">
                        <input 
                          id="firstName"
                          className={`input is-link ${firstNameError ? 'is-danger' : ''}`}
                          type="text" 
                          placeholder="First Name" 
                          value={firstName} 
                          onChange={handleFirstNameChange}
                        />
                        <span className="icon is-small is-left">
                          <i className="fas fa-user"></i>
                        </span>
                      </div>
                      {firstNameError && <p className="help is-danger">{firstNameError}</p>}
                    </div>
                    <div className="control is-expanded">
                      <label className="label" htmlFor="lastName">Last Name</label>
                      <div className="control has-icons-left">
                        <input 
                          id="lastName"
                          className={`input is-link ${lastNameError ? 'is-danger' : ''}`} 
                          type="text" 
                          placeholder="Last Name" 
                          value={lastName} 
                          onChange={handleLastNameChange}
                        />
                        <span className="icon is-small is-left">
                          <i className="fas fa-user"></i>
                        </span>
                      </div>
                      {lastNameError && <p className="help is-danger">{lastNameError}</p>}
                    </div>
                  </div>

                  <div className="field">
                    <label className="label">Email</label>
                    <div className="control has-icons-left has-icons-right">
                      <input 
                        className={`input is-link ${emailError ? 'is-danger' : ''}`} 
                        type="email" 
                        placeholder="Email" 
                        value={email} 
                        onChange={handleEmailChange}
                      />
                      <span className="icon is-small is-left">
                        <i className="fas fa-envelope"></i>
                      </span>
                    </div>
                    {emailError && <p className="help is-danger">{emailError}</p>}
                  </div>

                  <div className="field">
                    <label className="label">Password</label>
                    <div className="control has-icons-left">
                      <input
                        className={`input is-link ${passwordError ? 'is-danger' : ''}`}
                        type="password"
                        placeholder="Password"
                        value={password}
                        onChange={handlePasswordChange}
                      />
                      <span className="icon is-small is-left">
                        <i className="fas fa-lock"></i>
                      </span>
                    </div>
                    {passwordError && <p className="help is-danger">{passwordError}</p>}
                  </div>

              <div className="field">
                    <label className="label">Confirm Password</label>
                    <div className="control has-icons-left">
                      <input
                        className={`input is-link ${confirmPasswordError ? 'is-danger' : ''}`}
                        type="password"
                        placeholder="Confirm Password"
                        value={confirmPassword}
                        onChange={handleConfirmPasswordChange}
                        />
                      <span className="icon is-small is-left">
                        <i className="fas fa-lock"></i>
                      </span>
                    </div>
                    {confirmPasswordError && <p className="help is-danger">{confirmPasswordError}</p>}
                  </div>
                        </div>

              {/* Slide 2*/}
              <div>
                <div className="field">
                  <label className="label">Date of Birth</label>
                  <div className="control">
                    <input className="input is-link" type="date" value={birthdate} onChange={handleBirthdateChange}/>
                  </div>
                </div>

                <div className="field">
                  <label className="label">Gender</label>
                  <div className="control">
                    <div className="select is-link is-fullwidth">
                      <select value={gender} onChange={handleGenderChange}>
                        <option value="" disabled hidden>Select your gender</option>
                        <option value="prefer-not-to-say">Prefer not to say</option>
                        <option value="male">Male</option>
                        <option value="female">Female</option>
                        <option value="other">Non-binary</option>
                      </select>
                    </div>
                  </div>
                </div>

                <div className="field">
                  <label className="label">Relationship Status</label>
                  <div className="control">
                    <div className="select is-link is-fullwidth">
                      <select value={relationshipStatus} onChange={handleRelationshipStatusChange}>
                        <option value="" disabled hidden>Select your relationship status</option>
                        <option value="prefer-not-to-say">Prefer not to say</option>
                        <option value="single">Single</option>
                        <option value="married">Married</option>
                        <option value="engaged">Engaged</option>
                        <option value="in-a-relationship">In a relationship</option>
                      </select>
                    </div>
                  </div>
                </div>

                <div className="field">
                  <label className="label">Occupation</label>
                  <div className="control has-icons-left">
                    <input className="input is-link" type="text" placeholder="What do you do?" value={job} onChange={handleJobChange} />
                    <span className="icon is-small is-left">
                      <i className="fa-solid fa-suitcase"></i>
                    </span>
                  </div>
                </div>
                <div className="field">
                  <label className="label">Location</label>
                  <div className="control has-icons-left">
                    <input className="input is-link" type="text" placeholder="Where do you live?" value={location} onChange={handleLocationChange} />
                    <span className="icon is-small is-left">
                      <i className="fa-solid fa-location-dot"></i>
                    </span>
                  </div>
                </div>
              </div>

              {/* Slide 3 */}
              <div>
                <div className="field">
                  <label className="label">Profile Picture</label>
                  <div className="file has-name is-link">
                    <label className="file-label">
                      <input className="file-input" type="file" onChange={handleFileChange} accept="image/*" />
                      <span className="file-cta">
                        <span className="file-icon">
                          <i className="fas fa-upload"></i>
                        </span>
                        <span className="file-label">
                          Choose a file...
                        </span>
                      </span>
                      <span className="file-name">
                        {profilePicture ? profilePicture.name : "No file selected"}
                      </span>
                    </label>
                  </div>
                </div>

                <div className="field">
                  <label className="label">Bio</label>
                  <div className="control">
                    <textarea className="textarea is-link" placeholder="Tell us about yourself..." value={bio} onChange={handleBioChange} rows="4"></textarea>
                  </div>
                </div>
              </div>
            </ResponsiveSlider>
              <div className="has-text-centered mt-5">
                <button 
                  type="submit"
                  className="button is-link is-focused"
                  >
                  Submit
                </button>
            </div>
              <p className="has-text-centered mt-2">
                <Link to="/login" className="has-text-link">
                  Have already an account?
                </Link> 
              </p>
            </form>
          </div>
        </div>
      </div>
    </div>
  </div>
  );
}
