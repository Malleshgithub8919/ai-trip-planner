import React, { useState, useEffect } from 'react'
import { useParams } from 'react-router-dom'
import { doc, getDoc } from 'firebase/firestore';
import { db } from '../../service/firebaseConfig';
import { toast } from 'sonner';
import InfoSection from './components/infoSection.jsx';
import Hotels from './components/Hotels.jsx';

function Viewtrip() {
    const { tripId } = useParams();
    const [trip, setTrip] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        console.log('tripId from params:', tripId);
        if (tripId) {
            GetTripData();
        }
    }, [tripId]);

    const GetTripData = async () => {
        try {
            console.log('Fetching trip data for ID:', tripId);
            const docRef = doc(db, "AITrips", tripId);
            const docSnap = await getDoc(docRef);
             
            if (docSnap.exists()) {
                const tripData = docSnap.data();
                console.log("Document data:", tripData);
                setTrip(tripData);
            } else {
                console.log("No document found for ID:", tripId);
                toast('No trip found');
            }
        } catch (error) {
            console.error("Error fetching trip:", error);
            toast('Error loading trip data');
        } finally {
            setLoading(false);
        }
    };

    if (loading) {
        return <div>Loading trip data...</div>;
    }

    if (!trip) {
        return <div>No trip data found</div>;
    }

    return (
        <div>{/*i=Information section*/}
            <InfoSection trip={trip} />

        {/*Recommended hostels*/}
            <Hotels trip={trip} />

        {/*Daily plan*/}

        {/*Footer*/}
            <h1>Trip Details</h1>
            <p>Trip ID: {tripId}</p>
            <pre>{JSON.stringify(trip, null, 2)}</pre>
        </div>
    );
} 

export default Viewtrip
