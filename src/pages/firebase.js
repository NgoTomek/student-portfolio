// src/pages/firebase.js
// This is a bridge file that re-exports the Firebase configuration
import { auth, db, storage, analytics } from '../firebase';

export { auth, db, storage, analytics };
