import { useState } from "react";

export default function EditComment({ comment, onEdit }) {
  const [error, setError] = useState("");
  const token = localStorage.getItem("token");
  const payload = token ? JSON.parse(atob(token.split(".")[1])) : null;
  const currentUserId = payload?.sub;

  const isAuthor = currentUserId && comment?.author?._id === currentUserId;
  if (!isAuthor) return null;

  return (
    <div>
      <button
        type="button"
        className="button is-light is-small"
        onClick={() => {
          try {
            onEdit?.(comment);
          } catch (e) {
            setError(e.message || "Failed to start edit");
          }
        }}
      >
        Edit
      </button>
      {error && <p className="help is-danger is-size-7">{error}</p>}
    </div>
  );
}
