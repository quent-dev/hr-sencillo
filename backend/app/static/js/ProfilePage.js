const ProfilePage = () => {
  const [profileData, setProfileData] = React.useState(null);
  const [isEditing, setIsEditing] = React.useState(false);
  const [editData, setEditData] = React.useState({});

  React.useEffect(() => {
    fetchProfileData();
  }, []);

  const fetchProfileData = async () => {
    try {
      const response = await fetch('/api/profile');
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

  if (!profileData) return React.createElement('div', null, 'Loading...');

  return React.createElement(
    'div',
    null,
    React.createElement('h1', null, 'Profile'),
    isEditing
      ? React.createElement(
          'form',
          { onSubmit: handleSubmit },
          React.createElement('input', {
            type: 'text',
            name: 'name',
            value: editData.name,
            onChange: handleChange,
            required: true,
          }),
          React.createElement('input', {
            type: 'email',
            name: 'email',
            value: editData.email,
            onChange: handleChange,
            required: true,
          }),
          React.createElement('button', { type: 'submit' }, 'Save'),
          React.createElement('button', { onClick: () => setIsEditing(false) }, 'Cancel')
        )
      : React.createElement(
          React.Fragment,
          null,
          React.createElement('p', null, `Name: ${profileData.name}`),
          React.createElement('p', null, `Email: ${profileData.email}`),
          React.createElement('button', { onClick: handleEdit }, 'Edit Profile')
        ),
    React.createElement('h2', null, 'Time Off Information'),
    React.createElement('p', null, `Total days off for the year: ${profileData.total_days_off}`),
    React.createElement('p', null, `Days taken: ${profileData.days_taken}`),
    React.createElement('p', null, `Extra work days: ${profileData.extra_work_days}`),
    React.createElement('p', null, `Net days taken: ${profileData.net_days_taken}`),
    React.createElement('p', null, `Remaining available days: ${profileData.remaining_days}`),
    React.createElement('h2', null, 'Time Off Requests'),
    React.createElement(
      'table',
      { style: { width: '100%', borderCollapse: 'collapse' } },
      React.createElement(
        'thead',
        null,
        React.createElement(
          'tr',
          null,
          React.createElement('th', { style: tableHeaderStyle }, 'Start Date'),
          React.createElement('th', { style: tableHeaderStyle }, 'End Date'),
          React.createElement('th', { style: tableHeaderStyle }, 'Type'),
          React.createElement('th', { style: tableHeaderStyle }, 'Status'),
          React.createElement('th', { style: tableHeaderStyle }, 'Total Days'),
          React.createElement('th', { style: tableHeaderStyle }, 'Action')
        )
      ),
      React.createElement(
        'tbody',
        null,
        profileData.time_off_requests.map((request, index) =>
          React.createElement(
            'tr',
            { key: index },
            React.createElement('td', { style: tableCellStyle }, request.start_date),
            React.createElement('td', { style: tableCellStyle }, request.end_date),
            React.createElement('td', { style: tableCellStyle }, request.request_type),
            React.createElement('td', { style: tableCellStyle }, request.status),
            React.createElement('td', { style: tableCellStyle }, request.total_days),
            React.createElement(
              'td',
              { style: tableCellStyle },
              React.createElement(
                'a',
                { href: `/edit-request/${request.id}` },
                'Edit'
              )
            )
          )
        )
      )
    ),
    React.createElement(
      'a',
      { href: '/' },
      React.createElement('button', null, 'Back to Home')
    )
  );
};

const tableHeaderStyle = {
  backgroundColor: '#f2f2f2',
  padding: '10px',
  borderBottom: '1px solid #ddd',
  textAlign: 'left'
};

const tableCellStyle = {
  padding: '10px',
  borderBottom: '1px solid #ddd'
};

window.ProfilePage = ProfilePage;
