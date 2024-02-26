// Const variables for the application
const express = require('express');
const path = require('path');
const PORT = 3001;
const app = express();

// Middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use(express.static('public'));

// Routes for application
app.get('*', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

app.get('/notes', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'notes.html'));
});

app.get('/api/notes', (req, res) => {
    res.json({message: 'Get notes from API'});
});

app.post('/api/notes', (req, res) => {
    console.log(`Note: ${req.body}`);
    res.json({message: 'Saved note to API'});
});

app.delete('/api/notes/:id', (req, res) => {
    const id = req.params.id;
    console.log(`Note: ${id} deleted.`);
    res.json({message: `Note: ${id} deleted.`});
});

app.listen(PORT, () => {
    console.log('Server started.');
});