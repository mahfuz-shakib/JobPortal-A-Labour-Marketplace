const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
const mongoose = require('mongoose');

// Load environment variables
dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
// app.use(cors());
 app.use(cors(
  {
    origin:['http://localhost:5000','https://labour-marketplace.netlify.app/']
  }
 ));
app.use(express.json({ limit: '5mb' }));




// MongoDB connection
// mongoose.connect(process.env.MONGO_URI || 'mongodb://127.0.0.1:27017/workmatch')
mongoose.connect(process.env.MONGO_URI)
.then(() => console.log('MongoDB connected'))
.catch((err) => console.error('MongoDB connection error:', err));

// Routes
app.use('/api/auth', require('./routes/auth'));
app.use('/api/jobs', require('./routes/job'));
app.use('/api/user', require('./routes/user'));
app.use('/api/bids', require('./routes/bid'));
app.use('/api/reviews', require('./routes/review'));

app.get('/', (req, res) => {
  res.send('WorkMatch backend is running!');
});

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
