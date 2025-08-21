import { useEffect, useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { searchPosts } from "../services/posts";
import Post from "./Post";
import { Navbar } from "./Navbar";

export function SearchPosts() {    
    const [searchParams] = useSearchParams();
    const searchTerm = searchParams.get('term') || '';
    const [results, setResults] = useState([]);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState(null);
    const [currentUser, setCurrentUser] = useState(null);
    const navigate = useNavigate();

    useEffect(() => {
        const userId = localStorage.getItem("userId");
        if (userId) {
            setCurrentUser(userId);
        }
    }, []);

    useEffect(() => {
        if (!searchTerm) {
            setResults([]);
            setIsLoading(false);
            return;
        }

        const fetchResults = async () => {
            const token = localStorage.getItem("token");
            
            if (!token) {
                navigate('/login');
                return;
            }
            
            setIsLoading(true);
            setError(null);
            
            try {
                const response = await searchPosts(token, searchTerm);
                
                setResults(response.posts || []);
            } catch (err) {
                setError(err.message);
            } 
        };
        
        fetchResults();
    }, [searchTerm, navigate]);

    return (
        <div>
            <Navbar />
            <div>
                <p>
                    {searchTerm ? `Search Results for "${searchTerm}"` : 'Search Posts'}
                </p>                
                {searchTerm ? (
                    results.length > 0 ? (
                        <div className="search-results">
                            {results.map(post => (
                                post._id && (
                                    <div key={post._id} className="box mb-4">
                                        <Post 
                                            post={post} 
                                            currentUser={currentUser}
                                        />
                                    </div>
                                )
                            ))}
                        </div>
                    ) : (
                        <div>
                            <p>No posts found for "{searchTerm}"</p>
                        </div>
                    )
                ) : (
                    <div className="notification is-light">
                        <p>Enter a search term in the navbar to find posts.</p>
                    </div>
                )}
            </div>
        </div>
    );
}