import { useState } from "react";
import {useNavigate} from "react-router-dom" 
import { createPost } from "../services/posts";

export function CreatePostForm() {

    const [message, setMessage] = useState("");
    const [submitError, setSubmitError] = useState("");
    const [image, setImage] = useState(null); // Store selected image
    const [imagePreview, setImagePreview] = useState(null); // Store image preview url
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

    // Handle image file selection
    const handleImageChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            // Validate file type
            if(!file.type.startsWith('image/')) {
                setSubmitError("Please select an image file");
                return;
            }

            // Validate file size (limit to 5MB)
            if (file.size > 5 * 1024 * 1024) {
                setSubmitError("Image must be smaller than 5MB");
                return;
            }

            setImage(file);
            
            // Create preview URL
            const reader = new FileReader(); // Creates a new FileReader instance to read the file's contents
            reader.onload = (e) => {
                setImagePreview(e.target.result); // If sucessfully read --> Set the image preview using the result of the file read (as a base64-encoded Data URL)
            };
            reader.readAsDataURL(file); // Start reading the file as a Data URL (base64-encoded).
        }
    };

    // Remove selected image
    const handleRemoveImage = () => {
        setImage(null);
        setImagePreview(null);
        // Reset the file input
        const fileInput = document.getElementById('image-upload');
        if (fileInput) {
            fileInput.value = '';
        }
    }

    function readFileAsDataURL(file) {
    return new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.onload = () => resolve(reader.result);
        reader.onerror = reject;
        reader.readAsDataURL(file);
    });
    }


    async function handleSubmit(e) {
        e.preventDefault();
        console.log("Submitting: ", message, image ? "with image" : "without image");

         setSubmitError("") // Resets any previous error messages when user tries again
        
        // get token from local storage to check for auth
        const token = localStorage.getItem("token")

        // Check auth
        if(!token) {
            navigate("/login");
            return;
        }

        try {
            const postData = {message: trimmed};

            // Convert image to base64 if present
            if (image) {
                postData.image = await readFileAsDataURL(image) // await base64 conversion
            }

            await createPost(token, postData);
            navigate("/posts");

        } catch (err) {
            console.error(err);
            setSubmitError("Failed to create post. Please try again.");
        }
    }

    return (
        <form className="box" onSubmit={handleSubmit}>
            {/* Message input field */}
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
            {/* Image upload field */}
            <div className="field">
                <label className="label">Attach Image</label>
                <div className="file has-name is-link">
                    <label className="file-label">
                        <input 
                            className="file-input" 
                            type="file" 
                            id="image-upload"
                            onChange={handleImageChange} 
                            accept="image/*" 
                    />
                    <span className="file-cta">
                        <span className="file-icon">
                            <i className="fas fa-upload"></i>
                        </span>
                        <span className="file-label">
                            Choose a file...
                        </span>
                    </span>
                    <span className="file-name">
                        {image ? image.name : "No file selected"}
                    </span>
                </label>
            </div>
        </div>

        {/* Image Preview */}
        {imagePreview && (
            <div className="field">
                <label className="label">Image Preview</label>
                <div className="box">
                    <figure className="image is-128x128">
                        <img 
                            src={imagePreview} 
                            alt="Preview" 
                            style={{ objectFit: 'cover' }}
                        />
                    </figure>
                    <button 
                        type="button" 
                        className="button is-small is-danger mt-2"
                        onClick={handleRemoveImage}
                    >
                        Remove Image
                    </button>
                </div>
            </div>
        )}


            {/* Submit button */}
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
    );
}

