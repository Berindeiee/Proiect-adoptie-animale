import {User,IUser} from '../schema/schema';

// Functia pentru salvarea utilizatorului in baza de date
export async function saveUser(userData: IUser): Promise<string> {
  // Verifică dacă există deja un utilizator cu același email
  const existingUserByEmail = await User.findOne({ email: userData.email });
  if (existingUserByEmail) {
    return 'Există deja un utilizator cu acest email.';
  }

  // Verifică dacă există deja un utilizator cu același număr de telefon
  const existingUserByPhone = await User.findOne({ phoneNumber: userData.phoneNumber });
  if (existingUserByPhone) {
    return 'Există deja un utilizator cu acest număr de telefon.';
  }

  // Dacă nu există, creează un nou utilizator
  const newUser = new User(userData);
  console.log("Salvare utilizator...");
  await newUser.save();
  console.log('Utilizatorul a fost salvat');
  return 'Înregistrare reușită';
}