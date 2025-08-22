import { useEffect, useState } from 'react';
import { Navbar } from "../../components/Navbar";
//import { Link } from 'react-router-dom';
import { useNavigate } from 'react-router-dom';


const ProfilePage = () => {
  const [user, setUser] = useState({ name: "", bio: "" });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [backgroundImage, setBackgroundImage] = useState(null); // for background image
  // user posts 
  const [posts, setPosts] = useState([]);
  const [showImages, setShowImages] = useState(false);
  const [showAbout, setShowAbout] = useState(false);
  const navigate = useNavigate();



  useEffect(() => {
    const fetchUserProfile = async () => {
      try {
        const token = localStorage.getItem('token'); 

        const response = await fetch('http://localhost:3000/users/profile', {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}` 
          }
        });

        if (!response.ok) {
          throw new Error('Failed to fetch profile');
        }

        const data = await response.json();
        console.log('Fetched user data:', data);

        const BACKEND_URL = 'http://localhost:3000';

        const profileImagePath = data.profileImage.startsWith('/')
          ? data.profileImage
          : '/' + data.profileImage;

        setUser({
          ...data,
          profileImage: `${BACKEND_URL}${profileImagePath}`,
        });

        // for background image
        setBackgroundImage(data.backgroundImage ? `http://localhost:3000${data.backgroundImage}` : null) // backgrounds
      
      } catch (err) {
        console.error(err);
        setError(err.message || 'Something went wrong');
      } finally {
        setLoading(false);
      }
    };

    fetchUserProfile();
  }, []);

  

  // images from posts db

  useEffect(() => {
    const fetchUserPosts = async () => {
      try {
        const token = localStorage.getItem('token');
        console.log("Token being sent:", token);

        const response = await fetch('http://localhost:3000/posts/me', {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`
          }
        });

        if (!response.ok) {
          throw new Error('Failed to fetch user posts');
        }

        const data = await response.json();
        setPosts(data);
      } catch (err) {
        console.error(err.message);
      }
    };

    fetchUserPosts();
  }, []);

  if (loading) return <p>Loading profile...</p>;
  if (error) return <p>Error: {error}</p>;
  

  async function handleBackgroundChange(event) {
    const file = event.target.files[0];
    if (!file) return;

    const formData = new FormData();
    formData.append('backgroundImage', file);

    try {
      const response = await fetch(`http://localhost:3000/users/upload-background/${user._id}`, {
        method: 'POST',
        body: formData,
      });

      const data = await response.json();

      if (response.ok) {
        const BACKEND_URL = 'http://localhost:3000';
        setBackgroundImage(`${BACKEND_URL}${data.backgroundImage}`);
      } else {
        console.error('Upload failed:', data.error);
      }
    } catch (error) {
      console.error('Error uploading background image:', error);
    }
  }

  const buttonStyle = {
    padding: '10px 16px',
    backgroundColor: '#4259ff',
    color: 'white',
    border: 'none',
    borderRadius: '6px',
    cursor: 'pointer',
    fontSize: '1rem',
    boxShadow: '0 2px 8px rgba(0, 0, 0, 0.56)',

  };
  
  const aboutCardStyle = {
    backgroundColor: '#fff',
    borderRadius: '10px',
    padding: '10px',
    boxShadow: '0 2px 6px rgba(0, 0, 0, 0.1)',
    textAlign: 'center',
  };

  return (
    <>
      <Navbar />

      <div style={{ backgroundColor: '#d4d8ffff', minHeight: '100vh', paddingBottom: '50px' }}>
        
        {/* All profile page content goes here */}
        
        <div style={{ position: 'relative', width: '100%', marginBottom: '100px' }}>
          
          {/* ... background image, profile image, bio, buttons, grid ... */}
          <div style={{ position: 'relative', width: '100%', marginBottom: '100px' }}>
            <div
              style={{
                width: '100vw',
                height: '35vh',
                backgroundImage: backgroundImage ? `url(${backgroundImage})` : 'none',
                backgroundSize: 'cover',
                backgroundPosition: 'center',
                backgroundColor: '#4259ff',
                position: 'relative',
                overflow: 'visible',
                boxShadow: '0 2px 8px rgba(0, 0, 0, 0.21)',
              }}
            >
              <input
                type="file"
                accept="image/*"
                onChange={handleBackgroundChange}
                style={{
                  position: 'absolute',
                  bottom: '5px',
                  right: '5px',
                  opacity: 0.9,
                  backgroundColor: '#fcfdfeff',
                  padding: '5px',
                  borderRadius: '4px',
                  cursor: 'pointer',
                }}
              />

              <img
                src={user.profileImage || 'http://localhost:3000/uploads/default.jpg'}
                alt="Profile"
                style={{
                  width: '150px',
                  height: '150px',
                  objectFit: 'cover',
                  border: '3px solid white',
                  borderRadius: '12px',
                  position: 'absolute',
                  bottom: '-65px',
                  left: '50%',
                  transform: 'translateX(-50%)',
                  backgroundColor: '#fff',
                  boxShadow: '0 2px 8px rgba(0, 0, 0, 0.56)',
                  zIndex: 10,
                }}
              />
            </div>

            <div style={{ marginTop: '85px', textAlign: 'center' }}>
              <h4 style={{ fontSize: '1.5rem', marginBottom: '0.5rem', marginTop: '1rem' }}>
                {user.firstName} {user.lastName}
              </h4>
              <p style={{ color: '#0b072fff' }}>{user.bio}</p>

              {/* Button group */}
              <div style={{ display: 'flex', justifyContent: 'center', gap: '25px', marginTop: '40px' }}>
                <button
                  onClick={() => navigate('/createpost')}
                  style={buttonStyle}
                >
                  Create Post
                </button>

                <button
                  onClick={() => {
                    setShowImages(true);
                    setShowAbout(false);
                  }}
                  style={buttonStyle}
                >
                  My Images
                </button>

                <button
                  onClick={() => {
                    setShowAbout(true);
                    setShowImages(false);
                  }}
                  style={buttonStyle}
                >
                  About Me
                </button>
              </div>

              {/* Image grid */}
              {showImages && (
                <div
                  style={{
                    display: 'grid',
                    gridTemplateColumns: 'repeat(auto-fill, minmax(150px, 1fr))',
                    gap: '20px',
                    marginTop: '40px',
                    padding: '20px',
                    maxWidth: '900px',
                    marginLeft: 'auto',
                    marginRight: 'auto',
                    // boxShadow: '0 2px 8px rgba(0, 0, 0, 0.56)',
                    // backgroundColor: '#fffffff2',
                  }}
                >
                  {posts.map((post, index) =>
                    post.image ? (
                      <img
                        key={index}
                        src={post.image}
                        alt={`User post ${index}`}
                        style={{
                          width: '100%',
                          height: '150px',
                          objectFit: 'cover',
                          borderRadius: '8px',
                          boxShadow: '0 2px 8px rgba(0, 0, 0, 0.56)',
                        }}
                      />
                    ) : null
                  )}
                </div>
              )}

              {/* about me grid*/}
              {showAbout && (
                <div
                  style={{
                    display: 'grid',
                    gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))',
                    gap: '25px',
                    marginTop: '30px',
                    padding: '10px 20px',
                    maxWidth: '300px',
                    marginLeft: 'auto',
                    marginRight: 'auto',
                  }}
                >
                  {/* Email */}
                  <div style={aboutCardStyle}>
                    <strong>Email:</strong>
                    <p>{user.email || 'Not provided'}</p>
                  </div>

                  {/* Job */}
                  <div style={aboutCardStyle}>
                    <strong>Job:</strong>
                    <p>{user.job || 'Not specified'}</p>
                  </div>

                  {/* Location */}
                  <div style={aboutCardStyle}>
                    <strong>Location:</strong>
                    <p>{user.location || 'Not specified'}</p>
                  </div>

                  {/* Relationship Status */}
                  <div style={aboutCardStyle}>
                    <strong>Relationship Status:</strong>
                    <p>{user.relationshipStatus || 'Not specified'}</p>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </>
  );
}

export default ProfilePage;
