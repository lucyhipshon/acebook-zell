import { useState } from "react";
import { useNavigate, createSearchParams } from "react-router-dom";

export function SortPosts() {
    const navigate = useNavigate();
    const [isActive, setIsActive] = useState(false);

    const handleSortClick = (sortBy, order) => {
        navigate({
            search: createSearchParams({
                sort_by: sortBy,
                order: order,
            }).toString(),
        });
        setIsActive(false); 
    };

    const toggleDropdown = () => {
        setIsActive(!isActive);
    };

    return (
        <div className="has-text-right mr-5">
        <div className={`dropdown is-right ${isActive ? "is-active" : ""}`} >
            <div className="dropdown-trigger">
                <div className="buttons has-addons">
                    <button 
                        className="button is-link mb-4"
                        aria-haspopup="true"
                        aria-controls="dropdown-menu"
                        onClick={toggleDropdown}
                    >
                        <span className="icon is-small">
                            <i className="fas fa-filter"></i>
                        </span>
                        <span>Show filters</span>
                        <span className="icon is-small">
                            <i className="fas fa-angle-down" aria-hidden="true"></i>
                        </span>
                    </button>
                </div>
            </div>
            <div className="dropdown-menu" id="dropdown-menu-1" role="menu">
                <div className="dropdown-content">
                    <button onClick={() => handleSortClick("createdAt", "desc")} className="dropdown-item has-text-left">
                        Newest First
                    </button>
                    <button onClick={() => handleSortClick("createdAt", "asc")} className="dropdown-item has-text-left">
                        Oldest First
                    </button>
                    <hr className="dropdown-divider" />
                    <button onClick={() => handleSortClick("likes", "desc")} className="dropdown-item has-text-left">
                        Most Likes
                    </button>
                    <button onClick={() => handleSortClick("likes", "asc")} className="dropdown-item has-text-left">
                        Fewest Likes
                    </button>
                </div>
            </div>
        </div>
        </div>
    );
}