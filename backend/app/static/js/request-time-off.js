function RequestTimeOffPage() {
  const [confirmationMessage, setConfirmationMessage] = React.useState(null);
  const [isError, setIsError] = React.useState(false);
  const [user, setUser] = React.useState(null);

  React.useEffect(() => {
    fetch('/api/auth/user')
      .then(response => response.json())
      .then(data => {
        if (data.user) {
          setUser(data.user);
        } else {
          window.location.href = '/';
        }
      })
      .catch(error => {
        console.error('Error fetching user:', error);
        window.location.href = '/';
      });
  }, []);

  const handleRequestSubmitted = (message, error = false) => {
    setConfirmationMessage(message);
    setIsError(error);
  };

  if (!user) {
    return React.createElement('div', null, 'Loading...');
  }

  return React.createElement(
    'div',
    null,
    React.createElement('h1', null, `Request Time Off for ${user}`),
    confirmationMessage && React.createElement(
      'div',
      { 
        style: {
          backgroundColor: isError ? '#ffcccc' : '#ccffcc',
          padding: '10px',
          marginBottom: '20px',
          borderRadius: '5px'
        }
      },
      confirmationMessage
    ),
    React.createElement(TimeOffRequestForm, { onRequestSubmitted: handleRequestSubmitted }),
    React.createElement(
      'a',
      { href: '/' },
      React.createElement('button', null, 'Back to Home')
    )
  );
}

// Make the component available globally
window.RequestTimeOffPage = RequestTimeOffPage;
