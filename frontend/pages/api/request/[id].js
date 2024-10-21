// pages/api/request/[id].js

export default async function handler(req, res) {
  const id = req.query; // Get the request ID from the query parameters
  console.log(id);
  const flaskApiUrl = `http://127.0.0.1:5000/api/request/${id['id']}`; // Your Flask API URL
  const userEmail = req.headers["user"];
  if (req.method === 'GET') {
    console.log(req.headers);
    try {
      const response = await fetch(flaskApiUrl, {
        method: 'GET',
        headers: { 
          'Content-Type': 'application/json',
          'user': userEmail
         },
      }); // Fetch from Flask API
      const data = await response.json();

      if (!response.ok) {
        return res.status(response.status).json(data); // Forward the error response
      }

      return res.status(200).json(data); // Return the data from Flask
    } catch (error) {
      console.error('Error fetching from Flask API:', error);
      return res.status(500).json({ error: 'Failed to fetch data from Flask API' });
    }
  }

  if (req.method === 'PUT') {
    try {
      const response = await fetch(flaskApiUrl, {
        method: 'PUT',
        headers: { 
          'Content-Type': 'application/json',
          'user': userEmail
         },
        body: JSON.stringify(req.body), // Forward the request body
      });
      console.log(req.body)
      const data = await response.json();

      if (!response.ok) {
        return res.status(response.status).json(data); // Forward the error response
      }

      return res.status(200).json(data); // Return the success response
    } catch (error) {
      console.error('Error updating request in Flask API:', error);
      return res.status(500).json({ error: 'Failed to update request in Flask API' });
    }
  }

  if (req.method === 'DELETE') {
    try {
      const response = await fetch(flaskApiUrl, {
        method: 'DELETE',
        headers: { 
          'Content-Type': 'application/json',
          'user': userEmail
         }
      });

      const data = await response.json();

      if (!response.ok) {
        return res.status(response.status).json(data); // Forward the error response
      }

      return res.status(200).json(data); // Return the success response
    } catch (error) {
      console.error('Error deleting request in Flask API:', error);
      return res.status(500).json({ error: 'Failed to delete request in Flask API' });
    }
  }

  // Handle unsupported methods
  res.setHeader('Allow', ['GET', 'PUT', 'DELETE']);
  res.status(405).end(`Method ${req.method} Not Allowed`);
}
