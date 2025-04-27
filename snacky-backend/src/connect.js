const mongoose = require("mongoose");

async function connect(params) {
    try {
    // Connect using Mongoose
    const conn = await mongoose.connect(process.env.MONGO_ATLAS, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });

    console.log('✅ MongoDB connected');

    // Create GridFS bucket after connection is open
    gfs = new mongoose.mongo.GridFSBucket(conn.connection.db, {
      bucketName: 'images', // matches GridFS upload bucket
    });

    console.log('📦 GridFS bucket initialized (images)');
  } catch (error) {
    console.error('❌ MongoDB connection failed:', error);
  }
}
 

module.exports = { connect };