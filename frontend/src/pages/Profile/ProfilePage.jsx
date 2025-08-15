import { useEffect, useState } from 'react';

const ProfilePage = () => {
  const [user, setUser] = useState({ name: "", bio: "" });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

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
        setUser(data);
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


  // styling
  return (
    <div style={{ paddingTop: '80px', textAlign: 'center' }}>
      <img
        src={`http://localhost:3000${user.profileImage}`}
        alt="Profile"
        style={{
          width: '150px',
          height: '150px',
          objectFit: 'cover',
          border: '2px solid #ccc',
          marginBottom: '1rem',
          borderRadius: '8px', // rounded edges
        }}
      />

      <h4 style={{ fontSize: '2rem', marginBottom: '1rem' }}>
        {user.firstName} {user.lastName}
      </h4>

      <p style={{ color: '#0b072fff' }}>{user.bio}</p>
    </div>
  );
}

export default ProfilePage;

