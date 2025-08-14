import { Link } from "react-router-dom";
import LogoutButton from "./LogoutButton";

export function Navbar() {
    return (
        <header>
            <nav className="navbar is-light" role="navigation">
                <div className="container">
                    <div className="navbar-brand">
                        <strong>Quackbook</strong>
                    </div>

                    <div className="navbar-menu">
                        <div className="navbar-start">
                        <Link to="/posts">
                            Feed
                        </Link>
                        <Link to="/profile">
                            Profile
                        </Link>
                        </div>

                        <div className="navbar-end">
                            <div className="navbar-item">
                                <LogoutButton />
                            </div>
                        </div>
                    </div>
                </div>
            </nav>
        </header>
    )
}