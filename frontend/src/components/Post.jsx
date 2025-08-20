function Post(props) {

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







  // Update the jsx strucure props isn't just message - will need a div for the timestamp and the author info details 

return (
  <article className="card" key={props.post._id}>
    <div className="card-content">
      <div className="media">
        <div className="media-left">
          <figure className="image is-48x48">
            <img src="/rubber_duck.jpg" alt={`Profile picture for ${getDisplayName(props.post.author)}`}/>
          </figure>
        </div>
        <div className="media-content">
            <p className="title is-4 has-text-left">{getDisplayName(props.post.author)}</p>
            <small className="is-pulled-right has-text-black hover-text-primary has-text-weight-light">{formatTimeAgo(props.post.createdAt)}</small>
        </div>
    </div>

    <div className="content has-text-left">
      <p className="has-text-black hover-text-primary has-text-weight-normal">{props.post.message}</p>
      <br />

    </div>
    {props.post.image &&(
    <div className="card-image">
      <figure className="image is-4by3">
        <img src={props.post.image} alt={`Image for ${props.image}`}/>
      </figure> 

    </div>
    )}
    <nav className="level is-pulled-right">
          <a className="level-item is-pulled-right" aria-label="reply">
            <span className="icon is-small">
              <i className="fa-solid fa-comment" aria-hidden="true"></i>
            </span>
          </a>
          <a className="level-item" aria-label="like">
            <span className="icon is-small">
              <i className="fas fa-heart" aria-hidden="true"></i>
            </span>
          </a>
      </nav>
    </div>

    {/* Display image if exists */}
    {props.post.image && (
      <div style={{ marginTop: '8px' }}>
        <img 
          src={props.post.image} 
          alt="Post attachment" 
          style={{
            maxWidth: '100%',
            height: 'auto',
            borderRadius: '8px',
            border: '1px solid #ddd'
          }}
        />
      </div>
    )}
  </article>
)
}

export default Post;