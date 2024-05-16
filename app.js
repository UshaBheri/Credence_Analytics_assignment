// Import required modules
const express = require('express');
const mongoose = require('mongoose');

// Create Express app
const app = express();
const PORT = process.env.PORT || 3000;

// Body parsing middleware
app.use(express.json());

// Connect to MongoDB
mongoose.connect('mongodb://localhost:27017/books', { useNewUrlParser: true, useUnifiedTopology: true });
const db = mongoose.connection;
db.on('error', console.error.bind(console, 'MongoDB connection error:'));

// Define Book schema
const bookSchema = new mongoose.Schema({
    name: String,
    img: String,
    summary: String
});
const Book = mongoose.model('Book', bookSchema);

// CRUD Routes
// Create a new book
app.post('/books', async (req, res) => {
    try {
        // Extract name and img from the request body
        const { name, img,summary} = req.body;

        // Create a new book object with the extracted data
        const newBook = await Book.create({ name, img,summary });

        // Send a success response with the newly created book object
        res.status(201).json(newBook);
    } catch (err) {
        // Send an error response if there's an error
        res.status(400).json({ message: err.message });
    }
});


// Read all books
app.get('/books', async (req, res) => {
    try {
        const books = await Book.find();
        res.json(books);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

// Read a single book
app.put('/books/:id', async (req, res) => {
    try {
        // Extract name and img from the request body
        const { name, img,summary } = req.body;
        const updatedBook = await Book.findByIdAndUpdate(req.params.id, { name, img,summary }, { new: true });
        if (!updatedBook) {
            return res.status(404).json({ message: 'Book not found' });
        }
        res.json(updatedBook);
    } catch (err) {
        res.status(400).json({ message: err.message });
    }
});


// Update a book
app.put('/books/:id', async (req, res) => {
    try {
        // Extract name and img from the request body
        const { name, img, summary } = req.body;
        const {id} = req.params;

        // Check if any of the fields are missing in the request body
        if (!name || !img || !summary) {
            return res.status(400).json({ message: 'Name, img, and summary are required' });
        }

        // Update the book in the database with the provided data
        const updatedBook = await Book.findByIdAndUpdate(
            id, 
            { name, img, summary }, 
            { new: true } 
        );

        // Check if the book was found and updated successfully
        if (!updatedBook) {
            return res.status(404).json({ message: 'Book not found' });
        }

        // Send a success response with the updated book object
        res.json(updatedBook);
    } catch (err) {
        // Send an error response if there's an error
        res.status(400).json({ message: err.message });
    }
});

// Delete a book
app.delete('/books/:id', async (req, res) => {
    try {
        const { name, img,summary } = req.body;

        // Optionally, you can use the name and img if needed for logging or other purposes
        console.log(`Deleting book with name: ${name}, img: ${img},${summary}`);

        await Book.findByIdAndDelete(req.params.id);
        res.json({ message: 'Deleted book' });
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});


// Start the server
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});
