function RequestTimeOffPage() {
  const [confirmationMessage, setConfirmationMessage] = React.useState(null);
  const [isError, setIsError] = React.useState(false);

  const handleRequestSubmitted = (message, error = false) => {
    setConfirmationMessage(message);
    setIsError(error);
  };

  return React.createElement(
    'div',
    null,
    React.createElement('h1', null, 'Request Time Off'),
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
