const express = require('express');
const mysql = require('mysql');
const bcrypt = require('bcrypt');
const bodyParser = require('body-parser');
const path = require('path');

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

app.listen(port, () => {
    console.log(`Server running at http://localhost:${port}/`);
});
