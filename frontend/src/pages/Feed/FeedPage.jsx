import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";

import { getPosts } from "../../services/posts";
import Post from "../../components/Post";

import {CreatePostForm} from "../../components/CreatePostForm";
import LogoutButton from "../../components/LogoutButton";
import { Footer } from "../../components/Footer";
import { Navbar } from "../../components/Navbar";

export function FeedPage() {
  const [posts, setPosts] = useState([]);
  const navigate = useNavigate();
  useEffect(() => {
    const token = localStorage.getItem("token");
    const loggedIn = token !== null;
    if (loggedIn) {
      getPosts(token)
        .then((data) => {
          setPosts(data.posts);
          localStorage.setItem("token", data.token);
        })
        .catch((err) => {
          console.error(err);
          navigate("/login");
        });
    }
  }, [navigate]);
  const token = localStorage.getItem("token");
  if (!token) {
    navigate("/login");
    return;
  }

  return (
    <div>
      <Navbar/>
      <div className="card mb-5">
        <CreatePostForm onPostCreated={(newPost) => {setPosts([newPost, ...posts])}} />
      </div>
      <div className="feed" role="feed">
        {posts.map((post) => (
           post._id && (
          <Post post={post} key={post._id} />
        )
        ))}
      </div>
      <LogoutButton />
      <Footer/>
    </div>
  );
}
