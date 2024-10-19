const LoginForm = ({ onLogin }) => {
  const [loginData, setLoginData] = React.useState({ email: '', password: '' });

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
        onLogin(data.user);
      } else {
        alert(data.error || 'Login failed');
      }
    } catch (error) {
      alert('An error occurred during login');
    }
  };

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
};

window.LoginForm = LoginForm;
