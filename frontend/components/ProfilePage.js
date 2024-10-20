import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { useUser } from '../context/UserContext';

const ProfilePage = () => {
  const { user } = useUser();
  const [profileData, setProfileData] = useState(null);
  const [isEditing, setIsEditing] = useState(false);
  const [editData, setEditData] = useState({});

  useEffect(() => {
    if (user) {
      fetchProfileData(user); // Pass user to the function
    }
  }, [user]);

  const fetchProfileData = async (user) => {
    try {
      const response = await fetch('/api/profile', {
        method: 'POST', // Ensure the method is POST
        headers: {
          'Content-Type': 'application/json', // Set the content type to JSON
        },
        body: JSON.stringify({ user: user }), // Send user email as JSON
      });
      if (response.ok) {
        const data = await response.json();
        setProfileData(data);
        setEditData({ name: data.name, email: data.email });
      } else {
        console.error('Failed to fetch profile data');
      }
    } catch (error) {
      console.error('Error:', error);
    }
  };

  const handleEdit = () => {
    setIsEditing(true);
  };

  const handleChange = (e) => {
    setEditData({ ...editData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await fetch('/api/profile/update', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(editData),
      });
      if (response.ok) {
        setIsEditing(false);
        fetchProfileData();
      } else {
        console.error('Failed to update profile');
      }
    } catch (error) {
      console.error('Error:', error);
    }
  };

  if (!profileData) return <div>Loading profile data...</div>;

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4">Profile</h1>
      {isEditing ? (
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label htmlFor="name" className="block">Name:</label>
            <input
              type="text"
              id="name"
              name="name"
              value={editData.name}
              onChange={handleChange}
              required
              className="w-full p-2 border rounded"
            />
          </div>
          <div>
            <label htmlFor="email" className="block">Email:</label>
            <input
              type="email"
              id="email"
              name="email"
              value={editData.email}
              onChange={handleChange}
              required
              className="w-full p-2 border rounded"
            />
          </div>
          <button type="submit" className="bg-blue-500 text-white px-4 py-2 rounded">Save</button>
          <button onClick={() => setIsEditing(false)} className="bg-gray-500 text-white px-4 py-2 rounded ml-2">Cancel</button>
        </form>
      ) : (
        <div>
          <p>Name: {profileData.name}</p>
          <p>Email: {profileData.email}</p>
          <button onClick={handleEdit} className="bg-green-500 text-white px-4 py-2 rounded mt-2">Edit Profile</button>
        </div>
      )}
      <h2 className="text-xl font-bold mt-6 mb-2">Time Off Information</h2>
      <p>Total days off for the year: {profileData.total_days_off}</p>
      <p>Days taken: {profileData.days_taken}</p>
      <p>Extra work days: {profileData.extra_work_days}</p>
      <p>Net days taken: {profileData.net_days_taken}</p>
      <p>Remaining available days: {profileData.remaining_days}</p>
      <h2 className="text-xl font-bold mt-6 mb-2">Time Off Requests</h2>
      <table className="w-full border-collapse border">
        <thead>
          <tr className="bg-gray-200">
            <th className="border p-2">Start Date</th>
            <th className="border p-2">End Date</th>
            <th className="border p-2">Type</th>
            <th className="border p-2">Status</th>
            <th className="border p-2">Total Days</th>
            <th className="border p-2">Action</th>
          </tr>
        </thead>
        <tbody>
          {profileData.time_off_requests.map((request, index) => (
            <tr key={index}>
              <td className="border p-2">{request.start_date}</td>
              <td className="border p-2">{request.end_date}</td>
              <td className="border p-2">{request.request_type}</td>
              <td className="border p-2">{request.status}</td>
              <td className="border p-2">{request.total_days}</td>
              <td className="border p-2">
                <Link href={`/edit-request/${request.id}`} className="text-blue-500 hover:underline">
                  Edit
                </Link>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
      <Link href="/" className="block mt-6 text-blue-500 hover:underline">
        Back to Home
      </Link>
    </div>
  );
};

export default ProfilePage;
