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

// Functia pentru verificarea disponibilității numelui de utilizator
export async function checkUsernameAvailability(username: string): Promise<boolean> {
  // Verifică dacă există deja un utilizator cu același nume
  const existingUser = await User.findOne({ fullName: username });
  //console.log('Verificare disponibilitate nume de utilizator...'+existingUser);
  // Returnează true dacă nu există un utilizator cu acel nume, false în caz contrar
  return !existingUser;
}

export async function loginUser(email: string, password: string): Promise<{ message: string, user?: IUser }> {
  const user = await User.findOne({ email: email });
  
  if (!user) {
    return { message: 'Emailul sau parola este incorectă.' };
  }

  const isMatch = await Bun.password.verify(password, user.password);
  
  if (!isMatch) {
    return { message: 'Emailul sau parola este incorectă.' };
  }

  return { 
    message: 'Logare reușită.',
    user: user
  };
}