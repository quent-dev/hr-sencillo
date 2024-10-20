import React, { useEffect } from 'react';
import { useRouter } from 'next/router';
import { useUser } from '../context/UserContext';
import ProfilePage from '../components/ProfilePage';

const Profile = () => {
  const { user, loading } = useUser();
  const router = useRouter();

  useEffect(() => {
    if (!loading && !user) {
      router.push('/');
    }
  }, [user, loading, router]);

  if (loading) {
    return <div>Loading...</div>;
  }

  if (!user) {
    return null; // This will prevent any flash of content before redirecting
  }

  return <ProfilePage />;
};

export default Profile;
