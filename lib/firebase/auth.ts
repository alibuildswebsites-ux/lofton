import { 
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signInWithPopup,
  signOut,
  sendPasswordResetEmail,
  updateProfile,
  updatePassword,
  deleteUser,
  User
} from 'firebase/auth';
import { doc, setDoc, getDoc } from 'firebase/firestore';
import { auth, googleProvider, db } from '../../firebase.config';

// Helper for user-friendly error messages
const getErrorMessage = (error: unknown) => {
  if (error instanceof Error) {
    const msg = error.message;
    
    // Common Firebase Auth Errors
    if (msg.includes('auth/invalid-email')) return 'The email address you entered is invalid.';
    if (msg.includes('auth/user-disabled')) return 'This account has been disabled. Please contact support.';
    if (msg.includes('auth/user-not-found')) return 'No account found with this email. Please sign up.';
    if (msg.includes('auth/wrong-password')) return 'Incorrect password. Please try again.';
    if (msg.includes('auth/invalid-credential')) return 'Incorrect email or password.';
    if (msg.includes('auth/email-already-in-use')) return 'An account with this email already exists.';
    if (msg.includes('auth/weak-password')) return 'Password should be at least 6 characters.';
    if (msg.includes('auth/operation-not-allowed')) return 'This sign-in method is disabled.';
    if (msg.includes('auth/popup-closed-by-user')) return 'Sign-in cancelled by user.';
    if (msg.includes('auth/too-many-requests')) return 'Too many failed attempts. Please try again later.';
    if (msg.includes('auth/network-request-failed')) return 'Network error. Please check your connection.';
    if (msg.includes('auth/internal-error')) return 'An internal error occurred. Please try again.';
    
    // Admin specific errors (handled in components mostly, but good to have)
    if (msg.includes('Access Denied')) return msg;

    // Fallback: Clean up the raw Firebase message
    // Converts "Firebase: Error (auth/something)." -> "Error (auth/something)"
    return msg.replace('Firebase: ', ''); 
  }
  return String(error);
};

// Check if a user is an admin
export const checkIsAdmin = async (email: string | null): Promise<boolean> => {
  if (!auth || !auth.currentUser || !email || !db) return false;
  try {
    // 1. Check 'admins' collection FIRST (Preferred way)
    const adminDocRef = doc(db, 'admins', auth.currentUser.uid);
    const adminDoc = await getDoc(adminDocRef);
    if (adminDoc.exists()) return true;

    // 2. Fallback: Check 'users' collection for role='admin'
    // (Keeps backward compatibility if you already made an admin there)
    const userDocRef = doc(db, 'users', auth.currentUser.uid);
    const userDoc = await getDoc(userDocRef);
    if (userDoc.exists()) {
      return userDoc.data().role === 'admin';
    }
    
    return false;
  } catch (error) {
    console.error("Error checking admin status:", error);
    return false;
  }
};

// Sign up with email and password
export const signUpWithEmail = async (email: string, password: string, name: string) => {
  if (!auth || !db) return { success: false, error: "Authentication service not initialized. Please check configuration." };
  try {
    const userCredential = await createUserWithEmailAndPassword(auth, email, password);
    const user = userCredential.user;
    
    // Update profile with name
    await updateProfile(user, { displayName: name });
    
    // Create user document in Firestore
    await setDoc(doc(db, 'users', user.uid), {
      uid: user.uid,
      name: name,
      email: email,
      role: 'user', // Default role
      savedProperties: [],
      createdAt: new Date().toISOString()
    });
    
    return { success: true, user };
  } catch (error) {
    // If database write fails, sign out the user and delete the account to prevent partial state
    // (User authenticated but no profile doc)
    if (auth && auth.currentUser) {
      const userToDelete = auth.currentUser;
      await signOut(auth);
      try {
        // Attempt to delete the user so they can try signing up again
        await deleteUser(userToDelete);
      } catch (deleteErr) {
        console.error("Failed to rollback user creation:", deleteErr);
      }
    }
    return { success: false, error: getErrorMessage(error) };
  }
};

// Sign in with email and password
export const signInWithEmail = async (email: string, password: string) => {
  if (!auth) return { success: false, error: "Authentication service not initialized." };
  try {
    const userCredential = await signInWithEmailAndPassword(auth, email, password);
    return { success: true, user: userCredential.user };
  } catch (error) {
    return { success: false, error: getErrorMessage(error) };
  }
};

// Sign in with Google
export const signInWithGoogle = async () => {
  if (!auth || !db || !googleProvider) return { success: false, error: "Authentication service not initialized." };
  try {
    const result = await signInWithPopup(auth, googleProvider);
    const user = result.user;
    
    // Check if user document exists
    const userDoc = await getDoc(doc(db, 'users', user.uid));
    
    // If new user, create document
    if (!userDoc.exists()) {
      await setDoc(doc(db, 'users', user.uid), {
        uid: user.uid,
        name: user.displayName || 'User',
        email: user.email,
        role: 'user', // Default role
        savedProperties: [],
        createdAt: new Date().toISOString()
      });
    }
    
    return { success: true, user };
  } catch (error) {
    return { success: false, error: getErrorMessage(error) };
  }
};

// Sign out
export const logOut = async () => {
  if (!auth) return { success: false, error: "Not initialized" };
  try {
    await signOut(auth);
    return { success: true };
  } catch (error) {
    return { success: false, error: getErrorMessage(error) };
  }
};

// Send password reset email
export const resetPassword = async (email: string) => {
  if (!auth) return { success: false, error: "Not initialized" };
  try {
    await sendPasswordResetEmail(auth, email);
    return { success: true };
  } catch (error) {
    return { success: false, error: getErrorMessage(error) };
  }
};

// Update user profile name
export const updateUserName = async (user: User, newName: string) => {
  if (!db) return { success: false, error: "Database not connected" };
  try {
    await updateProfile(user, { displayName: newName });
    await setDoc(doc(db, 'users', user.uid), { name: newName }, { merge: true });
    return { success: true };
  } catch (error) {
    return { success: false, error: getErrorMessage(error) };
  }
};

// Update user password
export const updateUserPassword = async (user: User, newPassword: string) => {
  try {
    await updatePassword(user, newPassword);
    return { success: true };
  } catch (error) {
    return { success: false, error: getErrorMessage(error) };
  }
};