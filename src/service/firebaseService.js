import { 
  collection, 
  doc, 
  getDocs, 
  getDoc, 
  query, 
  where, 
  orderBy, 
  limit,
  onSnapshot 
} from 'firebase/firestore';
import { db } from './firebaseConfig';

// Get all documents from a collection
export const getAllTrips = async () => {
  try {
    const querySnapshot = await getDocs(collection(db, "AITrips"));
    const trips = [];
    querySnapshot.forEach((doc) => {
      trips.push({
        id: doc.id,
        ...doc.data()
      });
    });
    return trips;
  } catch (error) {
    console.error("Error fetching trips:", error);
    throw error;
  }
};

// Get trips by user email
export const getTripsByUser = async (userEmail) => {
  try {
    const q = query(
      collection(db, "AITrips"), 
      where("userEmail", "==", userEmail),
      orderBy("id", "desc")
    );
    const querySnapshot = await getDocs(q);
    const trips = [];
    querySnapshot.forEach((doc) => {
      trips.push({
        id: doc.id,
        ...doc.data()
      });
    });
    return trips;
  } catch (error) {
    console.error("Error fetching user trips:", error);
    throw error;
  }
};

// Get a single trip by ID
export const getTripById = async (tripId) => {
  try {
    const docRef = doc(db, "AITrips", tripId);
    const docSnap = await getDoc(docRef);
    
    if (docSnap.exists()) {
      return {
        id: docSnap.id,
        ...docSnap.data()
      };
    } else {
      console.log("No such document!");
      return null;
    }
  } catch (error) {
    console.error("Error fetching trip:", error);
    throw error;
  }
};

// Get recent trips (limited)
export const getRecentTrips = async (limitCount = 10) => {
  try {
    const q = query(
      collection(db, "AITrips"),
      orderBy("id", "desc"),
      limit(limitCount)
    );
    const querySnapshot = await getDocs(q);
    const trips = [];
    querySnapshot.forEach((doc) => {
      trips.push({
        id: doc.id,
        ...doc.data()
      });
    });
    return trips;
  } catch (error) {
    console.error("Error fetching recent trips:", error);
    throw error;
  }
};

// Real-time listener for user trips
export const subscribeToUserTrips = (userEmail, callback) => {
  const q = query(
    collection(db, "AITrips"), 
    where("userEmail", "==", userEmail),
    orderBy("id", "desc")
  );
  
  return onSnapshot(q, (querySnapshot) => {
    const trips = [];
    querySnapshot.forEach((doc) => {
      trips.push({
        id: doc.id,
        ...doc.data()
      });
    });
    callback(trips);
  });
};