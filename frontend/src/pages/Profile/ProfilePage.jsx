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

  return (
    <div>
      <h2>Welcome, {user.firstName}</h2>
      <p>{user.bio}</p>
      <img
        src={`http://localhost:3000${user.profileImage}`}
        alt="Profile"
        style={{ width: '150px', borderRadius: '50%' }}
      />
    </div>
  );
}

export default ProfilePage;

