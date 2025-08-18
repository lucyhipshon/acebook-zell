function Post(props) {

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
  <article key={props.post._id}>
    {/* Timestamp and author data */}
    <div style={{ color: '#66', fontSize: '14px', marginBottom: '4px' }}>
    {/* Display author email, fallback to unkown if author doesn't exist / Bullet seprator for minimal visual sepration / Human readable time format */}
        {props.post.author?.email || 'Unknown'} • {formatTimeAgo(props.post.createdAt)}
    </div>
    {/* This is where the message body of the post is */}
    <div>
      {props.post.message}
    </div>
  </article>
)

}

export default Post;