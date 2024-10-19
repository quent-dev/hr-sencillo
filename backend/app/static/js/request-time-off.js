function RequestTimeOffPage() {
  return React.createElement(
    'div',
    null,
    React.createElement('h1', null, 'Request Time Off'),
    React.createElement(TimeOffRequestForm, null)
  );
}

// Make the component available globally
window.RequestTimeOffPage = RequestTimeOffPage;
