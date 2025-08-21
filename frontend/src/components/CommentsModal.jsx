import { useEffect, useState } from "react";
import { getComments, createComment } from "../services/comments";
import DeleteComment from "./DeleteComment";

export default function CommentsModal({ isActive, onClose, post }) {
  const [comments, setComments] = useState([]);
  const [error, setError] = useState("");
  const [body, setBody] = useState("");

  const token = localStorage.getItem("token");

  // Fetch comments whenever the modal opens for a post
  useEffect(() => { // run this effect anytime dependencies below change
    const fetchComments = async () => { 
      try {
        setError("");
        const data = await getComments(token, post._id); // call backend for this post’s comments
        setComments(Array.isArray(data.comments) ? data.comments : []); // store an array even if response is weird
      } catch (e) {
        setError(e.message || "Failed to load comments"); // shows error if request fails
        setComments([]); // clear comments on failure
      }
    };
    fetchComments();
  }, [isActive, post?._id, token]); // re-run when modal visibility, the target post id, or the token changes

  async function handleSubmit(e) {
    e.preventDefault();
    const message = body.trim();
    if (!message) return;

    try {
      setError("");
      const result = await createComment(token, post._id, message); //call backend to create new comment
      if (result?.token) localStorage.setItem("token", result.token); // store refreshed token if backend sent one
      if (result?.comment) setComments((prev) => [result.comment, ...prev]); // prepends the newest comment to the list
      setBody(""); // clear the textarea on success
    } catch (e) {
      setError(e.message || "Failed to post comment");
    }
  }

    const formatTimeAgo = (timestamp) => { // Format time function taken from Post.jsx
    const now = new Date();
    const postTime = new Date(timestamp);

    const diffInMinutes = Math.floor((now - postTime) / (1000 * 60)); 
    if (diffInMinutes < 1) return "just now";
    if (diffInMinutes < 60) return `${diffInMinutes} minute${diffInMinutes > 1 ? 's' : ''} ago`;

    const diffInHours = Math.floor(diffInMinutes / 60);
    if (diffInHours < 24) return `${diffInHours} hour${diffInHours > 1 ? 's' : ''} ago`;
    
    const diffInDays = Math.floor(diffInHours / 24);
    return `${diffInDays} day${diffInDays > 1 ? 's' : ''} ago`;
  };

  return ( 
    <div className={`modal ${isActive ? "is-active" : ""}`}>
      <div className="modal-background" onClick={onClose} />
      <div className="modal-card">
        <header className="modal-card-head"> 
          <p className="modal-card-title">Comments</p>
          <button className="delete" onClick={onClose}></button> 
        </header>

        <section className="modal-card-body" style={{ maxHeight: "65vh" }}> 
          {error && <div className="notification is-danger is-light">{error}</div>} 

          {comments.length === 0 && !error && (
            <p className="has-text-grey">No comments yet.</p>
          )}

          {comments.map((comment) => ( // bulma media objects for rendering each comment
            <article className="media" key={comment._id}>
              <figure className="media-left">
                <div className="image is-48x48">
                  <img
                    className="is-rounded"
                    src={"http://localhost:3000/uploads/default.jpg"} // placeholder (replace with profile pic)
                    alt="profile picture"
                  />
                </div>
              </figure>
              <div className="media-content">
                <div className="content">
                  <p>
                    <strong>{comment.author.email || "Unknown"}</strong>{" "} {/* replace author email with username when possible */}
                    {comment.createdAt && (
                      <small className="has-text-grey">
                        · {formatTimeAgo(comment.createdAt)} {/* TimeAgo timestamp */}
                      </small>
                    )}
                    <br />
                    {comment.content} {/* actual comment text */}
                  </p>
                </div>
              </div>
              <DeleteComment
                comment={comment}
                onDelete={() =>
                  setComments((prev) => prev.filter((c) => c._id !== comment._id))
                }
              />
            </article>
          ))}
        </section>

        <footer className="modal-card-foot is-block"> {/* footer that holds the comment creation form */}
          <form onSubmit={handleSubmit}>
            <div className="field">
              <label className="label">Add a comment</label>
              <div className="control">
                <textarea
                  className="textarea"
                  rows={3}
                  placeholder="Say Something"
                  value={body}
                  onChange={(e) => setBody(e.target.value)}
                  maxLength={2000}
                  required // this tag is all that's required to prevent empty submit. Will make this change in create post form
                />
              </div>
            </div>

            <div className="field is-grouped is-justify-content-flex-end">
              <div className="control">
                <button
                  type="submit"
                  className={`button is-primary`}
                  disabled={!body.trim()} // disable when empty / whitespace-only
                >
                  Post comment
                </button>
              </div>
            </div>
          </form>
        </footer>
      </div>
    </div>
  );
}