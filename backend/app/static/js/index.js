const HomePage = () => {
  const [user, setUser] = React.useState(null);

  React.useEffect(() => {
    fetch('/api/auth/user')
      .then(response => response.json())
      .then(data => {
        if (data.user) setUser(data.user);
      });
  }, []);

  const handleLogin = (user) => {
    setUser(user);
  };

  const handleLogout = async () => {
    await fetch('/api/auth/logout');
    setUser(null);
  };

  if (!user) {
    return React.createElement(LoginForm, { onLogin: handleLogin });
  }

  return React.createElement(
    'div',
    null,
    React.createElement('h1', null, `Welcome, ${user}`),
    React.createElement('button', { onClick: handleLogout }, 'Logout'),
    React.createElement(
      'a',
      { href: '/request-time-off' },
      React.createElement('button', null, 'Request Time Off')
    ),
    React.createElement(
      'a',
      { href: '/profile' },
      React.createElement('button', null, 'View Profile')
    )
  );
};

window.HomePage = HomePage;
