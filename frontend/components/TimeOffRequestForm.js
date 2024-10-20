import React, { useState } from 'react';
import { useUser } from '../context/UserContext';

const TimeOffRequestForm = ({ onRequestSubmitted }) => {
    const { user } = useUser();
    const [formData, setFormData] = useState({
        email: user,
        start_date: '',
        end_date: '',
        request_type: '',
        comments: '',
    });

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        console.log('Form data being sent:', formData);
        try {
            const response = await fetch('/api/request-time-off', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(formData),
                credentials: 'include'
            });
            
            console.log('Response status:', response.status);
            
            if (response.status === 401) {
                console.log('Unauthorized, attempting to refresh token');
                const refreshResponse = await fetch('/api/auth/refresh', { method: 'POST' });
                if (refreshResponse.ok) {
                    console.log('Token refreshed, retrying request');
                    const retryResponse = await fetch('/api/request-time-off', {
                        method: 'POST',
                        headers: { 'Content-Type': 'application/json' },
                        body: JSON.stringify(formData),
                    });
                    const data = await retryResponse.json();
                    console.log('Retry response:', data);
                    onRequestSubmitted(data.message);
                } else {
                    console.log('Token refresh failed');
                    onRequestSubmitted('Session expired. Please log in again.', true);
                }
            } else {
                const data = await response.json();
                console.log('Response data:', data);
                onRequestSubmitted(data.message);
            }
        } catch (error) {
            console.error('Error:', error);
            onRequestSubmitted('An error occurred', true);
        }
    };

    return (
        <form onSubmit={handleSubmit} className="space-y-6">
            <div>
                <label htmlFor="start_date" className="block text-sm font-medium text-gray-700">Start Date:</label>
                <input
                    type="date"
                    id="start_date"
                    name="start_date"
                    value={formData.start_date}
                    onChange={handleChange}
                    required
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50"
                />
            </div>
            <div>
                <label htmlFor="end_date" className="block text-sm font-medium text-gray-700">End Date:</label>
                <input
                    type="date"
                    id="end_date"
                    name="end_date"
                    value={formData.end_date}
                    onChange={handleChange}
                    required
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50"
                />
            </div>
            <div>
                <label htmlFor="request_type" className="block text-sm font-medium text-gray-700">Request Type:</label>
                <select
                    id="request_type"
                    name="request_type"
                    value={formData.request_type}
                    onChange={handleChange}
                    required
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50"
                >
                    <option value="">Select a type</option>
                    <option value="vacation">Vacation</option>
                    <option value="sick_leave">Sick Leave</option>
                    <option value="extra_work_hours">Extra Work Hours</option>
                </select>
            </div>
            <div>
                <label htmlFor="comments" className="block text-sm font-medium text-gray-700">Comments:</label>
                <textarea
                    id="comments"
                    name="comments"
                    value={formData.comments}
                    onChange={handleChange}
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50"
                    rows="3"
                ></textarea>
            </div>
            <button 
                type="submit"
                className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
            >
                Submit Request
            </button>
        </form>
    );
};

export default TimeOffRequestForm;

if (typeof window !== 'undefined') {
    window.TimeOffRequestForm = TimeOffRequestForm;
}
