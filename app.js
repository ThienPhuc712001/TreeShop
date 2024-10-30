
const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const multer = require('multer');
const Tree = require('./models/tree'); 

const app = express();
mongoose.connect('mongodb://localhost:27017/TreeShop', { useNewUrlParser: true, useUnifiedTopology: true });

// Set EJS as the view engine
app.set('view engine', 'ejs');
app.use(bodyParser.urlencoded({ extended: true }));

// Configure Multer for file uploads
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, 'uploads/');
  },
  filename: (req, file, cb) => {
    cb(null, Date.now() + '-' + file.originalname);
  },
});
const upload = multer({ storage });

app.listen(3000, () => console.log('Server running on http://localhost:3000'));


// Route to render the add form
app.get('/add', (req, res) => {
  res.render('add');
});

// Route to handle form submission and save tree info
app.post('/add', upload.single('image'), async (req, res) => {
  try {
    const { treename, description } = req.body;
    const image = req.file ? req.file.filename : ''; // Save the file name if uploaded

    // Create a new tree object
    const newTree = new Tree({ treename, description, image });

    // Save to the database
    await newTree.save();

    res.redirect('/'); // Redirect to home page after adding
  } catch (error) {
    console.error('Error adding tree:', error);
    res.status(500).send('Error adding tree.');
  }
});
app.use('/uploads', express.static('uploads'));
// Route to display all trees
app.get('/', async (req, res) => {
  try {
    const trees = await Tree.find(); // Fetch all trees from the database
    res.render('index', { trees });
  } catch (error) {
    console.error('Error fetching trees:', error);
    res.status(500).send('Error fetching trees.');
  }
});
