// docs: https://vitejs.dev/guide/env-and-mode.html
const BACKEND_URL = import.meta.env.VITE_BACKEND_URL;

export async function getPosts(token) {
  const requestOptions = {
    method: "GET",
    headers: {
      Authorization: `Bearer ${token}`,
      "Content-type": "application/json",
    },
  };

  const response = await fetch(`${BACKEND_URL}/posts`, requestOptions);

  if (response.status !== 200) {
    throw new Error("Unable to fetch posts");
  }

  const data = await response.json();
  return data;
}

export async function createPost(token, postData) {
  const requestOptions = {
    method: "POST",
    headers: {
      Authorization: `Bearer ${token}`, //authenticates the user
      "Content-Type": "application/json", // tells the server that we are sending JSON data
    },

    body: JSON.stringify(postData), // server expects JSON, but fetch needs a string --> so we convert js object to JSON string for the req body
  };

  const response = await fetch(`${BACKEND_URL}/posts`, requestOptions);

  if (response.status !== 201) {
    throw new Error("Unable to create posts");
  }

  const data = await response.json();
  return data;
}

export async function getPostById(token, id) {
  const requestOptions = {
    method: "GET",
    headers: {
      Authorization: `Bearer ${token}`,
      "Content-type": "application/json",
    },
  };

  const response = await fetch(`${BACKEND_URL}/posts/${id}`, requestOptions);

  if (response.status !== 200) {
    throw new Error("Unable to fetch post");
  }

  const data = await response.json();
  return data;
}

export async function likePost(token, id) {
  const requestOptions = {
    method: "POST",
    headers: {
      Authorization: `Bearer ${token}`,
      "Content-type": "application/json",
    },
  };

  const response = await fetch(`${BACKEND_URL}/posts/${id}/like`, requestOptions);

  if (response.status !== 200) {
    throw new Error("Unable to like post");
  }

  const data = await response.json();
  return data;
}

export async function unlikePost(token, id) {
  const requestOptions = {
    method: "DELETE",
    headers: {
      Authorization: `Bearer ${token}`,
      "Content-type": "application/json",
    },
  };

  const response = await fetch(`${BACKEND_URL}/posts/${id}/like`, requestOptions);

  if (response.status !== 200) {
    throw new Error("Unable to unlike post");
  }

  const data = await response.json();
  return data;
}
  

  export async function deletePostById(token, id) {
  const requestOptions = {
    method: "DELETE",
    headers: {
      Authorization: `Bearer ${token}`,
      "Content-type": "application/json",
    },
  };
  try {

  const response = await fetch(`${BACKEND_URL}/posts/${id}`, requestOptions);
  const data = await response.json();
  
  if (response.status == 200) {
    return data;
  }
} catch(error) {
  throw new Error(error);
}
}

