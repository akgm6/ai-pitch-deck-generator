import { initializeApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';

const firebaseConfig = {
  apiKey: 'AIzaSyAD0OYI8icQdsvEjO2PCO6Wre0ECdg0Hz0',
  authDomain: 'ai-pitch-deck-generator.firebaseapp.com',
  projectId: 'ai-pitch-deck-generator',
  storageBucket: 'ai-pitch-deck-generator.firebasestorage.app',
  messagingSenderId: '434356115560',
  appId: '1:434356115560:web:abcbd520cc8f59bb8483dd',
  measurementId: 'G-NY5HPJJBCM',
};

const app = initializeApp(firebaseConfig);
export const auth = getAuth(app); 