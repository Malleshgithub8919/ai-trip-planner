import { useState, useEffect } from 'react';
import { getTripsByUser, subscribeToUserTrips } from '../service/firebaseService';

export const useUserTrips = (userEmail, realTime = false) => {
  const [trips, setTrips] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (!userEmail) {
      setLoading(false);
      return;
    }

    if (realTime) {
      // Real-time subscription
      const unsubscribe = subscribeToUserTrips(userEmail, (tripsData) => {
        setTrips(tripsData);
        setLoading(false);
        setError(null);
      });

      return () => unsubscribe();
    } else {
      // One-time fetch
      const fetchTrips = async () => {
        try {
          setLoading(true);
          const tripsData = await getTripsByUser(userEmail);
          setTrips(tripsData);
          setError(null);
        } catch (err) {
          setError(err.message);
          console.error('Error fetching trips:', err);
        } finally {
          setLoading(false);
        }
      };

      fetchTrips();
    }
  }, [userEmail, realTime]);

  return { trips, loading, error };
};