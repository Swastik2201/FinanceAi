import admin from 'firebase-admin';
import dotenv from 'dotenv';

dotenv.config();

let initialized = false;

export const initializeFirebaseAdmin = () => {
  if (initialized || admin.apps.length > 0) {
    return admin;
  }

  const projectId = process.env.FIREBASE_PROJECT_ID;
  const clientEmail = process.env.FIREBASE_CLIENT_EMAIL;
  const privateKey = process.env.FIREBASE_PRIVATE_KEY?.replace(/\\n/g, '\n');

  if (projectId && clientEmail && privateKey && !privateKey.includes('DEMO_PRIVATE_KEY')) {
    try {
      admin.initializeApp({
        credential: admin.credential.cert({
          projectId,
          clientEmail,
          privateKey,
        }),
      });
      initialized = true;
      console.log('✅ Firebase Admin SDK initialized successfully.');
    } catch (error) {
      console.warn('⚠️ Failed to initialize Firebase Admin SDK with credentials:', error);
    }
  } else {
    console.warn('⚠️ Firebase Admin SDK initialized in mock/fallback mode (missing or demo credentials).');
  }

  return admin;
};

export const verifyIdToken = async (idToken: string) => {
  initializeFirebaseAdmin();

  // If Firebase Admin has a registered app and isn't mock mode
  if (admin.apps.length > 0) {
    try {
      const decodedToken = await admin.auth().verifyIdToken(idToken);
      return decodedToken;
    } catch (error) {
      console.error('Firebase token verification error:', error);
      throw new Error('Invalid authentication token');
    }
  }

  // Fallback dev/mock token verification for local development testing without live service account
  if (idToken.startsWith('mock_token_')) {
    const parts = idToken.split('_');
    const uid = parts[2] || 'mock-user-123';
    const email = parts[3] || 'user@example.com';
    return {
      uid,
      email,
      name: email.split('@')[0],
      picture: undefined,
      auth_time: Math.floor(Date.now() / 1000),
      iss: 'https://securetoken.google.com/mock-app',
      aud: 'mock-app',
      sub: uid,
      firebase: { identities: {}, sign_in_provider: 'custom' },
    } as unknown as admin.auth.DecodedIdToken;
  }

  throw new Error('Firebase Admin SDK is not properly configured with live credentials.');
};
