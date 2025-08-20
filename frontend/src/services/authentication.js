// docs: https://vitejs.dev/guide/env-and-mode.html
const BACKEND_URL = import.meta.env.VITE_BACKEND_URL;

export async function login(email, password) {
  const payload = {
    email: email,
    password: password,
  };

  const requestOptions = {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(payload),
  };

  const response = await fetch(`${BACKEND_URL}/tokens`, requestOptions);
  let data = await response.json();

  // docs: https://developer.mozilla.org/en-US/docs/Web/HTTP/Status/201
  if (response.status === 201) {
    return data.token;
  } else if (response.status === 401) {
    throw new Error(data.message);
    
  } else {
    throw new Error(
      `Received status ${response.status} when logging in. Expected 201`
    );
  }
}



// sign up 
export async function signup(email, password, firstName, lastName, bio, job, location, gender, relationshipStatus, birthdate, profileImage) {
  const formData = new FormData();

  formData.append("email", email);
  formData.append("password", password);
  formData.append("firstName", firstName);
  formData.append("lastName", lastName);
  formData.append("bio", bio);
  formData.append("job", job);
  formData.append("location", location);
  formData.append("gender", gender);
  formData.append("relationshipStatus", relationshipStatus);
  formData.append("birthdate", birthdate);

  if (profileImage) {
    formData.append("profileImage", profileImage);
  }

  // const requestOptions = {
  //   method: "POST",
  //   headers: {
  //     "Content-Type": "application/json",
  //   },
  //   body: JSON.stringify(payload),
  // };

  const response = await fetch(`${BACKEND_URL}/users`, { 
    method: "POST",
    body: formData,  // for image uploads, has to be formData
  });


  // docs: https://developer.mozilla.org/en-US/docs/Web/HTTP/Status/201
  const data = await response.json();
  if (response.status === 201) {
    localStorage.setItem("token", data.token);
    console.log("Saved token:", localStorage.getItem("token"));
    return data;
  } else if (response.status === 400) {
    throw new Error(data.message);
  } else {
    throw new Error(
      `Received status ${response.status} when signing up. Expected 201`
    );
  }
}
