import { useState } from "react";
import { deletePostById } from "../services/posts";

export function DeletePost(props) {
    const [error, setError] = useState('')
    const [isDeleting, setIsDeleting] = useState(false)
    const token = localStorage.getItem("token");

    const payload = JSON.parse(atob(token.split('.')[1]));
    const currentUserId = payload.sub; // Gets "68a63a5c93163940390f9a67" 

    const isAuthor = currentUserId === props.post?.author?._id;
    
    if (!isAuthor) {
        return null; 
    }

    const handleDeletion = async () => {
        setIsDeleting(true);
        try {
            await deletePostById(token, props.post._id)
            if (props.onDelete) {
                props.onDelete();
            }
        } catch(err) {
            setError(err.message)
            setIsDeleting(false)
        }
    }

    return (
        <div className="buttons">
            <button className="button is-link" onClick={handleDeletion} disabled={isDeleting}>
                {isDeleting ? 'Deleting..' : 'Delete quack'}
            </button>
            {error && <p className="is-danger">{error}</p>}
        </div>
    )
}