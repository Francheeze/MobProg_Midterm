import AsyncStorage from "@react-native-async-storage/async-storage";

const USERS_KEY = "users";

export type User = {
  email: string;
  username: string;
  password: string;
};

// Read all saved accounts (empty list if none yet)
export async function getUsers(): Promise<User[]> {
  const json = await AsyncStorage.getItem(USERS_KEY);
  return json ? JSON.parse(json) : [];
}

// Save a new account. Returns an error message, or null if it worked.
export async function registerUser(user: User): Promise<string | null> {
  const users = await getUsers();

  const exists = users.some(
    (u) =>
      u.email.toLowerCase() === user.email.toLowerCase() ||
      u.username.toLowerCase() === user.username.toLowerCase()
  );
  if (exists) return "Email or username is already taken.";

  await AsyncStorage.setItem(USERS_KEY, JSON.stringify([...users, user]));
  return null;
}

// Find the account matching the login details (or null if none)
export async function loginUser(
  identifier: string,
  password: string
): Promise<User | null> {
  const users = await getUsers();
  const id = identifier.trim().toLowerCase();

  const match = users.find(
    (u) =>
      (u.email.toLowerCase() === id || u.username.toLowerCase() === id) &&
      u.password === password
  );
  return match ?? null;
}