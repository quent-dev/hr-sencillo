import React, { useState } from 'react';
import axios from 'axios';

const TimeOffRequestForm = () => {
  const [formData, setFormData] = useState({
    employee_id: '', // This should be populated from the authenticated user
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
    try {
      const response = await axios.post('/api/request-time-off', formData);
      alert(response.data.message);
      // Reset form or redirect user
    } catch (error) {
      alert(error.response.data.error);
    }
  };

  return (
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
          <option value="">Select a type</option>
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
        ></textarea>
      </div>
      <button type="submit">Submit Request</button>
    </form>
  );
};

export default TimeOffRequestForm;

// Add this line at the end of the file
window.TimeOffRequestForm = TimeOffRequestForm;
