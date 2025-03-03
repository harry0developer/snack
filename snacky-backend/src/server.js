const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const http = require('http');
const cors = require('cors');
const socketIo = require('socket.io');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const multer = require('multer');
const path = require('path');
const fs = require('fs');
const sendOTP = require('./services/twilio');
const crypto = require('crypto');
const dotenv = require('dotenv');

mongoose.set("debug", true);
dotenv.config();


const userRoutes = require('./routes/users');
const chatRoutes = require('./routes/chats');

const Chat = require('./models/chat');  
const User = require('./models/user');  

const app = express();
const server = http.createServer(app);

const port = 5001;

const io = socketIo(server, {
  cors: {
    origin: 'http://localhost:8100',  // URL of your Ionic app (adjust if different)
    methods: ['GET', 'POST'],
    allowedHeaders: ['Content-Type'],
    credentials: true,  // Allow credentials (cookies, authentication)
  },
});

// Middleware
app.use(bodyParser.json());
app.use('/uploads', express.static('uploads')); 

app.use(cors({
    origin: '*'
}));

// Routes
app.use('/api', userRoutes);
app.use('/api', chatRoutes);

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    const token = req.headers['authorization'];
    if (!token) {
      return cb(new Error('No token provided'), false);
    }

    jwt.verify(token, 'secretKey', (err, decoded) => {
      if (err) {
        return cb(new Error('Invalid token'), false);
      }

      // Create a directory based on user ID
      const userId = decoded.userId;
      const userDirectory = path.join(__dirname, 'uploads', userId);

      // Check if directory exists; if not, create it
      if (!fs.existsSync(userDirectory)) {
        fs.mkdirSync(userDirectory, { recursive: true });
      }

      // Set destination folder to user-specific directory
      cb(null, userDirectory);
    });
  },
  filename: function (req, file, cb) {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    cb(null, file.fieldname + '-' + uniqueSuffix + path.extname(file.originalname));
  },
});
const upload = multer({ storage: storage });


console.log("ENV ", dotenv.config());


// MongoDB Connection
mongoose.connect(process.env.MONGO_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
})
.then(() => console.log('MongoDB connected'))
.catch((err) => console.log(err));


app.post('/api/register', async (req, res) => {
  const { username, password, name, dob } = req.body;
  
  // Check if user already exists
  const userExists = await User.findOne({ username });
  if (userExists) {
    return res.status(400).json({ message: 'User already exists' });
  }

  // Hash password
  const salt = await bcrypt.genSalt(10);
  const hashedPassword = await bcrypt.hash(password, salt);

  // Create new user
  const newUser = new User({
    username,
    password: hashedPassword,
    name,
    dob
  });

  // Save the user to MongoDB
  try {
    await newUser.save();
    res.status(201).json({ message: 'User registered successfully' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Error registering user' });
  }
});

// Login route
app.post('/api/login', async (req, res) => {
  const { username, password } = req.body;

  // Find user in DB
  const user = await User.findOne({ username });
  if (!user) {
    return res.status(400).json({ message: 'Invalid username or password' });
  }

  // Check if password is correct
  const isMatch = await bcrypt.compare(password, user.password);
  if (!isMatch) {
    return res.status(400).json({ message: 'Invalid username or password' });
  }

  // Create JWT token
  const token = jwt.sign({ userId: user._id }, 'secretKey', { expiresIn: '1h' });
  
  res.json({ token, user });
});

// Protected route (authentication required)
app.get('/api/protected', (req, res) => {
  const token = req.headers['authorization'];
  if (!token) {
    return res.status(401).json({ message: 'No token provided' });
  }

  jwt.verify(token, 'secretKey', (err, decoded) => {
    if (err) {
      return res.status(401).json({ message: 'Invalid token' });
    }

    res.json({ message: 'Protected route accessed', userId: decoded.userId });
  });
});


//TWILLIO CODE 
app.post('/api/send-otp', async (req, res) => {
  const { phoneNumber } = req.body;

  // Generate OTP (simple 6-digit random number)
  const otp = Math.floor(100000 + Math.random() * 900000).toString();

  // Set expiration time for OTP (5 minutes)
  const otpExpiresAt = new Date(Date.now() + 5 * 60 * 1000);

  try {
    // Save the phone number and OTP in the database
    let user = await User.findOne({ phoneNumber });
    if (!user) {
      user = new User({ ...req.body });
    } else {
      user.otp = otp;
      user.otpExpiresAt = otpExpiresAt;
    }
    await user.save();

    // Send OTP to the user's phone number
    await sendOTP(phoneNumber, otp);

    res.status(200).json({ message: 'OTP sent successfully' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Internal server error' });
  }
});

// Route to verify OTP
app.post('/api/verify-otp', async (req, res) => {
  const { phoneNumber, otp } = req.body;

  try {
    // Find the user by phone number
    const user = await User.findOne({ phoneNumber });

    if (!user) {
      return res.status(400).json({ message: 'User not found' });
    }

    // Check if OTP is correct and not expired
    if (user.otp === otp && new Date() < user.otpExpiresAt) {
      res.status(200).json({ message: 'OTP verified successfully' });
    } else {
      res.status(400).json({ message: 'Invalid or expired OTP' });
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Internal server error' });
  }
});


//SOCKET IO 
io.on('connection', (socket) => {
    
    socket.on('join-room', ({ user1, user2 }) => {
        console.log(`${user1} and ${user2} are now connected`);
        socket.join(`${user1}-${user2}`);
      });
      
    socket.on('send-message', async ({ sender, receiver, message }) => {
        console.log("Senging message...");
        
      try {
        // Save message to MongoDB
        const newChatMessage = new Chat({ sender, receiver, message });
        await newChatMessage.save();
  
        // Emit the message in real-time to the relevant chat room
        io.to(`${sender}-${receiver}`).emit('receive-message', { sender, message });
  
        // Optionally, you can emit to both users
        io.to(receiver).emit('receive-message', { sender, message });
        io.to(sender).emit('receive-message', { sender, message });
      } catch (err) {
        console.error('Error saving message to database:', err);
      }
    });
  
    socket.on('disconnect', () => {
      console.log('A user disconnected');
    });

});

// Image upload route for multiple images
app.post('/api/upload-images', upload.array('profileImages', 10), async (req, res) => {
  const token = req.headers['authorization'];
  if (!token) {
    return res.status(401).json({ message: 'No token provided' });
  }

  jwt.verify(token, 'secretKey', async (err, decoded) => {
    if (err) {
      return res.status(401).json({ message: 'Invalid token' });
    }

    const userId = decoded.userId;
    const profileImages = req.files ? req.files.map(file => `/uploads/${userId}/${file.filename}`) : [];

    try {
      // Store image paths in MongoDB user document
      const updatedUser = await User.findByIdAndUpdate(
        userId,
        { $push: { profileImages: { $each: profileImages } } },
        { new: true }
      );

      res.json({ message: 'Images uploaded successfully', profileImages: updatedUser.profileImages });
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: 'Error uploading images' });
    }
  });
});

// Start Server
server.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
