// pages/EditRequest.js
import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import { useUser } from '../../context/UserContext';
import LoginForm from '../../components/LoginForm';


const EditRequestPage = () => {
  const { user, setUser } = useUser();
  const router = useRouter();
  const { id } = router.query; // Get the request ID from the URL
  console.log(id);
  const [formData, setFormData] = useState({
    start_date: '',
    end_date: '',
    request_type: '',
    comments: '',
  });

  useEffect(() => {
    if (id && user) {
      fetchRequest(id);
    }
  }, [id, user]);

  const fetchRequest = async (requestId) => {
    try {
      const response = await fetch(`/api/request/${requestId}`, {
        method: 'GET',
        headers: { 
          'Content-Type': 'application/json',
          'user': user
        }
      }); 
      if (response.ok) {
        const data = await response.json();
        setFormData({
          id: requestId,
          user: user,
          start_date: data.start_date,
          end_date: data.end_date,
          request_type: data.request_type,
          comments: data.comments,
        });
      } else {
        console.error('Failed to fetch request data');
      }
    } catch (error) {
      console.error('Error:', error);
    }
  };

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await fetch(`/api/request/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });
      if (response.ok) {
        alert('Request updated successfully');
        router.push('/profile'); // Redirect to the profile page
      } else {
        alert('Failed to update request');
      }
    } catch (error) {
      console.error('Error:', error);
      alert('An error occurred while updating the request');
    }
  };

  const handleDelete = async () => {
    if (window.confirm('Are you sure you want to delete this request?')) {
      try {
        const response = await fetch(`/api/request/${id}`, {
          method: 'DELETE',
        });
        if (response.ok) {
          alert('Request deleted successfully');
          router.push('/profile'); // Redirect to the profile page
        } else {
          alert('Failed to delete request');
        }
      } catch (error) {
        console.error('Error:', error);
        alert('An error occurred while deleting the request');
      }
    }
  };

  if (!user) {
    return (
      <div className="min-h-screen bg-gray-100 flex items-center justify-center">
        <div className="max-w-md w-full space-y-8 p-10 bg-white rounded-xl shadow-md">
          <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900">
            Login to your account
          </h2>
          <LoginForm onLogin={setUser} />
        </div>
      </div>
    );
  }
  

  return (
    <div>
      <h1>Edit Time Off Request</h1>
      <form onSubmit={handleSubmit}>
        <div>
          <label htmlFor="start_date">Start Date:</label>
          <input
            type="date"
            id="start_date"
            name="start_date"
            value={formData.start_date}
            onChange={handleChange}
            required
          />
        </div>
        <div>
          <label htmlFor="end_date">End Date:</label>
          <input
            type="date"
            id="end_date"
            name="end_date"
            value={formData.end_date}
            onChange={handleChange}
            required
          />
        </div>
        <div>
          <label htmlFor="request_type">Request Type:</label>
          <select
            id="request_type"
            name="request_type"
            value={formData.request_type}
            onChange={handleChange}
            required
          >
            <option value="vacation">Vacation</option>
            <option value="sick_leave">Sick Leave</option>
            <option value="extra_work_hours">Extra Work Hours</option>
          </select>
        </div>
        <div>
          <label htmlFor="comments">Comments:</label>
          <textarea
            id="comments"
            name="comments"
            value={formData.comments}
            onChange={handleChange}
          />
        </div>
        <button type="submit">Update Request</button>
      </form>
      <button onClick={handleDelete} style={{ marginTop: '10px', backgroundColor: 'red', color: 'white' }}>
        Delete Request
      </button>
      <button onClick={() => router.push('/profile')} style={{ display: 'block', marginTop: '10px' }}>
        Back to Profile
      </button>
    </div>
  );
};

export default EditRequestPage;

