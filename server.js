const express = require('express');
const bodyParser = require('body-parser');
const fs = require('fs');
const path = require('path');

const app = express();
const PORT = 3000;
const DATA_FILE = path.join(__dirname, 'appointments.json');

// Middleware
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, 'public')));

// 📥 Handle form submission and save to JSON
app.post('/book', (req, res) => {
  const { name, email, phone, service, date, time, notes } = req.body;
  const newAppointment = { name, email, phone, service, date, time, notes };

  fs.readFile(DATA_FILE, 'utf8', (err, data) => {
    if (err) return res.status(500).send('Failed to read appointments.');

    let appointments = [];
    try {
      appointments = JSON.parse(data);
    } catch (e) {
      console.error('❌ Error parsing JSON:', e.message);
    }

    appointments.push(newAppointment);

    fs.writeFile(DATA_FILE, JSON.stringify(appointments, null, 2), (err) => {
      if (err) return res.status(500).send('Failed to save appointment.');
      res.redirect('/staff-dashboard.html');
    });
  });
});

// 📤 Route to serve all appointments
app.get('/appointments', (req, res) => {
  fs.readFile(DATA_FILE, 'utf8', (err, data) => {
    if (err) return res.status(500).json({ error: 'Failed to load appointments.' });

    try {
      const appointments = JSON.parse(data);
      res.json(appointments);
    } catch (e) {
      res.status(500).json({ error: 'Corrupted JSON data.' });
    }
  });
});

// Start server
app.listen(PORT, () => {
  console.log(`🚀 Server running at http://localhost:${PORT}`);
});
