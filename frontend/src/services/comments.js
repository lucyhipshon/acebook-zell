const BACKEND_URL = import.meta.env.VITE_BACKEND_URL;

// GET /posts/:postId/comments
export async function getComments(token, postId) {
  const requestOptions = {
    method: "GET",
    headers: {
      Authorization: `Bearer ${token}`,
      "Content-type": "application/json",
    },
  };

  const response = await fetch(`${BACKEND_URL}/comments/post/${postId}`, requestOptions);
  if (response.status !== 200) throw new Error("Unable to fetch comments");
  return await response.json();
}

// POST /posts/:postId/comments
export async function createComment(token, postId, message) {
  const requestOptions = {
    method: "POST",
    headers: {
      Authorization: `Bearer ${token}`,
      "Content-type": "application/json",
    },
    body: JSON.stringify({ content: message, post: postId }),
  };

  const response = await fetch(`${BACKEND_URL}/comments`, requestOptions);
  if (response.status !== 201) throw new Error("Unable to create comment");
  return await response.json();
}
