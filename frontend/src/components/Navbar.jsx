import { Link, useLocation, useNavigate } from "react-router-dom";
import {useState} from "react";
import LogoutButton from "./LogoutButton";
// import "./Navbar.css";

export function Navbar() {
    const { pathname } = useLocation();
    const [isMenuOpen, setIsMenuOpen] = useState(false);
    const [searchTerm, setSearchTerm] = useState('');
    const navigate = useNavigate();
    const isFeed = pathname === "/posts" || pathname.startsWith("/posts/");
    const isProfile = pathname === "/profile" || pathname.startsWith("/profile/");
    const isUsers = pathname === "/users" || pathname.startsWith("/users/");
    const isAbout = pathname === "/about" || pathname.startsWith("/about/");

    const toggleMenu = () => {
        setIsMenuOpen(!isMenuOpen);
    };

    const handleSearch = (event) => {
        event.preventDefault();
        if (searchTerm.trim()){
            navigate(`/search?term=${encodeURIComponent(searchTerm)}`);
        }
    }

    return (
        <nav className="navbar is-link" role="navigation" aria-label="main navigation">
            <div className="navbar-brand">
                <Link to="/posts" className="navbar-item">
                    <img
                        src="https://img2.annthegran.com/printart/xlarge/fsl_studio/pgfsl1771.webp"
                        alt="Quackbook duck logo"
                        className="logo"
                    />
                    <span className="name is-size-3 has-text-weight-extrabold">QuackBook</span>
                </Link>
                <a role="button" className={`navbar-burger ${isMenuOpen ? 'is-active' : ''}`} aria-label="menu" aria-expanded={isMenuOpen} onClick={toggleMenu}>
                    <span aria-hidden="true"></span>
                    <span aria-hidden="true"></span>
                    <span aria-hidden="true"></span>
                    <span aria-hidden="true"></span>
                </a>
            </div>

                <div id="navbarBasicExample" className={`navbar-menu ${isMenuOpen ? 'is-active' : ''}`}>
                    <div className="navbar-start">
                    <Link to="/about" className={`navbar-item ${isAbout ? "active" : ""}`}>
                        About
                    </Link>
                        <Link to="/profile" className={`navbar-item ${isProfile ? "active" : ""}`}>
                        Profile
                    </Link>
                    <Link to="/createpost" className={`navbar-item ${isProfile ? "active" : ""}`}>
                        Create a Quack
                    </Link>
                    <Link to="/users" className={`navbar-item ${isUsers ? "active" : ""}`}>
                        Find friends
                    </Link>
                    </div>
                <div className="navbar-end">
                    <div className="navbar-item">
                        <form onSubmit={handleSearch}>
                            <div className="field has-addons">
                                <div className="control">
                                    <input
                                        className="input is-link"
                                        type="text"
                                        placeholder="Search posts..."
                                        value={searchTerm}
                                        onChange={(e) => setSearchTerm(e.target.value)}
                                    />
                                </div>
                            </div>
                        </form>

                    </div>
                    <div className="navbar-item">
                        <div className="buttons">
                            <div className="button is-link">
                                <LogoutButton />
                            </div>
                        </div>
                    </div>
                </div>
                </div>
        </nav>
    );
}
