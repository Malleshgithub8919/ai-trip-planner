import React, { useState, useEffect } from 'react'
import { useParams } from 'react-router-dom'
import { doc, getDoc } from 'firebase/firestore';
import { db } from '../../service/firebaseConfig';
import { toast } from 'sonner';
import InfoSection from './components/infoSection';
import Hotels from './components/Hotels';
import PlaceItinerary from './components/PlaceItinerary';
import TripNavigation from './components/TripNavigation';
import '../../styles/print.css';

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
        <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50">
            {/* Navigation Header */}
            <div className="no-print">
                <TripNavigation tripData={trip?.tripData} />
            </div>
            
            {/* Main Content */}
            <div className="max-w-7xl mx-auto px-4 py-8 space-y-8">
                {/* Information Section */}
                <div className="print-avoid-break">
                    <InfoSection trip={trip} />
                </div>

                {/* Recommended Hotels */}
                <div className="print-page-break print-avoid-break">
                    <Hotels trip={trip} />
                </div>

                {/* Daily Itinerary */}
                <div className="print-page-break print-avoid-break">
                    <PlaceItinerary trip={trip} />
                </div>
                
                {/* Debug Info (remove in production) */}
                {process.env.NODE_ENV === 'development' && (
                    <div className="no-print bg-gray-100 rounded-lg p-4">
                        <h3 className="font-bold mb-2">Debug Info (Trip ID: {tripId})</h3>
                        <details>
                            <summary className="cursor-pointer text-blue-600">View Raw Trip Data</summary>
                            <pre className="mt-2 text-xs overflow-auto bg-white p-2 rounded max-h-96">
                                {JSON.stringify(trip, null, 2)}
                            </pre>
                        </details>
                    </div>
                )}
            </div>
        </div>
    );
} 

export default Viewtrip
