// Importing express module
const express = require('express');
const fs = require("fs");
const cors = require('cors');
const app = express();

app.use(express.json());

app.use(cors({
    origin: '*'
}));

app.post('/read-scheme', (req, res) => {
    const data = fs.readFileSync('mock-data/' + req.body.fileName, 'utf8');
    res.send(data);
});

app.post('/read-data', (req, res) => {
    const data = fs.readFileSync('mock-data/' + req.body.fileName, 'utf8');
    res.send(data);
});

app.listen(3000, () => {
    console.log('Our express server is up on port 3000');
});