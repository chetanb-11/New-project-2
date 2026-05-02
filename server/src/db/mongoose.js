import mongoose from 'mongoose';

export const connectDatabase = async (uri) => {
  mongoose.set('strictQuery', true);
  await mongoose.connect(uri);
};
