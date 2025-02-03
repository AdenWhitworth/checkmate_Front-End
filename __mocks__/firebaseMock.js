// Mock Firebase Auth
const auth = {
    currentUser: null,
    signInWithEmailAndPassword: jest.fn(() => Promise.resolve()),
    createUserWithEmailAndPassword: jest.fn(() => Promise.resolve()),
    signOut: jest.fn(() => Promise.resolve()),
    onAuthStateChanged: jest.fn(),
    sendPasswordResetEmail: jest.fn(() => Promise.resolve()),
    updateProfile: jest.fn(() => Promise.resolve()),
};
  
// Mock Firestore
const mockDoc = {
    data: jest.fn(() => ({})),
    exists: jest.fn(() => true),
    id: 'mockDocId',
};
  
const mockQuerySnapshot = {
    docs: [mockDoc],
    empty: false,
    forEach: jest.fn(),
};
  
const mockDocReference = {
    get: jest.fn(() => Promise.resolve(mockDoc)),
    set: jest.fn(() => Promise.resolve()),
    update: jest.fn(() => Promise.resolve()),
    delete: jest.fn(() => Promise.resolve()),
};
  
const mockCollection = {
    doc: jest.fn(() => mockDocReference),
    add: jest.fn(() => Promise.resolve(mockDocReference)),
    where: jest.fn(() => mockCollection),
    orderBy: jest.fn(() => mockCollection),
    limit: jest.fn(() => mockCollection),
    get: jest.fn(() => Promise.resolve(mockQuerySnapshot)),
};
  
const db = {
    collection: jest.fn(() => mockCollection),
    doc: jest.fn(() => mockDocReference),
};
  
// Mock Firebase Storage
const storage = {
    ref: jest.fn(() => ({
    put: jest.fn(() => Promise.resolve({
        ref: {
        getDownloadURL: jest.fn(() => Promise.resolve('https://mock-url.com')),
        },
    })),
    getDownloadURL: jest.fn(() => Promise.resolve('https://mock-url.com')),
    delete: jest.fn(() => Promise.resolve()),
    })),
};
  
// Mock Firebase Analytics
const analytics = {
    logEvent: jest.fn(),
};
  
// Mock Firebase initialization
const initializeApp = jest.fn();
const getAuth = jest.fn(() => auth);
const getFirestore = jest.fn(() => db);
const getStorage = jest.fn(() => storage);
const getAnalytics = jest.fn(() => analytics);
  
// Export all mocks
export {
    auth,
    db,
    storage,
    analytics,
    initializeApp,
    getAuth,
    getFirestore,
    getStorage,
    getAnalytics,
};
  
// Export Firebase-specific types/constants that might be used
export const GoogleAuthProvider = {
    PROVIDER_ID: 'google.com',
    credential: jest.fn(),
};
  
export const signInWithPopup = jest.fn(() => Promise.resolve());
export const signInWithCredential = jest.fn(() => Promise.resolve());
  
export const collection = jest.fn(() => mockCollection);
export const doc = jest.fn(() => mockDocReference);
export const getDoc = jest.fn(() => Promise.resolve(mockDoc));
export const getDocs = jest.fn(() => Promise.resolve(mockQuerySnapshot));
export const setDoc = jest.fn(() => Promise.resolve());
export const updateDoc = jest.fn(() => Promise.resolve());
export const deleteDoc = jest.fn(() => Promise.resolve());
export const query = jest.fn(() => mockCollection);
export const where = jest.fn(() => mockCollection);
export const orderBy = jest.fn(() => mockCollection);
export const limit = jest.fn(() => mockCollection);
  
// Timestamp mock
export const Timestamp = {
    now: jest.fn(() => ({ seconds: 1234567890, nanoseconds: 0 })),
    fromDate: jest.fn((date) => ({ seconds: date.getTime() / 1000, nanoseconds: 0 })),
};
  
const firebaseApp = {
    initializeApp,
    auth,
    db,
    storage,
    analytics,
};

export default firebaseApp;