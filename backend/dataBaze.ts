import mongoose from "mongoose";

export async function connectToDb() {
    const dbUri = process.env.MONGODB_URI;
  
    try {
      await mongoose.connect(String(dbUri));
      //console.log(dbUri)
      console.log('Conectat la baza de date MongoDB.');
    } catch (err) {
      console.error('Eroare la conectarea la baza de date MongoDB:', err);
      process.exit(1); // Închide aplicația dacă nu se poate conecta la baza de date
    }
  }