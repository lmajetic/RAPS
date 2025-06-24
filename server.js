const express = require('express');
const mysql = require('mysql');
const bcrypt = require('bcryptjs');
const bodyParser = require('body-parser');
const path = require('path');
const request = require('request');

const app = express();
const port = process.env.PORT || 3000;

// Serve static files from the 'public' directory
app.use(express.static(path.join(__dirname, 'public')));

// Database setup
const db = mysql.createConnection({
    host: 'student.veleri.hr',
    user: 'lmajetic',
    password: '11',
    database: 'lmajetic'
});

db.connect(err => {
    if (err) {
        console.error('MySQL connection error:', err);
        return;
    }
    console.log('MySQL Connected...');
});

app.use(bodyParser.json());

// Serve the login form when root URL is accessed
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'loginforum.html'));
});

// Handle user registration
app.post('/register', (req, res) => {
    const { username, email, password } = req.body;

    if (!username || !email || !password) {
        return res.json({ success: false, message: 'All fields are required.' });
    }

    const query = 'SELECT * FROM users WHERE email = ?';
    db.query(query, [email], async (err, results) => {
        if (err) {
            console.error('Error:', err);
            return res.json({ success: false, message: 'An error occurred.' });
        }

        if (results.length > 0) {
            const user = results[0];
            const match = await bcrypt.compare(password, user.password);
            if (match) {
                return res.json({ success: true, message: 'Login successful.' });
            } else {
                return res.json({ success: false, message: 'Incorrect password.' });
            }
        } else {
            const hashedPassword = await bcrypt.hash(password, 10);
            const insertQuery = 'INSERT INTO users (username, email, password) VALUES (?, ?, ?)';
            db.query(insertQuery, [username, email, hashedPassword], (err, results) => {
                if (err) {
                    console.error('Error:', err);
                    return res.json({ success: false, message: 'An error occurred.' });
                }
                return res.json({ success: true, message: 'Account created and login successful.' });
            });
        }
    });
});

app.get('/proxy', (req, res) => {
  const url = decodeURIComponent(req.query.url);
  if (!url.startsWith('http')) return res.status(400).send('Invalid URL');
  
  request(url)
    .on('error', err => {
      console.error('Proxy stream error:', err);
      res.status(500).send('Stream proxy error');
    })
    .pipe(res);
});

// Add favorite radio station
app.post('/favorites/add', (req, res) => {
    const { userId, radioStation } = req.body;

    if (!userId || !radioStation) {
        return res.status(400).json({ success: false, message: 'Missing userId or station.' });
    }

    const query = 'INSERT INTO RadioFav (Radio_station, email) VALUES (?, ?)';
    db.query(query, [radioStation, userId], (err, result) => {
        if (err) {
            console.error('Error adding favorite:', err);
            return res.status(500).json({ success: false, message: 'Database error.' });
        }
        res.json({ success: true, message: 'Station added to favorites.' });
    });
});

// Remove favorite radio station
app.post('/favorites/remove', (req, res) => {
    const { userId, radioStation } = req.body;

    if (!userId || !radioStation) {
        return res.status(400).json({ success: false, message: 'Missing userId or station.' });
    }

    const query = 'DELETE FROM RadioFav WHERE email = ? AND Radio_station = ?';
    db.query(query, [userId, radioStation], (err, result) => {
        if (err) {
            console.error('Error removing favorite:', err);
            return res.status(500).json({ success: false, message: 'Database error.' });
        }
        res.json({ success: true, message: 'Station removed from favorites.' });
    });
});

// Get favorites for a user
app.get('/favorites/:userId', (req, res) => {
    const userId = req.params.userId;

    const query = 'SELECT Radio_station FROM RadioFav WHERE email = ?';
    db.query(query, [userId], (err, results) => {
        if (err) {
            console.error('Error fetching favorites:', err);
            return res.status(500).json({ success: false, message: 'Database error.' });
        }
        const stations = results.map(row => row.Radio_station);
        res.json({ success: true, favorites: stations });
    });
});

app.listen(port, () => {
    console.log(`Server running at http://localhost:${port}/`);
});
