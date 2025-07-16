// server.js
const express = require('express');
const axios = require('axios');
const app = express();

const AIRTABLE_API_KEY = "pat0R5ynXb9WP06Xx";
const AIRTABLE_BASE_ID = "appMZ0s6RcKzcVYQa";
const TABLE_NAME = process.env.TABLE_NAME || 'Status';

app.get('/webhook/track-open', async (req, res) => {
  const email = req.query.id;
  if (!email) return res.status(400).send('Missing email');

  try {
    const searchRes = await axios.get(
      `https://api.airtable.com/v0/${AIRTABLE_BASE_ID}/${encodeURIComponent(TABLE_NAME)}?filterByFormula=Email='${email}'`,
      {
        headers: {
          Authorization: `Bearer ${AIRTABLE_API_KEY}`,
        },
      }
    );

    const record = searchRes.data.records[0];
    if (!record) return res.status(404).send('Not found');

    await axios.patch(
      `https://api.airtable.com/v0/${AIRTABLE_BASE_ID}/${TABLE_NAME}/${record.id}`,
      {
        fields: {
          Status: 'прочёл',
        },
      },
      {
        headers: {
          Authorization: `Bearer ${AIRTABLE_API_KEY}`,
          'Content-Type': 'application/json',
        }
      }
    );

    res.setHeader('Content-Type', 'image/png');
    res.send(Buffer.from("iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAQAAAC1HAwCAAAAC0lEQVR4nGNgYAAAAAMAAWgmWQ0AAAAASUVORK5CYII=", 'base64'));
  } catch (err) {
    console.error(err.response?.data || err);
    res.status(500).send('Server error');
  }
});

app.listen(3000, () => console.log('📡 Tracker running on port 3000'));
