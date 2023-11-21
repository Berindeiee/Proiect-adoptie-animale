import mongoose, { Document } from 'mongoose';
import { hash as bunHash } from 'bun';

export interface IUser extends Document {
  fullName: string;
  phoneNumber: string;
  email: string;
  password: string;
  userType?: string;
}

const userSchema = new mongoose.Schema({
  fullName: { type: String, required: true },
  phoneNumber: { type: String, required: true },
  email: { type: String, required: true },
  password: { type: String, required: true },
  userType: { type: String, required: false },
});

// Hashing-ul parolei înainte de a salva utilizatorul
userSchema.pre('save', async function(next) {
  const user = this as IUser;

  // Hash-ul parolei doar dacă a fost modificată (sau este nouă)
  if (!user.isModified('password')) return next();

  // Aplică hashing-ul folosind Bun
  const hashedPassword = await bunHash(user.password, 10); // 10 este costul pentru salt
  user.password = hashedPassword.toString();
  next();
});

export const User = mongoose.model<IUser>('User', userSchema);
