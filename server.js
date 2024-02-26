// Const variables for the application
const express = require('express');
const path = require('path');
const PORT = 3001;
const app = express();
const fs = require('fs');
// Using the UUID package for generating unique identifiers for my notes
const { v4: uuidv4 } = require('uuid');

// Middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use(express.static('public'));

// Routes for application
app.get('/notes', (req, res) => {
    res.sendFile(path.join(__dirname, './public/notes.html'));
});

// Function for getting notes from db.json
const getNotesFromFile = () => {
    // Uses fs to find and read from the file
    const data = fs.readFileSync('./db/db.json', 'utf8');
    // Returns parsed data or an error and and empty array
    try {
      return JSON.parse(data);
    } catch (error) {
      console.error('Error:', error);
      return [];
    }
  };
  
  // GET method for notes API Call on notes.html load.
  app.get('/api/notes', (req, res) => {
    const notes = getNotesFromFile();
    res.json(notes);
  });

  // Function for storing notes to db.json 
  const saveNotesToFile = (notes) => {
    // This variable is only here to format the file.
    const jsonContent = JSON.stringify(notes, null, 2);
    // Uses fs to update db.json with the updated notes list.
    fs.writeFileSync('./db/db.json', jsonContent, 'utf8');
  };
  
  // POST method used to update the API notes.
  app.post('/api/notes', (req, res) => {
    // Calls the getNotesFromFile function
    const notes = getNotesFromFile();
    // Creates object for the newly created note.
    const newNote = {
        title: req.body.title,
        text: req.body.text,
        // This function is part of the UUID package and is used to generate a unique ID.
        id: uuidv4()
    };
    // Updates the notes called at start of function by adding the new note
    notes.push(newNote);
    // Adds note to db.json
    saveNotesToFile(notes);
    // Logs that a note has been saved.
    res.json({ message: 'Note has been saved.' });
  });
  
  // DELETE method for removing notes by id (generated with UUID).
  app.delete('/api/notes/:id', (req, res) => {
    // Gets notes from db.json
    const notes = getNotesFromFile();
    // Gets the id of the note we are attempting to delete.
    const noteId = req.params.id;
    // This line of code uses the filter function to comb through the notes and essentially test if each object in the notes arrays id matches that of the note we are attempting to delete. If the ids are not equal it moves on, saves the updated array as in updatedNotes var.
    const updatedNotes = notes.filter((note) => note.id !== noteId);
    // Saves updatedNotes to db.json
    saveNotesToFile(updatedNotes);
    // Logs note has been deleted to api.
    res.json({ message: 'Note has been deleted.' });
  });

  // Learnt the hard way that this NEEDS to come after all other routes (which I was already warned when we learnt this), gets any route attempt that isnt already defined and redirects that traffic to index.html/landing page.
  app.get('*', (req, res) => {
    // Responds with index.html
    res.sendFile(path.join(__dirname, './public/index.html'));
});

// Tells the app to run on the defined port
app.listen(PORT, () => {
    // Logs that the server has started in console.
    console.log('Server started.');
});