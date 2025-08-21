import { useState } from "react";
import { deleteComment } from "../services/comments";

export default function DeleteComment({ comment, onDelete }) {
  const [error, setError] = useState("");
  const [isDeleting, setIsDeleting] = useState(false);
  const token = localStorage.getItem("token");

  // decode JWT payload like DeletePost.jsx does
  const payload = token ? JSON.parse(atob(token.split(".")[1])) : null;
  const currentUserId = payload?.sub;

  const isAuthor = currentUserId && comment?.author?._id === currentUserId;
  if (!isAuthor) return null;

  const handleDeletion = async () => {
    setIsDeleting(true);
    try {
      const res = await deleteComment(token, comment._id);
      if (res?.token) localStorage.setItem("token", res.token);
      onDelete?.();
    } catch (err) {
      setError(err.message || "Failed to delete comment");
      setIsDeleting(false);
    }
  };

  return (
    <div>
      <button
        className="button is-light is-small"
        onClick={handleDeletion}
        disabled={isDeleting}
      >
        {isDeleting ? "Deleting…" : "Delete"}
      </button>
      {error && <p className="help is-danger is-size-7">{error}</p>}
    </div>
  );
}
