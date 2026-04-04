import { Client, Account, Databases, ID } from 'appwrite';

const client = new Client();

client
  .setEndpoint(import.meta.env.VITE_APPWRITE_ENDPOINT)
  .setProject(import.meta.env.VITE_APPWRITE_PROJECT_ID);

export const account = new Account(client);
export const databases = new Databases(client);
export { ID };

export const DB_ID = '69cfbc6d000c4015495b';
export const POSTS_ID = 'posts';
export const REPLIES_ID = 'replies';
export const PROFILES_ID = 'profiles';