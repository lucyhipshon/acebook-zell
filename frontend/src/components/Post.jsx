import { useState } from "react";
import { DeletePost } from "./DeletePost";
import { likePost, unlikePost } from "../services/posts";


function Post(props) {

  // State for like functionality
  const [isLiked, setIsLiked] = useState(props.post.likedByCurrentUser || false);
  const [likeCount, setLikeCount] = useState(props.post.likesCount || 0);


  // Helper function for display name
  const getDisplayName = (author) => {
    if (!author) return 'Unknown';
    
    const firstName = author.firstName?.trim();
    const lastName = author.lastName?.trim();
    
    if (firstName && lastName) {
      return `${firstName} ${lastName}`;
    } else if (firstName) {
      return firstName;
    } else if (lastName) {
      return lastName;
    } else {
      return author.email || 'Unknown User';
    }
  };


  // Format time function for the created at timestamp
  const formatTimeAgo = (timestamp) => {
    const now = new Date();
    const postTime = new Date(timestamp);

    // calculate differnce in minutes 
    // Math.floor() to round down to whole minutes
    // Subtracting postTime from now (gives milliseconds)
    // (1000 * 60) converts milliseconds to minutes e.g. (1000 ms = 1 second, 60 seconds = 1 minute)
    const diffInMinutes = Math.floor((now - postTime) / (1000 * 60)); 
    
    if (diffInMinutes < 1) return "just now";
    // If less than 60 minutes have passed, return a string showing the number of minutes. Uses a ternary operator to add 's' for plural (e.g., "5 minutes ago" vs "1 minute ago").
    if (diffInMinutes < 60) return `${diffInMinutes} minute${diffInMinutes > 1 ? 's' : ''} ago`;
    
    // convert minutes to hours
    const diffInHours = Math.floor(diffInMinutes / 60);
    // If less than 24 hours have passed, return a string showing the number of hours with proper pluralization
    if (diffInHours < 24) return `${diffInHours} hour${diffInHours > 1 ? 's' : ''} ago`;
    
    // same process as above but for days
    const diffInDays = Math.floor(diffInHours / 24);
    return `${diffInDays} day${diffInDays > 1 ? 's' : ''} ago`;
  };


    // Handle like/unlike functionality
  const handleLikeClick = async () => {

    // Auth
    const token = localStorage.getItem("token");
    if (!token) return;

    // Updates the UI immediately before the API call completes --> users see their action take effect instantly.
    // Had originally planed to do it directly:
    // setIsLiked(!isLiked);
    // setLikeCount(likeCount + 1);
    // But if server fails - you can keep the old values as a fallback (see reverrt update on error below) 
    // This patter is called "optimistic update with rollback"
    // https://blog.logrocket.com/understanding-optimistic-ui-react-useoptimistic-hook/
    const newIsLiked = !isLiked;
    const newLikeCount = newIsLiked ? likeCount + 1 : likeCount - 1;
    
    setIsLiked(newIsLiked);
    setLikeCount(newLikeCount);

    try {
      if (newIsLiked) {
        const response = await likePost(token, props.post._id);
        // Updates the auth token if the server provides a refreshed one (JWT rotation thingy)
        if (response.token) {
          localStorage.setItem("token", response.token);
        }
      } else {
        const response = await unlikePost(token, props.post._id);
        if (response.token) {
          localStorage.setItem("token", response.token);
        }
      }
    } catch (error) {
      // Revert optimistic update on error
      setIsLiked(isLiked);
      setLikeCount(likeCount);
      console.error("Error toggling like:", error);
    }
  };


return (
  <div className="section">
    <div className="container">
  <article className="card mb-4" key={props.post._id}>
    {/* Header Section */}
    <div className="card-content pb-2">
      <div className="media">
        <div className="media-left">
          <figure className="image is-48x48">
            <img 
                src={(() => {
                  if (!props.post.author?.profileImage) {
                    return 'http://localhost:3000/uploads/default.jpg';
                  }
                  const profileImagePath = props.post.author.profileImage.startsWith('/') 
                    ? props.post.author.profileImage 
                    : '/' + props.post.author.profileImage;
                  return `http://localhost:3000${profileImagePath}`;
                })()} 
                alt={`Profile picture for ${getDisplayName(props.post.author)}`}
                style={{
                  width: '48px',
                  height: '48px',
                  objectFit: 'cover',
                  borderRadius: '50%'
                }}
              />
          </figure>
        </div>
        <div className="media-content">
            <p className="title is-5 has-text-left mb-1">{getDisplayName(props.post.author)}</p>
            <small className="has-text-grey">{formatTimeAgo(props.post.createdAt)}</small>
        </div>
      </div>
      
      {/* Content Section */}
      <div className="content has-text-left mt-3">
        <p className="has-text-black">{props.post.message}</p>
      </div>
    </div>

    {/* Image Section - Better Desktop Sizing */}
    {props.post.image && (
      <div className="card-image">
        <div style={{ 
          display: 'flex', 
          justifyContent: 'center',
          padding: '0 1rem' // Add some padding on sides
        }}>
          <figure className="image" style={{ maxWidth: '600px', width: '100%' }}>
            <img 
              src={props.post.image} 
              alt={`Image for post by ${getDisplayName(props.post.author)}`}
              style={{
                width: '100%',
                height: 'auto',
                maxHeight: '400px', // Reduced from 500px
                objectFit: 'contain', // Changed from 'cover' to 'contain'
                display: 'block',
                borderRadius: '8px' // Add slight rounding
              }}
            />
          </figure>
        </div>
      </div>
    )}

    {/* Actions Footer - Responsive */}
    <div className="card-content pt-3 pb-3">
      <div className="level is-mobile"> {/* is-mobile keeps level working on mobile */}
        <div className="level-left">
          <div className="level-item">
            <a 
              aria-label="like"
              onClick={handleLikeClick}
              style={{cursor:"pointer"}}
              className="has-text-link"
            >
              <span className="icon is-small" style={{ marginRight: '4px' }}>
                <i 
                  className="fas fa-heart" 
                  aria-hidden="true"
                  style={{
                    color: isLiked ? '#ff3860' : '#3273dc'
                  }}
                />
              </span>
              <span style={{fontSize: '0.9rem'}}>
                {likeCount}
              </span>
            </a>
          </div>
          
          <div className="level-item">
            <a 
              aria-label="open comments"
              onClick={props.onOpenComments}
              style={{cursor:"pointer"}}
              className="has-text-link"
            >
              <span className="icon is-small" style={{ marginRight: '4px' }}>
                <i className="fa-solid fa-comment" aria-hidden="true"></i>
              </span>
              <span className="is-hidden-mobile" style={{fontSize: '0.9rem'}}>
                Comments
              </span>
            </a>
          </div>
        </div>
        
        <div className="level-right">
          <div className="level-item">
            <DeletePost post={props.post} currentUser={props.currentUser} onDelete={props.onDelete}/>
          </div>
        </div>
      </div>
    </div>
  </article>
  </div>
  </div>
);

}

export default Post;