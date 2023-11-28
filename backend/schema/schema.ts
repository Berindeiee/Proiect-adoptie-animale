import mongoose, { Document } from 'mongoose';
import { hash as bunHash } from 'bun';

// Definirea interfeței IUser pentru a tipiza documentele utilizator din MongoDB.
// Aceasta extinde interfața Document oferită de Mongoose și definește structura 
// unui utilizator, inclusiv numele complet, numărul de telefon, email-ul, parola,
// și opțional tipul de utilizator.
export interface IUser extends Document {
  fullName: string;
  phoneNumber: string;
  email: string;
  password: string;
  userType?: string;
}

// Crearea unei scheme Mongoose pentru utilizatori. Schema definește structura
// unui document de utilizator în baza de date, inclusiv tipurile de date și 
// validările necesare pentru fiecare câmp.
const userSchema = new mongoose.Schema({
  fullName: { type: String, required: true },
  phoneNumber: { type: String, required: true },
  email: { type: String, required: true },
  password: { type: String, required: true },
  userType: { type: String, required: false },
});

// Middleware pre-save pentru hashing-ul parolei înainte de salvarea unui utilizator.
// Aceasta asigură că parolele sunt stocate în mod sigur în baza de date.
userSchema.pre('save', async function(next) {
  const user = this as IUser; // Castarea documentului curent la tipul IUser.

  // Verifică dacă parola a fost modificată. Dacă nu, continuă procesul de salvare.
  if (!user.isModified('password')) return next();

  // Aplică hashing-ul parolei folosind Bun și un salt de 10.
  const hashedPassword = await Bun.password.hash(user.password, { 
    algorithm: 'argon2id', 
    timeCost: 10 // 10 este costul pentru salt.
  });
  
  user.password = hashedPassword.toString(); // Actualizarea parolei cu versiunea hash-uită.
  next();
});



// Exportarea modelului User, care este utilizat pentru a interacționa cu colecția de 
// utilizatori din baza de date MongoDB. Modelul este creat folosind schema definită mai sus.
export const User = mongoose.model<IUser>('User', userSchema);
