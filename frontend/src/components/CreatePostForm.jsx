import { useState } from "react";

export function CreatePostForm() {

    const [message, setMessage] = useState("");

    const maxLength = 200;
    const count = message.length
    const isEmpty = message.length === 0

    function handleSubmit(e) {
        e.preventDefault();
        console.log("Submitting: ", message)
    }

    return (
        <form className="box" onSubmit={handleSubmit}>
            <div className="field">
                <label className="label">
                    Say Something... <span>({count}/{maxLength})</span>
                </label>
                <div className="control">
                    <textarea 
                        id="post-message" 
                        className="textarea" 
                        rows={5}
                        value={message}
                        onChange={(e) => setMessage(e.target.value)}
                        maxLength={200}
                    />
                </div>
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