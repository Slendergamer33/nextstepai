// express-api/index.js
const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
require('dotenv').config();

const path = require('path');

const app = express();
const port = 3000;

const SUPABASE_URL = process.env.SUPABASE_URL;
const SUPABASE_API_KEY = process.env.SUPABASE_API_KEY;

app.use(cors());
app.use(bodyParser.json());

// Serve static files from a 'public' directory
app.use(express.static(path.join(__dirname, 'static')));

// Optional: send index.html for root path
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname,'index.html'));
});

app.post('/intake', async (req, res) => {
    const { name, email, company, notes } = req.body;

    try {
        const response = await fetch(`${SUPABASE_URL}/rest/v1/clients`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'apikey': SUPABASE_API_KEY,
                'Authorization': `Bearer ${SUPABASE_API_KEY}`,
                'Prefer': 'return=representation'
            },
            body: JSON.stringify({ name, email, company, notes })
        });

        const data = await response.json();
        res.status(200).json({ message: 'Success', data });
    } catch (err) {
        console.error(err); 
        res.status(500).json({ message: 'Error submitting form' });
    }
});

app.listen(port, () => console.log(`Express API listening on http://localhost:${port}`));
