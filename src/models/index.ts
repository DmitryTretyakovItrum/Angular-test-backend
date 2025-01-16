import mongoose from 'mongoose';
import Logger from '../libs/logger';

const connectDB = async function () {
  try {
    const m = await mongoose.connect('mongodb://localhost:27017/test');
    Logger.i(`MongoDB connect ${m.connection.host}:${m.connection.port}`);
  } catch (error) {
    Logger.e(`MongoDB failed connect: ${error}`);
  }
}

export { connectDB };