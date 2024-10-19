const EditRequestPage = () => {
  const [request, setRequest] = React.useState(null);
  const [formData, setFormData] = React.useState({
    start_date: '',
    end_date: '',
    request_type: '',
    comments: '',
  });

  React.useEffect(() => {
    const requestId = window.location.pathname.split('/').pop();
    fetchRequest(requestId);
  }, []);

  const fetchRequest = async (id) => {
    try {
      const response = await fetch(`/api/request/${id}`);
      if (response.ok) {
        const data = await response.json();
        setRequest(data);
        setFormData({
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
      const requestId = window.location.pathname.split('/').pop();
      const response = await fetch(`/api/request/${requestId}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });
      if (response.ok) {
        alert('Request updated successfully');
        window.location.href = '/profile';
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
        const requestId = window.location.pathname.split('/').pop();
        const response = await fetch(`/api/request/${requestId}`, {
          method: 'DELETE',
        });
        if (response.ok) {
          alert('Request deleted successfully');
          window.location.href = '/profile';
        } else {
          alert('Failed to delete request');
        }
      } catch (error) {
        console.error('Error:', error);
        alert('An error occurred while deleting the request');
      }
    }
  };

  if (!request) return React.createElement('div', null, 'Loading...');

  return React.createElement(
    'div',
    null,
    React.createElement('h1', null, 'Edit Time Off Request'),
    React.createElement(
      'form',
      { onSubmit: handleSubmit },
      React.createElement(
        'div',
        null,
        React.createElement('label', { htmlFor: 'start_date' }, 'Start Date:'),
        React.createElement('input', {
          type: 'date',
          id: 'start_date',
          name: 'start_date',
          value: formData.start_date,
          onChange: handleChange,
          required: true,
        })
      ),
      React.createElement(
        'div',
        null,
        React.createElement('label', { htmlFor: 'end_date' }, 'End Date:'),
        React.createElement('input', {
          type: 'date',
          id: 'end_date',
          name: 'end_date',
          value: formData.end_date,
          onChange: handleChange,
          required: true,
        })
      ),
      React.createElement(
        'div',
        null,
        React.createElement('label', { htmlFor: 'request_type' }, 'Request Type:'),
        React.createElement(
          'select',
          {
            id: 'request_type',
            name: 'request_type',
            value: formData.request_type,
            onChange: handleChange,
            required: true,
          },
          React.createElement('option', { value: 'vacation' }, 'Vacation'),
          React.createElement('option', { value: 'sick_leave' }, 'Sick Leave'),
          React.createElement('option', { value: 'extra_work_hours' }, 'Extra Work Hours')
        )
      ),
      React.createElement(
        'div',
        null,
        React.createElement('label', { htmlFor: 'comments' }, 'Comments:'),
        React.createElement('textarea', {
          id: 'comments',
          name: 'comments',
          value: formData.comments,
          onChange: handleChange,
        })
      ),
      React.createElement('button', { type: 'submit' }, 'Update Request')
    ),
    React.createElement('button', { onClick: handleDelete, style: { marginTop: '10px', backgroundColor: 'red', color: 'white' } }, 'Delete Request'),
    React.createElement(
      'a',
      { href: '/profile', style: { display: 'block', marginTop: '10px' } },
      React.createElement('button', null, 'Back to Profile')
    )
  );
};

window.EditRequestPage = EditRequestPage;
