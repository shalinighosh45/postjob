const mongoose = require("mongoose");

const connectDb = async () => {
  try {
    const conn = await mongoose.connect(process.env.MONGO_URL ,{
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    console.log(`Connect to mongoDb at ${conn.connection.host}`);
  } catch (err) {
    console.log(`Error in mongodb connection :${err}`);
  }
};

module.exports = connectDb;
