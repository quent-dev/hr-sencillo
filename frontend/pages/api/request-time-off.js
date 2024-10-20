export default async function handler(req, res) {
  if (req.method === 'POST') {
    try {
      const response = await fetch('http://127.0.0.1:5000/api/request-time-off', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(req.body),
      });

      if (!response.ok) {
        throw new Error('Failed to submit time off request');
      }

      const data = await response.json();
      res.status(200).json(data);
    } catch (error) {
      res.status(500).json({ error: 'Failed to submit time off request' });
    }
  } else {
    res.setHeader('Allow', ['POST']);
    res.status(405).end(`Method ${req.method} Not Allowed`);
  }
}
