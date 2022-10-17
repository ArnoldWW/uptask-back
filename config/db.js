import mongoose from "mongoose";

const connectDB = async () => {
  try {
    const connection = await mongoose.connect(process.env.MONGO_URI, {
      dbName: "uptask"
    });

    const url = `${connection.connection.host}:${connection.connection.port}`;
    console.log(`MongoDB connect -> http://${url}`);
  } catch (error) {
    console.log(`Error ${error.message}`);
    process.exit(1);
  }
};

export default connectDB;
