import React from 'react';
import { useAuth } from '../../components/Auth/AuthContext';

const ProfilePage: React.FC = () => {
  const { user } = useAuth();

  return (
    <div>
      <h2>Your Profile</h2>
      {user ? (
        <div>
          <p><strong>Username:</strong> {user.username}</p>
          <p><strong>Name:</strong> {user.name}</p>
        </div>
      ) : (
        <p>Loading profile...</p>
      )}
    </div>
  );
};

export default ProfilePage;