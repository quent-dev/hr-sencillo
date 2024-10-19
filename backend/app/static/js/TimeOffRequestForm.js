const TimeOffRequestForm = () => {
  const [formData, setFormData] = React.useState({
    start_date: '',
    end_date: '',
    request_type: '',
    comments: '',
  });
  const [user, setUser] = React.useState(null);
  const [loginData, setLoginData] = React.useState({ email: '', password: '' });

  React.useEffect(() => {
    // Check if user is already logged in
    fetch('/api/auth/user')
      .then(response => response.json())
      .then(data => {
        if (data.user) setUser(data.user);
      });
  }, []);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleLoginChange = (e) => {
    setLoginData({ ...loginData, [e.target.name]: e.target.value });
  };

  const handleLogin = async (e) => {
    e.preventDefault();
    try {
      const response = await fetch('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(loginData),
      });
      const data = await response.json();
      if (data.user) {
        setUser(data.user);
      } else {
        alert(data.error || 'Login failed');
      }
    } catch (error) {
      alert('An error occurred during login');
    }
  };

  const handleLogout = async () => {
    await fetch('/api/auth/logout');
    setUser(null);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await fetch('/api/request-time-off', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });
      if (response.status === 401) {
        // Token might be expired, try to refresh
        const refreshResponse = await fetch('/api/auth/refresh', { method: 'POST' });
        if (refreshResponse.ok) {
          // Token refreshed, try the request again
          const retryResponse = await fetch('/api/request-time-off', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(formData),
          });
          const data = await retryResponse.json();
          alert(data.message);
        } else {
          // Refresh failed, user needs to log in again
          setUser(null);
          alert('Session expired. Please log in again.');
        }
      } else {
        const data = await response.json();
        alert(data.message);
      }
    } catch (error) {
      alert('An error occurred');
    }
  };

  if (!user) {
    return React.createElement(
      'form',
      { onSubmit: handleLogin },
      React.createElement('input', {
        type: 'email',
        name: 'email',
        value: loginData.email,
        onChange: handleLoginChange,
        placeholder: 'Email',
        required: true,
      }),
      React.createElement('input', {
        type: 'password',
        name: 'password',
        value: loginData.password,
        onChange: handleLoginChange,
        placeholder: 'Password',
        required: true,
      }),
      React.createElement('button', { type: 'submit' }, 'Login')
    );
  }

  return React.createElement(
    React.Fragment,
    null,
    React.createElement('button', { onClick: handleLogout }, 'Logout'),
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
          React.createElement('option', { value: '' }, 'Select a type'),
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
      React.createElement('button', { type: 'submit' }, 'Submit Request')
    )
  );
};

// Make the component available globally
window.TimeOffRequestForm = TimeOffRequestForm;
