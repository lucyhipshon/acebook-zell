import { useEffect, useState } from 'react';

const ProfilePage = () => {
  const [user, setUser] = useState({ name: "", bio: "" });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [backgroundImage, setBackgroundImage] = useState(null); // for background image

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

  if (loading) return <p>Loading profile...</p>;
  if (error) return <p>Error: {error}</p>;





  // function handleBackgroundChange(event) {
  //   const file = event.target.files[0];
  //   if (file) {
  //     const imageUrl = URL.createObjectURL(file);
  //     setBackgroundImage(imageUrl);
  //   }
  // }

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


  // styling
  return (
    <div style={{ position: 'relative', width: '100%', marginBottom: '100px' /* space for profile img below banner */ }}>
      <div // background image
        style={{
          width: '100vw',        // full viewport width
          height: '35vh',
          backgroundImage: backgroundImage ? `url(${backgroundImage})` : 'none',
          backgroundSize: 'cover',
          backgroundPosition: 'center',
          backgroundColor: '#3748dcbb',
          position: 'relative',
          overflow: 'visible',
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
            opacity: 0.8,
            backgroundColor: '#bbcbef',
            padding: '5px',
            borderRadius: '4px',
            cursor: 'pointer',
          }}
        />

        {/* Profile image positioned at bottom center of banner */}
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
            bottom: '-45px',        // half the height, to overlap
            left: '50%',
            transform: 'translateX(-50%)',
            backgroundColor: '#fff', // optional, for white background behind image
            boxShadow: '0 2px 8px rgba(0,0,0,0.2)',
            zIndex: 10,
          }}
        />
      </div>

      <div style={{ marginTop: '60px', textAlign: 'center' }}>
        <h4 style={{ fontSize: '1.5rem', marginBottom: '0.5rem', marginTop: '1rem' }}>
          {user.firstName} {user.lastName}
        </h4>
        <p style={{ color: '#0b072fff' }}>{user.bio}</p>
      </div>
    </div>
  );
}

export default ProfilePage;

