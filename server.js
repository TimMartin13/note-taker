// Dependencies
// =============================================================
var express = require("express");
var path = require("path");
const fs = require("fs");

// Sets up the Express App
// =============================================================
var app = express();
var PORT = process.env.PORT || 3001;

// Sets up the Express app to handle data parsing
app.use(express.urlencoded({ extended: true }));
app.use(express.static('public'));
app.use(express.json());

// Sticky Notes (DATA)
// =============================================================
// var notes = [];

// Routes
// =============================================================
app.get("/notes", function(req, res) {
    res.sendFile(path.join(__dirname, "./public/notes.html"));
});

// Displays all characters
app.get("/api/notes", function(req, res) {
    // Get the saved notes
    let savedData = fs.readFileSync(__dirname + "/db/db.json");
    // Parse the data
    let notes = JSON.parse(savedData);
    // Return the notes to the front end
    res.json(notes);
});

// Basic route that sends the user first to the AJAX Page
app.get("*", function(req, res) {
    res.sendFile(path.join(__dirname, "./public/index.html"));
});

app.post("/api/notes", function(req, res) {
    // Get the saved notes
    let savedData = fs.readFileSync(__dirname + "/db/db.json");
    // Parse the data
    let notes = JSON.parse(savedData);
    // Get the new note from the user
    let newNote = req.body;
    // Add a unique ID
    newNote.id = new Date();
    // Push it into the current array
    notes.push(newNote);
    // Write back to the db.json
    fs.writeFile(__dirname + "/db/db.json", JSON.stringify(notes), 'utf-8', (err) => err ? console.error(err) : console.log("Success!"));
    // Return the new note to the page  
    res.json(newNote);
  });

app.delete("/api/notes/:id", function(req, res) {
    // Get the saved notes
    let savedData = fs.readFileSync(__dirname + "/db/db.json");
    // Parse the data
    let notes = JSON.parse(savedData);
    // Cycle through the array
    for (let i = 0; i < notes.length; i++) {
        // Find the note that matches the ID to be deleted
        if (req.params.id === notes[i].id) {
            // Remove the deleted data
            let deleted = notes.splice(i, 1);
        }
    }
    // Write it back to the file
    fs.writeFile(__dirname + "/db/db.json", JSON.stringify(notes), 'utf-8', (err) => err ? console.error(err) : console.log("Success!"));
    // Send the data back to the user
    return res.json(notes);
});

// Starts the server to begin listening
// =============================================================
app.listen(PORT, function() {
  console.log("App listening on PORT " + PORT);
});
