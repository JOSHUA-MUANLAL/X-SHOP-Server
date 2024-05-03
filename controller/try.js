const express = require('express');
const mongoose = require('mongoose');
const multer = require('multer');
const cors = require('cors');

const app = express();
const port = 3000;

// Connect to MongoDB
mongoose.connect('mongodb://localhost:27017/image_store', {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

const userSchema = new mongoose.Schema({
  id: { type: String, required: true },
  email: { type: String, required: true },
  images: [
    {
      imageData: { type: String, required: true },
      mimeType: { type: String, required: true },
    },
  ],
});

const User = mongoose.model('User', userSchema);

app.use(cors());
app.use(express.json());

// Set up Multer for handling file uploads
const storage = multer.memoryStorage();
const upload = multer({ storage });

// Endpoint to upload multiple images in one go
app.post('/upload', upload.array('images'), async (req, res) => {
  const { id, email } = req.body;

  if (!id || !email) {
    return res.status(400).send({ message: 'User ID and email are required' });
  }

  try {
    const newImages = req.files.map((file) => ({
      imageData: file.buffer.toString('base64'),
      mimeType: file.mimetype,
    }));

    let user = await User.findOne({ id });

    if (!user) {
      user = new User({ id, email, images: newImages });
    } else {
      user.images.push(...newImages); // Add new images to existing user's array
    }

    await user.save();

    res.status(200).send({ message: 'Images uploaded successfully' });
  } catch (error) {
    res.status(500).send({ message: 'Error uploading images', error });
  }
});

// Endpoint to fetch all users with their images
app.get('/images', async (req, res) => {
  try {
    const users = await User.findOne({email:'aa@aa'});
    res.status(200).send(users || []);
  } catch (error) {
    res.status(500).send({ message: 'Error fetching images', error });
  }
});

app.listen(port, () => {
  console.log(`Server running at http://localhost:${port}`);
});
