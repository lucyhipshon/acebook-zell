import { Link, useLocation } from "react-router-dom";
import LogoutButton from "./LogoutButton";
import "./Navbar.css";

export function Navbar() {
    const { pathname } = useLocation();
    const isFeed = pathname === "/posts" || pathname.startsWith("/posts/");
    const isProfile = pathname === "/profile" || pathname.startsWith("/profile/");

    return (
        <header className="nav">
            <div className="nav-inner">
                <div className="brand" aria-label="Quackbook">
                    <img
                        src="https://img2.annthegran.com/printart/xlarge/fsl_studio/pgfsl1771.webp"
                        alt="Quackbook duck logo"
                        className="logo"
                    />
                    <span className="name">Quackbook</span>
                </div>

                <nav className="links" aria-label="Primary">
                    <Link to="/posts" className={`nav-link ${isFeed ? "active" : ""}`}>
                        Feed
                    </Link>
                    <Link to="/profile" className={`nav-link ${isProfile ? "active" : ""}`}>
                        Profile
                    </Link>
                </nav>

                <div className="right">
                    <LogoutButton />
                </div>
            </div>
        </header>
    );
}
