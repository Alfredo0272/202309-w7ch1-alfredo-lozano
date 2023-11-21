import mongoose from 'mongoose';

export function dbConnect() {
  const user = 'alfredo-lozano';
  const pasword = 'Dk7421465a';
  const uri = `mongodb+srv://${user}:${pasword}@cluster0.a4xpomk.mongodb.net/bootcamp2023?retryWrites=true&w=majority`;
  return mongoose.connect(uri);
}
