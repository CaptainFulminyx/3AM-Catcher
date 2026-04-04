import { ref } from 'vue';
import { defineStore } from 'pinia';
import { account, databases, ID, DB_ID, PROFILES_ID } from '../lib/appwrite';

const adjectives = ['King', 'Dark', 'Swift', 'Neon', 'Ghost', 'Iron', 'Wild', 'Cold', 'Fast', 'Deep'];
const nouns = ['Bird', 'Wolf', 'Fox', 'Hawk', 'Tiger', 'Dragon', 'Phoenix', 'Raven', 'Owl', 'Coder'];

function generateCallsign() {
  const adj = adjectives[Math.floor(Math.random() * adjectives.length)];
  const noun = nouns[Math.floor(Math.random() * nouns.length)];
  const num = Math.floor(Math.random() * 90) + 10;
  return `${adj}${noun}${num}`;
}

export const useAuthStore = defineStore('auth', () => {
  const user = ref(null);
  const callsign = ref(null);
  const showAuthModal = ref(false);

  async function signUp(email, password) {
    try {
      const newUser = await account.create(ID.unique(), email, password);
      const newCallsign = generateCallsign();
      
      await account.createEmailPasswordSession(email, password);
      
      await databases.createDocument(DB_ID, PROFILES_ID, newUser.$id, {
        userId: newUser.$id,
        callsign: newCallsign,
      //  createdAt: new Date().toISOString()
      });
      
      user.value = newUser;
      callsign.value = newCallsign;
      showAuthModal.value = false;
      return { success: true };
    } catch (error) {
      return { success: false, error: error.message };
    }
  }

  async function signIn(email, password) {
    try {
      await account.createEmailPasswordSession(email, password);
      const userData = await account.get();
      
      const profile = await databases.getDocument(DB_ID, PROFILES_ID, userData.$id);
      callsign.value = profile.callsign;
      user.value = userData;
      showAuthModal.value = false;
      return { success: true };
    } catch (error) {
      return { success: false, error: error.message };
    }
  }

  async function signOut() {
    await account.deleteSession('current');
    user.value = null;
    callsign.value = null;
  }

  async function checkAuth() {
    try {
      const userData = await account.get();
      const profile = await databases.getDocument(DB_ID, PROFILES_ID, userData.$id);
      user.value = userData;
      callsign.value = profile.callsign;
    } catch (error) {
      user.value = null;
      callsign.value = null;
    }
  }

  return {
    user,
    callsign,
    showAuthModal,
    signUp,
    signIn,
    signOut,
    checkAuth
  };
});