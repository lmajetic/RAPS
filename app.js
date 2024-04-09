
const express = require("express");
const app = express(); //Konstruktor
const port=3000;
const PORT = process.env.PORT || 3000;



/*24/1/24 - 2
const axios=require('axios');
const csv=require('csv-parser');

const rezultati = [];

app.get('/sud', async(req, res) =>
{
    const response = await axios.get('https://data.gov.hr/ckan/dataset/56ac1f63-2dda-4703-b5f9-01170b6d15ea/resource/7e1fe68f-589b-4a53-8d7f-422a42d11d7c/download/os-novi-zagreb-rezultati-rada-suda-2023.csv',
    {
        responseType:'stream'
    });

    response.data
        .pipe(csv())
        .on('data', (data) => rezultati.push(data))
        .on('end', () => 
        {
            res.send(rezultati);
        });
});
*/


/* 24/1/24 - 1
const axios = require('axios'); //Podaci s servera

const urlvic = 'https://official-joke-api.appspot.com/random_joke';

app.get('/vic', async(req, res) => // req u jednom trenutku a res u drugom
{
    try
    {
        const response = await axios.get(urlvic); // čekanje
        res.json(response.data);
    }
    catch(error)
    {
        console.error(error);
        res.status(500).send("greška u dohvaćanju vica");
    }
});
*/


/* 6/12/23
const niz = ["stol", "stolica", "kuća", "api", "js", "Elon", "program"];

app.get('/randomRijec', (req, res) => 
{
    const randomBroj = Math.floor(Math.random() * niz.length());
    res.send(niz[randomBroj]);
});
*/




/*
const bodyParser = require('body-parser');

app.use(bodyParser.json());

app.post('/zbroji', (req,res) =>
{
    const {broj1,broj2} = req.body;
    const rezultat = broj1 + broj2;
    res.json({rezultat});
    
});

app.post('/oduzmi', (req,res) =>
{
    const {broj1,broj2} = req.body;
    const rezultat = broj1 - broj2;
    res.json({rezultat});
    
});

app.post('/mnozi', (req,res) =>
{
    const {broj1, broj2} = req.body;
    const rezultat = broj1 * broj2;
    res.json({rezultat});

});

app.post('/dijeli', (req,res) => 
{
    const {broj1, broj2} = req.body;
    if (broj2 === 0){
        return res.status(400).json({greška: 'Nemoguće dijeljenje s nulom'});
    }

    else{
    const rezultat = broj1 / broj2;
    res.json({rezultat});
    }

});
*/




/*
const todoList = [];
const bodyParser = require('body-parser');

app.use(bodyParser.json());

app.post('/add', (req,res) => 
{
    const taskId = todoList.length;
    const {task} = req.body;

    todoList.app.push({id:taskId, task});
    res.json({id:taskId, task});
});

app.get('/list', (req,res) =>
{
    res.json(todoList);
});

app.delete('/delete/:id', (req,res) =>
{
    const taskId = parseInt(req.params.id); //Id dobivamo iz URL-a
    todoList.splice(taskId,1);
    res.json({poruka:'Uspješno obrisano'});
});*/




/*
const profil = [];
const bodyParser = require('body-parser'); //Sve što dođe unutar body-a će pretvoriti u JSON
app.use(bodyParser.json());

app.post('/add', (req,res) => 
{
    const {ime, prezime, email} = req.body;
    const profilId = profil.length;
    const noviProfil = {id: profilId, ime, prezime, email};
    profil.push(noviProfil);
    res.json(noviProfil);
});

app.get('/profil/:id', (req,res) =>
{
    const profilId = parseInt(req.params.id);
    res.json(profil[profilId]);
});*/




/*
const mysql=require("mysql");
const db=mysql.createConnection(
{
    host:'student.veleri.hr',
    user:'lmajetic',
    password:'11',
    database:'lmajetic'
});

db.connect(
    (err) => 
    {
        if (err) throw err;
        console.log("Povezano s bazom");
    });
    
app.use(express.json());

app.get('/korisnici', (req, res) =>
{
    const query='SELECT * FROM KorisnikRAPS';
    db.query(query, (err, results) =>
    {
        if (err) throw err;
        res.json(results);
    });
});

app.post('/korisnici', (req, res) =>
{
    
    const noviKorisnik=req.body;
    const upit='INSERT INTO KorisnikRAPS(ime,prezime) VALUES (?,?)'; // ? je prepared statement
    db.query(upit, [noviKorisnik.ime, noviKorisnik.prezime], (err, result) =>  //noviKorisnik ulazi u
    {
        if (err) throw err;
        res.send('Korisnik dodan u bazu.');
    });
});
*/




app.listen (port, () => 
{
    console.log(`Server je pokrenut na portu ${port}`);
});
