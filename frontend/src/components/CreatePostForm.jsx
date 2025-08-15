import { useState } from "react";
import {useNavigate} from "react-router-dom" 
import { createPost } from "../services/posts";

export function CreatePostForm() {

    const [message, setMessage] = useState("");
    const [submitError, setSubmitError] = useState("");
    const navigate = useNavigate();

    const maxLength = 200;
    const count = message.length
    const trimmed = message.trim();
    const isEmpty = trimmed.length === 0

    // Clear the error message as the user starts typing
    const handleChange = (e) => {
        setMessage(e.target.value)
        if (submitError) {
            setSubmitError("");
        }
    };

    async function handleSubmit(e) {
        e.preventDefault();
        console.log("Submitting: ", message)

         setSubmitError("") // Resets any previous error messages when user tries again
        
        // get token from local storage to check for auth
        const token = localStorage.getItem("token")

        // Check auth
        if(!token) {
            navigate("/login");
            return;
        }

        try {
            // Call service function (needs token and message data - see function sig in service for context)
            await createPost(token, {message: trimmed});
            // Navigate to posts if successful
            navigate("/posts")

        } catch (err) {
            console.error(err) // for devs - error in browser console
            setSubmitError("Failed to create post. Please try again."); // for user - stay on the page and show the error
        }



    }

    return (
        <form className="box" onSubmit={handleSubmit}>
            <div className="field">
                <label className="label is-flex is-justify-content-space-between">
                    New Post <span className="has-text-grey-light">({count}/{maxLength})</span>
                </label>
                <div className="control">
                    <textarea 
                    // condtional styling using a ternary operator - red border around if error exists (e.g. api call failed)
                        className={submitError ? 'textarea is-danger' : 'textarea'}   // ternary operator --> if condition : if true : if false 
                        id="post-message"  
                        rows={5}
                        value={message}
                        onChange={handleChange}
                        maxLength={maxLength}
                        placeholder="Say something..."
                    />
                </div>
                {/* Conditional error message: only shows if submitError has content */}
                {submitError && <p className="help is-danger">{submitError}</p>}
            </div>
            <div className="field">
                <div className="control">
                    <button 
                        type="submit" 
                        className="button is-primary"
                        disabled={isEmpty}>
                        Submit
                    </button>
                </div>
            </div>
        </form>
    )
}