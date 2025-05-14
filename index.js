// express-api/index.js
const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const nodemailer = require('nodemailer');
const { createClient } = require('@supabase/supabase-js');
require('dotenv').config({ path: './express-api/.env' });

const path = require('path');

const app = express();
const port = 3000;

// Supabase
const SUPABASE_URL = process.env.SUPABASE_URL;
const SUPABASE_API_KEY = process.env.SUPABASE_API_KEY;
const supabase = createClient(SUPABASE_URL, SUPABASE_API_KEY);

// Email
const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASSWORD
  }
});

app.use(cors());
app.use(bodyParser.json());

// Serve static files from a 'public' directory
app.use(express.static(path.join(__dirname, 'static')));

app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'index.html'));
});

// CONTACT FORM ROUTE
app.post('/intake', async (req, res) => {
    const { name, email, company, notes } = req.body;
  
    try {
      // 1. Save to Supabase
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
  
      // 2. Send confirmation email to user
      const confirmationMailOptions = {
        from: process.env.EMAIL_USER,
        to: email,  // <-- this uses the email submitted in the form
        subject: 'Thank you for contacting us!',
        text: `Hi ${name},\n\nThank you for reaching out to NextStepAI. We'll be in touch shortly.\n\n— The NextStepAI Team`
      };
  
      await transporter.sendMail(confirmationMailOptions);
  
      // 3. Notify your internal team
      const internalMailOptions = {
        from: process.env.EMAIL_USER,
        to: process.env.EMAIL_USER, // Or another team email
        subject: `New contact form submission from ${name}`,
        text: `Name: ${name}\nEmail: ${email}\nCompany: ${company}\nNotes: ${notes}`
      };
  
      await transporter.sendMail(internalMailOptions);
  
      res.status(200).json({ message: 'Submission successful' });
  
    } catch (err) {
      console.error('Error in /intake route:', err);
      res.status(500).json({ message: 'Something went wrong' });
    }
  });
  

app.listen(port, () => {
  console.log(`Express API listening on http://localhost:${port}`);
});
