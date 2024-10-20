export default async function handler(req, res) {
  if (req.method === 'POST') {
    try {
      const response = await fetch('http://127.0.0.1:5000/api/profile/update', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Cookie': req.headers.cookie || ''
        },
        body: JSON.stringify(req.body),
        credentials: 'include'
      });

      const data = await response.json();

      if (response.ok) {
        res.status(200).json(data);
      } else {
        res.status(response.status).json(data);
      }
    } catch (error) {
      res.status(500).json({ error: 'An error occurred while updating profile data' });
    }
  } else {
    res.setHeader('Allow', ['POST']);
    res.status(405).end(`Method ${req.method} Not Allowed`);
  }
}
