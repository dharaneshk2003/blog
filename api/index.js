const express = require('express');
const app = express();
const cors = require('cors');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const cookieParser = require('cookie-parser');
const multer = require('multer');
const path = require('path');
const fs = require('fs');
const Post = require('./models/PostSchema');
const User = require('./models/userSchema');
require('dotenv').config();

const secret = process.env.SESSION_SECRET || 'your_default_secret'; // Use environment variable for the secret
const port = process.env.PORT || 5000;

// Setup multer storage for profile pictures
const profileStorage = multer.diskStorage({
    destination: (req, file, cb) => {
        const profileDir = path.join(__dirname, 'uploads', 'profile');
        if (!fs.existsSync(profileDir)) {
            fs.mkdirSync(profileDir, { recursive: true });
        }
        cb(null, profileDir);
    },
    filename: (req, file, cb) => {
        const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
        cb(null, file.fieldname + '-' + uniqueSuffix + path.extname(file.originalname));
    }
});

// Setup multer storage for post images
const postStorage = multer.diskStorage({
    destination: (req, file, cb) => {
        const postDir = path.join(__dirname, 'uploads');
        cb(null, postDir);
    },
    filename: (req, file, cb) => {
        const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
        cb(null, file.fieldname + '-' + uniqueSuffix + path.extname(file.originalname));
    }
});

// Create middleware instances
const uploadProfilePicture = multer({ storage: profileStorage });
const uploadPostImage = multer({ storage: postStorage });

app.use(cors({
    credentials: true,
    origin: 'http://localhost:3000', // Replace with your frontend URL
    methods: ['GET', 'POST', 'PUT', 'DELETE'],
    allowedHeaders: ['Content-Type', 'Authorization']
}));

app.use(express.json());
app.use(cookieParser());
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// Register route
app.post('/register', uploadProfilePicture.single('profilePicture'), async (req, res) => {
    const { userName, password } = req.body;
    const profilePicture = req.file ? req.file.filename : null;

    try {
        const salt = await bcrypt.genSalt(12);
        const hashedPassword = await bcrypt.hash(password, salt);

        const user = new User({
            userName,
            password: hashedPassword,
            profilePicture, // Save the profile picture filename
        });
        await user.save();
        res.json(user);
        console.log(user);
    } catch (e) {
        if (e.code === 11000) {
            res.status(400).json({ message: 'Username already exists' });
        } else {
            res.status(500).json(e);
        }
    }
});

// Login route
app.post('/login', async (req, res) => {
    const { userName, password } = req.body;

    try {
        const user = await User.findOne({ userName });
        if (!user) {
            return res.status(400).json({ message: 'Invalid username or password' });
        }

        const result = await bcrypt.compare(password, user.password);
        if (!result) {
            return res.status(400).json({ message: 'Invalid username or password' });
        }

        jwt.sign({ userName, id: user._id }, secret, {}, (err, token) => {
            if (err) throw err;
            res.cookie('token', token).json({
                id: user._id,
                userName
            });
            console.log('Login successful:', user);
        });
    } catch (e) {
        res.status(500).json({ message: 'Server error', error: e });
    }
});

// Profile route
app.get('/profile', (req, res) => {
    const { token } = req.cookies;

    jwt.verify(token, secret, {}, async (err, info) => {
        if (err) return res.status(401).json({ message: 'Unauthorized' });

        try {
            // Find the user by the ID extracted from the token
            const user = await User.findById(info.id);

            if (!user) {
                return res.status(404).json({ message: 'User not found' });
            }

            // Send back the user information including the profile picture
            res.json({
                userName: user.userName,
                profilePicture: user.profilePicture,
            });
        } catch (error) {
            res.status(500).json({ message: 'Server error', error });
        }
    });
});

// Update profile picture route
app.put('/profile/picture', uploadProfilePicture.single('profilePicture'), (req, res) => {
    const { token } = req.cookies;

    jwt.verify(token, secret, async (err, info) => {
        if (err) return res.status(401).json({ message: 'Unauthorized' });

        try {
            const user = await User.findById(info.id);
            if (user.profilePicture) {
                // Delete the old profile picture
                const oldPath = path.join(__dirname, 'uploads', 'profile', user.profilePicture);
                if (fs.existsSync(oldPath)) fs.unlinkSync(oldPath);
            }

            user.profilePicture = req.file.filename;
            await user.save();

            res.json(user);
        } catch (error) {
            res.status(500).json({ message: 'Failed to update profile picture', error });
        }
    });
});

// Delete account route
app.delete('/profile/account', (req, res) => {
    const { token } = req.cookies;

    jwt.verify(token, secret, async (err, info) => {
        if (err) return res.status(401).json({ message: 'Unauthorized' });

        try {
            const user = await User.findById(info.id);
            if (!user) return res.status(404).json({ message: 'User not found' });

            // Delete the user's profile picture if it exists
            if (user.profilePicture) {
                const oldPath = path.join(__dirname, 'uploads', 'profile', user.profilePicture);
                if (fs.existsSync(oldPath)) fs.unlinkSync(oldPath);
            }

            // Delete the user account
            await user.deleteOne();

            // Optionally, clear the cookie and handle logout
            res.cookie('token', '').json({ message: 'Account deleted successfully' });
        } catch (error) {
            res.status(500).json({ message: 'Failed to delete account', error });
        }
    });
});

// Logout route
app.post('/logout', (req, res) => {
    res.cookie('token', '').json('ok');
});

// Create post route
app.post('/post', uploadPostImage.single('image'), (req, res) => {
    const { title, summary, content } = req.body;
    const image = req.file;
    const imageFilename = image ? image.filename : null;
    const { token } = req.cookies;

    jwt.verify(token, secret, {}, (err, info) => {
        if (err) throw err;
        const data = new Post({
            title,
            summary,
            content,
            image: imageFilename,
            author: info.id
        });
        data.save().then(() => {
            console.log('Post created:', data);
        }).catch(err => {
            console.log(err);
        });
        res.json(data);
    });
});

// Get all posts
app.get('/', async (req, res) => {
    try {
        // Perform the query with error handling
        const posts = await Post.find({})
            .populate('author', ['userName'])
            .sort({ createdAt: -1 });

        // Send the posts as a JSON response
        res.json(posts);
    } catch (err) {
        // Handle any errors that occur during the query
        console.error('Query error:', err);
        res.status(500).json({ message: 'Internal server error' });
    }
});

// Get single post by ID
app.get('/post/:id', async (req, res) => {
    const { id } = req.params;
    try {
        const post = await Post.findById(id).populate('author', ['userName']);
        res.json(post);
        console.log(post);
    } catch (error) {
        res.status(500).json({ message: 'Internal server error', error });
    }
});

// Update post route
app.put('/post/:id', uploadPostImage.single('image'), async (req, res) => {
    const { id } = req.params;
    let imageUrl = null;
    
    if (req.file) {
        imageUrl = `/uploads/${req.file.filename}`; // Construct the image URL
    }

    const { token } = req.cookies;
    const { title, summary, content } = req.body;

    jwt.verify(token, secret, {}, async (err, info) => {
        if (err) {
            return res.status(401).json({ error: 'Unauthorized' });
        }

        try {
            const post = await Post.findById(id);
            if (post.author.toString() !== info.id) {
                return res.status(403).json({ error: 'Forbidden' });
            }

            if (imageUrl) {
                // Remove the old image if necessary
                const oldImagePath = path.join(__dirname, 'uploads', post.image);
                if (fs.existsSync(oldImagePath)) fs.unlinkSync(oldImagePath);
            }

            const updatedPost = await Post.findByIdAndUpdate(id, {
                title,
                summary,
                content,
                image: imageUrl || post.image
            }, { new: true });

            res.json(updatedPost);
        } catch (error) {
            res.status(500).json({ message: 'Failed to update post', error });
        }
    });
});

// Delete post route
app.delete('/post/:id', async (req, res) => {
    const { id } = req.params;
    const { token } = req.cookies;

    jwt.verify(token, secret, {}, async (err, info) => {
        if (err) return res.status(401).json({ message: 'Unauthorized' });

        try {
            const post = await Post.findById(id);
            if (post.author.toString() !== info.id) {
                return res.status(403).json({ message: 'Forbidden' });
            }

            // Delete the associated image
            if (post.image) {
                const imagePath = path.join(__dirname, 'uploads', post.image);
                if (fs.existsSync(imagePath)) fs.unlinkSync(imagePath);
            }

            await Post.findByIdAndDelete(id);
            res.json({ message: 'Post deleted successfully' });
        } catch (error) {
            res.status(500).json({ message: 'Failed to delete post', error });
        }
    });
});

app.listen(port, () => {
    console.log(`Server running on port ${port}`);
});
