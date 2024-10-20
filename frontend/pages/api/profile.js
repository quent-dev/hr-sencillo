export default async function handler(req, res) {
  if (req.method === 'GET') {
    try {
      const response = await fetch('http://127.0.0.1:5000/api/profile', {
        headers: {
          'Cookie': req.headers.cookie || ''
        },
        method: 'GET',
        body: JSON.stringify({ user: req.cookies.user }),
        credentials: 'include'
      });

      const data = await response.json();

      if (response.ok) {
        res.status(200).json(data);
      } else {
        res.status(response.status).json(data);
      }
    } catch (error) {
      res.status(500).json({ error: 'An error occurred while fetching profile data' });
    }
  } else if (req.method === 'POST') { // Handle POST request
    try {
      const { user } = req.body; // Extract user from the request body
      // Process the user data as needed, e.g., fetch profile data based on user
      const response = await fetch('http://127.0.0.1:5000/api/profile', {
        headers: {
          'Cookie': req.headers.cookie || ''
        },
        method: 'POST', // Change to POST if sending data
        body: JSON.stringify({ user }), // Include user in the request body
        credentials: 'include'
      });

      const data = await response.json();

      if (response.ok) {
        res.status(200).json(data);
      } else {
        res.status(response.status).json(data);
      }
    } catch (error) {
      res.status(500).json({ error: 'An error occurred while fetching profile data' });
    }
  } else {
    res.setHeader('Allow', ['GET', 'POST']); // Allow both GET and POST methods
    res.status(405).end(`Method ${req.method} Not Allowed`);
  }
}
