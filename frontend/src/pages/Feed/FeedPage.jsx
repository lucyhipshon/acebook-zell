import { useState, useEffect } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { getPosts } from "../../services/posts";
import Post from "../../components/Post";
import {CreatePostForm} from "../../components/CreatePostForm";
import { Navbar } from "../../components/Navbar";
import CommentsModal from "../../components/CommentsModal";
import { SortPosts } from "../../components/SortPosts";


export function FeedPage() {
  const [posts, setPosts] = useState([]);
  const [activePost, setActivePost] = useState(null);
  const [currentUser, setCurrentUser] = useState(null);
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();

   const sortPosts = (postsToSort) => {
    const sortBy = searchParams.get('sort_by') || 'createdAt';
    const order = searchParams.get('order') || 'desc';

    return [...postsToSort].sort((firstPost, secondPost) => {
      let firstPostValue, secondPostValue;

      if (sortBy === 'createdAt') {
        firstPostValue = new Date(firstPost.createdAt);
        secondPostValue = new Date(secondPost.createdAt);
      } else if (sortBy === 'likes') {
        firstPostValue = Array.isArray(firstPost.likes) ? firstPost.likes.length : (firstPost.likes || 0);
        secondPostValue = Array.isArray(secondPost.likes) ? secondPost.likes.length : (secondPost.likes || 0);
      }

      if (order === 'asc') {
        return firstPostValue > secondPostValue ? 1 : -1;
      } else {
        return firstPostValue < secondPostValue ? 1 : -1;
      }
    });
  };

  const fetchPosts = async () => {
    const token = localStorage.getItem("token");
    if (!token) {
      navigate("/login");
      return;
    }
      getPosts(token)
        .then((data) => {
          setPosts(data.posts);
          localStorage.setItem("token", data.token);
        })
        .catch((err) => {
          console.error(err);
          navigate("/login");
        });
    };

  useEffect(() => {
    const userId = localStorage.getItem("userId");
    if (userId) {
      setCurrentUser(userId)
    }
    fetchPosts();
  }, [navigate]);

  const sortedPosts = sortPosts(posts);

  return (
    <div>
      <Navbar/>
      <div className="card mb-5">
        <CreatePostForm onPostCreated={fetchPosts} />
      </div>
      <SortPosts/>
      <div className="feed" role="feed">
        {sortedPosts.map((post) => (
         post._id && (
        <Post 
           post={post} 
           key={post._id} 
           currentUser={currentUser} 
           onDelete={fetchPosts}
           onOpenComments={() => setActivePost(post)}
       />
    )
    ))}
      </div>
      <CommentsModal
        isActive={activePost}
        post={activePost}
        onClose={() => setActivePost(null)}
      />
      </div>
  );
}