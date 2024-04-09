const express = require('express');
const fetch = require('node-fetch'); // dohvaćanje s tuđeg servera gdje nije text (datoteke)
const cors = require('cors'); // Cross-Origin Resource Sharing
const app = express();
const port = 3000;
app.use(cors()); // Za pristupanje drugim stranicama zbog zaštite weba

const api_kljuc = 'jdjĬDfrsd54f5d2sf5dfdsfQW5s'; // -> ovo morate promijeniƟ (registriraƟ se)

app.get('/random-foto', async (req, res) => 
{
 try 
 {
 const response = await fetch(`https://api.unsplash.com/photos/random?client_id=${api_kljuc}`); //-> ovaj ključ je kao onaj gore (zamijeniƟ)
 const data = await response.json();
 res.json(
    {
        imageUrl : data.urls.raw,
        description : data.alt_description,
        autor : data.user.name
    });
 } 
 catch (error) 
 {
 res.status(500).json({ error: error.toString() });
 }
});


app.listen(port, () => {
 console.log(`Server pokrenut na hƩp://localhost:${port}`);
});