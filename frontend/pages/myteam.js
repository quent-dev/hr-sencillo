// pages/myteam.js
import React, { useEffect, useState } from 'react';
import { useUser } from '../context/UserContext';
import { useRouter } from 'next/router';

const MyTeamPage = () => {
  const { user } = useUser();
  const router = useRouter();
  const [requests, setRequests] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('all');

  useEffect(() => {
    if (user) {
      fetchTeamRequests();
    } else {
      router.push('/'); // Redirect to home if not logged in
    }
  }, [user]);

  const fetchTeamRequests = async () => {
    try {
      const response = await fetch('/api/myteam', {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          'user': user, // Pass user email in headers
        },
      });
      if (response.ok) {
        const data = await response.json();
        setRequests(data);
      } else {
        console.error('Failed to fetch team requests');
      }
    } catch (error) {
      console.error('Error:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleApprove = async (requestId) => {
    try {
      const response = await fetch(`/api/request/${requestId}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'user': user,
          'role': 'manager',
          'approval': true
        },
        body: JSON.stringify({ status: 'approved' }),
      });
      if (response.ok) {
        alert('Request approved successfully');
        fetchTeamRequests(); // Refresh the requests
      } else {
        alert('Failed to approve request');
      }
    } catch (error) {
      console.error('Error:', error);
    }
  };

  const handleReject = async (requestId) => {
    try {
      const response = await fetch(`/api/request/${requestId}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'user': user,
          'role': 'manager',
          'approval': false
        },
        body: JSON.stringify({ status: 'denied' }),
      });
      if (response.ok) {
        alert('Request rejected successfully');
        fetchTeamRequests(); // Refresh the requests
      } else {
        alert('Failed to reject request');
      }
    } catch (error) {
      console.error('Error:', error);
    }
  };

  const filteredRequests = requests.filter((request) => {
    if (filter === 'all') return true;
    return request.status === filter;
  });

  if (loading) {
    return <div>Loading...</div>;
  }

  return (
    <div className="min-h-screen bg-gray-100 p-10">
      <h1 className="text-2xl font-bold mb-4">My Team's Time Off Requests</h1>
      <div className="mb-4">
        <label htmlFor="filter" className="mr-2">Filter by status:</label>
        <select
          id="filter"
          value={filter}
          onChange={(e) => setFilter(e.target.value)}
          className="border rounded-md p-2"
        >
          <option value="all">All</option>
          <option value="pending">Pending</option>
          <option value="approved">Approved</option>
          <option value="denied">Denied</option>
        </select>
      </div>
      <table className="min-w-full bg-white border border-gray-300">
        <thead>
          <tr>
            <th className="border px-4 py-2">Employee</th>
            <th className="border px-4 py-2">Start Date</th>
            <th className="border px-4 py-2">End Date</th>
            <th className="border px-4 py-2">Request Type</th>
            <th className="border px-4 py-2">Status</th>
            <th className="border px-4 py-2">Actions</th>
          </tr>
        </thead>
        <tbody>
          {filteredRequests.map((request) => (
            <tr key={request.id}>
              <td className="border px-4 py-2">{request.employee_name}</td>
              <td className="border px-4 py-2">{request.start_date}</td>
              <td className="border px-4 py-2">{request.end_date}</td>
              <td className="border px-4 py-2">{request.request_type}</td>
              <td className="border px-4 py-2">{request.status}</td>
              <td className="border px-4 py-2">
                <button onClick={() => handleApprove(request.id)} className="bg-green-500 text-white px-2 py-1 rounded">Approve</button>
                <button onClick={() => handleReject(request.id)} className="bg-red-500 text-white px-2 py-1 rounded ml-2">Reject</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default MyTeamPage;
