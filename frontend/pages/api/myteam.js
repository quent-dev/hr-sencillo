export default async function handler(req, res) {
    const userEmail = req.headers["user"];
    if (req.method === 'GET') {
      try {
        const response = await fetch('http://127.0.0.1:5000/api/myteam', {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
            'user': userEmail
          }
        });
  
        if (!response.ok) {
          throw new Error('Failed to retrieve team timeoff requests');
        }
  
        const data = await response.json();
        res.status(200).json(data);
      } catch (error) {
        res.status(500).json({ error: 'Failed to retrieve team time off request' });
      }
    } 
    else {
      res.setHeader('Allow', ['POST']);
      res.status(405).end(`Method ${req.method} Not Allowed`);
    }
  }